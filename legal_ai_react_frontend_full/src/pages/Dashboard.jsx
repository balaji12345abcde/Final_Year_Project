import MainLayout from "../layouts/MainLayout"

function Dashboard(){

return(

<MainLayout>

<h2 className="text-2xl mb-4">

Dashboard

</h2>

<div className="grid grid-cols-3 gap-4">

<div className="bg-white shadow p-6">

Documents

</div>

<div className="bg-white shadow p-6">

Contracts

</div>

<div className="bg-white shadow p-6">

Risk Reports

</div>

</div>

</MainLayout>

)

}

export default Dashboard