export default function Chatbot({query,setQuery,ask,answer}){

 return(

  <div className="bg-white p-5 rounded-xl shadow-lg">

   <h2 className="font-semibold mb-4">
    Legal Assistant
   </h2>

   <div className="space-y-2 mb-4">

    <div className="bg-gray-100 p-3 rounded-lg">
      {query}
    </div>

    {answer && (
      <div className="bg-blue-100 p-3 rounded-lg">
        {answer}
      </div>
    )}

   </div>

   <div className="flex gap-2">

    <input
     value={query}
     onChange={(e)=>setQuery(e.target.value)}
     className="border p-2 rounded flex-1"
     placeholder="Ask about this document..."
    />

    <button
     onClick={ask}
     className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600 transition"
    >
      Send
    </button>

   </div>

  </div>

 )
}