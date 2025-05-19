'use client';
import React from 'react';
import Image from 'next/image';
import { useTranslation } from '@/app/i18n/client';
import tStyles from '@/app/[lng]/textSizes.module.css';
import ShortBorder from './ShortBorder';
import Assets from '@/public/assets/side-valve.webp';

export const ElevateFluidControl = ({ lng }: { lng: string }) => {
	const { t } = useTranslation(lng, 'elevate');

	return (
		<div className="relative grid grid-cols-11 px-4 gap-3 bg-[#0f0f0f] text-[#F7F7F7]">
			<div className="absolute left-[54.45%] z-10 h-full w-[1px] bg-[#313131] max-laptop:hidden"></div>
			<div className={`max-laptop:hidden col-span-11 h-full w-full flex-col  lg:col-span-6 `}>
				<ShortBorder invBg />
				<Image src={Assets} alt={`Valve`} className='justify-self-center h-fit w-fit max-h-[50vh]'/>
			</div>
			<div className={`col-span-11 lg:col-span-5 max-laptop:mt-6`}>
				<ShortBorder invBg side={true} hid />
				<div className="flex flex-col h-full space-y-6 laptop:pl-2">
					<h2 className={`pb-3 ${tStyles.cat1}`}>{t('title')}</h2>
					<p className={tStyles.cat3}>{t('desc')}</p>
					<div className="h-full gap-20 max-laptop:space-y-3 laptop:flex">
						<ul className="space-y-3 list-disc list-inside">
							<li className={tStyles.cat3}>{t('Abrasive')}</li>
							<li className={tStyles.cat3}>{t('Corrosive')}</li>
							<li className={tStyles.cat3}>{t('Solids')}</li>
							<li className={tStyles.cat3}>{t('Powders')}</li>
							<li className={tStyles.cat3}>{t('Foodstuffs')}</li>
							<li className={tStyles.cat3}>{t('Slurries')}</li>
						</ul>
						<ul className="space-y-3 list-disc list-inside">
							<li className={tStyles.cat3}>{t('Dust')}</li>
							<li className={tStyles.cat3}>{t('Non-homogeneous')}</li>
							<li className={tStyles.cat3}>{t('Suspensions')}</li>
							<li className={tStyles.cat3}>{t('Complicated')}</li>
							<li className={tStyles.cat3}>{t('Vacuum')}</li>
							<li className={tStyles.cat3}>{t('FDA/ATEX')}</li>
						</ul>
					</div>
				</div>
			</div>
			<div className={`laptop:hidden col-span-11 h-full w-full flex-col  lg:col-span-6 `}>
				<ShortBorder invBg />
				<Image src={Assets} alt={`Valve`} className='justify-self-center h-fit w-fit max-h-[50vh]'/>
			</div>
		</div>
	);
};
