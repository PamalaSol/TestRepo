'use client';

import { useEffect, useState } from 'react';
import SleevePhoto from '@/public/assets/products/spare-sleeves.webp';
import { defaultSeries, series, seriesNums, toastDefaultOptions } from '@/lib/utils';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import { IProductCategory, productCategoryService } from '../_services/productCategory';
import { useTranslation } from '@/app/i18n/client';
import { productOrder } from '../_interfaces/interfaces';
import Link from 'next/link';
import tStyles from '@/app/[lng]/textSizes.module.css';
import BlueArrow from '@/public/assets/blue-arrow.svg';

export default function Sleeves({ lng }: { lng: string }) {
	const { t } = useTranslation(lng, 'sleeves');
	const { t: tr } = useTranslation(lng, 'products');

	const [dmSelected, setDmSelected] = useState<string>('---.');
	const [qualitySelected, setQualitySelected] = useState<string>('---.');
	const [versionSelected, setVersionSelected] = useState<string>('---');
	const [atexFlag, setAtexFlag] = useState<number>(0);
	const [seriesNumber, setSeriesNumber] = useState<string>('--');
	const [productAmount, setProductAmount] = useState<number>(1);

	const [orderNumber, setOrderNumber] = useState<string>(
		seriesNumber.substring(0, 0) + dmSelected + qualitySelected + versionSelected
	);

	const [sleeveCategory, setSleeveCategory] = useState<IProductCategory | undefined>(undefined);

	const unusedFeatures = false;

	const addToCart = (orderNo: string, amount: number, category: string) => {
		if (orderNo.includes('-')) {
			toast.error(t('orderError'), toastDefaultOptions);
		} else {
			const ls = localStorage.getItem('orders');
			let newOrder: productOrder = {
				imgString: '',
				orderNo: orderNo,
				sleeveNo: '',
				amount: amount,
				category: category,
				extraReq: '',
			};
			if (ls) {
				const orders = JSON.parse(ls);
				orders.push(newOrder);
				localStorage.setItem('orders', JSON.stringify(orders));
				toast.success(t('addToCart'), toastDefaultOptions);
				window.dispatchEvent(new Event('storageItems'));
			} else {
				const orders: productOrder[] = [];
				orders.push(newOrder);
				localStorage.setItem('orders', JSON.stringify(orders));
				window.dispatchEvent(new Event('storageItems'));
				toast.success(t('addToCart'), toastDefaultOptions);
			}
		}
	};

	useEffect(() => {
		const fetchCategory = async () => {
			productCategoryService
				.getCategory(2, lng)
				.then((result) => {
					setSleeveCategory(result.data);
				})
				.catch((error) => {
					const statusCode = error.status;
					if (statusCode === 404) {
						toast.error(t('noData'), toastDefaultOptions);
					} else if (statusCode === 500) {
						toast.error(t('serverError'), toastDefaultOptions);
					} else {
						toast.error(t('unexpectedError'), toastDefaultOptions);
					}
				});
		};

		fetchCategory();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const seriesFirstCharacter = seriesNumber.charAt(0);
		setOrderNumber(seriesFirstCharacter + dmSelected + qualitySelected + versionSelected);
	}, [qualitySelected, seriesNumber, dmSelected, versionSelected]);

	useEffect(() => {
		setDmSelected('---.');
		setQualitySelected('---.');
		setVersionSelected('---');
		setAtexFlag(0);

		const findSeriesByNum = (seriesNumm: string) => {
			const index = series.findIndex((seriesItem) => seriesItem.seriesNum === seriesNumm);
			setLocalSeries(index);
		};

		findSeriesByNum(seriesNumber);
	}, [seriesNumber]);
	const [localSeries, setLocalSeries] = useState<number>(-1);

	const settingsGrid = (
		<div className="grid-rows-auto grid grid-cols-12 border-[#0F0F0F] text-center">
			<div className="grid grid-cols-12 col-span-12">
				<div className="col-span-1 border-x border-t border-x-[#0F0F0F] border-t-[#0F0F0F] bg-[#F7F7F7] max-lg:text-[0.6rem]">
					<p>{tr('series')}</p>
				</div>
				<div className="col-span-1 border-t border-t-[#0F0F0F] bg-[#F7F7F7] max-lg:text-[0.6rem]">
					<p>DN</p>
				</div>
				<div className="col-span-8 border-x border-t border-[#0F0F0F]">
					<div className="grid grid-rows-2 bg-white">
						<p className="max-lg:text-[0.6rem]">{tr('sQuality')}</p>
						<div className="grid grid-cols-8 border-[#0F0F0F]">
							{seriesNumber === '--' || localSeries === -1
								? defaultSeries.qualities.map((quality, idx) => (
										<div
											key={`quality + ${quality.name}`}
											className={`border-[#C8C8C8] ${idx === 0 ? '' : 'border-l'} text-gray-500`}
											onClick={() => {
												toast.error(t('seriesFirst'), toastDefaultOptions);
											}}
										>
											<p className="py-1 text-center text-[0.6rem] font-normal xl:text-xs">
												{quality.name}
											</p>
										</div>
									))
								: series[localSeries].qualities.map((quality, idx) => (
										<div
											key={`quality + ${quality.name}`}
											className={`border-[#C8C8C8] ${idx === 0 ? '' : 'border-l'}`}
										>
											<p className="py-1 text-center text-[0.6rem] font-normal xl:text-xs">
												{quality.name}
											</p>
										</div>
									))}
						</div>
					</div>
				</div>
				<div className="col-span-2 border-r border-t border-[#0F0F0F] bg-[#F7F7F7]">
					<div className="grid h-full grid-rows-2 content-between max-lg:text-[0.6rem]">
						<p>{tr('version')}</p>
						<p>{tr('standard')}</p>
					</div>
				</div>
			</div>
			<div className="grid grid-cols-12 col-span-12">
				<div className="col-span-1 flex w-full flex-col items-center justify-center border border-[#0F0F0F] bg-[#F7F7F7]">
					{seriesNums.map((series) => (
						<div
							key={`quality + ${series}`}
							className={`flex w-full items-center justify-center border border-x-transparent border-b-[#C8C8C8] border-t-transparent font-normal text-[#306abf] underline hover:cursor-pointer hover:font-bold`}
							onClick={() => {
								setSeriesNumber(series);
							}}
						>
							<p
								className={`${seriesNumber === series ? 'font-bold text-[#306abf]' : ''} py-1 text-center text-[0.6rem] xl:text-xs`}
							>
								{series}
							</p>
						</div>
					))}
				</div>
				<div className="col-span-1 flex w-full flex-col items-center justify-center border-y border-[#0F0F0F] bg-[#F7F7F7]">
					{seriesNumber === '--' || localSeries === -1
						? defaultSeries.dm.map((dimension, idx) => (
								<div
									key={`quality + ${dimension}`}
									className={`flex w-full items-center justify-center ${idx === 0 ? '' : 'border-t'} border-[#C8C8C8] font-normal text-gray-500`}
									onClick={() => {
										toast.error(t('seriesFirst'), toastDefaultOptions);
									}}
								>
									<p
										className={`${dmSelected === dimension ? 'font-bold text-[#306abf]' : ''} py-1 text-center text-[0.6rem] xl:text-xs`}
									>
										{dimension}
									</p>
								</div>
							))
						: series[localSeries].dm.map((dimension, idx) => (
								<div
									key={`quality + ${dimension}`}
									className={`flex w-full items-center justify-center ${idx === 0 ? '' : 'border-t'} border-[#C8C8C8] font-normal text-[#306abf] underline hover:cursor-pointer hover:font-bold`}
									onClick={() => {
										setDmSelected(dimension);
									}}
								>
									<p
										className={`${dmSelected === dimension ? 'font-bold text-[#306abf]' : ''} py-1 text-center text-[0.6rem] xl:text-xs`}
									>
										{dimension}
									</p>
								</div>
							))}
				</div>
				<div
					className={`col-span-10 grid grid-cols-10 ${seriesNumber === '--' || localSeries === -1 ? <div></div> : series[localSeries].v2Name ? 'grid-rows-2' : 'grid-rows-1'}`}
				>
					<div className="grid grid-cols-10 col-span-10">
						<div className="col-span-8 border border-[#0F0F0F]">
							<div className="grid h-full grid-cols-8 bg-white">
								{seriesNumber === '--' || localSeries === -1
									? defaultSeries.qualities.map((quality, idx) => (
											<div
												key={`quality + ${quality.num}`}
												className={`flex items-center justify-center border-[#C8C8C8] ${idx === 0 ? '' : 'border-l'} font-normal text-gray-500`}
												onClick={() => {
													toast.error(
														t('seriesFirst'),
														toastDefaultOptions
													);
												}}
											>
												<p
													className={`${qualitySelected === quality.num ? 'font-bold text-[#306abf]' : ''} py-1 text-center text-[0.6rem] xl:text-xs`}
												>
													{quality.num}
												</p>
											</div>
										))
									: series[localSeries].qualities.map((quality, idx) => (
											<div
												key={`quality + ${quality.num}`}
												className={`flex items-center justify-center border-[#C8C8C8] ${idx === 0 ? '' : 'border-l'} font-normal text-[#306abf] underline hover:cursor-pointer hover:font-bold`}
												onClick={() => {
													if (atexFlag) {
														setAtexFlag(0);
														setVersionSelected('---');
													}
													setQualitySelected(quality.num);
												}}
											>
												<p
													className={`${qualitySelected === quality.num ? 'font-bold text-[#306abf]' : ''} py-1 text-center text-[0.6rem] xl:text-xs`}
												>
													{quality.num}
												</p>
											</div>
										))}
							</div>
						</div>
						<div className="col-span-2 border-y border-r border-[#0F0F0F] bg-[#F7F7F7]">
							<div className="flex flex-col items-center justify-around w-full h-full col-span-1 border">
								{seriesNumber === '--' || localSeries === -1
									? defaultSeries.version.num.map((ver) => (
											<div
												key={`quality + ${ver}`}
												className={`flex w-full items-center justify-center font-normal text-gray-500`}
												onClick={() => {
													toast.error(
														t('seriesFirst'),
														toastDefaultOptions
													);
												}}
											>
												<p
													className={`py-1 text-center text-[0.6rem] xl:text-xs ${versionSelected === ver && !atexFlag ? 'font-bold text-[#306abf]' : ''}`}
												>
													{ver}
												</p>
											</div>
										))
									: series[localSeries].version.num.map((ver) => (
											<div
												key={`quality + ${ver}`}
												className={`flex w-full items-center justify-center font-normal text-[#306abf] underline hover:cursor-pointer hover:font-bold`}
												onClick={() => {
													if (atexFlag) {
														setAtexFlag(0);
														setQualitySelected('---.');
													}
													setVersionSelected(ver);
												}}
											>
												<p
													className={`py-1 text-center text-[0.6rem] xl:text-xs ${versionSelected === ver && !atexFlag ? 'font-bold text-[#306abf]' : ''}`}
												>
													{ver}
												</p>
											</div>
										))}
							</div>
						</div>
					</div>
					<div
						className={`col-span-10 grid grid-cols-10 ${seriesNumber === '--' || localSeries === -1 ? 'text-gray-500' : series[localSeries].v2Name ? '' : 'hidden'}`}
					>
						<div className="col-span-8 grid grid-cols-8 grid-rows-2 border-x border-b border-[#0F0F0F] bg-white">
							<div
								className={`col-span-4 row-span-2 flex h-full w-full items-center justify-center max-lg:text-[0.6rem]`}
							>
								<p>{tr('atexVer')}:</p>
							</div>
							<div
								className={`col-span-4 row-span-2 flex h-full flex-col justify-around`}
							>
								<div className="grid h-fit w-full grid-cols-4 border-b border-b-[#0F0F0F]">
									{seriesNumber === '--' || localSeries === -1
										? defaultSeries.v2Qualities?.map((quality) => (
												<div
													key={`quality + ${quality.name}`}
													className={`flex items-center justify-center border border-y-transparent border-l-[#C8C8C8] border-r-transparent text-gray-500`}
													onClick={() => {
														toast.error(
															t('seriesFirst'),
															toastDefaultOptions
														);
													}}
												>
													<p className="py-1 text-center text-[0.6rem] font-normal">
														{quality.name}
													</p>
												</div>
											))
										: series[localSeries].v2Qualities?.map((quality) => (
												<div
													key={`quality + ${quality.name}`}
													className={`flex items-center justify-center border-l border-[#C8C8C8]`}
												>
													<p className="py-1 text-center text-[0.6rem] font-normal">
														{quality.name}
													</p>
												</div>
											))}
								</div>

								<div className="grid w-full h-full grid-cols-4">
									{seriesNumber === '--' || localSeries === -1
										? defaultSeries.v2Qualities?.map((quality) => (
												<div
													key={`quality + ${quality.num}`}
													className={`flex items-center justify-center border-l border-[#C8C8C8] font-normal text-gray-500`}
													onClick={() => {
														toast.error(
															t('seriesFirst'),
															toastDefaultOptions
														);
													}}
												>
													<p
														className={`${qualitySelected === quality.num ? 'font-bold text-[#306abf]' : ''} text-center text-xs`}
													>
														{quality.num}
													</p>
												</div>
											))
										: series[localSeries].v2Qualities?.map((quality) => (
												<div
													key={`quality + ${quality.num}`}
													className={`flex items-center justify-center border-l border-[#C8C8C8] font-normal text-[#306abf] underline hover:cursor-pointer hover:font-bold`}
													onClick={() => {
														if (!atexFlag) {
															setAtexFlag(1);
															setVersionSelected('---');
														}
														setQualitySelected(quality.num);
													}}
												>
													<p
														className={`${qualitySelected === quality.num ? 'font-bold text-[#306abf]' : ''} text-center text-xs`}
													>
														{quality.num}
													</p>
												</div>
											))}
								</div>
							</div>
						</div>
						<div className="col-span-2 flex flex-col justify-center border-b border-r border-[#0F0F0F] bg-[#F7F7F7]">
							<p className="h-fit border-b border-[#0F0F0F] max-lg:text-[0.6rem]">
								ATEX
							</p>
							<div className="flex flex-col items-center justify-around w-full h-full col-span-1">
								{seriesNumber === '--' || localSeries === -1
									? defaultSeries.v2Name.num.map((ver) => (
											<div
												key={`quality + ${ver}`}
												className={`flex w-full items-center justify-center font-normal text-gray-500`}
												onClick={() => {
													toast.error(
														t('seriesFirst'),
														toastDefaultOptions
													);
												}}
											>
												<p
													className={`${versionSelected === ver ? 'font-bold text-[#306abf]' : ''} text-center text-[0.6rem] xl:text-xs`}
												>
													{ver}
												</p>
											</div>
										))
									: series[localSeries].v2Name?.num.map((ver) => (
											<div
												key={`quality + ${ver}`}
												className={`flex w-full items-center justify-center font-normal text-[#306abf] underline hover:cursor-pointer hover:font-bold`}
												onClick={() => {
													if (!atexFlag) {
														setAtexFlag(1);
														setQualitySelected('---.');
													}
													setVersionSelected(ver);
												}}
											>
												<p
													className={`${versionSelected === ver && atexFlag ? 'font-bold text-[#306abf]' : ''} text-center text-[0.6rem] xl:text-xs`}
												>
													{ver}
												</p>
											</div>
										))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	return (
		<div className="relative grid grid-cols-11 px-4 mt-5">
			<div className="absolute left-[54.45%] z-40 h-full w-[1px] bg-[#C8C8C8] max-laptop:hidden"></div>
			<div className="col-span-11 lg:col-span-6">
				<div className="relative flex flex-col justify-around lg:fixed lg:h-[90vh] lg:w-[52vw]">
					<div className="flex w-full">
						<div className="flex w-[75%] flex-col text-right max-laptop:mt-10 ">
							<p className={tStyles.cat5}>{t('knowHow')}</p>
							<h2 className={tStyles.productTitle}>{t('sleeveType')}</h2>
						</div>
						<div className="grid-rows-10 grid w-[25%]">
							<div className="z-10 row-start-6 ml-1 h-[1px] w-[1000px] bg-[#C8C8C8] max-laptop:hidden"></div>
						</div>
					</div>
					<div className="flex w-full items-center justify-center laptop:my-2 laptop:h-[60vh]">
						<Image src={SleevePhoto} alt="Sleeve photo" className="laptop:scale-50" />
					</div>

					<div
						className={`w-[90%] grid-cols-3 grid-rows-2 gap-2 whitespace-nowrap text-[0.6rem] max-tablet:space-y-4 tablet:grid lg:text-xs 2xl:text-xl`}
					>
						<div>
							<p className={tStyles.cat1}>
								<span>NR </span>(FDA, ATEX)
							</p>
							<ul className={`ml-4 list-disc ${tStyles.cat3}`}>
								<li> {t('nr1')}</li>
								<li> {t('nr2')}</li>
							</ul>
						</div>
						<div>
							<p className={tStyles.cat1}>
								<span>NBR </span>(FDA, ATEX)
							</p>
							<ul className={`ml-4 list-disc ${tStyles.cat3}`}>
								<li> {t('nbr1')}</li>
								<li> {t('nbr2')}</li>
							</ul>
						</div>
						<div>
							<p className={tStyles.cat1}>CSM</p>
							<ul className={`ml-4 list-disc ${tStyles.cat3}`}>
								<li> {t('csm1')}</li>
								<li> {t('csm2')}</li>
							</ul>
						</div>

						<div>
							<p className={tStyles.cat1}>FPM</p>
							<ul className={`ml-4 list-disc ${tStyles.cat3}`}>
								<li> {t('fpm1')}</li>
								<li> {t('fpm2')}</li>
							</ul>
						</div>
						<div>
							<p className={tStyles.cat1}>CR</p>
							<ul className={`ml-4 list-disc ${tStyles.cat3}`}>
								<li> {t('cr1')}</li>
								<li> {t('cr2')}</li>
							</ul>
						</div>
						<div>
							<p className={tStyles.cat1}>EPDM</p>
							<ul className={`ml-4 list-disc ${tStyles.cat3}`}>
								<li> {t('epdm1')}</li>
								<li> {t('epdm2')}</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			<div className="laptop-l:-pl-[7px] z-20 col-span-11 grid-cols-12 space-y-5 bg-[#f7f7f7] py-3 laptop:pl-1 lg:col-span-5 lg:grid-cols-6  laptop:pr-3">
				<div className="flex flex-col space-y-5">
					<h2 className={tStyles.cat1}>{t('heading')}</h2>
					<p className={tStyles.cat3}>{t('desc')}</p>
				</div>
				<div className="flex flex-col space-y-5">
					<p className={`pb-3 ${tStyles.cat1}`}>{t('choose')}</p>
					{settingsGrid}
					<div className="flex-row justify-between laptop:flex">
						<div className="flex flex-col">
							<p className={tStyles.cat1}>{t('oNumber')}</p>
							<p className={tStyles.cat1}>{orderNumber}</p>
						</div>
						<div className="flex items-center justify-end gap-3 max-laptop:justify-between">
							<div className="grid h-fit grid-cols-3 items-center gap-2 rounded-3xl bg-[#0F0F0F] px-2 text-xs font-medium text-white">
								<button
									className="text-sm"
									onClick={() => {
										setProductAmount((prev) => {
											if (prev > 1) {
												return prev - 1;
											}
											return prev;
										});
									}}
								>
									-
								</button>
								<p className="py-1">{productAmount}</p>
								<button
									className="text-sm"
									onClick={() => {
										setProductAmount((prev) => prev + 1);
									}}
								>
									+
								</button>
							</div>
							<button
								className="  max-laptop:h-fit max-laptop:whitespace-nowrap text-xs laptop-xl:text-base font-light h-fit rounded-3xl bg-[#0F0F0F] px-8 py-1 text-white transition ease-in-out hover:opacity-80 laptop:text-xs laptop-l:text-xs"
								onClick={() => {
									addToCart(orderNumber, productAmount, '2');
								}}
							>
								{t('add')}
							</button>
						</div>
					</div>
				</div>
				<Link
					href={`/${lng}/resources`}
					className={`${tStyles.cat3} flex items-center justify-between text-blue-800 hover:cursor-pointer`}
				>
					Downloads
					<Image
						src={BlueArrow}
						alt="arrow"
						height={500}
						width={500}
						className="w-auto h-auto"
					/>
				</Link>
			</div>
			<ToastContainer />
		</div>
	);
}
