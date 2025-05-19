'use client';
import { useTranslation } from '@/app/i18n/client';
import Link from 'next/link';
import React from 'react';
import tStyles from '@/app/[lng]/textSizes.module.css';

const HomeFooter = ({ lng }: { lng: string }) => {
	const { t } = useTranslation(lng, 'contact');
	const unusedFeatures = false;

	return (
		<div
			className="col-span-2 row-span-1 mt-4 grid w-full grid-cols-9 px-6 text-[#C8C8C8]"
			suppressHydrationWarning={true}
		>
			<div className="grid grid-cols-5 col-span-3">
				<div className={`col-span-3 flex flex-col gap-2 whitespace-nowrap`}>
				<p></p>
					<div className={`flex flex-col gap-2 ${tStyles.homeFooter}`}>
						<div className="flex flex-col">
							<p>{`HO-Matic AG`}</p>
							<p>{`Alte Obfelderstrasse 55`}</p>
							<p>{`8910 Affoltern a. A.`}</p>
							<p>Schweiz</p>
						</div>
						<div className="flex flex-col">
							<div className="grid grid-cols-6">
								<p className="col-span-2">phone:</p>
								<div className="flex items-center justify-start w-full col-span-4">
									<p>{`+41 (0)43 322 70 80`}</p>
								</div>
							</div>
							<div className="grid grid-cols-6">
								<p className="col-span-2">fax:</p>
								<div className="flex items-center justify-start w-full col-span-4">
									<p>{`+41 (0)43 322 70 88`}</p>
								</div>
							</div>
							<div className="grid grid-cols-6">
								<p className="col-span-2">mail:</p>
								<div className="flex items-center justify-start w-full col-span-4">
									<p>{`info@ho-matic.ch`}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="grid grid-cols-2 col-span-3 pl-2">
				<div className={`flex flex-col`}>
					<p className={`text-light text-base text-[#F7F7F7] `}>{t('pages')}</p>
					<div className={`flex flex-col ${tStyles.homeFooter}`}>
						<Link
							className="capitalize transition ease-in-out hover:opacity-50"
							href={`/${lng}/`}
						>
							{t('home')}
						</Link>
						<Link
							className="capitalize transition ease-in-out hover:opacity-50"
							href={`/${lng}/products`}
						>
							{t('products')}
						</Link>
						<Link
							className="capitalize transition ease-in-out hover:opacity-50"
							href={`/${lng}/resources`}
						>
							{'Downloads'}
						</Link>
						<Link
							className="capitalize transition ease-in-out hover:opacity-50"
							href={`/${lng}/news`}
						>
							{t('news')}
						</Link>
						<Link
							className="capitalize transition ease-in-out hover:opacity-50"
							href={`/${lng}/about`}
						>
							{t('about')}
						</Link>
						<Link
							className="capitalize transition ease-in-out hover:opacity-50"
							href={`/${lng}/contact`}
						>
							{t('contact')}
						</Link>
						<Link
							className="capitalize transition ease-in-out hover:opacity-50"
							href={`/${lng}/cart`}
						>
							{t('cart')}
						</Link>
					</div>
				</div>
				<div className={`flex flex-col`}>
					<p className={`text-light text-base text-[#F7F7F7]`}>{t('Legal')}</p>
					<div className={`flex flex-col ${tStyles.homeFooter}`}>
						<Link
							className="capitalize transition ease-in-out hover:opacity-50"
							href={`/${lng}/site-notice`}
							suppressHydrationWarning={true}
						>
							{t('notice')}
						</Link>
						<Link
							className="capitalize transition ease-in-out hover:opacity-50"
							href={`/${lng}/privacy-policy`}
							suppressHydrationWarning={true}
						>
							{t('privPol')}
						</Link>
					</div>
					<p className={`text-light mt-1 whitespace-nowrap text-base text-[#F7F7F7]`}>
						{t('SM')}
					</p>
					<div className={`flex flex-col ${tStyles.homeFooter}`}>
						<a
							target="_blank"
							rel="noopener noreferrer"
							className="capitalize transition ease-in-out hover:opacity-50"
							href={`https://www.instagram.com/homaticag/`}
							suppressHydrationWarning={true}
						>
							{t('Instagram')}
						</a>
						<a
							target="_blank"
							rel="noopener noreferrer"
							className="capitalize transition ease-in-out hover:opacity-50"
							href={`https://www.youtube.com/@ho-maticag9119/videos`}
							suppressHydrationWarning={true}
						>
							{t('YouTube')}
						</a>
						<a
							target="_blank"
							rel="noopener noreferrer"
							className="capitalize transition ease-in-out hover:opacity-50"
							href={`https://www.linkedin.com/company/ho-matic`}
							suppressHydrationWarning={true}
						>
							{t('LinkedIn')}
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomeFooter;
