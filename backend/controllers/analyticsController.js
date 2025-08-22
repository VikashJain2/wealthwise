import { pool } from "../config/database.js";
import { redisClient } from "../config/redis.js";

const getAnalytics = async (req, res) => {
  const cacheKey = `analytics:${req.user.id}`;
  
  try {
    // Try to get cached data
    let cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    console.log("Fetching analytics for user:", req.user.id);
    // Get expenses by category
    const [categoryData] = await pool.query(
      `SELECT category, SUM(amount) as total, type 
       FROM transactions 
       WHERE user_id = ? 
       GROUP BY category, type`,
      [req.user.id]
    );

    console.log("Category Data:", categoryData);

    // Get monthly trends
    const [monthlyData] = await pool.query(
      `SELECT 
         DATE_FORMAT(date, '%Y-%m') as month,
         type,
         SUM(amount) as total
       FROM transactions 
       WHERE user_id = ? 
       GROUP BY month, type
       ORDER BY month DESC
       LIMIT 12`,
      [req.user.id]
    );

    console.log("Monthly Data:", monthlyData);

    // Get total income and expenses
    const [totals] = await pool.query(
      `SELECT 
         type,
         SUM(amount) as total
       FROM transactions 
       WHERE user_id = ? 
       GROUP BY type`,
      [req.user.id]
    );

    console.log("Totals Data:", totals);
    // Calculate balance
    const income = totals.find(t => t.type === 'income')?.total || 0;
    const expenses = totals.find(t => t.type === 'expense')?.total || 0;
    const balance = income - expenses;

    // Prepare response data
    const data = {
      summary: {
        income,
        expenses,
        balance
      },
      byCategory: categoryData,
      monthlyTrends: monthlyData,
      lastUpdated: new Date().toISOString()
    };

    // Cache for 15 minutes
    await redisClient.setEx(cacheKey, 900, JSON.stringify(data));

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ msg: 'Error fetching analytics', error: err.message });
  }
};

export { getAnalytics };