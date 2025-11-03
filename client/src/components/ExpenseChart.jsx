import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

export const CategoryChart = ({ expenses }) => {
  const categoryData = expenses.reduce((acc, expense) => {
    const existing = acc.find((item) => item.name === expense.category)
    if (existing) {
      existing.value += expense.amount
    } else {
      acc.push({ name: expense.category, value: expense.amount })
    }
    return acc
  }, [])

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h3>
      {categoryData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: $${value.toFixed(0)}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center py-8 text-gray-500">No expense data available</div>
      )}
    </div>
  )
}

export const TimelineChart = ({ expenses }) => {
  const timelineData = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    const existing = acc.find((item) => item.date === date)
    if (existing) {
      existing.amount += expense.amount
    } else {
      acc.push({ date, amount: expense.amount })
    }
    return acc
  }, [])

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Timeline</h3>
      {timelineData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center py-8 text-gray-500">No timeline data available</div>
      )}
    </div>
  )
}

export const CategoryBreakdown = ({ expenses }) => {
  const categoryData = expenses
    .reduce((acc, expense) => {
      const existing = acc.find((item) => item.name === expense.category)
      if (existing) {
        existing.amount += expense.amount
        existing.count += 1
      } else {
        acc.push({ name: expense.category, amount: expense.amount, count: 1 })
      }
      return acc
    }, [])
    .sort((a, b) => b.amount - a.amount)

  const total = categoryData.reduce((sum, cat) => sum + cat.amount, 0)

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
      {categoryData.length > 0 ? (
        <div className="space-y-4">
          {categoryData.map((cat) => (
            <div key={cat.name}>
              <div className="flex justify-between mb-1">
                <span className="font-medium text-gray-900">{cat.name}</span>
                <span className="text-gray-600">${cat.amount.toFixed(2)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(cat.amount / total) * 100}%` }} />
              </div>
              <p className="text-xs text-gray-500 mt-1">{cat.count} transactions</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">No category data available</div>
      )}
    </div>
  )
}
