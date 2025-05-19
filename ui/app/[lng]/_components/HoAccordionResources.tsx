'use client';

import { LottieRefCurrentProps } from 'lottie-react';
import { useEffect, useReducer, useRef, useState } from 'react';
import Open from '@/public/assets/open.svg';
import Image from 'next/image';
import tStyles from '@/app/[lng]/textSizes.module.css';
import Link from 'next/link';
import MiniArrow from '@/public/assets/mini-arrow-circle.svg';
import BlueOpen from '@/public/assets/plus-button-blue-small.svg';

export default function HoAccordionResources({
	title,
	children,
	eClass,
	blueBtn,
	xl,
	lng,
	idMatch,
}: {
	title: string;
	children: React.ReactNode;
	eClass?: string;
	blueBtn?: boolean;
	xl?: boolean;
	lng?: string;
	idMatch?: boolean;
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

	useEffect(()=>{
		if(idMatch){
			setIsOpen(true)
			
		}
	},[idMatch])
	
	return (
		<div
			className={`w-full cursor-pointer `}
			onClick={() => {
				setIsOpen((prevOpen) => !prevOpen);
			}}
		>
			<div className={`flex flex-col overflow-clip  py-4 laptop:pr-4 ${eClass}`}>
				<div className="flex items-center w-full grid-cols-12 max-laptop:justify-between laptop:grid">
					<h3 className={`col-span-12 lg:col-span-11 laptop:pr-3  ${tStyles.cat4}`}>
						{title}
					</h3>
					<div className="flex justify-end col-span-12 lg:col-span-1">
						{!lng ? (
							<button className={` transition ease-in-out hover:opacity-80 `}>
								{blueBtn ? (
									<Image
										src={BlueOpen}
										alt="Open icon"
										className={`transform transition duration-500 laptop:scale-75 ${isOpen ? 'rotate-[225deg]' : ''} min-h-[48px] min-w-[48px]`}
									/>
								) : (
									<Image
										src={Open}
										alt="Open icon"
										className={`transform transition duration-500 ${isOpen ? 'rotate-[225deg]' : ''} min-h-[48px] min-w-[48px]`}
									/>
								)}
							</button>
						) : (
							<Link
								className={` transition ease-in-out hover:opacity-80 `}
								href={`/${lng}/resources`}
							>
								<Image
									src={MiniArrow}
									alt="Arrow icon"
									className={`min-h-[48px] min-w-[48px] transform transition duration-500 hover:scale-125`}
								/>
							</Link>
						)}
					</div>
				</div>

				<div
					className={`transition-max-height overflow-hidden duration-300 ease-in-out ${isOpen ? `max-h-[${xl ? '3000' : '1000'}px]` : 'max-h-0'}`}
					onClick={(e) => e.stopPropagation()}
				>
					{children}
				</div>
			</div>
		</div>
	);
}
