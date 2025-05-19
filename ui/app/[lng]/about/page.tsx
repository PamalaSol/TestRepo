'use client';
import { useTranslation } from '@/app/i18n/client';
import { useState } from 'react';
import styles from './about.module.css';
import tStyles from '@/app/[lng]/textSizes.module.css';
import AboutValve from '@/public/assets/about-valves.webp';
import Image from 'next/image';

export default function About({ params: { lng } }: { params: { lng: string } }) {
	const { t } = useTranslation(lng, 'about');
	const [yearSelected, setYearSelected] = useState<string>('');

	return (
		<div className="scroll mt-6 grid laptop:h-[95vh] grid-cols-11 max-laptop:mt-16 laptop:overflow-clip">
			<div className="col-span-11 border-r-[#C8C8C8] lg:col-span-6 laptop:border-r">
				<div className="flex flex-col items-end justify-end h-full lg:grid lg:grid-cols-11">
					<div className="bottom-0 col-span-10 flex laptop:h-[90vh] max-laptop:w-full items-start justify-center">
						<Image
							src={AboutValve}
							alt="About valve"
							className="laptop:h-[90vh] laptop:w-fit max-laptop:w-[50vw] laptop:fixed laptop:bottom-0"
						/>
					</div>
					<div className="col-span-1 flex h-full w-[36%] items-center justify-center justify-self-end max-laptop:hidden">
						<div className="flex h-5 col-span-1 rotate-0 max-tablet:mb-6 max-tablet:flex-wrap max-tablet:gap-3 max-tablet:px-4 tablet:gap-10 lg:-rotate-90">
							<button
								onClick={() => {
									if (yearSelected === '2024') {
										setYearSelected('');
									} else {
										setYearSelected('2024');
									}
								}}
								className={`${styles.years} ${yearSelected === '2024' ? 'opacity-100' : 'opacity-20'} transition ease-in-out hover:opacity-80`}
							>{`2024`}</button>
							<button
								onClick={() => {
									if (yearSelected === '2017') {
										setYearSelected('');
									} else {
										setYearSelected('2017');
									}
								}}
								className={`${styles.years} ${yearSelected === '2017' ? 'opacity-100' : 'opacity-20'} transition ease-in-out hover:opacity-80`}
							>{`2017`}</button>
							<button
								onClick={() => {
									if (yearSelected === '2013') {
										setYearSelected('');
									} else {
										setYearSelected('2013');
									}
								}}
								className={`${styles.years} ${yearSelected === '2013' ? 'opacity-100' : 'opacity-20'} transition ease-in-out hover:opacity-80`}
							>{`2013`}</button>
							<button
								onClick={() => {
									if (yearSelected === '1987') {
										setYearSelected('');
									} else {
										setYearSelected('1987');
									}
								}}
								className={`${styles.years} ${yearSelected === '1987' ? 'opacity-100' : 'opacity-20'} transition ease-in-out hover:opacity-80`}
							>{`1987`}</button>
							<button
								onClick={() => {
									if (yearSelected === '1978') {
										setYearSelected('');
									} else {
										setYearSelected('1978');
									}
								}}
								className={`${styles.years} ${yearSelected === '1978' ? 'opacity-100' : 'opacity-20'} transition ease-in-out hover:opacity-80`}
							>{`1978`}</button>
							<button
								onClick={() => {
									if (yearSelected === '1977') {
										setYearSelected('');
									} else {
										setYearSelected('1977');
									}
								}}
								className={`${styles.years} ${yearSelected === '1977' ? 'opacity-100' : 'opacity-20'} transition ease-in-out hover:opacity-80`}
							>{`1977`}</button>
						</div>
					</div>
					<div className="flex justify-between w-full gap-3 px-4 flex-grid laptop:hidden">
						<button
							onClick={() => {
								if (yearSelected === '2024') {
									setYearSelected('');
								} else {
									setYearSelected('2024');
								}
							}}
							className={`${styles.years} ${yearSelected === '2024' ? 'opacity-100' : 'opacity-20'} transition ease-in-out hover:opacity-80`}
						>{`2024`}</button>
						<button
							onClick={() => {
								if (yearSelected === '2017') {
									setYearSelected('');
								} else {
									setYearSelected('2017');
								}
							}}
							className={`${styles.years} ${yearSelected === '2017' ? 'opacity-100' : 'opacity-20'} transition ease-in-out hover:opacity-80`}
						>{`2017`}</button>
						<button
							onClick={() => {
								if (yearSelected === '2013') {
									setYearSelected('');
								} else {
									setYearSelected('2013');
								}
							}}
							className={`${styles.years} ${yearSelected === '2013' ? 'opacity-100' : 'opacity-20'} transition ease-in-out hover:opacity-80`}
						>{`2013`}</button>
						<button
							onClick={() => {
								if (yearSelected === '1987') {
									setYearSelected('');
								} else {
									setYearSelected('1987');
								}
							}}
							className={`${styles.years} ${yearSelected === '1987' ? 'opacity-100' : 'opacity-20'} transition ease-in-out hover:opacity-80`}
						>{`1987`}</button>
						<button
							onClick={() => {
								if (yearSelected === '1978') {
									setYearSelected('');
								} else {
									setYearSelected('1978');
								}
							}}
							className={`${styles.years} ${yearSelected === '1978' ? 'opacity-100' : 'opacity-20'} transition ease-in-out hover:opacity-80`}
						>{`1978`}</button>
						<button
							onClick={() => {
								if (yearSelected === '1977') {
									setYearSelected('');
								} else {
									setYearSelected('1977');
								}
							}}
							className={`${styles.years} ${yearSelected === '1977' ? 'opacity-100' : 'opacity-20'} transition ease-in-out hover:opacity-80`}
						>{`1977`}</button>
					</div>
				</div>
			</div>
			<div className="col-span-11 laptop:h-[90vh] py-3 max-laptop:px-4 max-laptop:pb-10 lg:col-span-5 laptop:grid laptop:grid-rows-5">
				<div className={`row-span-2 flex flex-col laptop:pl-2`}>
					<h1 className={`pb-3 ${tStyles.cat1}`}>
						{t(`${yearSelected === '' ? 'title' : yearSelected}`)}
					</h1>
					<p className={tStyles.cat3}>
						{t(`${yearSelected === '' ? 'desc' : yearSelected + 'Desc'}`)}
					</p>
				</div>
				<div className="flex justify-center w-full h-full row-span-3 laptop:relative max-laptop:mt-10">
					<div className={`laptop:top-7 grid grid-cols-12 laptop:absolute`}>
						<div className="grid-cols-2 col-span-2 max-laptop:hidden"></div>
						<div className="grid-cols-4 col-span-4 space-y-5 max-laptop:col-span-6">
							<div className="flex flex-col">
								<h4 className="text-xs uppercase text-[#C8C8C8]">
									{t('variants')}
								</h4>
								<p className={`${tStyles.cat3} pt-1 text-[#0D0D0D]`}>{`8300+`}</p>
							</div>
							<div className="flex flex-col">
								<h4 className="text-xs uppercase text-[#C8C8C8]">
									{t('countries')}
								</h4>
								<p className={`${tStyles.cat3} pt-1 text-[#0D0D0D]`}>{`153`}</p>
							</div>
							<div className="flex flex-col">
								<h4 className="text-xs uppercase text-[#C8C8C8]">
									{t('availability')}
								</h4>
								<p
									className={`${tStyles.cat3} pt-1 text-[#0D0D0D]`}
								>{`90% ${t('within')} 24h`}</p>
							</div>
						</div>
						<div className="grid-cols-4 col-span-4 space-y-5 max-laptop:col-span-6">
							<div className="flex flex-col">
								<h4 className="text-xs uppercase text-[#C8C8C8]">
									{t('satisfaction')}
								</h4>
								<p className={`${tStyles.cat3} pt-1 text-[#0D0D0D]`}>{`99,9%`}</p>
							</div>
							<div className="flex flex-col">
								<h4 className="text-xs uppercase text-[#C8C8C8]">
									{t('partners')}
								</h4>
								<p className={`${tStyles.cat3} pt-1 text-[#0D0D0D]`}>{`13`}</p>
							</div>
							<div className="flex flex-col">
								<h4 className="text-xs uppercase text-[#C8C8C8]">
									{t('customers')}
								</h4>
								<p className={`${tStyles.cat3} pt-1 text-[#0D0D0D]`}>{`3500+`}</p>
							</div>
						</div>
						<div className="grid-cols-2 col-span-2 max-laptop:hidden"></div>
					</div>
				</div>
			</div>
		</div>
	);
}
