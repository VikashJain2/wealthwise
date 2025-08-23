import { pool } from "../config/database.js";
import { redisClient } from "../config/redis.js";

const getTransactions = async (req, res) => {
    console.log("Fetching transactions for user:", req.user.id);
  const { page = 1, limit = 10, category, type, startDate, endDate } = req.query;
  const offset = (page - 1) * limit;
  let query = "SELECT * FROM transactions WHERE user_id = ?";
  let countQuery = "SELECT COUNT(*) as total FROM transactions WHERE user_id = ?";
  let values = [req.user.id];
  let countValues = [req.user.id];

  if (category) {
    query += " AND category = ?";
    countQuery += " AND category = ?";
    values.push(category);
    countValues.push(category);
  }

  if (type) {
    query += " AND type = ?";
    countQuery += " AND type = ?";
    values.push(type);
    countValues.push(type);
  }

  if (startDate) {
    query += " AND date >= ?";
    countQuery += " AND date >= ?";
    values.push(startDate);
    countValues.push(startDate);
  }

  if (endDate) {
    query += " AND date <= ?";
    countQuery += " AND date <= ?";
    values.push(endDate);
    countValues.push(endDate);
  }

  query += " ORDER BY date DESC, created_at DESC LIMIT ? OFFSET ?";
  values.push(parseInt(limit), parseInt(offset));

  try {
    const [rows] = await pool.query(query, values);
    const [countResult] = await pool.query(countQuery, countValues);
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    return res.json({
      transactions: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages
      }
    });
  } catch (err) {
    return res.status(500).json({ msg: "Error fetching transactions", error: err.message });
  }
};

const addTransaction = async (req, res) => {
  const { amount, category, type, date, description } = req.body;

  // Validation
  if (!amount || !category || !type) {
    return res.status(400).json({ msg: "Amount, category, and type are required" });
  }

  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ msg: "Amount must be a positive number" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO transactions (user_id, amount, category, type, date, description) VALUES (?, ?, ?, ?, ?, ?)",
      [req.user.id, amount, category, type, date || new Date().toISOString().slice(0, 10), description || '']
    );

    await redisClient.del(`transactions:${req.user.id}`);
    await redisClient.del(`analytics:${req.user.id}`);

    return res.status(201).json({ 
      msg: "Transaction added successfully",
      transaction: { id: result.insertId, amount, category, type, date, description }
    });
  } catch (err) {
    return res.status(500).json({ msg: "Error adding transaction", error: err.message });
  }
};

const editTransaction = async (req, res) => {
  const { id } = req.params;
  const { amount, category, type, date, description } = req.body;

  try {
    const [check] = await pool.query(
      "SELECT user_id FROM transactions WHERE id = ?",
      [id]
    );

    if (!check.length) {
      return res.status(404).json({ msg: "Transaction not found" });
    }

    if (check[0].user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Not authorized" });
    }

    const MySQLDate = new Date(date).toISOString().slice(0, 19).replace('T', ' ');
    await pool.query(
      "UPDATE transactions SET amount = ?, category = ?, type = ?, date = ?, description = ? WHERE id = ?",
      [amount, category, type, MySQLDate, description, id]
    );

    // Invalidate cache
    await redisClient.del(`transactions:${req.user.id}`);
    await redisClient.del(`analytics:${req.user.id}`);

    return res.json({ msg: "Transaction updated successfully" });
  } catch (err) {
    return res.status(500).json({ msg: "Error updating transaction", error: err.message });
  }
};

const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const [check] = await pool.query(
      "SELECT user_id FROM transactions WHERE id = ?",
      [id]
    );

    if (!check.length) {
      return res.status(404).json({ msg: "Transaction not found" });
    }

    if (check[0].user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await pool.query("DELETE FROM transactions WHERE id = ?", [id]);

    // Invalidate cache
    await redisClient.del(`transactions:${req.user.id}`);
    await redisClient.del(`analytics:${req.user.id}`);

    return res.json({ msg: "Transaction deleted successfully" });
  } catch (err) {
    return res.status(500).json({ msg: "Error deleting transaction", error: err.message });
  }
};

export { getTransactions, addTransaction, editTransaction, deleteTransaction };