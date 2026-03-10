import Layout from "../components/Layout"

export default function Dashboard(){

return(

<Layout>

<h2 className="text-2xl font-semibold mb-6">
Dashboard Overview
</h2>

<div className="grid grid-cols-4 gap-6">

<div className="bg-white shadow p-6 rounded">
<h3 className="text-gray-500">Documents</h3>
<p className="text-3xl font-bold">124</p>
</div>

<div className="bg-white shadow p-6 rounded">
<h3 className="text-gray-500">Contracts</h3>
<p className="text-3xl font-bold">52</p>
</div>

<div className="bg-white shadow p-6 rounded">
<h3 className="text-gray-500">High Risk</h3>
<p className="text-3xl font-bold text-red-500">8</p>
</div>

<div className="bg-white shadow p-6 rounded">
<h3 className="text-gray-500">Cases</h3>
<p className="text-3xl font-bold">19</p>
</div>

</div>

</Layout>

)
}