import React from 'react';

const ProductsSkeleton = ({ news }: { news?: boolean }) => {

	const thumbnail = (
		<div className="w-full h-full laptop:pl-2">
			<div className="flex h-full w-full items-center justify-center border-b border-b-[#C8C8C8] laptop:px-24 laptop:py-6 ">
				<div className=" h-[30vh] w-[80vw] rounded-xl bg-[#C8C8C8] opacity-50 laptop:w-[40vw] ">
					{' '}
				</div>
			</div>
		</div>
	);

	const thumbnail2 = (
		<div className="w-full h-full laptop:pr-2">
			<div className="flex h-full w-full items-center justify-center border-b-[#C8C8C8] laptop:border-b laptop:px-24 laptop:py-6 ">
				<div className=" h-[60vh] w-[80vw] laptop:w-[40vw] rounded-xl bg-[#C8C8C8] opacity-50 laptop:h-[30vh] ">
					{' '}
				</div>
			</div>
		</div>
	);

	const array = [1, 2, 3, 4, 5, 6, 7];
	return (
		<div className={` laptop:mt-6 max-laptop:flex max-laptop:flex-col max-laptop:gap-y-2`}>
			{array.map((elem, idx) => (
				<div
					key={elem + idx}
					className={`relative h-[80vh] w-full grid-cols-11 gap-x-2 px-4 max-laptop:border-t max-laptop:border-[#C8C8C8] laptop:grid  laptop:h-[40vh] `}
				>
					<div className="absolute left-[54.45%] top-4 z-10 h-full w-[1px] bg-[#C8C8C8] max-laptop:hidden"></div>

					<div
						className={`${news && idx === 0 ? 'laptop:border-t laptop:border-[#C8C8C8] ' : ''} col-span-6 max-laptop:my-4`}
					>
						{thumbnail2}
					</div>
					<div
						className={`max-laptop:hidden ${news && idx === 0 ? 'border-t border-[#C8C8C8] ' : ''} col-span-5 `}
					>
						{thumbnail}
					</div>
				</div>
			))}
		</div>
	);
};

export default ProductsSkeleton;
