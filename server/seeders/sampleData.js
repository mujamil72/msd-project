import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Trip from '../models/Trip.js';
import Expense from '../models/Expense.js';
import Notification from '../models/Notification.js';
import Budget from '../models/Budget.js';
import Insurance from '../models/Insurance.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create sample users
    const users = await User.create([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // password
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
      }
    ]);

    // Create sample trips
    const trips = await Trip.create([
      {
        name: 'Summer Europe Tour',
        destination: 'Paris, France',
        startDate: new Date('2024-06-15'),
        endDate: new Date('2024-06-25'),
        budget: 5000,
        currency: 'USD',
        createdBy: users[0]._id,
        members: [users[0]._id, users[1]._id],
        status: 'active'
      },
      {
        name: 'Weekend Beach Getaway',
        destination: 'Miami, FL',
        startDate: new Date('2024-07-10'),
        endDate: new Date('2024-07-12'),
        budget: 1500,
        currency: 'USD',
        createdBy: users[0]._id,
        members: [users[0]._id],
        status: 'planning'
      }
    ]);

    // Create sample expenses
    await Expense.create([
      {
        trip: trips[0]._id,
        paidBy: users[0]._id,
        category: 'accommodation',
        amount: 450.00,
        description: 'Hotel booking for 3 nights',
        date: new Date('2024-06-16'),
        currency: 'USD'
      },
      {
        trip: trips[0]._id,
        paidBy: users[1]._id,
        category: 'food',
        amount: 85.50,
        description: 'Dinner at Italian restaurant',
        date: new Date('2024-06-17'),
        currency: 'USD'
      }
    ]);

    // Create sample budgets
    await Budget.create([
      {
        user: users[0]._id,
        trip: trips[0]._id,
        categories: {
          accommodation: 2000,
          food: 1200,
          transport: 800,
          activities: 700,
          shopping: 200,
          other: 100
        },
        totalBudget: 5000,
        currency: 'USD'
      }
    ]);

    // Create sample notifications
    await Notification.create([
      {
        user: users[0]._id,
        trip: trips[0]._id,
        type: 'expense_added',
        title: 'New Expense Added',
        message: 'Jane added $85.50 for dinner at Italian restaurant',
        isRead: false
      }
    ]);

    console.log('Sample data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();