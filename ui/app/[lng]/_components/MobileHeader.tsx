'use client';
import React, { useEffect, useRef, useState } from 'react';
import LocalizedLink from './LocalizedLink';
import Open from '@/public/assets/mobile/menu-plus.svg';
import OpenInv from '@/public/assets/mobile/menu-plus-inv.svg';
import Logo from '@/public/assets/ho.svg';
import LogoInv from '@/public/assets/ho-inv.svg';
import Image from 'next/image';
import Search from './Search';
import GrayArrow from '@/public/assets/grey-arrow.svg';
import MobileMenu from './MobileMenu';
import { usePathname } from 'next/navigation';

const MobileHeader = ({
	lng,
	srch,
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
}: {
	lng: string;
	srch: string;
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
}) => {
	const [menuOpen, setMenuOpen] = useState(false);

	const menuRef = useRef<HTMLDivElement>(null);

	const handleToggleMenu = () => {
		setMenuOpen((prev) => !prev);
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
			setMenuOpen(false);
		}
	};

	useEffect(() => {
		if (menuOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		} else {
			document.removeEventListener('mousedown', handleClickOutside);
		}

		// Cleanup the event listener on component unmount
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [menuOpen]);

	const [invBg, setInvBg] = useState<boolean>(false);

	const pathname = usePathname();

	useEffect(() => {
		setInvBg(false);
	}, [pathname]);

	const handleToBlack = () => {
		setInvBg(true);
	};

	const handleToWhite = () => {
		setInvBg(false);
	};

	useEffect(() => {
		window.addEventListener('toBlack', handleToBlack);
		window.addEventListener('toWhite', handleToWhite);

		return () => {
			window.removeEventListener('toBlack', handleToBlack);
			window.removeEventListener('toWhite', handleToWhite);
		};
	}, []);

	return (
		<div
			className={`fixed top-0 z-50 grid w-[100%] ${invBg ? 'bg-[#0F0F0F]' : 'bg-[#f7f7f7]'} px-4 pt-2 ${menuOpen && !invBg ? 'border-b-2 border-[#0F0F0F]' : menuOpen && invBg ? 'border-b-2 border-[#F7F7F7]' : ''}`}
			suppressHydrationWarning={true}
			ref={menuRef}
		>
			<div className="grid grid-cols-12 ">
				<div className="col-span-11 grid w-full grid-cols-12 gap-2">
					<LocalizedLink
						className="col-span-2 flex h-full w-full"
						href="/"
						lng={lng}
						onClick={() => {
							setMenuOpen(false);
						}}
					>
						{!invBg ? (
							<Image src={Logo} alt="HO-Matic Footer Logo" className="self-center" />
						) : (
							<Image
								src={LogoInv}
								alt="HO-Matic Footer Logo"
								className="self-center"
							/>
						)}
					</LocalizedLink>
					<div
						className={`relative col-span-10 grid grid-cols-12 justify-between border-b ${invBg ? 'border-b-[#F7F7F7]' : 'border-b-[#0F0F0F]'} max-laptop:mx-2 max-tablet:mx-0 lg:col-span-4`}
						suppressHydrationWarning={true}
					>
						<Search lng={lng} srch={srch} invBg={invBg} />
						<div className="col-span-1 flex items-center justify-end">
							<Image src={GrayArrow} alt="arrow" className="max-laptop:w-[10vw]" />
						</div>
					</div>
				</div>
				<button
					className="col-span-1 flex w-fit min-w-[48px] items-center justify-end justify-self-end"
					onClick={() => {
						handleToggleMenu();
					}}
				>
					{invBg ? (
						<Image
							src={OpenInv}
							alt="open dropdown icon"
							className={` trasfrom transition duration-500 ${menuOpen ? 'rotate-[225deg]' : ''}  w-[5vw] `}
						/>
					) : (
						<Image
							src={Open}
							alt="open dropdown icon"
							className={` trasfrom transition duration-500 ${menuOpen ? 'rotate-[225deg]' : ''}  w-[5vw] `}
						/>
					)}
				</button>
			</div>
			<div
				className={`overflow-hidden transition-all duration-500 ease-in-out  ${
					menuOpen ? 'max-h-screen' : 'max-h-0'
				} h-fit w-full pt-2`}
			>
				<MobileMenu
					lng={lng}
					prods={prods}
					pvs={pvs}
					rsc={rsc}
					news={news}
					about={about}
					contact={contact}
					sleevesMn={sleevesMn}
					customs={customs}
					controlsMn={controlsMn}
					commercials={commercials}
					onItemClick={() => {
						setMenuOpen(false);
					}}
					open={menuOpen}
					invBg={invBg}
				/>
			</div>
		</div>
	);
};

export default MobileHeader;
