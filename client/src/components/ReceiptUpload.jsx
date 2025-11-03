"use client"

import { useState } from "react"

export default function ReceiptUpload({ tripId, onUploadSuccess }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    try {
      // In a real app, you'd upload to Cloudinary or similar
      // For demo, we'll just use the base64 preview
      onUploadSuccess(preview, file.name)
      setFile(null)
      setPreview(null)
    } catch (error) {
      console.error("Upload error:", error)
      alert("Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 transition">
      <div className="text-center">
        {preview ? (
          <div>
            <img src={preview || "/placeholder.svg"} alt="Preview" className="h-32 mx-auto rounded mb-3" />
            <p className="text-sm text-gray-600 mb-3">{file.name}</p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Confirm Upload"}
              </button>
              <button
                onClick={() => {
                  setFile(null)
                  setPreview(null)
                }}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded text-sm font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <label className="cursor-pointer">
            <div className="text-4xl mb-2">📸</div>
            <p className="text-sm font-medium text-gray-700">Click to upload receipt</p>
            <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
            <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
          </label>
        )}
      </div>
    </div>
  )
}
