# WealthWise – Personal Finance Tracker

WealthWise is a modern, full-stack personal finance tracker that helps you manage your income, expenses, and financial goals. It provides insightful analytics, beautiful charts, and a simple interface to keep your finances healthy and organized.

---

## Features

- **User Authentication:** Secure registration, login, and logout with JWT.
- **Transaction Management:** Add, view, and delete income/expense transactions.
- **Analytics Dashboard:** Visualize income, expenses, balance, category breakdown, and monthly trends.
- **Charts:** Interactive bar, pie, and line charts for financial insights.
- **Role-Based Access:** Supports different user roles (`admin`, `user`, `read-only`).
- **Rate Limiting & Security:** Prevents abuse and secures your data.
- **Data Caching:** Uses Redis for fast analytics and transaction queries.

---

## Tech Stack

- **Frontend:** React 19, Vite, TailwindCSS, Chart.js, Axios, React Router
- **Backend:** Node.js, Express, MySQL, Redis, JWT, bcryptjs
- **Database:** MySQL
- **Cache:** Redis

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm
- MySQL
- Redis

### Setup

#### 1. Clone the repository

```sh
git clone https://github.com/Vikashjain2/wealthwise.git
cd wealthwise
```

#### 2. Backend Setup

```sh
cd backend
npm install
npm run server
```

#### 3. Frontend Setup

```sh
cd frontend
npm install
npm run dev
```

---

## API Usage

### Authentication

#### Register

- **POST** `/api/auth/register`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "role": "user"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "user": { "id": 1, "email": "user@example.com", "role": "user" },
    "token": "JWT_TOKEN"
  }
  ```

#### Login

- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "user": { "id": 1, "email": "user@example.com", "role": "user" },
    "token": "JWT_TOKEN"
  }
  ```

#### Logout

- **PUT** `/api/auth/logout`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Response:**
  ```json
  { "success": true, "message": "Logged out successfully" }
  ```

---

### Transactions

#### Get Transactions

- **GET** `/api/transactions`
- **Query Params:** `page`, `limit`, `category`, `type`, `startDate`, `endDate`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Example:**
  ```
  GET /api/transactions?page=1&limit=10&type=expense
  ```
- **Response:**
  ```json
  {
    "transactions": [
      {
        "id": 1,
        "user_id": 1,
        "amount": 500,
        "category": "Food & Dining",
        "type": "expense",
        "date": "2024-06-01",
        "description": "Lunch"
      }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 1, "totalPages": 1 }
  }
  ```

#### Add Transaction

- **POST** `/api/transactions`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Body:**
  ```json
  {
    "amount": 1000,
    "category": "Salary",
    "type": "income",
    "date": "2024-06-01",
    "description": "June Salary"
  }
  ```
- **Response:**
  ```json
  {
    "msg": "Transaction added successfully",
    "transaction": {
      "id": 2,
      "amount": 1000,
      "category": "Salary",
      "type": "income",
      "date": "2024-06-01",
      "description": "June Salary"
    }
  }
  ```

#### Delete Transaction

- **DELETE** `/api/transactions/:id`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Response:**
  ```json
  { "msg": "Transaction deleted successfully" }
  ```

---

### Analytics

#### Get Analytics

- **GET** `/api/analytics`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Response:**
  ```json
  {
    "summary": {
      "income": 10000,
      "expenses": 5000,
      "balance": 5000
    },
    "byCategory": [
      { "category": "Food & Dining", "total": 2000, "type": "expense" },
      { "category": "Salary", "total": 10000, "type": "income" }
    ],
    "monthlyTrends": [
      { "month": "2024-06", "type": "income", "total": 10000 },
      { "month": "2024-06", "type": "expense", "total": 5000 }
    ]
  }
  ```

---

## Security

- JWT authentication for all sensitive routes.
- Rate limiting on authentication, analytics, and transaction endpoints.
- Passwords hashed with bcryptjs.
- CORS restricted to frontend origin.
- Helmet for HTTP header security.

---

## Author

- [Vikash Jain](https://github.com/Vikashjain2)

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.