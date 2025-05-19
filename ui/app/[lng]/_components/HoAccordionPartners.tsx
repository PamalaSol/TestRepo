'use client';

import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import faqOpenAnimation from '@/public/assets/animations/Animation - 1713769151435.json';
import { useEffect, useReducer, useRef, useState } from 'react';
import Close from '@/public/assets/close.svg';
import Open from '@/public/assets/open.svg';
import Image from 'next/image';

export default function HoAccordionPartners({
	title,
	children,
	eClass,
}: {
	title: string;
	children: React.ReactNode;
	eClass?: string;
}) {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [animationState, setAnimationState] = useState<number>(0);
	const plusRef = useRef<LottieRefCurrentProps>(null);
	const unusedFeatures = false;

	useEffect(() => {
		plusRef.current?.goToAndStop(0.5);
	}, []);

	const handleClick = () => {
		if (plusRef.current) {
			if (animationState === 0) {
				plusRef.current.setDirection(1);
				plusRef.current.setSpeed(1);
				plusRef.current.goToAndPlay(0);
				setAnimationState(1);
			} else {
				plusRef.current.goToAndStop(0);
				setAnimationState(0);
			}
		}
	};
	return (
		<div
			className={`w-full cursor-pointer`}
			onClick={() => {
				setIsOpen((prevOpen) => !prevOpen);
			}}
		>
			<div className={`flex flex-col transition ease-in-out `}>
				<div className={`mb-1 grid laptop:h-[9vh] h-full w-full grid-cols-12 items-center pt-1 `}>
					<p className="text-sm font-normal text-[#111111] max-laptop:col-span-10 lg:col-span-10 laptop:text-xs laptop-l:text-xs laptop-xl:text-base laptop-xl-extra:text-lg">
						{title}
					</p>
					<div className="max-laptop:col-span-2 lg:col-span-2 ">
						<button className={` laptop:w-[3vw] transition ease-in-out hover:opacity-80 `}>
							<Image
								src={Open}
								alt="Open icon"
								className={`transform transition duration-500 ${isOpen ? 'rotate-[225deg]' : ''} max-laptop:w-[1vw] max-laptop:min-w-[48px]`}
							/>
						</button>
						
					</div>
				</div>

				<div
					className={`transition-max-height my-[1px] laptop:h-[10vh] max-laptop:mb-2 overflow-hidden duration-300 ease-in-out ${isOpen ? 'max-h-[1000px]' : 'max-h-0'} max-laptop:text-[0.6rem]`}
					onClick={(e) => e.stopPropagation()}
				>
					{children}
				</div>
			</div>
		</div>
	);
}
