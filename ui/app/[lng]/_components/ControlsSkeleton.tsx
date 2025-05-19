import React from 'react';

const ControlsSkeleton = () => {
	const element = (
		<div className="mx-6 flex h-full laptop:h-[35vh] justify-center py-10">
			<div className="w-[80vw] laptop:w-[25vw] max-laptop:h-[60vh] rounded-xl bg-[#C8C8C8]"></div>
		</div>
	);
	const array = [1, 2, 3, 4, 5, 6];
	return (
		<div
			className={`col-span-11 laptop:my-6 max-laptop:h-full laptop:grid h-[80vh] w-full grid-cols-11 laptop:divide-x divide-[#C8C8C8] laptop:border-t border-t-[#C8C8C8] opacity-50`}
		>
			{array.map((elem, idx) => (
				<div className={`${idx % 2 === 0 ? 'laptop:col-span-6' : 'laptop:col-span-5'} max-laptop:border-t max-laptop:border-[#C8C8C8]`} key={elem}>
					<div className="max-laptop:hidden border border-x-transparent border-b-[#C8C8C8] border-t-transparent px-6 py-10">
						<div className="flex w-full">
							<div className="h-[3vh] w-[40%] rounded-xl bg-[#C8C8C8]"></div>
						</div>
						{element}
						<div className="flex items-center justify-end w-full">
							<div className="h-[3vh] w-[20%] rounded-xl bg-[#C8C8C8]"></div>
						</div>
					</div>
					<div className='w-full h-full laptop:hidden'>
						{element}
						
					</div>
				</div>
			))}
		</div>
	);
};

export default ControlsSkeleton;
