import {uploadDocument} from "../api/api"
import MainLayout from "../layouts/MainLayout"

function Upload(){

const upload = async(e)=>{

const file = e.target.files[0]

await uploadDocument(file)

alert("Uploaded")

}

return(

<MainLayout>

<h2 className="text-2xl mb-4">

Upload Document

</h2>

<input type="file" onChange={upload}/>

</MainLayout>

)

}

export default Upload