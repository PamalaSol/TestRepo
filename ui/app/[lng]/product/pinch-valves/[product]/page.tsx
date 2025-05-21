'use client';

import HoAccordion from '@/app/[lng]/_components/HoAccordion';
import {
	IProduct,
	ProductFile,
	productSuitableForDivider as divider,
	productService,
} from '@/app/[lng]/_services/products';
import tStyles from '@/app/[lng]/textSizes.module.css';
import { useTranslation } from '@/app/i18n/client';
import { series, toastDefaultOptions } from '@/lib/utils';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../../../_components/Loader';
import LoadingAnimation from '../../../_components/LoadingAnimation';
import { productOrder } from '../../../_interfaces/interfaces';
import { fileService } from '../../../_services/files';
import { getLocalizedPath } from '@/app/i18n/settings';

export interface CadPairs {
	dxf: ProductFile | undefined;
	stp: ProductFile | undefined;
}

export default function Product({ params }: { params: { product: string; lng: string } }) {
	const { product, lng } = params;
	const { t } = useTranslation(lng, 'pinchValve');

	const fId = process.env.NEXT_PUBLIC_INSTRUCTIONS_FILE_ID;

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [productData, setProduct] = useState<IProduct | null>(null);
	const [images, setImages] = useState<ProductFile[]>([]);
	const [dimensions, setDimensions] = useState<ProductFile[]>([]);
	const [thumbnails, setThumbnails] = useState<ProductFile[]>([]);

	const unusedFeatures = false;

	const [insm, setInsm] = useState<ProductFile | null>(null);
	const [servInstructions, setServInstructions] = useState<ProductFile | null>(null);
	const [instructions41, setInstruction41] = useState<ProductFile[]>([]);
	const [video, setVideo] = useState<ProductFile | null>(null);
	const [spareP, setSpareP] = useState<ProductFile | null>(null);
	const [brochure, setBrochure] = useState<ProductFile | null>(null);
	const [cadFiles, setCadFiles] = useState<CadPairs[]>([]);
	const [otherCadFiles, setOtherCadFiles] = useState<ProductFile[] | null>(null);
	const [dataSheets, setDataSheets] = useState<ProductFile | null>(null);

	const extractImageData = (dataImages: ProductFile[]) => {
		const _02Images: ProductFile[] = [];
		dataImages.forEach((image) => {
			if (image.fileCategoryId == '1') {
				if (image.fileName.includes('_02')) {
					_02Images.push({ ...image });
				} else {
					images.push({ ...image });
				}
			}

			if (image.fileCategoryId == '5') {
				dimensions.push({ ...image });
			}
		});
		images.push(..._02Images);
	};

	const createProductCadsData = (product: IProduct): CadPairs[] => {
		const filteredAndSortedFiles = product.dataFiles
			.filter((file) => {
				if (Number(file.fileCategoryId) === 8) {
					setDataSheets(file);
					return false;
				}
				return true;
			})
			.sort((a, b) => {
				const numA = Number(a.title.match(/\d+/)?.[0]);
				const numB = Number(b.title.match(/\d+/)?.[0]);
				return numA - numB;
			})
			.reverse();

		const groupedFiles: { [key: string]: CadPairs } = {};
		const otherFiles: ProductFile[] = [];

		filteredAndSortedFiles.forEach((file) => {
			const title = file.title.trim();
			const trimmedFileName = file.fileName.trim();

			const isDxf = trimmedFileName.endsWith('dxf.zip');
			const isStp = trimmedFileName.endsWith('stp.zip');
			const isCategory7 = Number(file.fileCategoryId) === 7;

			if (isDxf || isStp) {
				if (!groupedFiles[title]) {
					groupedFiles[title] = { dxf: undefined, stp: undefined };
				}
				if (isDxf) {
					groupedFiles[title].dxf = file;
				} else if (isStp) {
					groupedFiles[title].stp = file;
				}
			} else if (isCategory7) {
				otherFiles.push(file);
			}
		});

		const cadPairsArray: CadPairs[] = Object.values(groupedFiles).reverse();

		const reversedOtherFiles: ProductFile[] = otherFiles.reverse();

		if (reversedOtherFiles.length > 0) {
			setOtherCadFiles(reversedOtherFiles);
		}

		return cadPairsArray;
	};

	const capitalizeTitle = (title: string | undefined): string => {
		if (!title) return '';

		// Replace underscores with spaces and convert the entire string to lowercase
		const formattedTitle = title.replace(/_/g, ' ').toLowerCase();

		if (lng == 'en-US') {
			// Capitalize only the first letter of the first word
			return formattedTitle.charAt(0).toUpperCase() + formattedTitle.slice(1);
		}

		// Capitalize the first letter of every word (default behavior)
		return formattedTitle.replace(/\b\w/g, (char) => char.toUpperCase());
	};

	useEffect(() => {
		setIsLoading(true);
		try {
			const fetchProducts = async () => {
				productService.getProduct(product, lng).then((result) => {
					// Add redirect check for controls category
					if (result == null || result.productCategories[0]?.id !== 1) {
						// Ensure it IS a pinch valve (ID 1)
						// Redirect if not a pinch valve. This path should ideally not be reached if layout.tsx noindexes.
						// Consider if a different category (like controls) should redirect to its specific product page if applicable.
						// For now, a general redirect to the main controls category page.
						const localizedControlsPath = getLocalizedPath(lng, '/products/controls'); // Get localized path for controls
						window.location.href = localizedControlsPath;
						return;
					}

					setProduct(result);

					findSeriesByNum(result.series);
					extractImageData(result.dataImages);
					if (result) {
						fetchResources(result);
					}
					setCadFiles(createProductCadsData(result));
				});
			};

			const resourcesCatIds: number[] = [4, 2, 9, 3, 8, 6];
			const fetchResources = async (product: IProduct) => {
				fileService.getFilesByCategory(resourcesCatIds, lng).then((result) => {
					if (result) {
						//!
						const getTensValue = (numberString: string): number => {
							const number = parseInt(numberString, 10);
							return Math.floor(number / 10) * 10;
						};

						const filteredVideos = result.filter((item) => item.fileCategoryId == '2');

						// Find a video where the title contains a number with the same ten value as the series
						const matchingVideo = filteredVideos.find((item) => {
							if (product.series) {
								const seriesTensValue = getTensValue(product.series);

								// Extract all two-digit numbers from the title
								const numbersInTitle = item.title.match(/\b\d{2}\b/g);

								// Check if any number in the title has the same ten value
								return (
									numbersInTitle &&
									numbersInTitle.some(
										(number) => getTensValue(number) === seriesTensValue
									)
								);
							}
							return false;
						});

						// Update state with the matching video or null
						setVideo(matchingVideo || null);
						//!
						const filteredSparep = result.find(
							(item) =>
								item.fileCategoryId == '9' &&
								product.series &&
								item.title.includes(product.series)
						);
						setSpareP(filteredSparep || null);

						//!
						const filteredBrochure = result.find(
							(item) =>
								item.fileCategoryId == '3' &&
								item.title.toLowerCase().includes('4 mb')
						);

						setBrochure(filteredBrochure || null);

						//!
						const filteredServiceInstructions = result.filter(
							(item) => item.fileCategoryId == '6'
						);

						//!
						if (product.series === '41') {
							// Find all files that contain the number '41' in their title
							const filesWith41 = filteredServiceInstructions.filter((item) =>
								item.title.includes('41')
							);

							// Add these files to the instructions41 array
							setInstruction41(filesWith41);
						}
						// Check for file with specific ID
						filteredServiceInstructions.map((item) => {
							if (
								item.fileName.includes('Einbau-_Betriebsbedingungen_QV_d_e_f.pdf')
							) {
								setInsm(item);
							}
						});

						// Function to check if the series matches any number in the title with the same ten value
						const findMatchingFile = (
							items: ProductFile[],
							series?: string
						): ProductFile | null => {
							if (series) {
								const seriesTensValue = getTensValue(series);

								// Check if any item title has a number with the same tens value
								const matchingFile = items.find((item) => {
									const numbersInTitle = item.title.match(/\b\d{2}\b/g);
									return (
										numbersInTitle &&
										numbersInTitle.some(
											(number) => getTensValue(number) === seriesTensValue
										)
									);
								});

								return matchingFile || null;
							}

							return null;
						};

						// Find the matching file and update state
						const matchingFile = findMatchingFile(
							filteredServiceInstructions,
							product.series
						);
						setServInstructions(matchingFile);
					}
				});
			};

			fetchProducts();
		} catch (error: any) {
			const statusCode = error.status;
			if (statusCode === 404) {
				toast.error(t('noData'), toastDefaultOptions);
			} else if (statusCode === 500) {
				toast.error(t('serverError'), toastDefaultOptions);
			} else {
				toast.error(t('unexpectedError'), toastDefaultOptions);
			}
		} finally {
			setIsLoading(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const [dmSelected, setDmSelected] = useState<string>('---.');
	const [qualitySelected, setQualitySelected] = useState<string>('---.');
	const [versionSelected, setVersionSelected] = useState<string>('---');
	const [atexFlag, setAtexFlag] = useState<number>(0);
	const [seriesNumber, setSeriesNumber] = useState<string>('--');
	const [productAmount, setProductAmount] = useState<number>(1);

	const [orderNumber, setOrderNumber] = useState<string>(
		seriesNumber + dmSelected + qualitySelected + versionSelected
	);

	useEffect(() => {
		setOrderNumber(seriesNumber + dmSelected + qualitySelected + versionSelected);
	}, [qualitySelected, seriesNumber, dmSelected, versionSelected]);

	const findSeriesByNum = (seriesNum: string) => {
		const index = series.findIndex((seriesItem) => seriesItem.seriesNum === seriesNum);
		setLocalSeries(index);
		setSeriesNumber(seriesNum);
	};

	const [localSeries, setLocalSeries] = useState<number>(0);

	const addToCart = (imgString: string, orderNo: string, amount: number, category: string) => {
		if (orderNo.includes('-')) {
			toast.error(t('orderError'), toastDefaultOptions);
		} else {
			const ls = localStorage.getItem('orders');

			let newOrder: productOrder = {
				imgString: imgString,
				orderNo: orderNo,
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
				toast.success(t('addToCart'), toastDefaultOptions);
				window.dispatchEvent(new Event('storageItems'));
			}
		}
	};

	const settingsGrid = (
		<div className="grid-rows-auto grid grid-cols-12 border-[#0F0F0F] text-center">
			<div className="col-span-12 grid grid-cols-12">
				<div className="col-span-1 border-l border-t border-[#0F0F0F] bg-[#F7F7F7] max-laptop:text-[0.6rem]">
					<p>{t('series')}</p>
				</div>
				<div className="col-span-1 border-l border-t border-[#0F0F0F] bg-[#F7F7F7] max-laptop:text-[0.6rem]">
					<p>DN</p>
				</div>
				<div className="col-span-8 border-x border-t border-[#0F0F0F] bg-white">
					<div className="grid grid-rows-2">
						<p>{t('sQuality')}</p>
						<div className="grid grid-cols-8">
							{series[localSeries]?.qualities.map((quality, idx) => (
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
				<div className="col-span-2 border-r border-t border-[#0F0F0F] bg-[#F7F7F7] max-laptop:text-[0.6rem]">
					<div className="grid h-full grid-rows-2 content-between">
						<p>{t('version')}</p>
						<p>{t('standard')}</p>
					</div>
				</div>
			</div>
			<div className="col-span-12 grid grid-cols-12">
				<div className="col-span-1 flex items-center justify-center border-y border-l border-[#0F0F0F] bg-[#F7F7F7] text-sm">
					<p>{series[localSeries]?.seriesNum}</p>
				</div>
				<div className="col-span-1 flex w-full flex-col items-center justify-center border-y border-l border-[#0F0F0F] bg-[#F7F7F7]">
					{series[localSeries]?.dm.map((dimension, idx) => (
						<div
							key={`quality-${dimension}`}
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
					className={`col-span-10 grid grid-cols-10 ${series[localSeries]?.v2Name ? 'grid-rows-2' : 'grid-rows-1'} bg-white`}
				>
					<div className="col-span-10 grid grid-cols-10">
						<div className="col-span-8 border-x border-y border-[#0F0F0F]">
							<div className="grid h-full grid-cols-8">
								{series[localSeries]?.qualities.map((quality, idx) => (
									<div
										key={`quality-${quality.num}`}
										className={`flex items-center justify-center ${idx === 0 ? '' : 'border-l'} border-[#C8C8C8] font-normal text-[#306abf] underline hover:cursor-pointer hover:font-bold`}
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
							<div className="col-span-1 flex h-full w-full flex-col items-center justify-around">
								{series[localSeries]?.version.num.map((ver) => (
									<div
										key={`quality-${ver}`}
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
						className={`col-span-10 grid grid-cols-10 ${series[localSeries]?.v2Name ? '' : 'hidden'}`}
					>
						<div className="col-span-8 grid grid-cols-8 grid-rows-2 border-x border-b border-[#0F0F0F]">
							<div
								className={`col-span-4 row-span-2 flex h-full w-full items-center justify-center max-laptop:text-[0.6rem]`}
							>
								<p>{t('atexVer')}:</p>
							</div>
							<div
								className={`col-span-4 row-span-2 flex h-full flex-col justify-around`}
							>
								<div className="grid h-full w-full grid-cols-4">
									{series[localSeries]?.v2Qualities?.map((quality, idx) => (
										<div
											key={`quality-${quality.name}`}
											className={`flex items-center justify-center border-l border-[#C8C8C8]`}
										>
											<p className="py-1 text-center text-[0.6rem] font-normal">
												{quality.name}
											</p>
										</div>
									))}
								</div>

								<div className="grid h-full w-full grid-cols-4 border-t border-[#0F0F0F]">
									{series[localSeries]?.v2Qualities?.map((quality) => (
										<div
											key={`quality-${quality.num}`}
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
							<p className="border-b border-[#0F0F0F] max-laptop:text-[0.6rem]">
								ATEX
							</p>
							<div className="col-span-1 flex h-full w-full flex-col items-center justify-around">
								{series[localSeries]?.v2Name?.num.map((ver) => (
									<div
										key={`quality-${ver}`}
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
			<div
				className={`col-span-12 flex w-full justify-end ${series[localSeries]?.version.num.includes('100') || series[localSeries]?.v2Name?.num.includes('100') ? '' : 'hidden'}`}
			>
				<p className={`w-fit ${tStyles.pvDetailHeading}`}>{t('silicone')}</p>
			</div>
		</div>
	);

	const [photoActive, setPhotoActive] = useState<number>(0);

	function splitString(input: string, divider: string) {
		const parts = input.split(divider);
		if (parts.length !== 2) {
			return ['', ''];
		}
		return parts;
	}

	const url = process.env.GENERAL_URL;
	const apiUrl = process.env.API_URL;

	return (
		<>
			{!isLoading ? (
				<div className="mt-6 grid grid-cols-11 px-4 py-6">
					<div className="col-span-11 grid-cols-12 lg:col-span-6 lg:grid-cols-6">
						<div className="ultrawide:justify-start flex flex-col justify-around lg:fixed lg:h-[90vh] lg:w-[50vw] laptop-xl+:justify-between">
							<div className="flex w-full">
								<div className="flex w-[80%] flex-col lg:w-[40vw]">
									<p className={`laptop:text-end ${tStyles.cat5}`}>
										{productData?.industries}
									</p>
									<h1 className={`laptop:text-end ${tStyles.productTitle}`}>
										{' '}
										{`${t('series')} ${productData?.series} ${t('hpvalves')}`}
									</h1>
								</div>
								<div className="grid-rows-10 grid w-[20%]">
									<div className="z-10 row-start-5 ml-1 h-[1px] w-[600px] bg-[#C8C8C8] max-laptop:hidden"></div>
								</div>
							</div>
							<div
								className={` ${images[photoActive] && images[photoActive].fileName.includes('_02') ? '-ml-4' : ''} flex flex-row justify-center overflow-visible max-laptop:min-h-[35vh] max-laptop:overflow-clip lg:h-[55vh] lg:w-[43vw]`}
							>
								<picture>
									{images[photoActive] ? (
										// eslint-disable-next-line @next/next/no-img-element
										<img
											key={images[photoActive].id}
											className={`ultrawide-mt ultrawide-h`}
											src={`${process.env.API_URL}/files/${images[photoActive]?.id}/${images[photoActive]?.fileName}`}
											alt={`${images[photoActive]?.alt}`}
											width="600"
											height="600"
										/>
									) : (
										<LoadingAnimation />
									)}
								</picture>
							</div>
							<div className="ultrawide-bg z-20 grid grid-cols-12">
								<div className="col-span-2 grid-cols-2 max-laptop:hidden lg:col-span-1 lg:grid-cols-1">
									<div className="flex flex-col space-y-3 max-lg:hidden">
										<button
											className="transition ease-in-out hover:opacity-80"
											onClick={() => {
												if (productData) {
													if (images.length - 1 === photoActive) {
														setPhotoActive(0);
													} else {
														setPhotoActive((prev) => prev + 1);
													}
												}
											}}
										>
											{/* eslint-disable-next-line @next/next/no-img-element */}
											<img
												src={`/assets/up-button.png`}
												alt="Up button"
												className="w-[3vw]"
											/>
										</button>
										<button
											className="transition ease-in-out hover:opacity-80"
											onClick={() => {
												if (productData) {
													if (photoActive === 0) {
														const lastPhoto = images.length - 1;
														setPhotoActive(lastPhoto);
													} else {
														setPhotoActive((prev) => prev - 1);
													}
												}
											}}
										>
											{/* eslint-disable-next-line @next/next/no-img-element */}
											<img
												src={`/assets/down-button.png`}
												alt="Down button"
												className="w-[3vw]"
											/>
										</button>
									</div>
								</div>
								<div className="col-span-12 my-4 w-full laptop:hidden">
									<div className="flex w-full items-center justify-between">
										<button
											className=""
											onClick={() => {
												if (productData) {
													if (images.length - 1 === photoActive) {
														setPhotoActive(0);
													} else {
														setPhotoActive((prev) => prev + 1);
													}
												}
											}}
										>
											{/* eslint-disable-next-line @next/next/no-img-element */}
											<img
												src={`/assets/up-button.png`}
												alt="Up button"
												className="w-[10vw] -rotate-90"
											/>
										</button>
										<button
											className=""
											onClick={() => {
												if (productData) {
													if (photoActive === 0) {
														const lastPhoto = images.length - 1;
														setPhotoActive(lastPhoto);
													} else {
														setPhotoActive((prev) => prev - 1);
													}
												}
											}}
										>
											{/* eslint-disable-next-line @next/next/no-img-element */}
											<img
												src={`/assets/down-button.png`}
												alt="Down button"
												className="w-[10vw] -rotate-90"
											/>
										</button>
									</div>
								</div>
								<div className="col-span-12 h-fit w-full self-center max-laptop:space-y-3 tablet:ml-4 lg:col-span-11 lg:ml-6">
									<div className="w-full grid-cols-9 laptop:grid">
										<p
											className={`col-span-3 laptop-l:col-span-4 ${tStyles.pvDetailHeading}`}
										>
											{t('nWidths')}:
										</p>
										<p
											className={`col-span-6 laptop-l:col-span-5 ${tStyles.pvDetailDesc}`}
										>
											{productData?.nominalWidth}
										</p>
									</div>
									{productData?.screws && productData.screws !== '' && (
										<div className={`w-full grid-cols-9 laptop:grid`}>
											<p
												className={`col-span-3 laptop-l:col-span-4 ${tStyles.pvDetailHeading}`}
											>
												{productData?.connectionMaterial
													? productData?.connectionMaterial
													: t('screws')}
											</p>
											<p
												className={`col-span-6 laptop-l:col-span-5 ${tStyles.pvDetailDesc}`}
											>
												{productData?.screws}
											</p>
										</div>
									)}
									<div className="w-full grid-cols-9 laptop:grid">
										<p
											className={`col-span-3 laptop-l:col-span-4 ${tStyles.pvDetailHeading}`}
										>
											{productData?.connectionType}:
										</p>
										<p
											className={`col-span-6 laptop-l:col-span-5 ${tStyles.pvDetailDesc}`}
										>
											{productData?.material}
										</p>
									</div>
									<div className="w-full grid-cols-9 laptop:grid">
										<p
											className={`col-span-3 laptop-l:col-span-4 ${tStyles.pvDetailHeading}`}
										>{`${t('sleeve')}:`}</p>
										<p
											className={`col-span-6 laptop-l:col-span-5 ${tStyles.pvDetailDesc}`}
										>{`${t('sQuality')} ${qualitySelected}; Version: ${atexFlag ? 'ATEX' : 'Standard'}`}</p>
									</div>
									{productData?.suitableFor && (
										<div className="w-full grid-cols-9 laptop:grid">
											<p
												className={`col-span-3 laptop-l:col-span-4 ${tStyles.pvDetailHeading}`}
											>{`${splitString(productData.suitableFor, divider)[0]}:`}</p>
											<p
												className={`col-span-6 laptop-l:col-span-5 ${tStyles.pvDetailDesc}`}
											>{`${splitString(productData.suitableFor, divider)[1]}`}</p>
										</div>
									)}
									<div className="w-full grid-cols-9 laptop:grid">
										<p
											className={`col-span-3 laptop-l:col-span-4 ${tStyles.pvDetailHeading}`}
										>{`${t('housing')}:`}</p>
										<p
											className={`col-span-6 tablet:whitespace-nowrap laptop-l:col-span-5 ${tStyles.pvDetailDesc}`}
										>
											{productData?.housing}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="z-20 col-span-11 grid-cols-12 space-y-5 border border-y-transparent border-l-transparent border-r-transparent bg-[#f7f7f7] py-3 lg:col-span-5 lg:grid-cols-6 laptop:border-l-[#C8C8C8] ">
						<div className="flex flex-col space-y-5 laptop:pl-1">
							<p className={`pb-3 ${tStyles.cat1}`}>{t('choose')}</p>
							{settingsGrid}
							<div className="flex-row justify-between lg:flex">
								<div className="flex max-laptop:mb-2 max-laptop:justify-between laptop:flex-col">
									<p className={tStyles.cat1}>{t('orderN')}</p>
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
										className="laptop-xl:text-basefont-light h-fit rounded-3xl bg-[#0F0F0F] px-8 py-1 text-white transition ease-in-out hover:opacity-80 laptop:text-xs laptop-l:text-xs"
										onClick={() => {
											addToCart(
												images[0]?.id ? images[0].id : '',
												orderNumber,
												productAmount,
												'1'
											);
										}}
									>
										{t('add')}
									</button>
								</div>
								{unusedFeatures && (
									<button
										className="h-8 rounded-3xl bg-[#0F0F0F] px-10 py-0 text-base font-light text-white transition ease-in-out hover:opacity-80"
										onClick={() => {
											addToCart(
												thumbnails[0]?.id ? thumbnails[0].id : '',
												orderNumber,
												1,
												'1'
											);
										}}
									>
										{t('add')}
									</button>
								)}
							</div>
						</div>
						<div className="flex flex-col space-y-5 laptop:pl-1">
							<div className="mt-8 h-[1px] w-full bg-[#C8C8C8]"></div>
							<div className="flex w-full flex-col pb-10">
								<p className={tStyles.cat4}>{t('dimensions')}</p>
								{dimensions[0] ? (
									// eslint-disable-next-line @next/next/no-img-element
									<img
										src={`${process.env.API_URL}/files/${dimensions[0]?.id}/${dimensions[0]?.fileName}`}
										alt={`${t('series')} ${productData?.series} ${t('dimensions')}`}
										width="600"
										height="400"
										className="self-center"
									/>
								) : (
									<div className="flex w-full justify-center">
										<LoadingAnimation />
									</div>
								)}
							</div>
							<div className="h-[1px] w-full bg-[#C8C8C8]"></div>
							<div className="laptop:pl-3">
								<HoAccordion title={t('controls')}>
									<Link
										href={`/${lng}/products/controls`}
										className="flex w-full items-center justify-around hover:cursor-pointer"
									>
										<picture className="">
											{false && (
												<source
													srcSet={`/assets/products/controls/schnellentlüftungsventil.webp`}
													type="image/webp"
												/>
											)}
											<img
												src={`/assets/products/controls/schnellentlüftungsventil.webp`}
												alt={`featured control 1`}
												className=""
											/>
										</picture>
										<picture className="">
											{false && (
												<source
													srcSet={`/assets/products/controls/featured2.webp`}
													type="image/webp"
												/>
											)}
											<img
												src={`/assets/products/controls/featured2.webp`}
												alt={`featured control 1`}
												className=""
											/>
										</picture>
										<picture className="">
											{false && (
												<source
													srcSet={`/assets/products/controls/featured3.webp`}
													type="image/webp"
												/>
											)}
											<img
												src={`/assets/products/controls/featured3.webp`}
												alt={`featured control 1`}
												className=""
											/>
										</picture>
										<picture className="">
											{false && (
												<source
													srcSet={`/assets/products/controls/featured4.webp`}
													type="image/webp"
												/>
											)}
											<img
												src={`/assets/products/controls/featured4.webp`}
												alt={`featured control 1`}
												className=""
											/>
										</picture>
									</Link>
								</HoAccordion>
							</div>
							<div className="h-[1px] w-full bg-[#C8C8C8]"></div>
							<div className="laptop:pl-3">
								<HoAccordion title={'Downloads'}>
									<div
										className={`flex w-full flex-col gap-3 text-[#306abf] ${tStyles.cat3}`}
									>
										{dataSheets && (
											<Link
												className={`flex w-full flex-row items-center justify-between transition ease-in-out hover:opacity-80`}
												href={`${apiUrl}/files/${dataSheets?.id}/${dataSheets?.fileName}`}
												target="_blank"
												rel="noopener noreferrer"
											>
												{capitalizeTitle(
													dataSheets?.title.replace(/_/g, ' ')
												)}
											</Link>
										)}
										{spareP && (
											<Link
												className={`flex w-full flex-row items-center justify-between transition ease-in-out hover:opacity-80`}
												href={`${apiUrl}/files/${spareP?.id}/${spareP?.fileName}`}
												target="_blank"
												rel="noopener noreferrer"
											>
												{`${t('parts')} ${lng == 'en-US' ? spareP?.title.toLowerCase() : spareP?.title}`}
											</Link>
										)}
										{brochure && (
											<Link
												className={`flex w-full flex-row items-center justify-between transition ease-in-out hover:opacity-80`}
												href={`${apiUrl}/files/${brochure?.id}/${brochure?.fileName}`}
												target="_blank"
												rel="noopener noreferrer"
											>
												{brochure?.title}
											</Link>
										)}

										{insm && (
											<Link
												className={`flex w-full flex-row items-center justify-between transition ease-in-out hover:opacity-80`}
												href={`${apiUrl}/files/${insm?.id}/${insm?.fileName}`}
												target="_blank"
												rel="noopener noreferrer"
											>
												{insm?.title}
											</Link>
										)}

										{servInstructions && !(productData?.series == '41') && (
											<Link
												key={servInstructions.id}
												className={`flex w-full flex-row items-center justify-between transition ease-in-out hover:opacity-80`}
												href={`${apiUrl}/files/${servInstructions.id}/${servInstructions.fileName}`}
												target="_blank"
												rel="noopener noreferrer"
											>
												{t('servInst')}
											</Link>
										)}
										{productData?.series == '41' &&
											instructions41 &&
											instructions41.map((file, idx) => (
												<Link
													key={file.id}
													className={`flex w-full flex-row items-center justify-between transition ease-in-out hover:opacity-80`}
													href={`${apiUrl}/files/${file.id}/${file.fileName}`}
													target="_blank"
													rel="noopener noreferrer"
												>
													{file.title}
												</Link>
											))}
										{video && (
											<Link
												className={`flex w-full flex-row items-center justify-between transition ease-in-out hover:opacity-80`}
												href={video.alt}
												target="_blank"
												rel="noopener noreferrer"
											>
												{video?.title}
											</Link>
										)}
										{(cadFiles.length > 0 || otherCadFiles) && (
											<>
												<p
													className={`${tStyles.cat4} mt-5 font-light text-[#0F0F0F]`}
												>
													{t('cads')}
												</p>
												{cadFiles.map(
													(filePair, idx) =>
														(filePair.dxf || filePair.stp) && ( // Wrap in parentheses for clarity
															<div
																className={`grid grid-cols-12 gap-3`}
																key={`${idx} ${filePair.dxf ? 'dxf' : 'stp'}`}
															>
																<p className="col-span-3 text-[#0F0F0F] max-mobile-l:col-span-4 laptop-l:col-span-2 laptop-xl+:col-span-2">{`${filePair.dxf?.title || filePair.stp?.title}`}</p>{' '}
																<div className="col-span-2 flex gap-1">
																	{filePair.dxf && (
																		<Link
																			href={`${apiUrl}/files/${filePair.dxf?.id}/${filePair.dxf?.fileName}`}
																			target="_blank"
																			rel="noopener noreferrer"
																		>
																			dxf
																		</Link>
																	)}
																	{filePair.dxf &&
																		filePair.stp && <p>/</p>}
																	{filePair.stp && (
																		<Link
																			href={`${apiUrl}/files/${filePair.stp?.id}/${filePair.stp?.fileName}`}
																			target="_blank"
																			rel="noopener noreferrer"
																		>
																			stp
																		</Link>
																	)}
																</div>
															</div>
														)
												)}
												{otherCadFiles?.map((file, idx) => (
													<div
														className="grid w-full grid-cols-12 items-center justify-start"
														key={file.id}
													>
														<p
															className={`col-span-2 w-fit whitespace-nowrap text-[#0F0F0F] max-mobile-l:col-span-3 tablet:col-span-1 laptop-l:col-span-1 laptop-xl+:col-span-1`}
														>
															{`${file.title}`}
														</p>
														&nbsp;
														<Link
															className={`flex w-full flex-row items-center justify-start transition ease-in-out hover:opacity-80`}
															href={`${apiUrl}/files/${file.id}/${file.fileName}`}
															target="_blank"
															rel="noopener noreferrer"
														>
															stp
														</Link>
													</div>
												))}
											</>
										)}
									</div>
								</HoAccordion>
							</div>
							<div className="h-[1px] w-full bg-[#C8C8C8]"></div>

							<div className="laptop:pl-3">
								<HoAccordion title={t('special')}>
									<div
										className={`${tStyles.cat3} flex w-full justify-between pt-6`}
									>
										<p>{t('sVer')}</p>
										<Link
											href={`/${lng}/contact`}
											className="text-[#306abf] transition ease-in-out hover:opacity-80"
										>
											{t('contact')}
										</Link>
									</div>
								</HoAccordion>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className="flex w-full items-center justify-center">
					<Loader />
				</div>
			)}
			<ToastContainer />
		</>
	);
}
