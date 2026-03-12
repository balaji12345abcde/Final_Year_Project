export default function Navbar(){

 return(

  <div className="flex justify-between items-center bg-white shadow px-6 py-3">

   <h2 className="text-lg font-semibold">
    Legal AI Document Analyzer
   </h2>

   <div className="flex items-center gap-3">

     <img
      src="https://i.pravatar.cc/40"
      className="rounded-full"
     />

     <span>Balaji</span>

   </div>

  </div>

 )

}