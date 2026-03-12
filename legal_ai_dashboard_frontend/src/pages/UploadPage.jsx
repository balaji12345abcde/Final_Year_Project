import { useState } from "react"
import { uploadDocument } from "../api/api"
import { useNavigate } from "react-router-dom"
import MainLayout from "../layout/MainLayout"

export default function UploadPage() {

  const [file, setFile] = useState(null)
  const navigate = useNavigate()

  const handleUpload = async () => {

    if (!file) {
      alert("Please select a document")
      return
    }

    try {

      const res = await uploadDocument(file)

      const docId = res.document_id

      navigate(`/analysis/${docId}`)

    } catch (err) {

      console.error(err)
      alert("Upload failed")

    }

  }

  return (
    <MainLayout>

      <h1 className="text-2xl font-bold mb-6">
        Upload Legal Document
      </h1>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded ml-4"
      >
        Upload
      </button>

    </MainLayout>
  )
}