import axios from "axios"

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api"
})

export const uploadDocument = async (file) => {
  const formData = new FormData()
  formData.append("file", file)

  const res = await API.post("/documents/upload/", formData)
  return res.data
}

export const analyzeDocument = async (documentId) => {
  const res = await API.post("/nlp/analyze/", {
    document_id: documentId
  })
  return res.data
}

export const askDocumentBot = async (documentId, question) => {
  const res = await API.post("/chat/document/", {
    document_id: documentId,
    question: question
  })
  return res.data
}

export const askLegalBot = async (question) => {
  const res = await API.post("/chat/general/", {
    question: question
  })
  return res.data
}

export default API