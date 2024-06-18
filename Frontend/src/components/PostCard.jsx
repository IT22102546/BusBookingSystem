/* eslint-disable react/prop-types */


export default function PostCard({ bus }) {
  return (
    <div className='group relative w-full border border-teal-500 hover:border-2 h-[400px] overflow-hidden rounded-lg sm:w-[430px] transition-all'>
      
      <div className='p-3 flex flex-col gap-2'>
        <p className='text-lg font-semibold line-clamp-2'>{bus.company}</p>
        <span className='italic text-sm'>{bus.type}</span>
        
      </div>
    </div>
  );
}