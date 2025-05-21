/* eslint-disable @next/next/no-img-element */
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ILink, IPartner, IProduct } from '../../_interfaces/interfaces';
import { CSSProperties, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import styles from '../../scroll.module.css';
import { useTranslation } from '@/app/i18n/client';
import BlueArrow from '@/public/assets/blue-arrow.svg';
import tStyles from '@/app/[lng]/textSizes.module.css';
import BigValve from '@/public/assets/home-valve-homatic.webp';
import Button from '@/public/assets/button.svg';
import Partners from '@/public/assets/valve-partners.webp';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { isSafari } from 'react-device-detect';
import { toast, ToastContainer } from 'react-toastify';
import { toastDefaultOptions } from '@/lib/utils';
import dynamic from 'next/dynamic';

gsap.registerPlugin(ScrollTrigger);

// Dynamically import ContactForm
const ContactForm = dynamic(() => import('../../_components/ContactForm'), {
	loading: () => <p>Loading form...</p>,
	ssr: false
});

// Dynamically import HomeFooter
const HomeFooter = dynamic(() => import('./HomeFooter'), {
	loading: () => <p>Loading footer...</p>,
	ssr: false
});

export default function HorizontalScroll({ lng }: { lng: string }) {
	const { t } = useTranslation(lng, 'horiz-scroll');

	const partners: IPartner[] = [
		{
			title: t('p1Title'),
			heading: t('p1Heading'),
			description: t('p1Desc'),
			width: 35,
			height: 28,
			image: '/assets/home-partner-magnetventile.svg',
			link: 'https://www.buschjostventile.de/en',
		},
		{
			title: t('p2Title'),
			heading: t('p2Heading'),
			description: t('p2Desc'),
			width: 26,
			height: 19,
			image: '/assets/home-partner-pneumatikventile.svg',
			link: 'https://www.rosseuropa.com/en',
		},
	];

	const featuredProducts: IProduct[] = [
		{
			heading: t('p1heading'),
			description: t('p1description'),
			series: '20',
			dimensions: '',
			width: 408,
			height: 694,
			link: `${lng}/product/pinch-valves/36322a29-ce46-4261-8ee8-500cea0381b8`,
			image: '/series-20-featured.webp',
		},
		{
			heading: t('p2heading'),
			description: t('p2description'),
			series: '40',
			dimensions: '',
			width: 328,
			height: 742,
			link: `${lng}/product/pinch-valves/037461ff-d48c-4a7c-946b-860342b700cb`,
			image: '/series-40-featured.webp',
		},
		{
			heading: t('p3heading'),
			description: t('p3description'),
			series: '10',
			dimensions: '',
			width: 399,
			height: 804,
			link: `${lng}/product/pinch-valves/56588334-86df-44b4-8da2-94a613c57800`,
			image: '/series-10-featured.webp',
		},
	];

	const links: ILink[] = [
		{
			title: t('pv'),
			description: t('pvDesc'),
			link: `${lng}/products/pinch-valves`,
			src: '/assets/home-pinch-valve.webp',
		},
		{
			title: t('controls'),
			description: t('cDesc'),
			link: `${lng}/products/controls`,
			src: '/assets/mobile-control.webp',
		},
		{
			title: t('spareSleeves'),
			description: t('ssDesc'),
			link: `${lng}/products/sleeves`,
			src: '/assets/products/spare-sleeves.webp',
		},
		{
			title: t('customSol'),
			description: t('customSolDesc'),
			link: `${lng}/contact`,
			src: '/assets/control-photo.webp',
		},
	];

	const sliderItemStyle = {} as CSSProperties;

	const sectionRef = useRef(null);
	const triggerRef = useRef(null);
	const blackRef = useRef(null);

	useEffect(() => {
		if (window.innerWidth > 1024) {
			const pin = gsap.fromTo(
				sectionRef.current,
				{
					translateX: 0,
				},
				{
					translateX: '-400vw',
					ease: 'none',
					duration: 2,
					scrollTrigger: {
						trigger: triggerRef.current,
						start: 'top top',
						end: () => '+=' + window.screen.width * 3.8,
						scrub: 0.01,
						pin: true,
					},
				}
			);

			return () => {
				pin.kill();
			};
		}
	}, []);

	const [homeHeaderColor, setHomeHeaderCoolor] = useState<boolean>(false);

	useEffect(() => {
		const event = new CustomEvent('homeColorSwap', {
			detail: { color: homeHeaderColor },
		});

		window.dispatchEvent(event);
	}, [homeHeaderColor]);

	useEffect(() => {
		const logScrollPosition = () => {
			const scrollY = window.scrollY; // Get vertical scroll position

			if (scrollY >= window.screen.width * 3.3 && !homeHeaderColor) {
				setHomeHeaderCoolor(true);
			} else {
				setHomeHeaderCoolor(false);
			}
		};

		// Optional: Set up an event listener to log on resize

		// Event listeners for scroll and resize
		window.addEventListener('scroll', logScrollPosition);

		// Cleanup event listeners on component unmount
		return () => {
			window.removeEventListener('scroll', logScrollPosition);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Empty dependency array means this runs once when the component mounts

	const [selectedPhoto, setSelectedPhoto] = useState<string>('/assets/home-pinch-valve.webp');
	const [photoNum, setPhotoNum] = useState<number>(0);
	const [parent, enableAnimations] = useAutoAnimate();
	const unusedFeatures = false;

	const [transformItem, setTransformItem] = useState<{
		css: string;
		idx?: number;
		item?: string;
	}>({
		css: '',
		idx: 0,
	});

	const handleSubmissionResult = (success: boolean) => {
		if (success) {
			toast.success(t('sent'), toastDefaultOptions);
		} else {
			toast.error(t('notSend'), toastDefaultOptions);
		}
	};

	return (
		<div className="overflow-hidden max-lg:hidden" suppressHydrationWarning>
			<div ref={triggerRef} className="z-10 flex h-[100vh] items-end ">
				<div ref={sectionRef} className="">
					<div className={`relative flex h-[97vh] w-[500vw]`}>
						<section
							style={sliderItemStyle}
							className={`${styles.scrollSection} py-4 laptop-l:py-10`}
						>
							<div className="grid-rows-7 grid h-full">
								<div
									className={`row-span-1 grid grid-cols-11 ${isSafari ? 'gap-3' : ''}`}
								>
									<div className="col-span-6"></div>
									<div
										className="col-span-5 -ml-1 w-full pr-8"
										onPointerEnter={() => {
											setTransformItem({
												css: 'animate-pulse ',
												item: 'sec1',
											});
										}}
										onPointerLeave={() => {
											setTransformItem({ css: '', idx: 0, item: '' });
										}}
									>
										<h1 className={`pb-3 ${tStyles.cat1}`}>{t('mainTitle')}</h1>
										<p className={`${tStyles.cat3}`}>{t('mainDesc')}</p>
										<div className="flex flex-row justify-end">
											<Link
												href={`/${lng}/products`}
												className={`flex gap-3 whitespace-nowrap font-light text-[#306abf] transition ease-in-out hover:opacity-80  laptop:text-xs laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-base ${transformItem.item === 'sec1' ? `${transformItem.css}` : ''}`}
											>
												{t('link')}
												<Image
													src={BlueArrow}
													alt="arrow"
													height={500}
													width={500}
													className="h-auto w-auto"
												/>
											</Link>
										</div>
									</div>
								</div>
								<div className="row-span-6 flex h-full items-center">
									<Image src={BigValve} alt="Home valve" className="" priority />
								</div>
							</div>
						</section>
						<section
							style={sliderItemStyle}
							className={`${styles.scrollSection} flex items-center  `}
						>
							<div className="mt-16 grid grid-cols-11 border-x border-x-[#C8C8C8]">
								<div
									className="col-span-11 -mt-4 flex items-center justify-center lg:col-span-6"
									ref={parent}
								>
									{photoNum === 0 && (
										<div className="col-span-5">
											<Image
												src={selectedPhoto}
												alt="Home Link Preview"
												className="w-[30vw] transition ease-in-out"
												width={500}
												height={500}
												loading="lazy"
											/>
										</div>
									)}
									{photoNum === 1 && (
										<div className="col-span-5">
											<Image
												src={selectedPhoto}
												alt="Home Link Preview"
												className="w-[30vw] transition ease-in-out"
												width={500}
												height={500}
												loading="lazy"
											/>
										</div>
									)}
									{photoNum === 2 && (
										<div className="col-span-5">
											<Image
												src={selectedPhoto}
												alt="Home Link Preview"
												className="w-[30vw] transition ease-in-out"
												width={500}
												height={500}
												loading="lazy"
											/>
										</div>
									)}
									{photoNum === 3 && (
										<div className="col-span-5">
											<Image
												src={selectedPhoto}
												alt="Home Link Preview"
												className="w-[30vw] transition ease-in-out"
												width={500}
												height={500}
												loading="lazy"
											/>
										</div>
									)}
								</div>
								<div className="col-span-11 -mt-10 flex h-[85vh] flex-col items-start justify-between px-6 lg:col-span-5 ">
									<div className="">
										<div className="h-[5vh]"></div>
										<div
											className="laptop-l:mb-3"
											onPointerEnter={() => {
												setTransformItem({
													css: 'animate-pulse ',
													item: 'sec2',
												});
											}}
											onPointerLeave={() => {
												setTransformItem({ css: '', idx: 0, item: '' });
											}}
										>
											<h2 className={`pb-3 ${tStyles.cat1}`}>
												{t('welcome')}
											</h2>
											<p className={tStyles.cat3}>{t('welcomeDesc')}</p>

											<div className="flex w-full justify-end laptop-l:mt-2">
												<Link
													href={`/${lng}/about`}
													className={`${transformItem.item === 'sec2' ? `${transformItem.css}` : ''} text-light  flex items-center gap-3 text-[#306abf] transition ease-in-out hover:opacity-80 laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-base `}
												>
													{t('welcomeLink')}
													<Image src={BlueArrow} alt="arrow" />
												</Link>
											</div>
										</div>
									</div>

									<div className="grid grid-rows-4 max-laptop:pt-4 ">
										{links.map((link, idx) => (
											<div
												key={`link-item-${link.title.toLowerCase()}-${idx}`}
												className={`grid grid-cols-12 border-b border-x-transparent border-t-[#C8C8C8] py-3 laptop-l:py-5 ${selectedPhoto === link.src ? 'bg-[#F7F7F7]' : ''}`}
												onPointerEnter={() => {
													setSelectedPhoto(link.src);
													setPhotoNum(idx);
												}}
											>
												<div className="col-span-8 grid-cols-8">
													<div className="flex flex-col space-y-1 laptop-l:space-y-2">
														<p className={` ${tStyles.cat3}`}>{link.title}</p>
														<h3 className={`pb-3 ${tStyles.cat2}`}>
															{link.description}
														</h3>
													</div>
												</div>
												<div className="col-span-2 grid-cols-2"></div>
												<Link
													href={link.link}
													className="flex items-center col-span-2 grid-cols-2 transition ease-in-out hover:opacity-80"
												>
													<Image
														src={Button}
														alt="Button"
														className={`transition ease-in-out hover:opacity-80 ${transformItem.idx === idx && transformItem.item === 'link' ? `${transformItem.css}` : ''}`}
													/>
												</Link>
											</div>
										))}
									</div>
								</div>
							</div>
						</section>
						<section
							style={sliderItemStyle}
							className={`${styles.scrollSection}  pr-6`}
						>
							<div className="h-[5vh]"></div>
							<div className="grid h-full grid-cols-4 space-x-3 border-r border-r-[#C8C8C8]">
								<div className="col-span-4 grid-cols-12 lg:col-span-1 ">
									<p
										className={`${lng === 'en-US' ? 'my-4' : 'my-8'} w-44 -rotate-90 whitespace-nowrap  pb-36 ${lng === 'en-US' ? 'text-sm' : 'text-xs'} font-light uppercase text-[#0D0D0D]`}
									>
										{t('sideText')}
									</p>
								</div>
								<div className="cols-span-4  mt-[3vh] grid h-[85vh] grid-cols-3 gap-6 lg:col-span-3">
									{featuredProducts.map((product, idx) => (
										<div
											className="col-span-3 flex flex-col justify-between lg:col-span-1"
											key={`product-item-${product.heading.toLowerCase()}-${idx}`}
											onPointerEnter={() => {
												setTransformItem({
													css: 'animate-pulse ',
													idx: idx,
													item: 'sec3',
												});
											}}
											onPointerLeave={() => {
												setTransformItem({ css: '', idx: 0, item: '' });
											}}
										>
											<div className="flex h-[90vh] flex-col ">
												<div className="flex w-full items-center justify-center overflow-clip">
													<img
														src={`/assets${product.image}`}
														alt={product.heading}
														className="h-[60vh]  "
													/>
												</div>
												<div className="rows-auto-rows grid-rows-6 flex-col items-center  px-3  laptop:grid laptop:h-[28vh]  laptop-l:flex">
													<div className="row-span-5 h-full flex-col justify-between laptop:flex laptop:justify-start laptop:self-start">
														<h3
															className={`  pb-3 pt-6 ${tStyles.cat2}`}
														>
															{product.heading}
														</h3>
														<p
															className={`self-start laptop:line-clamp-3 laptop-l:line-clamp-4 ${tStyles.cat3}`}
														>
															{product.description}
														</p>
													</div>

													<Link
														href={product.link}
														className={`${transformItem.item === 'sec3' && transformItem.idx === idx ? `${transformItem.css}` : ''} row-span-1 flex w-full  items-center justify-end gap-3 text-[#306abf] laptop:text-[0.6rem] laptop-l:pb-[4vh] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-base`}
													>
														{t('series')} {product.series}{' '}
														<Image
															src={BlueArrow}
															alt="Blue arrow"
															loading="lazy"
															className="h-fit"
														/>
													</Link>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						</section>
						<section
							style={sliderItemStyle}
							className={`${styles.scrollSection} flex flex-col items-center `}
						>
							<div className=" h-[5vh]"></div>
							<div className="my-10 grid grid-cols-11 px-2 ">
								<div className=" b col-span-11 flex h-[90vh] items-center justify-center lg:col-span-6">
									<Image
										src={Partners}
										alt="Home partners"
										className="h-[95%] w-fit"
										loading="lazy"
									/>
								</div>

								<div className="col-span-11 mb-4 grid-rows-2 flex-col content-baseline justify-between lg:col-span-5 laptop:grid laptop:h-[60vh] laptop-l:flex laptop-l:h-[85vh]">
									<div className="mt-4 flex h-fit flex-col justify-start pr-10">
										<h2 className={`pb-3 ${tStyles.cat1}`}>{t('partners')}</h2>
										<p className={tStyles.cat3}>{t('partnersD')}</p>
									</div>
									<div className="grid h-fit grid-rows-2 place-self-start">
										{partners.map((partner, idx) => (
											<div
												onPointerEnter={() => {
													setTransformItem({
														css: 'scale-110 ',
														idx: idx,
													});
												}}
												onPointerLeave={() => {
													setTransformItem({ css: '', idx: 0 });
												}}
												className={`grid grid-cols-12 border  py-3 laptop-l:py-5 ${
													idx !== links.length - 1
														? 'border-t-[#C8C8C8]'
														: 'border-y-[#C8C8C8]'
												} border-x-transparent border-b-transparent`}
												key={`partner-item-${partner.title.toLowerCase()}-${idx}`}
											>
												<div className="col-span-8 grid-cols-8">
													<div className="flex flex-col space-y-1 laptop-l:space-y-2">
														<div className="flex items-center space-x-1 ">
															<Image
																src={partner.image}
																alt={partner.title}
																width={partner.width}
																height={partner.height}
																loading="lazy"
																className="w-[2vw]"
															/>
															<p className={` ${tStyles.cat3}`}>
																{partner.title}
															</p>
														</div>
														<h3 className={`pb-3 ${tStyles.cat2}`}>
															{partner.heading}
														</h3>
														<p className={`${tStyles.cat3}`}>
															{partner.description}
														</p>
													</div>
												</div>
												<div className="col-span-2 grid-cols-2"></div>
												<div className="col-span-2 flex h-full items-center ">
													<Link
														href={partner.link}
														target="_blank"
														rel="noopener noreferrer"
														className="flex h-full items-center"
													>
														<Image
															loading="lazy"
															src="/assets/button.svg"
															alt="Button"
															width={113}
															height={113}
															className={`${transformItem.idx === idx ? `${transformItem.css}` : ''} transition ease-in-out hover:opacity-80`}
														/>
													</Link>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</section>
						<section
							style={sliderItemStyle}
							className={`${styles.scrollSection} relative flex flex-col items-center justify-center bg-[#0F0F0F]  pt-[5vh] text-[#f7f7f7] `}
							suppressHydrationWarning={true}
							ref={blackRef}
						>
							<div className="grid h-full w-full grid-cols-2 grid-rows-4 ">
								<div className="col-span-2 row-span-1 max-laptop-l:hidden"></div>
								<div className="col-span-2 row-span-2 grid grid-cols-11 ">
									<p className="col-span-6 self-center pl-6 text-xl text-[#F7F7F7]"></p>
									<div
										className="col-span-5 pl-2 pr-8"
										suppressHydrationWarning={true}
									>
										<div className="flex flex-col space-y-10">
											<p className="text-xl text-[#F7F7F7]">{t('hello')}</p>
											<ContactForm
												theme={'dark'}
												lng={lng}
												onSubmissionResult={handleSubmissionResult}
											/>
										</div>
									</div>
								</div>
								<div
									suppressHydrationWarning={true}
									className="row-span-1 row-start-4"
								>
									<HomeFooter lng={lng} />
								</div>
							</div>
						</section>
					</div>
				</div>
			</div>
			<ToastContainer />
		</div>
	);
}
