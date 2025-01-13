import React from 'react'
import { FaArrowDown, FaArrowUp, FaArrowUpWideShort, FaBusinessTime, FaCarSide, FaClockRotateLeft, FaEarListen, FaHeadset, FaXmark } from 'react-icons/fa6'

export default function KpiCard({ kpiCategoryName, metricValue, metricUnit, deltaPercentage, onClick }) {
  return (
    <button 
      className='bg-[#FFF] rounded-lg w-[242px] h-[122px] p-[16px] flex flex-col justify-around shadow-md select-none transition-transform scale-100 hover:scale-[1.03] hover:bg-[#f6f6f6] active:bg-[#f0f0f0]'
      onClick={onClick}
    >
        <div className='flex gap-x-2'>
            { generateIcon(kpiCategoryName) }
            <h2 className='text-[#142937] text-xl'>{ kpiCategoryName }</h2>
        </div>
        <div className="ml-8">
            <h3 className='text-[#142937] text-lg flex gap-x-2'>
                <span className='text-[28px]'>{metricValue}</span> 
                <span>{metricUnit}</span>
            </h3>
            <h4 className={`text-left flex items-center ${deltaPercentage < 0 ? 'text-[#EE2E6B]' : 'text-[#4ECC4C]'}`}>
              {deltaPercentage * 100}%
              { deltaPercentage < 0 ? (
                <FaArrowDown size={16} color='#EE2E6B' style={{ paddingBottom: 2, paddingLeft: 3 }}/>
              ) : (
                <FaArrowUp size={16} color='#4ECC4C' style={{ paddingBottom: 2, paddingLeft: 3 }}/>
              )}
            </h4>
        </div>
    </button>
  )
}

function generateIcon(name) {
  const iconColor = '#142937';
  const iconSize = 24;

  switch(name) {
    case 'Taxa de recorrência':
      return <FaClockRotateLeft size={iconSize} color={iconColor} />;
    case 'Chamados por dia':
      return <FaHeadset size={iconSize} color={iconColor} />;
    case 'Tempo de trajeto':
      return <FaCarSide size={iconSize} color={iconColor} />;
    case 'Tempo por serviço':
      return <FaBusinessTime size={iconSize} color={iconColor} />;
    default:
      return <FaXmark size={iconSize} color={iconColor} />
  }
}