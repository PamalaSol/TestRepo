'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ILink, IPartner, IProduct } from '../../_interfaces/interfaces';
import { CSSProperties, useEffect, useState } from 'react';
import { useTranslation } from '@/app/i18n/client';
import HomeValve from '@/public/assets/home-valve-homatic.webp';
import tStyles from '@/app/[lng]/textSizes.module.css';
import { AccordionItem } from './AccordionItem';
import logo from '@/public/assets/logo.svg';
import BlueArrow from '@/public/assets/blue-arrow.svg';
import { usePathname } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import { toastDefaultOptions } from '@/lib/utils';
import dynamic from 'next/dynamic';

// Dynamically import ContactForm
const ContactForm = dynamic(() => import('../../_components/ContactForm'), {
	loading: () => <p>Loading form...</p>,
	ssr: false,
});

export default function VerticalScroll({ lng }: { lng: string }) {
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

	interface IProductWIdx extends IProduct {
		idx: number;
	}
	const featuredProducts: IProductWIdx[] = [
		{
			heading: t('p1heading'),
			description: t('p1description'),
			series: '20',
			dimensions: '',
			width: 408,
			height: 694,
			link: `/${lng}/product/pinch-valves/36322a29-ce46-4261-8ee8-500cea0381b8`,
			image: '/assets/series-20-featured.webp',
			idx: 0,
		},
		{
			heading: t('p2heading'),
			description: t('p2description'),
			series: '40',
			dimensions: '',
			width: 328,
			height: 742,
			link: `/${lng}/product/pinch-valves/037461ff-d48c-4a7c-946b-860342b700cb`,
			image: '/assets/series-40-featured.webp',
			idx: 1,
		},
		{
			heading: t('p3heading'),
			description: t('p3description'),
			series: '10',
			dimensions: '',
			width: 399,
			height: 804,
			link: `/${lng}/product/pinch-valves/56588334-86df-44b4-8da2-94a613c57800`,
			image: '/assets/series-10-featured.webp',
			idx: 2,
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
	const unfinishedFeatures = false;
	const [currFPIdx, setCurrFPIdx] = useState<boolean[]>([]);
	const toggleAccordion = (idx: number) => {
		setCurrFPIdx((prev) => {
			const newState = [...prev];
			newState[idx] = !newState[idx];
			return newState;
		});
	};

	const pathname = usePathname();

	const handleSubmissionResult = (success: boolean) => {
		if (success) {
			toast.success(t('sent'), toastDefaultOptions);
		} else {
			toast.error(t('notSend'), toastDefaultOptions);
		}
	};

	useEffect(() => {
		// Intersection Observer callback
		const handleIntersection = (entries: IntersectionObserverEntry[]) => {
			entries.forEach((entry) => {
				const isVisible = entry.isIntersecting;

				if (entry.target.id === 'cont2') {
					if (isVisible) {
						// Entering the element, dispatch toBlack
						window.dispatchEvent(new Event('toBlack'));
					} else {
						// Exiting the element, dispatch toWhite
						window.dispatchEvent(new Event('toWhite'));
					}
				}
			});
		};

		const observerOptions: IntersectionObserverInit = {
			root: null,
			threshold: 0,
			rootMargin: '0px 0px -100% 0px',
		};
		// Create the observer
		const observer = new IntersectionObserver(handleIntersection, observerOptions);

		// Get the element to observe
		const cont2Element = document.querySelector('#cont2');

		// Type-check if element exists before observing
		if (cont2Element) observer.observe(cont2Element);

		return () => observer.disconnect();
	}, [pathname]);

	return (
		<div className="overflow-clip px-4 pt-10">
			<section>
				<div className="mb-16 mt-6">
					<div></div>
					<div className="">
						<h2 className={`pb-3 ${tStyles.cat1}`}>{t('mainTitle')}</h2>
						<p className={tStyles.cat3}>{t('mainDesc')}</p>
					</div>
					<div>
						<Image
							src={HomeValve}
							alt="Home valve"
							width={1728}
							height={839}
							priority
							className="-z-10 mt-4 w-full scale-110"
						/>
					</div>
				</div>
			</section>
			<section className="-mx-4 ">
				<div className="px-4">
					<h2 className={`pb-3 ${tStyles.cat1}`}>{t('welcome')}</h2>
					<p className={tStyles.cat3}>{t('welcomeDesc')}</p>
				</div>
				{links.map((link, idx) => (
					<div key={link.title + idx}>
						<AccordionItem
							title={link.title}
							content={link.description}
							src={link.src}
							link={link.link}
							idx={idx}
						/>
					</div>
				))}
				<Link
					href={`/${lng}/contact`}
					className="my-2 flex w-full items-center justify-center bg-[#0F0F0F] py-2 text-white focus:outline-none"
				>
					<p className={`uppercase ${tStyles.cat3}`}>{t('touch')}</p>
				</Link>
			</section>
			<section className="-mx-4 flex flex-col">
				{featuredProducts.map((product, idx) => (
					<div
						key={`product-item-${product.heading.toLowerCase()}-${idx}`}
						className="relative flex h-[1/3] flex-col  items-center"
					>
						<Image
							src={product.image}
							alt={product.heading}
							width={product.width}
							height={product.height}
							loading="lazy"
							className="z-10 w-[60vw] "
						/>
						<div
							className={`transition-max-height absolute bottom-0 z-30 h-full w-full  overflow-hidden bg-[#f7f7f7] px-4  duration-300 ease-in-out ${currFPIdx[idx] ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
						>
							<button
								className={` top-0 my-2 w-full bg-[#f7f7f7]  py-1 text-left focus:outline-none`}
								onClick={() => {
									toggleAccordion(idx);
								}}
							>
								<div className="flex items-center justify-between ">
									<p className={`line-clamp-1 ${tStyles.cat2}`}>
										{product.heading}
									</p>

									<svg
										className="-mr-1 h-5 w-5 text-gray-400"
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
								</div>
							</button>
							<div className="grid-rows-10 grid h-full bg-[#f7f7f7]  py-6 ">
								<div className="row-span-4 space-y-3 justify-self-start ">
									<p className={` ${tStyles.cat2}`}>{product.heading}</p>
									<p className={`${tStyles.cat3}`}>{product.description}</p>
								</div>
								<div className="row-span-4 flex justify-end ">
									<Link
										href={product.link}
										className={` flex w-full items-center justify-end gap-3 text-[#306abf] laptop:text-[0.6rem] laptop-l:pb-[4vh] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-base`}
									>
										{t('series')} {product.series}{' '}
										<Image
											src={BlueArrow}
											alt="Blue arrow"
											height={500}
											width={500}
											className="h-auto w-auto"
										/>
									</Link>
								</div>
							</div>
						</div>
						<button
							className={`${currFPIdx[idx] ? '' : ''}  bottom-0 z-20 w-full bg-gray-200  px-4  py-1 text-left focus:outline-none`}
							onClick={() => {
								toggleAccordion(idx);
							}}
						>
							<div className={`flex items-center justify-between `}>
								<p
									className={`line-clamp-1 ${tStyles.cat2} ${currFPIdx[idx] ? 'text-white' : 'text-[#0F0F0F]'} `}
								>
									{product.heading}
								</p>

								<svg
									className={`-mr-1 h-5 w-5 rotate-180 ${currFPIdx[idx] ? 'text-white' : 'text-gray-400'} `}
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
							</div>
						</button>
					</div>
				))}
			</section>
			<section>
				<div className="mt-6">
					<div className="flex justify-center">
						<Image
							src="/assets/valve-partners.webp"
							alt="Home partners"
							width={858}
							height={801}
							className="w-[70vw]"
						/>
					</div>
					<div className="">
						<div className="flex h-full flex-col justify-between">
							<div className="flex flex-col">
								<p className={`pb-3 ${tStyles.cat1}`}>{t('partners')}</p>
								<p className={tStyles.cat3}>{t('partnersD')}</p>
							</div>
							<div className="mt-3 flex flex-col space-y-3">
								{partners.map((partner, idx) => (
									<div
										className={`py-3`}
										key={`partner-item-${partner.title.toLowerCase()}`}
									>
										<div>
											<div className="flex flex-col ">
												<div className="flex items-center">
													<Link href={partner.link}>
														<Image
															src={partner.image}
															alt={partner.title}
															width={100}
															height={100}
															className="w-[10vw] pb-3"
														/>
													</Link>
												</div>
												<p className={`pb-1 ${tStyles.cat4}`}>
													{partner.heading}
												</p>
												<p className={tStyles.cat3}>
													{partner.description}
												</p>
												<Link
													href={partner.link}
													className="w-fit border-b border-[#0F0F0F] pt-3 text-xs font-normal"
												>
													{partner.title}
												</Link>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>
			<section className="relative -mx-4 mt-10 bg-[#0F0F0F] px-4" id="cont2">
				<div className="w-full pb-10 ">
					<div className="pt-10">
						<div className="">
							<div>
								<div className="flex flex-col space-y-10">
									<p className="text-xl text-[#F7F7F7]">{t('hello')}</p>
									<ContactForm
										theme={'dark'}
										lng={lng}
										onSubmissionResult={handleSubmissionResult}
									/>
								</div>
							</div>
							<div className="order-2 flex h-full items-end pt-10">
								<Image src={logo} alt="HO-Matic footer logo" className="w-[50%]" />
							</div>
							<div className="grid h-full w-full grid-cols-2 pt-10">
								<div className="flex flex-col space-y-5">
									<p className="text-xs uppercase text-[#f7f7f7]">{t('pages')}</p>
									<div className="flex flex-col space-y-2">
										<Link
											className="text-xs uppercase text-[#B7B7B7] transition ease-in-out hover:opacity-80"
											href={`/${lng}/`}
										>
											{t('home')}
										</Link>
										<Link
											className="text-xs uppercase text-[#B7B7B7] transition ease-in-out hover:opacity-80"
											href={`/${lng}/products`}
										>
											{t('products')}
										</Link>
										<Link
											className="text-xs uppercase text-[#B7B7B7] transition ease-in-out hover:opacity-80"
											href={`/${lng}/resources`}
										>
											{'Downloads'}
										</Link>
										<Link
											className="text-xs uppercase text-[#B7B7B7] transition ease-in-out hover:opacity-80"
											href={`/${lng}/news`}
										>
											{t('news')}
										</Link>
										<Link
											className="text-xs uppercase text-[#B7B7B7] transition ease-in-out hover:opacity-80"
											href={`/${lng}/about`}
										>
											{t('about')}
										</Link>
										<Link
											className="text-xs uppercase text-[#B7B7B7] transition ease-in-out hover:opacity-80"
											href={`/${lng}/contact`}
										>
											{t('contact')}
										</Link>
										<Link
											className="text-xs uppercase text-[#B7B7B7] transition ease-in-out hover:opacity-80"
											href={`/${lng}/cart`}
										>
											{t('cart')}
										</Link>
										<Link
											className="text-xs uppercase text-[#B7B7B7] transition ease-in-out hover:opacity-80"
											href={`/${lng}/site-notice`}
											suppressHydrationWarning={true}
										>
											{t('notice')}
										</Link>
										<Link
											className="text-xs uppercase text-[#B7B7B7] transition ease-in-out hover:opacity-80"
											href={`/${lng}/privacy-policy`}
											suppressHydrationWarning={true}
										>
											{t('privPol')}
										</Link>
										<button
											className=" flex items-start text-xs uppercase text-[#B7B7B7] transition ease-in-out hover:opacity-80"
											onClick={() => {
												navigator.clipboard.writeText('info@ho-matic.ch');
												toast.success(t('clipboard'), toastDefaultOptions);
											}}
										>
											{'Email'}
										</button>
									</div>
									<p className={`mt-2 text-xs uppercase text-[#f7f7f7]`}>
										{t('SM')}
									</p>
									<div className={`flex flex-col space-y-2 text-[#B7B7B7] `}>
										<a
											target="_blank"
											rel="noopener noreferrer"
											className="text-xs uppercase text-[#B7B7B7] transition ease-in-out hover:opacity-80"
											href={`https://www.instagram.com/homaticag/`}
											suppressHydrationWarning={true}
										>
											{t('Instagram')}
										</a>
										<a
											target="_blank"
											rel="noopener noreferrer"
											className="text-xs uppercase text-[#B7B7B7] transition ease-in-out hover:opacity-80"
											href={`https://www.youtube.com/@ho-maticag9119/videos`}
											suppressHydrationWarning={true}
										>
											{t('YouTube')}
										</a>
										<a
											target="_blank"
											rel="noopener noreferrer"
											className="text-xs uppercase text-[#B7B7B7] transition ease-in-out hover:opacity-80"
											href={`https://www.linkedin.com/company/ho-matic`}
											suppressHydrationWarning={true}
										>
											{t('LinkedIn')}
										</a>
									</div>
								</div>
								<div className={`grid-cols-6 text-[#B7B7B7]`}>
									<div className={`flex flex-col space-y-5`}>
										<p
											className={`text-light text-xs  text-[#f7f7f7] opacity-0`}
										>
											.
										</p>
										<div className="flex flex-col">
											<p className="text-xs ">{`HO-Matic AG`}</p>
											<p className="text-xs ">{`Alte Obfelderstrasse 55`}</p>
											<p className="text-xs ">{`8910 Affoltern a. A.`}</p>
											<p className="text-xs ">{`Schweiz`}</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<ToastContainer />
		</div>
	);
}
