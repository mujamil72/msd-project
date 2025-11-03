import Notification from '../models/Notification.js';

export const createNotification = async (userId, type, title, message, tripId = null, data = null) => {
  try {
    const notification = new Notification({
      user: userId,
      trip: tripId,
      type,
      title,
      message,
      data
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

export const createExpenseNotification = async (expense, paidByUser) => {
  // Notify other trip members about new expense
  const Trip = (await import('../models/Trip.js')).default;
  const trip = await Trip.findById(expense.trip).populate('members');
  
  if (trip) {
    const otherMembers = trip.members.filter(member => 
      member._id.toString() !== paidByUser._id.toString()
    );
    
    for (const member of otherMembers) {
      await createNotification(
        member._id,
        'expense_added',
        'New Expense Added',
        `${paidByUser.name} added a $${expense.amount} expense for ${expense.description}`,
        trip._id,
        { expenseId: expense._id, amount: expense.amount }
      );
    }
  }
};

export const createBudgetAlert = async (userId, tripId, category, percentage) => {
  await createNotification(
    userId,
    'budget_alert',
    'Budget Alert',
    `You have exceeded ${percentage}% of your ${category} budget`,
    tripId,
    { category, percentage }
  );
};