'use client';
import Image from 'next/image';
import { useState } from 'react';
import tStyles from '@/app/[lng]/textSizes.module.css';
import Link from 'next/link';
import BlueArrow from '@/public/assets/blue-arrow.svg';

export const AccordionItem = ({
	title,
	content,
	src,
	link,
	idx,
}: {
	title: string;
	content: string;
	src: string;
	link: string;
	idx: number;
}) => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleAccordion = () => {
		setIsOpen((prev) => !prev);
	};

	return (
		<div className="my-2 ">
			<button
				className="w-full bg-gray-200 px-4 py-1 text-left focus:outline-none"
				onClick={toggleAccordion}
			>
				<div className="flex items-center justify-between ">
					<span className={tStyles.cat2}>{title}</span>
					<span>{isOpen ? '-' : '+'}</span>
				</div>
			</button>
			<div
				className={`overflow-hidden px-4 transition-all duration-500 ease-in-out ${
					isOpen ? 'max-h-screen' : 'max-h-0'
				}`}
			>
				<div className="my-4 flex w-full justify-center">
					<Image
						src={src}
						alt="Home pinch-valve"
						width={520}
						height={828}
						loading="lazy"
					/>
				</div>
				<div className="space-y-2">
					<p className={tStyles.cat5}>{title}</p>
					<p className={tStyles.cat3}>{content}</p>
				</div>
				{idx !== 3 ? (
					<div className="my-4 ">
						<Link href={link} className={`${tStyles.cat2} flex justify-end `}>
							<Image
								src={BlueArrow}
								alt="Blue arrow"
								loading="lazy"
								height={500}
								width={500}
								className="h-auto w-auto"
							/>
						</Link>
					</div>
				) : (
					<ul className={`${tStyles.cat2} my-4 list-disc px-6`}></ul>
				)}
			</div>
		</div>
	);
};
