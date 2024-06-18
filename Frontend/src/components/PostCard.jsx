/* eslint-disable react/prop-types */

export default function PostCard({ bus }) {
  return (
    <div className="group relative border border-teal-500 hover:border-2 h-auto overflow-hidden rounded-lg transition-all w-full p-4 flex flex-col justify-between  bg-slate-50" 
  >
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <p className="text-lg font-semibold">{bus.company}</p>
          <span className="text-sm italic font-bold  ">{bus.type}</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-1">
            <span className="font-semibold">Starting at:</span>
            <span className="text-slate-400">{bus.startStation}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold">End point:</span>
            <span className="text-slate-400">{bus.toStation}</span>
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-1">
            <span className="font-semibold">Departure:</span>
            <span className="text-slate-400"> {bus.depatureTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold">Arrival:</span>
            <span className="text-slate-400">{bus.arrivalTime}</span>
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-1">
            <span className="font-semibold "></span>
            <span></span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold">Price:</span>
            <span className="text-slate-400">Rs.{bus.price}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center gap-1">
          <span className="font-semibold ">Rating:</span>
          <span className="text-slate-400">{bus.rating}</span>
        </div>
        <div className="flex items-center gap-1">
           <button className="bg-orange-500 text-white px-4 py-2 rounded mt-4 self-end">Book Now</button>
        </div>
     </div>
      
    </div>
  );
}





