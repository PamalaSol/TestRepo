'use client';
import { useTranslation } from '@/app/i18n/client';
import React from 'react';
import BlueArrow from '@/public/assets/blue-arrow.svg';
import Image from 'next/image';
import tStyles from '@/app/[lng]/textSizes.module.css';
import Link from 'next/link';

const ReadyToElevate = ({ lng }: { lng: string }) => {
	const { t } = useTranslation(lng, 'readyToElevate');

	return (
		<div className="col-span-11 lg:col-span-6 max-laptop:pb-3">
			<div
				className={`flex h-full flex-col laptop:pr-3 laptop:border-r laptop:border-r-[#313131]`}
			>
				<div className="flex flex-col h-full ">
					<h2 className={`pb-3 ${tStyles.cat1}`}>{t('title')}</h2>
					<p className={tStyles.cat3}>{t('desc')}</p>
				</div>
				<div className="flex justify-end">
					<Link
						href={`/${lng}/contact`}
						className={`${tStyles.cat3} flex whitespace-nowrap gap-3 text-[#306abf] transition ease-in-out hover:opacity-80`}
					>
						{t('cta')}
						<Image src={BlueArrow} alt="arrow" height={500} width={500} className="w-auto h-auto"  />
					</Link>
				</div>
			</div>
		</div>
	);
};

export default ReadyToElevate;
