'use client';

import Cart from '@/public/assets/cart-icon.svg';
import CartInv from '@/public/assets/cart-iconinv.svg';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import DDArrow from '@/public/assets/dd-arrow.svg';
import LocalizedLink from './LocalizedLink';
import { languages, getCanonicalPath } from '@/app/i18n/settings';

export default function Menu({
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
	invBg?: boolean;
}) {
	const pathname = usePathname();

	const [lngDdOpen, setLangDdOpen] = useState<boolean>(false);
	const [isHoveringProducts, setIsHoveringProducts] = useState<boolean>(false);

	const toggleDropdown = () => {
		setLangDdOpen((prev) => !prev);
	};

	const [mouseOutOfProducts, setMouseOutOfProducts] = useState<boolean>(true);
	const [mouseOutOfMenu, setMouseOutOfMenu] = useState<boolean>(true);

	useEffect(() => {
		if (mouseOutOfProducts && mouseOutOfMenu) {
			setIsHoveringProducts(false);
		}
	}, [mouseOutOfMenu, mouseOutOfProducts]);
	const unusedFeatures = false;

	const [cartItems, setCartItems] = useState<number>(0);
	const updateCartItems = () => {
		const vLS = localStorage.getItem('orders');
		if (!vLS) {
			setCartItems(0);
		} else {
			const localFormat = JSON.parse(vLS);
			setCartItems(localFormat.length);
		}
	};
	useEffect(() => {
		updateCartItems();
	}, []);

	window.addEventListener('storageItems', () => {
		updateCartItems();
	});

	// Function to get the canonical path for language switching
	const getCanonicalPathForLanguageSwitch = (path: string) => {
		return getCanonicalPath(path) || '/';
	};

	return (
		<ul
			suppressHydrationWarning={true}
			className="col-span-6 grid grid-cols-11 gap-x-3 gap-y-2 text-sm max-laptop:flex max-laptop:w-full max-laptop:flex-col max-laptop:items-end max-laptop:py-2 max-laptop:pr-6 lg:gap-y-0"
		>
			<li
				suppressHydrationWarning
				className={`relative col-span-11 w-full max-laptop:flex max-laptop:w-fit max-laptop:justify-end lg:col-span-2`}
				onMouseOver={() => {
					setIsHoveringProducts(true);
					setMouseOutOfProducts(false);
				}}
				onMouseLeave={() => {
					setTimeout(() => {
						setMouseOutOfProducts(true);
					}, 100);
				}}
				onClick={() => {
					onItemClick && onItemClick();
					setIsHoveringProducts(false);
				}}
			>
				<LocalizedLink
					href="/products"
					lng={lng}
					className={`block border-b pl-0 ${invBg ? 'border-b-[#f7f7f7]' : 'border-b-[#0F0F0F]'} ${pathname === `/${lng}/products` && !invBg ? ' rounded bg-[#0F0F0F] pl-1 text-[#F7F7F7]' : pathname === `/${lng}/products` && invBg ? ' normal-contrast-button rounded pl-1  ' : pathname !== `/${lng}/products` && !invBg ? 'hover:bg-[#0F0F0F] hover:text-white' : pathname !== `/${lng}/products` && invBg ? 'inverted-contrast-button hover:border-none hover:bg-[#F7F7F7] hover:text-[#0F0F0F]' : ''} hover:rounded hover:pl-1 laptop:text-[0.7rem] laptop-xl:text-sm laptop-xl-extra:text-base`}
				>
					{prods}
				</LocalizedLink>
				{isHoveringProducts ? (
					<ul
						className={`absolute w-[210%] space-y-3 border ${invBg ? 'border-[#F7F7F7]' : 'border-[#0F0F0F]'} ${invBg ? 'bg-[#0F0F0F]' : 'bg-[#F7F7F7]'} p-3 max-laptop:hidden laptop:top-5 laptop-xl-extra:top-6`}
						onMouseOver={() => {
							setIsHoveringProducts(true);
							setMouseOutOfMenu(false);
						}}
						onMouseLeave={() => setMouseOutOfMenu(true)}
					>
						<li
							onClick={() => {
								onItemClick && onItemClick();
								setIsHoveringProducts(false);
							}}
						>
							<LocalizedLink
								className="transition ease-in-out hover:opacity-80"
								href="/products/pinch-valves"
								lng={lng}
							>
								<div className="flex flex-row items-center justify-between">
									<p
										className={`text-light text-xs ${invBg ? 'text-[#F7F7F7]' : 'text-[#111111]'}`}
									>
										{pvs}
									</p>
									<Image src={DDArrow} alt="arrow" />
								</div>
							</LocalizedLink>
						</li>
						<li
							onClick={() => {
								onItemClick && onItemClick();
								setIsHoveringProducts(false);
							}}
						>
							<LocalizedLink
								className="transition ease-in-out hover:opacity-80"
								href="/contact"
								lng={lng}
							>
								<div className="flex flex-row items-center justify-between">
									<p
										className={`text-light text-xs ${invBg ? 'text-[#F7F7F7]' : 'text-[#111111]'}`}
									>
										{customs}
									</p>
									<Image src={DDArrow} alt="arrow" />
								</div>
							</LocalizedLink>
						</li>
						<li
							onClick={() => {
								onItemClick && onItemClick();
								setIsHoveringProducts(false);
							}}
						>
							<LocalizedLink
								className="transition ease-in-out hover:opacity-80"
								href="/products/sleeves"
								lng={lng}
							>
								<div className="flex flex-row items-center justify-between">
									<p
										className={`text-light text-xs ${invBg ? 'text-[#F7F7F7]' : 'text-[#111111]'}`}
									>
										{sleevesMn}
									</p>
									<Image src={DDArrow} alt="arrow" />
								</div>
							</LocalizedLink>
						</li>
						<li
							onClick={() => {
								onItemClick && onItemClick();
								setIsHoveringProducts(false);
							}}
						>
							<LocalizedLink
								className="transition ease-in-out hover:opacity-80"
								href="/products/controls"
								lng={lng}
							>
								<div className="flex flex-row items-center justify-between">
									<p
										className={`text-light text-xs ${invBg ? 'text-[#F7F7F7]' : 'text-[#111111]'}`}
									>
										{controlsMn}
									</p>
									<Image src={DDArrow} alt="arrow" />
								</div>
							</LocalizedLink>
						</li>
						{unusedFeatures && (
							<li
								onClick={() => {
									onItemClick && onItemClick();
									setIsHoveringProducts(false);
								}}
							>
								<LocalizedLink
									className="transition ease-in-out hover:opacity-80"
									href="/contact"
									lng={lng}
								>
									<div className="flex flex-row items-center justify-between">
										<p
											className={`text-light text-xs ${invBg ? 'text-[#F7F7F7]' : 'text-[#111111]'}`}
										>
											{commercials}
										</p>
										<Image src={DDArrow} alt="arrow" />
									</div>
								</LocalizedLink>
							</li>
						)}
					</ul>
				) : null}
			</li>

			<li
				suppressHydrationWarning
				className={`col-span-11 max-laptop:flex max-laptop:w-fit max-laptop:justify-end lg:col-span-2`}
			>
				<LocalizedLink
					onClick={() => {
						onItemClick && onItemClick();
					}}
					href="/resources"
					lng={lng}
					className={`block border-b ${invBg ? 'border-b-[#f7f7f7]' : 'border-b-[#0F0F0F]'} ${pathname === `/${lng}/resources` && !invBg ? '-ml-1 rounded bg-[#0F0F0F] pl-1 text-[#F7F7F7]' : pathname === `/${lng}/resources` && invBg ? 'normal-contrast-button -ml-1 rounded pl-1  ' : pathname !== `/${lng}/resources` && !invBg ? 'hover:bg-[#0F0F0F] hover:text-white' : pathname !== `/${lng}/resources` && invBg ? 'inverted-contrast-button hover:border-none hover:bg-[#F7F7F7] hover:text-[#0F0F0F]' : ''} hover:-ml-1 hover:rounded hover:pl-1  laptop:text-[0.7rem] laptop-xl:text-sm laptop-xl-extra:text-base`}
				>
					{rsc}
				</LocalizedLink>
			</li>
			<li
				suppressHydrationWarning
				className={`col-span-11 w-full hover:rounded hover:bg-[#0F0F0F] max-laptop:flex max-laptop:w-fit max-laptop:justify-end lg:col-span-2`}
			>
				<LocalizedLink
					onClick={() => {
						onItemClick && onItemClick();
					}}
					href="/news"
					lng={lng}
					className={`block border-b ${invBg ? 'border-b-[#f7f7f7]' : 'border-b-[#0F0F0F]'} ${pathname === `/${lng}/news` && !invBg ? '-ml-1 rounded bg-[#0F0F0F] pl-1 text-[#F7F7F7]' : pathname === `/${lng}/news` && invBg ? 'normal-contrast-button -ml-1 rounded pl-1  ' : pathname !== `/${lng}/news` && !invBg ? 'hover:bg-[#0F0F0F] hover:text-white' : pathname !== `/${lng}/news` && invBg ? 'inverted-contrast-button hover:border-none hover:bg-[#F7F7F7] hover:text-[#0F0F0F]' : ''} hover:-ml-1 hover:rounded hover:pl-1 laptop:text-[0.7rem] laptop-xl:text-sm laptop-xl-extra:text-base`}
				>
					{news}
				</LocalizedLink>
			</li>
			<li
				suppressHydrationWarning
				className={`col-span-11 w-full max-laptop:flex max-laptop:w-fit max-laptop:justify-end lg:col-span-2`}
			>
				<LocalizedLink
					onClick={() => {
						onItemClick && onItemClick();
					}}
					href="/about"
					lng={lng}
					className={`block border-b ${invBg ? 'border-b-[#f7f7f7]' : 'border-b-[#0F0F0F]'} ${pathname === `/${lng}/about` && !invBg ? '-ml-1 rounded bg-[#0F0F0F] pl-1 text-[#F7F7F7]' : pathname === `/${lng}/about` && invBg ? 'normal-contrast-button -ml-1 rounded pl-1  ' : pathname !== `/${lng}/about` && !invBg ? 'hover:bg-[#0F0F0F] hover:text-white' : pathname !== `/${lng}/about` && invBg ? 'inverted-contrast-button hover:border-none hover:bg-[#F7F7F7] hover:text-[#0F0F0F]' : ''} hover:-ml-1 hover:rounded hover:pl-1 laptop:text-[0.7rem] laptop-xl:text-sm laptop-xl-extra:text-base`}
				>
					{about}
				</LocalizedLink>
			</li>
			<li
				suppressHydrationWarning
				className={`col-span-11 w-full max-laptop:flex max-laptop:w-fit max-laptop:justify-end lg:col-span-2`}
			>
				<LocalizedLink
					onClick={() => {
						onItemClick && onItemClick();
					}}
					href="/contact"
					lng={lng}
					className={`block border-b ${invBg ? 'border-b-[#f7f7f7]' : 'border-b-[#0F0F0F]'} ${pathname === `/${lng}/contact` && !invBg ? '-ml-1 rounded bg-[#0F0F0F] pl-1 text-[#F7F7F7]' : pathname === `/${lng}/contact` && invBg ? 'normal-contrast-button -ml-1 rounded pl-1  ' : pathname !== `/${lng}/contact` && !invBg ? 'hover:bg-[#0F0F0F] hover:text-white' : pathname !== `/${lng}/contact` && invBg ? 'inverted-contrast-button hover:border-none hover:bg-[#F7F7F7] hover:text-[#0F0F0F]' : ''} hover:-ml-1 hover:rounded hover:pl-1 laptop:text-[0.7rem] laptop-xl:text-sm laptop-xl-extra:text-base`}
				>
					{contact}
				</LocalizedLink>
			</li>
			<li
				className="grid grid-cols-2 gap-2 max-laptop:hidden lg:col-span-1"
				suppressHydrationWarning
			>
				<div
					className={`justify-self-end rounded hover:border-none ${lngDdOpen && !invBg ? '' : lngDdOpen && invBg ? 'hover:bg-[#0F0F0F] hover:text-[#F7F7F7]' : !lngDdOpen && invBg ? 'hover:bg-[#F7F7F7] hover:text-[#0F0F0F]' : 'hover:bg-[#0F0F0F] hover:text-[#F7F7F7]'}`}
				>
					<button
						onClick={toggleDropdown}
						className={`col-span-1 flex w-full hover:border-none ${lngDdOpen && !invBg ? '' : lngDdOpen && invBg ? 'border-b border-none border-b-[#F7F7F7]' : !lngDdOpen && invBg ? 'border-b border-b-[#F7F7F7] hover:border-none' : 'border-b border-b-[#0F0F0F] hover:border-none'} justify-center px-[0.1rem] text-start uppercase laptop:text-[0.6rem] laptop-l:text-[0.7rem] laptop-xl:text-sm laptop-xl-extra:text-base`}
					>
						{lng.substring(0, 2)}
					</button>
					<div className={`${lngDdOpen ? '' : 'hidden'}`}>
						<div
							className={`${invBg ? 'bg-[#0F0F0F]' : 'bg-[#f7f7f7]'} laptop:relative`}
							suppressHydrationWarning
						>
							<div
								className={`laptop-xl-extra:texs-base absolute z-50 w-full border-b ${invBg ? 'border-[#F7F7F7] bg-[#0F0F0F]' : 'border-[#0F0F0F] bg-[#f7f7f7]'} laptop:text-[0.6rem] laptop-xl:text-sm`}
							>
								{languages.map((language) => {
									if (language === lng) return null;
									return (
										<LocalizedLink
											key={language}
											href={getCanonicalPathForLanguageSwitch(pathname)}
											lng={language}
											className={`mt-2 flex justify-center rounded px-[0.1rem] uppercase ${invBg ? 'hover:bg-[#F7F7F7] hover:text-[#0F0F0F]' : 'hover:bg-[#0F0F0F] hover:text-[#F7F7F7]'}`}
											onClick={() => setLangDdOpen(false)}
										>
											{language.substring(0, 2)}
										</LocalizedLink>
									);
								})}
							</div>
						</div>
					</div>
				</div>
				<div
					className={`flex w-fit items-center border-b ${invBg ? 'border-b-[#F7F7F7]' : 'border-b-[#0F0F0F]'} ${pathname === `/${lng}/cart` ? 'border-none ' : ''} col-span-1 justify-self-end hover:border-b-transparent hover:opacity-80`}
				>
					<LocalizedLink
						href="/cart"
						lng={lng}
						className={`relative flex w-[1vw] justify-center rounded `}
					>
						{cartItems > 0 ? (
							<p
								className={`absolute -top-[10px] left-[16px] text-[12px]${invBg ? 'text-[#F7F7F7]' : 'text-[#306abf]'}`}
							>
								{cartItems}
							</p>
						) : null}
						{invBg ? (
							<Image src={CartInv} alt="cart" className="" />
						) : (
							<Image src={Cart} alt="cart" className="" />
						)}
					</LocalizedLink>
				</div>
			</li>
		</ul>
	);
}
