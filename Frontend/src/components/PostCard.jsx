/* eslint-disable react/prop-types */


export default function PostCard({ bus = {} }) {
  const {
    type = 'N/A',
    company = 'N/A',
    startStation = 'N/A',
    toStation = 'N/A',
    departureTime = 'N/A',
    arrivalTime = 'N/A',
    travelTime = 'N/A',
    price = 0,
    seat = 0,
    seatLayout = 'N/A',
    rating = 0,
    availability='N/A'
  } = bus;

  return (
    <div className="group relative border border-gray-300 h-auto overflow-hidden rounded-lg transition-all w-full md:w-4/5 p-6 flex flex-col justify-between bg-white shadow-lg">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <span className="text-lg font-bold">{type} - {company} - {startStation} - {toStation}</span>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-slate-500 text-sm">Seat Layout:</span>
            <span className="text-slate-500 text-sm">{seatLayout}</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2">
          <div className="flex items-center gap-1">
            <img src="/img/bus.png" className="w-5 h-6 mr-2" alt="Bus icon" />
            <span className="font-semibold text-md text-yellow-400">{type} - {company}</span>
          </div>
          <div className="flex items-center gap-1 mt-2 sm:mt-0">
            <span className="text-blue-700 font-semibold text-lg">Rs.{price}</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2">
          <div className="flex items-center gap-1">
            <span className="font-semibold ml-16">{departureTime}</span>
            <span className='ml-4'><img src="/img/rightarrow.png" className="w-10 h-7 mx-2" alt="Arrow icon" /></span>
            <span className="font-semibold ml-3">{arrivalTime}</span>
          </div>
          <div className="flex items-center gap-1 mt-2 sm:mt-0">
            <span className="text-slate-500 text-sm">{availability}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-sm text-slate-500 ml-12">{startStation}</span>
          <span className="font-semibold text-sm text-slate-500 mx-4">{travelTime} min</span>
          <span className="font-semibold text-sm text-slate-500">{toStation}</span>
        </div>
      </div>
      <div className="flex justify-end items-center mt-4">
        <button className="bg-blue-700 text-white px-4 py-2 rounded">Book Now</button>
      </div>
    </div>
  );
}
