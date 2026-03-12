import MainLayout from "../layout/MainLayout"

export default function Dashboard(){

 return(

  <MainLayout>

   <h1 className="text-3xl font-bold mb-6">
    Legal AI Dashboard
   </h1>

   <div className="grid grid-cols-3 gap-6">

    <div className="bg-white shadow p-6 rounded">
     Documents Analyzed
    </div>

    <div className="bg-white shadow p-6 rounded">
     High Risk Cases
    </div>

    <div className="bg-white shadow p-6 rounded">
     Acts Detected
    </div>

   </div>

  </MainLayout>

 )

}