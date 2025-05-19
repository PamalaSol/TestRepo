'use client';

import Search from './Search';
import Menu from './Menu';
import { useTranslation } from '@/app/i18n/client';
import Logo from '@/public/assets/logo.svg';
import LogoInv from '@/public/assets/logoinv.svg';
import Image from 'next/image';
import GrayArrow from '@/public/assets/grey-arrow.svg';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import LocalizedLink from './LocalizedLink';

export const Header = ({ lng, path = '' }: { lng: string; path: string }) => {
	const { t } = useTranslation(lng, 'horiz-scroll');

	const unusedFeatures = false;
	const [invBg, setInvBg] = useState<boolean>(false);

	const pathname = usePathname();

	useEffect(() => {
		setInvBg(false);
	}, [pathname]);

	const handleToBlack = (event: Event) => {
		setInvBg(true);
	};

	const handleToWhite = (event: Event) => {
		setInvBg(false);
	};

	useEffect(() => {
		if (
			pathname === `/${lng}/products` ||
			pathname === `/${lng}/pinch-valves` ||
			// Also check for localized paths
			pathname.includes('/produkte') ||
			pathname.includes('/produits') ||
			// Add specific check for English pinch valves in product category
			pathname.includes(`/${lng}/products/pinch-valves`)
		) {
			window.addEventListener('toBlack', handleToBlack);
			window.addEventListener('toWhite', handleToWhite);

			return () => {
				window.removeEventListener('toBlack', handleToBlack);
				window.removeEventListener('toWhite', handleToWhite);
			};
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname]);

	useEffect(() => {
		const handleColorSwap = (event: Event) => {
			const customEvent = event as CustomEvent; // Cast to CustomEvent
			const color = customEvent.detail.color; // Access the color value
			setInvBg(color);
		};

		window.addEventListener('homeColorSwap', handleColorSwap as EventListener); // Cast to EventListener

		// Cleanup event listener on component unmount
		return () => {
			window.removeEventListener('homeColorSwap', handleColorSwap as EventListener);
		};
	}, []);

	return (
		<header className="fixed z-50 w-[99.99%] lg:h-[5vh]" suppressHydrationWarning={true}>
			<div
				id="contrast"
				className={`${invBg ? 'inverted-contrast' : 'normal-contrast'} grid w-full grid-cols-11 items-end px-4 pb-2 pt-2 lg:gap-y-0 laptop:gap-x-2 laptop:pt-3`}
			>
				<div className="grid items-end grid-cols-12 col-span-10 gap-x-3 lg:col-span-6 lg:grid-cols-6">
					<div
						className={`col-span-4 border-b ${invBg ? 'border-b-[#F7F7F7]' : 'border-b-[#0F0F0F]'}  max-laptop:hidden lg:col-span-2 `}
					>
						<LocalizedLink href="/" lng={lng}>
							{invBg ? (
								<Image
									src={LogoInv}
									alt="HO-Matic Logo"
									className="w-[7vw] pb-[2px] transition ease-in-out hover:opacity-80"
								/>
							) : (
								<Image
									src={Logo}
									alt="HO-Matic Logo"
									className="w-[7vw] pb-[2px] transition ease-in-out hover:opacity-80"
								/>
							)}
						</LocalizedLink>
					</div>
					<div
						className={`relative col-span-11 grid grid-cols-12 justify-between border-b ${invBg ? 'border-b-[#F7F7F7]' : 'border-b-[#0F0F0F]'} lg:col-span-4`}
						suppressHydrationWarning={true}
					>
						<Search lng={lng} srch={t('search')} invBg={invBg} />
						<div className="flex items-center justify-end col-span-1">
							<Image src={GrayArrow} alt="arrow" className="w-1/2" />
						</div>
					</div>
				</div>
				<div className="grid-cols-12 max-laptop:hidden lg:col-span-5 lg:grid-cols-6">
					<Menu
						lng={lng}
						prods={t('products')}
						pvs={t('pinchValvesMn')}
						rsc={'Downloads'}
						news={t('news')}
						about={t('about')}
						contact={t('contact')}
						sleevesMn={t('sleevesMn')}
						customs={t('customSolutionsMn')}
						controlsMn={t('controlsMn')}
						commercials={t('commercialProductsMn')}
						invBg={invBg}
					/>
				</div>
			</div>
		</header>
	);
};
export default Header;
