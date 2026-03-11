import Layout from "../layouts/MainLayout"

export default function Contracts(){

return(

<Layout>

<h2 className="text-2xl font-semibold mb-6">
Contract Analysis
</h2>

<div className="grid grid-cols-3 gap-6">

<div className="bg-white p-6 shadow rounded">
<h3 className="font-semibold">Contract Risk</h3>
<p className="text-red-500">High Risk Clause</p>
</div>

</div>

</Layout>

)
}