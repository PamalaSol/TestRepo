'use client';
import React from 'react';
import tStyles from '@/app/[lng]/textSizes.module.css';
import Image from 'next/image';
import AboutValve from '@/public/assets/valve-opened-view.webp';
import { useTranslation } from '@/app/i18n/client';

const WhyHomaticNew = ({ lng }: { lng: string }) => {
	const { t } = useTranslation(lng, 'whyHomatic');

	return (
		<div className="relative grid grid-cols-11 gap-2 bg-[#0f0f0f] px-4 text-[#F7F7F7]">
			<div className="absolute left-[54.45%] z-10 h-full w-[1px] bg-[#313131] max-laptop:hidden"></div>
			<div className="col-span-11 laptop:col-span-6 ">
				<div className={` col-span-1  grid-cols-12 py-3  lg:col-span-6 lg:grid-cols-6 `}>
					<div className="flex flex-col justify-center h-full">
						<div className="flex flex-col laptop:mt-6">
							<h2 className={` pb-3 ${tStyles.cat1}`}>{t('whyChoose')}</h2>
							<div className="flex flex-col space-y-10">
								<p className={` ${tStyles.cat3}`}>{t('becuase')}</p>
								<ul className="space-y-3 list-disc list-inside ">
									<li className={tStyles.cat3}>{t('over3500')}</li>
									<li className={tStyles.cat3}>{t('bestPrice')}</li>
									<li className={tStyles.cat3}>{t('longLife')}</li>
									<li className={tStyles.cat3}>{t('highLevel')}</li>
									<li className={tStyles.cat3}>{t('innovative')}</li>
									<li className={tStyles.cat3}>{t('standard')}</li>
									<li className={tStyles.cat3}>{t('fast')}</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="col-span-11 laptop:col-span-5">
				<div className="flex items-center justify-end -mr-4 overflow-clip">
					<Image
						src={AboutValve}
						alt={`Astronaut holding a valve`}
						className=""
					/>
				</div>
			</div>
		</div>
	);
};

export default WhyHomaticNew;
