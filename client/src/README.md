# Trip Budget Planner - MERN Stack

A production-grade full-stack application for planning trips and managing shared expenses with friends.

## Features

- **User Authentication**: Secure JWT-based auth with bcrypt password hashing
- **Trip Management**: Create, edit, and manage multiple trips
- **Expense Tracking**: Add expenses with categories, dates, and descriptions
- **Smart Bill Splitting**: Equal or custom splits across trip members
- **Analytics**: Visual charts showing spending patterns and trends
- **Collaboration**: Invite friends to trips and track shared expenses
- **Settlements**: Automatic calculation of who owes whom
- **Multi-Currency**: Support for different currencies with exchange rates
- **Receipt Upload**: Attach images to expense records

## Tech Stack

**Frontend:**
- React 18 with Vite
- React Router for navigation
- Recharts for data visualization
- Tailwind CSS for styling
- Context API for state management

**Backend:**
- Node.js + Express
- MongoDB with Mongoose
- JWT for authentication
- Helmet for security
- Express-validator for input validation

**Deployment:**
- Frontend: Vercel or Netlify
- Backend: Render or Railway
- Database: MongoDB Atlas

## Setup Instructions

### Prerequisites
- Node.js 16+
- MongoDB Atlas account
- npm or yarn

### Backend Setup

\`\`\`bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
\`\`\`

### Frontend Setup

\`\`\`bash
cd client
npm install
cp .env.example .env
# Edit .env with API URL (http://localhost:5000/api)
npm run dev
\`\`\`

### Seed Database

\`\`\`bash
cd server
npm run seed
\`\`\`

This creates sample users and trip data for testing.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Trips
- `GET /api/trips` - Get all user trips
- `POST /api/trips` - Create new trip
- `GET /api/trips/:id` - Get trip details
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip

### Expenses
- `GET /api/expenses/:tripId` - Get trip expenses
- `POST /api/expenses` - Add expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Analytics
- `GET /api/analytics/:tripId/categories` - Category breakdown
- `GET /api/analytics/:tripId/timeline` - Spending timeline

### Settlements
- `GET /api/settlements/:tripId` - Calculate settlements
- `POST /api/settlements/:tripId/settle` - Mark settlement as done

## Project Structure

\`\`\`
trip-budget-planner/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── scripts/
│   ├── index.js
│   └── package.json
└── README.md
\`\`\`

## Environment Variables

### Backend (.env)
\`\`\`
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/trip-budget
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=development
CLOUDINARY_NAME=your_name
CLOUDINARY_KEY=your_key
CLOUDINARY_SECRET=your_secret
\`\`\`

### Frontend (.env)
\`\`\`
VITE_API_URL=http://localhost:5000/api
\`\`\`

## Features to Add

- [ ] Real-time updates with Socket.io
- [ ] Email notifications
- [ ] Receipt OCR using Tesseract
- [ ] Map integration for trip planning
- [ ] Payment gateway integration (Stripe)
- [ ] Chat feature for trip members
- [ ] Export to PDF
- [ ] Dark mode

## License

MIT
