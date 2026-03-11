import axios from "axios"

const API = axios.create({
 baseURL: "http://127.0.0.1:8000/api"
})

export const analyzeDocument = async (documentId, query) => {
 const res = await API.post("/nlp/analyze/", {
  document_id: documentId,
  query: query
 })

 return res.data
}