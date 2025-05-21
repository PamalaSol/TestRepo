'use client';

import Image from 'next/image';
import BlueArrow from '@/public/assets/blue-arrow.svg';
import { useState } from 'react';
import { useTranslation } from '@/app/i18n/client';
import ContactValve from '@/public/assets/contact-valve-open.webp';
import Link from 'next/link';
import YT from '@/public/assets/social-media/yt-d.svg';
import LI from '@/public/assets/social-media/li-d.svg';
import IG from '@/public/assets/social-media/ig-d.svg';
import dynamic from 'next/dynamic';
import tStyles from '@/app/[lng]/textSizes.module.css';

// Dynamically import ContactForm
const ContactForm = dynamic(() => import('../_components/ContactForm'), {
	loading: () => <p>Loading form...</p>,
	ssr: false,
});

// Dynamically import HoAccordionPartners
const HoAccordionPartners = dynamic(() => import('../_components/HoAccordionPartners'), {
	loading: () => <p>Loading partners...</p>,
	ssr: false,
});

// Dynamically import ContactFooter
const ContactFooter = dynamic(() => import('../_components/ContactFooter'), {
	loading: () => <p>Loading footer...</p>,
	ssr: false,
});

export default function Contact({ params }: { params: { lng: string } }) {
	const { lng } = params;
	const { t } = useTranslation(lng, 'contact');

	const [selectedTab, setSelectedTab] = useState<'getInTouch' | 'partners'>('getInTouch');

	const partnerCountries: {
		title: string;
		name: string;
		address: string;
		phone: string;
		link: string;
	}[] = [
		{
			title: t('denmark'),
			name: 'Iversen Tradig ApS',
			address: 'Sintrupvej 7, 8220 Braband,',
			phone: 'Tel. + 45 86 24 33 11',
			link: 'https://iversen-trading.dk',
		},
		{
			title: t('norway'),
			name: 'Bürkert Norway AS',
			address: 'Boks 243, 2026 Skjetten',
			phone: 'Tel. +47 63 84 44 10',
			link: 'https://burkert.no',
		},
		{
			title: t('japan'),
			name: 'Yamamoto Sangyo Co., Ltd.',
			address: '3-3-12, Senba-Higashi	562-0035 Mino City, Osaka',
			phone: 'Tel. +81 72 730 02 02',
			link: 'https://oscarvalve.com',
		},
		{
			title: t('thailand'),
			name: 'Big Bee Enterprise Co., Ltd.',
			address: '75/58 Soi Rom Klao 1, San saep, Minburi 10510 Bangkok',
			phone: 'Tel. +66 29 18 22 29',
			link: 'https://big-bee.com',
		},
		{
			title: t('sweden'),
			name: 'Kompauto Nordic AB',
			address: 'Box 265 77126 Ludvika',
			phone: 'Tel. +46 10 130 10 00',
			link: 'https://kompauto.se',
		},
		{
			title: t('netherlands'),
			name: 'Klinger B.V.',
			address: 'Postbus 8504 3009 AM Rotterdam',
			phone: 'Tel. +31 10 455 75 55',
			link: 'https://klinger.nl',
		},
		{
			title: t('china'),
			name: 'Yanming (HK) Industrial Co., Ltd.',
			address: 'Unit 04, 7/F, Bright Way Tower, No. 33 Mong Kok Road Kowloon, HK',
			phone: '+852-27 93 55 11 / HK | +86-755-82 52 47 06 / Shenzhen',
			link: 'http://ymic-hk.com',
		},
	];

	const url = process.env.GENERAL_URL;

	return (
		<section className=" relative mt-5 grid grid-cols-11 overflow-x-clip max-laptop:mt-12 max-laptop:px-4 laptop:h-[95vh] laptop:gap-1">
			<div className="col-span-11 lg:col-span-6 laptop:h-[90vh] ">
				<div className="flex flex-col items-end justify-end h-full lg:grid lg:grid-cols-11">
					<div className="bottom-0 col-span-10 flex items-start justify-center max-laptop:w-full laptop:h-[90vh]">
						<Image
							src={ContactValve}
							alt="About valve"
							className="max-laptop:w-[50vw] laptop:fixed laptop:bottom-0 laptop:h-[90vh] laptop:w-fit"
						/>
					</div>
					<div className="col-span-1 flex h-[90vh] w-[36%] items-center justify-center justify-self-end max-laptop:hidden"></div>
				</div>
			</div>
			<div className="col-span-11 pb-6  pt-3 max-laptop:pb-16 lg:col-span-5 laptop:grid laptop:h-[90vh] laptop:grid-rows-5 laptop:pr-4 ">
				<div className="flex flex-col h-full space-y-6">
					<div className="grid grid-cols-12 space-x-2 max-laptop:mb-10">
						<div className="grid-cols-6 col-span-6">
							<button
								onClick={() => setSelectedTab('getInTouch')}
								className={`h-10 w-full border border-x-transparent border-b-[#898989] border-t-transparent text-left max-laptop:pb-4 max-laptop:text-sm ${tStyles.cat2} ${selectedTab === 'getInTouch' ? 'border-b-[#111111] text-[#111111]' : 'border-b-[#C8C8C8] text-[#C8C8C8]'}`}
							>
								<h1>{t('touch')}</h1>
							</button>
						</div>
						<div className="grid-cols-6 col-span-6">
							<button
								onClick={() => setSelectedTab('partners')}
								className={`h-10 w-full border border-x-transparent border-b-[#C8C8C8] border-t-transparent text-left max-laptop:pb-4 max-laptop:text-sm ${tStyles.cat2} ${selectedTab === 'partners' ? 'border-b-[#111111] text-[#111111]' : 'border-b-[#898989] text-[#C8C8C8]'}`}
							>
								{t('salesPartners')}
							</button>
						</div>
					</div>
					{selectedTab === 'getInTouch' ? (
						<div className="flex flex-col justify-between h-full space-y-12">
							<p className={`${tStyles.cat3} text-[#111111]`}>{t('msg')}</p>
							<ContactForm theme={'light'} lng={lng} />
							<div className="flex justify-end w-full h-fit max-laptop:space-y-5">
								<div className="flex items-center gap-3 h-fit w-fit ">
									<a
										target="_blank"
										rel="noopener noreferrer"
										className=" text-xs uppercase text-[#B7B7B7] transition ease-in-out hover:opacity-80"
										href={`https://www.instagram.com/homaticag/`}
										suppressHydrationWarning={true}
									>
										<Image
											src={IG}
											alt="Instagram"
											className="w-[2vw] max-laptop:w-[10vw]"
										/>
									</a>
									<a
										target="_blank"
										rel="noopener noreferrer"
										className=" text-xs uppercase text-[#B7B7B7] transition ease-in-out hover:opacity-80"
										href={`https://www.youtube.com/@ho-maticag9119/videos`}
										suppressHydrationWarning={true}
									>
										<Image
											src={YT}
											alt="Youtube"
											className="w-[2vw] max-laptop:w-[10vw]"
										/>
									</a>
									<a
										target="_blank"
										rel="noopener noreferrer"
										className=" text-xs uppercase text-[#B7B7B7] transition ease-in-out hover:opacity-80"
										href={`https://www.linkedin.com/company/ho-matic`}
										suppressHydrationWarning={true}
									>
										<Image
											src={LI}
											alt="LinkedIn"
											className="w-[2vw] max-laptop:w-[10vw]"
										/>
									</a>
								</div>
							</div>
							<ContactFooter theme={'light'} lng={lng} />
						</div>
					) : (
						<div className="flex flex-col max-laptop:mb-18 laptop:grid laptop:grid-cols-2">
							<div className="flex flex-col max-laptop:hidden laptop:mr-2">
								{partnerCountries.map((partner, idx) => (
									<div
										className={`${idx < partnerCountries.length / 2 ? '' : 'hidden'}`}
										key={`contact-partner-item-${partner.title.toLowerCase()}`}
									>
										<div className="flex w-full  items-center justify-center border-b border-b-[#C8C8C8]">
											<HoAccordionPartners title={partner.title}>
												<div className="flex flex-col">
													<h4 className={tStyles.partnerA}>
														{partner.name}
													</h4>
													<p className={tStyles.partnerA}>
														{partner.address}
													</p>
													<p className={tStyles.partnerA}>
														{partner.phone}
													</p>
													<Link
														href={partner.link}
														target="_blank"
														rel="noopener noreferrer"
														className={`${tStyles.partnerA} flex items-center gap-3 text-[#306abf] transition ease-in-out hover:opacity-80`}
													>
														{partner.link}{' '}
														<Image
															src={BlueArrow}
															alt="arrow"
															height={500}
															width={500}
															className="h-auto w-[8%]"
														/>
													</Link>
													{partner.name ===
														'Yanming (HK) Industrial Co., Ltd.' && (
														<Link
															href="www.ho-matic.cn"
															target="_blank"
															rel="noopener noreferrer"
															className={`${tStyles.partnerA} text-[#306abf] transition ease-in-out hover:opacity-80`}
														>
															www.ho-matic.cn
														</Link>
													)}
												</div>
											</HoAccordionPartners>
										</div>
									</div>
								))}
							</div>
							<div className="flex flex-col border-l-[#C8C8C8] max-laptop:hidden laptop:ml-1 laptop:border-l laptop:pl-2 ">
								{partnerCountries.map((partner, idx) => (
									<div
										className={`${idx < partnerCountries.length / 2 ? 'hidden' : ''}`}
										key={`contact-partner-item-${partner.title.toLowerCase()}`}
									>
										<div className="flex w-full items-center justify-center border-b border-b-[#C8C8C8]">
											<HoAccordionPartners title={partner.title}>
												<div className="flex flex-col">
													<p className={tStyles.partnerA}>
														{partner.name}
													</p>
													<p className={tStyles.partnerA}>
														{partner.address}
													</p>
													<p className={tStyles.partnerA}>
														{partner.phone}
													</p>
													<Link
														href={partner.link}
														target="_blank"
														rel="noopener noreferrer"
														className={`${tStyles.partnerA} flex items-center gap-3 text-[#306abf] transition ease-in-out hover:opacity-80`}
													>
														{partner.link}{' '}
														<Image
															src={BlueArrow}
															alt="arrow"
															height={500}
															width={500}
															className="h-auto w-[8%]"
														/>
													</Link>
												</div>
											</HoAccordionPartners>
										</div>
									</div>
								))}
							</div>
							{partnerCountries.map((partner, idx) => (
								<div
									className="laptop:hidden"
									key={` contact-partner-item-${partner.title.toLowerCase()}`}
								>
									<div className="flex w-full  items-center justify-center border-b border-b-[#C8C8C8]">
										<HoAccordionPartners title={partner.title}>
											<div className="flex flex-col">
												<h4 className={tStyles.partnerA}>{partner.name}</h4>
												<p className={tStyles.partnerA}>
													{partner.address}
												</p>
												<p className={tStyles.partnerA}>{partner.phone}</p>
												<Link
													href={partner.link}
													target="_blank"
													rel="noopener noreferrer"
													className={`${tStyles.partnerA} flex items-center gap-3 text-[#306abf] transition ease-in-out hover:opacity-80`}
												>
													{partner.link}{' '}
													<Image
														src={BlueArrow}
														alt="arrow"
														height={500}
														width={500}
														className="h-auto w-[8%]"
													/>
												</Link>
												{partner.name ===
													'Yanming (HK) Industrial Co., Ltd.' && (
													<Link
														href="www.ho-matic.cn"
														target="_blank"
														rel="noopener noreferrer"
														className={`${tStyles.partnerA} text-[#306abf] transition ease-in-out hover:opacity-80`}
													>
														www.ho-matic.cn
													</Link>
												)}
											</div>
										</HoAccordionPartners>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
