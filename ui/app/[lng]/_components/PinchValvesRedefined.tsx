'use client';
import { useTranslation } from '@/app/i18n/client';
import Link from 'next/link';
import React from 'react';
import tStyles from '@/app/[lng]/textSizes.module.css';
import ShortBorder from './ShortBorder';
import BlueArrow from '@/public/assets/blue-arrow.svg';
import Image from 'next/image';

export const PinchValvesRedefined = ({ lng }: { lng: string }) => {
	const { t } = useTranslation(lng, 'redefined');
	return (
		<div className="col-span-11 lg:col-span-6">
			<ShortBorder invBg/>
			<div
				className={`flex h-full flex-col pr-3 `}
			>
				<div className="flex flex-col h-full ">
					<h2 className={`pb-3 ${tStyles.cat1}`}>{t('title')}</h2>
					<p className={tStyles.cat3}>{t('desc')}</p>
				</div>
				<div className="flex justify-end mb-4">
					<Link
						href={`/${lng}/contact`}
						className={`${tStyles.cat3} flex gap-3 whitespace-nowrap text-[#306abf] transition ease-in-out hover:opacity-80`}
					>
						{t('cta')}
						<Image
							src={BlueArrow}
							alt="arrow "
							height={500}
							width={500}
							className="w-auto h-auto"
						/>
					</Link>
				</div>
			</div>
		</div>
	);
};
