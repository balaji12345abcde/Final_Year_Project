import axios from "axios"

const API = axios.create({

baseURL:"http://127.0.0.1:8000/api/"

})

export const loginUser = (data)=>API.post("login/",data)

export const registerUser = (data)=>API.post("register/",data)

export const uploadDocument = (file)=>{

const form = new FormData()
form.append("file",file)

return API.post("documents/upload/",form)

}

export const analyzeDocument = (data)=>API.post("nlp/analyze/",data)

export default API