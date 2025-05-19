'use client';

import Image from 'next/image';
import GrayArrow from '@/public/assets/grey-arrow.svg';
import LocalizedLink from './LocalizedLink';
import { usePathname } from 'next/navigation';
import { languages, getCanonicalPath } from '@/app/i18n/settings';
import { useState, useEffect } from 'react';

const MobileMenu = ({
	lng,
	prods,
	pvs,
	rsc,
	news,
	about,
	contact,
	sleevesMn,
	customs,
	controlsMn,
	commercials,
	onItemClick,
	open,
	invBg,
}: {
	lng: string;
	prods: string;
	pvs: string;
	rsc: string;
	news: string;
	about: string;
	contact: string;
	sleevesMn: string;
	customs: string;
	controlsMn: string;
	commercials: string;
	onItemClick?: () => void;
	open: boolean;
	invBg?: boolean;
}) => {
	const pathname = usePathname();
	const [lngDdOpen, setLangDdOpen] = useState<boolean>(false);
	const [cartItems, setCartItems] = useState<number>(0);

	const toggleDropdown = () => {
		setLangDdOpen((prev) => !prev);
	};

	// Get the canonical path for the current URL
	const getCanonicalPathForLanguageSwitch = (path: string) => {
		// If we got a canonical path, use it, otherwise use '/'
		return getCanonicalPath(path) || '/';
	};

	// Helper function to remove the language prefix from a path
	const removeLangPrefix = (path: string) => {
		return path.replace(/^\/[^\/]{2,5}/, '');
	};

	// Get cart items count
	useEffect(() => {
		const updateCartItems = () => {
			const storedCart = JSON.parse(localStorage.getItem('orders') || '[]');
			setCartItems(storedCart.length);
		};

		updateCartItems();

		const handleStorageChange = () => {
			updateCartItems();
		};

		window.addEventListener('storageItems', handleStorageChange);
		return () => {
			window.removeEventListener('storageItems', handleStorageChange);
		};
	}, []);

	return (
		<ul
			suppressHydrationWarning={true}
			className={`flex w-full flex-col py-2 text-sm ${invBg ? 'text-[#F7F7F7]' : 'text-black'}`}
		>
			<li
				suppressHydrationWarning
				className={`relative col-span-11 mt-2 flex  w-full  py-2 lg:col-span-2 `}
			>
				<LocalizedLink
					href="/products"
					lng={lng}
					onClick={() => {
						onItemClick && onItemClick();
					}}
					className={`flex w-full items-center justify-between    `}
				>
					{prods}
					<Image src={GrayArrow} alt="arrow" />
				</LocalizedLink>
			</li>

			<li suppressHydrationWarning className={`col-span-11 flex w-full  py-2 lg:col-span-2 `}>
				<LocalizedLink
					onClick={() => {
						onItemClick && onItemClick();
					}}
					href="/resources"
					lng={lng}
					className={`flex w-full items-center justify-between  `}
				>
					{rsc}
					<Image src={GrayArrow} alt="arrow" />
				</LocalizedLink>
			</li>
			<li
				suppressHydrationWarning
				className={`col-span-11 flex w-full  py-2 lg:col-span-2  `}
			>
				<LocalizedLink
					onClick={() => {
						onItemClick && onItemClick();
					}}
					href="/news"
					lng={lng}
					className={`flex w-full items-center justify-between`}
				>
					{news}
					<Image src={GrayArrow} alt="arrow" />
				</LocalizedLink>
			</li>
			<li
				suppressHydrationWarning
				className={`col-span-11 flex w-full rounded  py-2 lg:col-span-2 `}
			>
				<LocalizedLink
					onClick={() => {
						onItemClick && onItemClick();
					}}
					href="/about"
					lng={lng}
					className={`flex w-full items-center justify-between    `}
				>
					{about}
					<Image src={GrayArrow} alt="arrow" />
				</LocalizedLink>
			</li>
			<li suppressHydrationWarning className={`col-span-11 flex w-full  py-2 lg:col-span-2`}>
				<LocalizedLink
					onClick={() => {
						onItemClick && onItemClick();
					}}
					href="/contact"
					lng={lng}
					className={`flex w-full items-center justify-between    `}
				>
					{contact}
					<Image src={GrayArrow} alt="arrow" />
				</LocalizedLink>
			</li>

			{/* Cart link */}
			<li suppressHydrationWarning className={`col-span-11 flex w-full py-2 lg:col-span-2`}>
				<LocalizedLink
					onClick={() => {
						onItemClick && onItemClick();
					}}
					href="/cart"
					lng={lng}
					className={`flex w-full items-center justify-between   `}
				>
					Cart ({cartItems})
					<Image src={GrayArrow} alt="arrow" />
				</LocalizedLink>
			</li>

			{/* Language Switcher */}
			<li
				suppressHydrationWarning
				className={`${lngDdOpen ? '' : ''} col-span-11 flex w-full flex-col py-2 `}
			>
				<button
					onClick={toggleDropdown}
					className={`col-span-1 flex w-full items-center justify-between rounded text-start uppercase `}
				>
					{lng.substring(0, 2)}
					<svg
						className={`-mr-1 h-5 w-5 ${lngDdOpen ? 'hidden text-white' : 'text-gray-400'} `}
						viewBox="0 0 20 20"
						fill="currentColor"
						aria-hidden="true"
					>
						<path
							fillRule="evenodd"
							d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
							clipRule="evenodd"
						/>
					</svg>
					<svg
						className={`-mr-1 h-5 w-5 rotate-180 ${lngDdOpen ? 'text-gray-400' : ' hidden'} `}
						viewBox="0 0 20 20"
						fill="currentColor"
						aria-hidden="false"
					>
						<path
							fillRule="evenodd"
							d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
							clipRule="evenodd"
						/>
					</svg>
				</button>

				<div className={`${lngDdOpen ? '' : 'hidden'}`}>
					<div className="" suppressHydrationWarning>
						<div className="z-50 w-full rounded ">
							{languages.map((language) => {
								if (language === lng) return null;
								return (
									<LocalizedLink
										key={language}
										href={getCanonicalPathForLanguageSwitch(pathname)}
										lng={language}
										className={`mt-2 block w-full rounded uppercase`}
										onClick={() => {
											toggleDropdown();
											onItemClick && onItemClick();
										}}
									>
										{language.substring(0, 2)}
									</LocalizedLink>
								);
							})}
						</div>
					</div>
				</div>
			</li>
		</ul>
	);
};

export default MobileMenu;
