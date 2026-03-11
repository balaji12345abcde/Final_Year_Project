export default function Entities({entities}){

 if(!entities) return null

 return(

  <div className="bg-white p-5 rounded-xl shadow-lg">

   <h3 className="font-semibold mb-3">
    Entities
   </h3>

   <div className="flex flex-wrap gap-2">

    {entities.slice(0,10).map((e,i)=>(
      <span
       key={i}
       className="bg-gray-200 px-3 py-1 rounded-lg text-sm"
      >
        {e.text || e}
      </span>
    ))}

   </div>

  </div>

 )
}