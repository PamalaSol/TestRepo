import React from 'react'
interface ShortBorderProps {
    side?: boolean; 
    top?:boolean;
    bor?:boolean;
    hid?:boolean;
    mobVis?:boolean;
    invBg?:boolean;
  }
  
  const ShortBorder: React.FC<ShortBorderProps> = ({ side, top, bor, hid, mobVis, invBg}) => {
  return (
    <div className={`flex ${side? 'justify-end':'' } w-full ${bor? 'border-r border-r-[#C8C8C8]' : ''}`}>
					<div className={`${top?'bg-transparent':''} ${hid?'max-laptop:hidden':''} ${mobVis?'laptop:hidden':''} my-2 h-[0.5px] w-full ${invBg?'bg-[#313131]':'bg-[#C8C8C8]'} `}></div>
				</div>
  )
}

export default ShortBorder