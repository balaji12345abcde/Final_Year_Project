import axios from "axios"

/*
----------------------------------------
BASE API CONFIGURATION
----------------------------------------
*/

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json"
  }
})


/*
----------------------------------------
ADD TOKEN AUTOMATICALLY
----------------------------------------
*/

API.interceptors.request.use((config) => {

  const token = localStorage.getItem("token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config

})


/*
----------------------------------------
AUTH API
----------------------------------------
*/

export const loginUser = async (data) => {
  return API.post("login/", data)
}

export const registerUser = async (data) => {
  return API.post("register/", data)
}


/*
----------------------------------------
DOCUMENT UPLOAD
----------------------------------------
*/

export const uploadDocument = async (file) => {

  const formData = new FormData()

  formData.append("file", file)

  return API.post("documents/upload/", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
}


/*
----------------------------------------
DOCUMENT ANALYSIS
----------------------------------------
*/

export const analyzeDocument = async (document_id, query) => {

  return API.post("nlp/analyze/", {

    document_id: document_id,
    query: query

  })

}


/*
----------------------------------------
GET USER DOCUMENTS
----------------------------------------
*/

export const getDocuments = async () => {
  return API.get("documents/")
}


/*
----------------------------------------
DOCUMENT HISTORY
----------------------------------------
*/

export const getAnalysisHistory = async () => {
  return API.get("analysis/history/")
}


/*
----------------------------------------
CHATBOT API
----------------------------------------
*/

export const chatbotQuery = async (query) => {

  return API.post("chatbot/", {

    query: query

  })

}


export default API