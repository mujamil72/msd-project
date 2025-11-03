import { useState } from 'react'
import Modal from './Modal'

export default function SplitBillModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    splitType: 'equal',
    members: ['You', 'John', 'Sarah'] // Mock data
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🧾 Split Bill">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white/90 font-medium mb-2">Total Amount</label>
          <input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            placeholder="0.00"
            required
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50"
          />
        </div>

        <div>
          <label className="block text-white/90 font-medium mb-2">Description</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="What are you splitting?"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50"
          />
        </div>

        <div>
          <label className="block text-white/90 font-medium mb-2">Split Type</label>
          <select
            value={formData.splitType}
            onChange={(e) => setFormData({...formData, splitType: e.target.value})}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
          >
            <option value="equal">Equal Split</option>
            <option value="custom">Custom Amounts</option>
            <option value="percentage">By Percentage</option>
          </select>
        </div>

        <div>
          <label className="block text-white/90 font-medium mb-2">Members</label>
          <div className="space-y-2">
            {formData.members.map((member, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-white">{member}</span>
                <span className="text-green-300 font-bold">
                  ${formData.amount ? (parseFloat(formData.amount) / formData.members.length).toFixed(2) : '0.00'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-white/30 text-white rounded-xl font-medium hover:bg-white/10 transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
          >
            Split Bill
          </button>
        </div>
      </form>
    </Modal>
  )
}