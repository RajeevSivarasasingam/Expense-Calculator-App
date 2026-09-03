# SpendWise – Personal Expense Tracker

A modern, professional, full-stack web application for tracking income, expenses, budgets, and financial analytics. Built with React, Node.js, Express, and MongoDB.

![SpendWise](https://img.shields.io/badge/React-18.2.0-blue) ![Node](https://img.shields.io/badge/Node.js-18.x-green) ![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green) ![License](https://img.shields.io/badge/license-MIT-blue)

## 📋 Features

### Core Features
- **User Authentication**: Secure registration and login with JWT authentication
- **Dashboard**: Overview of total balance, income, expenses, and monthly spending
- **Transaction Management**: Add, edit, delete, search, and filter transactions
- **Budget Management**: Create and track monthly budgets by category with progress bars
- **Analytics**: Visual charts for spending patterns, income vs expenses, and category breakdown
- **Responsive Design**: Mobile-first design that works on all devices

### Additional Features
- Professional SaaS-style dashboard UI
- Real-time data visualization with Recharts
- Sri Lankan Rupees (LKR) currency formatting
- Protected routes and API endpoints
- Input validation and error handling
- Loading states and empty states
- Mobile-friendly sidebar navigation

## 🚀 Tech Stack

### Frontend
- **React.js** (v18.2.0) - UI library
- **Vite** (v5.0.0) - Build tool
- **Tailwind CSS** (v3.3.5) - Styling
- **React Router DOM** (v6.20.0) - Routing
- **Axios** (v1.6.2) - HTTP client
- **Recharts** (v2.10.3) - Charts
- **React Hook Form** (v7.48.2) - Form management
- **Lucide React** (v0.294.0) - Icons
- **date-fns** (v2.30.0) - Date utilities

### Backend
- **Node.js** (v18.x) - Runtime
- **Express.js** (v4.18.2) - Web framework
- **MongoDB** (v6.x) - Database
- **Mongoose** (v8.0.3) - ODM
- **JWT** (v9.0.2) - Authentication
- **bcryptjs** (v2.4.3) - Password hashing
- **dotenv** (v16.3.1) - Environment variables
- **CORS** (v2.8.5) - Cross-origin resource sharing

## 📁 Project Structure

```
expense-tracker/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── layouts/        # Layout components
│   │   ├── services/       # API services
│   │   ├── context/        # React context
│   │   ├── hooks/          # Custom hooks
│   │   └── utils/          # Utility functions
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                 # Backend Express application
│   ├── controllers/        # Route controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── config/            # Configuration files
│   ├── utils/             # Utility functions
│   ├── server.js          # Server entry point
│   └── package.json
│
├── README.md
└── .env.example
```

## 🛠️ Installation

### Prerequisites
- Node.js (v18.x or higher)
- MongoDB (v6.x or higher)
- npm or yarn

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd expense-tracker
```

### Step 2: Install Backend Dependencies
```bash
cd server
npm install
```

### Step 3: Configure Environment Variables
Create a `.env` file in the `server` directory:
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/spendwise
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
NODE_ENV=development
```

### Step 4: Install Frontend Dependencies
```bash
cd ../client
npm install
```

## 🏃 Running the Application

### Start MongoDB
Make sure MongoDB is running on your system:
```bash
# For Windows (if using MongoDB as a service)
net start MongoDB

# Or if using MongoDB Atlas, update MONGODB_URI in .env
```

### Start Backend Server
```bash
cd server
npm run dev
```
The backend will run on `http://localhost:8000`

### Start Frontend Development Server
```bash
cd client
npm run dev
```
The frontend will run on `http://localhost:5173`

### Access the Application
Open your browser and navigate to: `http://localhost:5173`

## 🔐 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Backend server port | `8000` | No |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/spendwise` | Yes |
| `JWT_SECRET` | Secret key for JWT token generation | - | Yes |
| `NODE_ENV` | Environment mode | `development` | No |

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Transaction Model
```javascript
{
  userId: ObjectId (ref: User),
  type: String (enum: 'income', 'expense'),
  amount: Number,
  category: String,
  description: String,
  paymentMethod: String (enum: 'Cash', 'Card', 'Bank Transfer', 'Online Payment', 'Other'),
  date: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Budget Model
```javascript
{
  userId: ObjectId (ref: User),
  category: String,
  amount: Number,
  month: Number (1-12),
  year: Number,
  createdAt: Date updatedAt: Date
}
```

## 🔌 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### POST /api/auth/login
Login user

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### GET /api/auth/profile
Get user profile (Protected)

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Transaction Endpoints

#### POST /api/transactions
Create new transaction (Protected)

**Request Body:**
```json
{
  "type": "expense",
  "amount": 1500.00,
  "category": "Food",
  "description": "Lunch at restaurant",
  "paymentMethod": "Card",
  "date": "2024-01-15"
}
```

#### GET /api/transactions
Get all transactions (Protected)

**Query Parameters:**
- `limit` (default: 50)
- `skip` (default: 0)
- `type` (optional: 'income' or 'expense')
- `category` (optional)
- `startDate` (optional)
- `endDate` (optional)

#### PUT /api/transactions/:id
Update transaction (Protected)

#### DELETE /api/transactions/:id
Delete transaction (Protected)

### Dashboard Endpoints

#### GET /api/dashboard/summary
Get dashboard summary (Protected)

**Response:**
```json
{
  "totalBalance": 125000.00,
  "totalIncome": 200000.00,
  "totalExpenses": 75000.00,
  "monthlyExpenses": 32500.00
}
```

#### GET /api/dashboard/categories
Get expense category breakdown (Protected)

#### GET /api/dashboard/analytics
Get analytics data (Protected)

**Query Parameters:**
- `period` (default: 'thisMonth', options: 'lastMonth', 'last3Months', 'last6Months', 'thisYear')

### Budget Endpoints

#### POST /api/budgets
Create new budget (Protected)

**Request Body:**
```json
{
  "category": "Food",
  "amount": 20000.00,
  "month": 1,
  "year": 2024
}
```

#### GET /api/budgets
Get all budgets (Protected)

**Query Parameters:**
- `month` (optional)
- `year` (optional)

#### PUT /api/budgets/:id
Update budget (Protected)

#### DELETE /api/budgets/:id
Delete budget (Protected)

## 🎨 Screenshots

### Dashboard
- Summary cards showing total balance, income, expenses, and monthly spending
- Recent transactions list
- Income vs Expense bar chart
- Expense category pie chart

### Transactions
- Professional table with all transactions
- Search and filter functionality
- Add/Edit/Delete transaction modal
- Category and payment method badges

### Budgets
- Budget cards with progress bars
- Spent vs remaining amounts
- Over-budget warnings
- Monthly budget management

### Analytics
- Income vs Expenses comparison chart
- Expense category breakdown
- Spending trends over time
- Period selection (This month, Last month, Last 3 months, etc.)

## 🔒 Security Features

- JWT authentication for protected routes
- Password hashing with bcryptjs
- CORS configuration
- Input validation on all endpoints
- User-specific data isolation (users can only access their own data)
- Environment variable configuration for sensitive data

## 🌐 System Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   React Frontend │◄────────│  Express Backend │◄────────│    MongoDB      │
│   (Port 5173)   │  API    │   (Port 5000)   │  Data   │   (Port 27017)  │
└─────────────────┘         └─────────────────┘         └─────────────────┘
       │                           │                           │
       │                           │                           │
       └───────────────────────────┴───────────────────────────┘
                    REST API Communication
```

## 🧪 Testing

### Test Credentials
After registering a new account, you can use:
- Email: Your registered email
- Password: Your chosen password

### Manual Testing Checklist
- [ ] User registration
- [ ] User login
- [ ] Protected route access
- [ ] Add transaction (income)
- [ ] Add transaction (expense)
- [ ] View transactions list
- [ ] Search and filter transactions
- [ ] Delete transaction
- [ ] Create budget
- [ ] View budget progress
- [ ] View dashboard analytics
- [ ] Logout functionality

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy the dist folder
```

### Backend Deployment (Render/Heroku)
```bash
cd server
# Set environment variables in deployment platform
npm start
```

### MongoDB Atlas
1. Create a free MongoDB Atlas account
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in environment variables

## 📝 Future Improvements

- [ ] Dark mode toggle
- [ ] CSV export functionality
- [ ] PDF monthly reports
- [ ] Profile settings and password change
- [ ] Multi-currency support
- [ ] Recurring transactions
- [ ] Transaction categories customization
- [ ] Budget alerts and notifications
- [ ] Data backup and restore
- [ ] Mobile app (React Native)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built as a portfolio-quality full-stack application demonstrating modern web development practices.

---

**Note**: This is a demonstration project. For production use, ensure proper security measures, regular updates, and thorough testing.
