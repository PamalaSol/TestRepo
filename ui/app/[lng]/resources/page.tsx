'use client';

import { useTranslation } from '@/app/i18n/client';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { fileService } from '../_services/files';
import { IProduct, Product, ProductFile, productService } from '../_services/products';
import { ToastContainer, toast } from 'react-toastify';
import { toastDefaultOptions } from '@/lib/utils';
import CatalogImage from '@/public/assets/resources-catalog.webp';
import Image from 'next/image';
import BlueArrow from '@/public/assets/blue-arrow.svg';
import tStyles from '@/app/[lng]/textSizes.module.css';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import HoAccordionResources from '../_components/HoAccordionResources';

import ReadyToElevate from '../_components/ReadyToElevate';

export default function Resources({ params: { lng } }: { params: { lng: string } }) {
	const { t } = useTranslation(lng, 'resources');

	const searchParams = useSearchParams();
	const searchTerm = searchParams.get('searchTerm');
	const cadSeries = searchParams.get('ser');

	interface CadPairs {
		dxf: ProductFile | undefined;
		stp: ProductFile | undefined;
	}

	interface ProductCadsData {
		pName: string;
		cadPairs: CadPairs[];
		otherCadFiles?: ProductFile[];
		ser?: string;
	}

	function createProductCadsData(products: IProduct[]): ProductCadsData[] {
		return products.map((product) => {
			// Step 1: Filter and sort files
			const filteredAndSortedFiles = product.dataFiles
				.filter((file) => Number(file.fileCategoryId) !== 8)
				.sort((a, b) => {
					const numA = Number(a.title.match(/\d+/)?.[0]);
					const numB = Number(b.title.match(/\d+/)?.[0]);
					return numA - numB;
				})
				.reverse();

			// Step 2: Group files into CadPairs and collect other files
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

			// Step 3: Prepare final CadPairs and otherFiles arrays
			const cadPairsArray: CadPairs[] = Object.values(groupedFiles).reverse();
			const reversedOtherFiles: ProductFile[] = otherFiles.reverse();

			// Step 4: Return the final ProductCadsData
			return {
				pName: `${t('series')} ${product.series}`,
				cadPairs: cadPairsArray,
				otherCadFiles: reversedOtherFiles.length > 0 ? reversedOtherFiles : undefined,
				ser: product.series,
			};
		});
	}

	useEffect(() => {
		const resourcesCatIds: number[] = [4, 2, 6, 9, 3, 8];
		const fetchResources = async () => {
			fileService
				.getFilesByCategory(resourcesCatIds, lng)
				.then((result) => {
					if (result) {
						let filteredManu = result.filter((item) => item.fileCategoryId == '4');
						filteredManu = filteredManu.sort((a, b) => {
							// Extract the number from the title string using a regular expression
							const numA = a.title.match(/\d{2,3}/); // Match two or three digits
							const numB = b.title.match(/\d{2,3}/);

							if (numA && numB) {
								// If both titles contain numbers, compare them numerically
								return Number(numA[0]) - Number(numB[0]);
							} else if (numA) {
								// If only the first title contains a number, it should come first
								return -1;
							} else if (numB) {
								// If only the second title contains a number, it should come first
								return 1;
							} else {
								// If neither title contains a number, maintain their relative order
								return 0;
							}
						});

						let filteredVideos = result.filter((item) => item.fileCategoryId == '2');

						filteredVideos = filteredVideos.sort((a, b) => {
							// Extract the number from the title string using a regular expression
							const numA = a.title.match(/\d{2}/);
							const numB = b.title.match(/\d{2}/);

							if (numA && numB) {
								// If both titles contain numbers, compare them numerically
								return Number(numA[0]) - Number(numB[0]);
							} else if (numA) {
								// If only the first title contains a number, it should come first
								return -1;
							} else if (numB) {
								// If only the second title contains a number, it should come first
								return 1;
							} else {
								// If neither title contains a number, maintain their relative order
								return 0;
							}
						});

						// Filter files with fileCategoryId '6'
						let filteredInsm = result.filter((item) => item.fileCategoryId == '6');
						filteredInsm = filteredInsm.sort((a, b) => {
							// Extract the number from the title string using a regular expression
							const numA = a.title.match(/\d{2}/);
							const numB = b.title.match(/\d{2}/);

							if (numA && numB) {
								// If both titles contain numbers, compare them numerically
								return Number(numA[0]) - Number(numB[0]);
							} else if (numA) {
								// If only the first title contains a number, it should come first
								return -1;
							} else if (numB) {
								// If only the second title contains a number, it should come first
								return 1;
							} else {
								// If neither title contains a number, maintain their relative order
								return 0;
							}
						});
						// Find files containing "ATEX"
						let atexFiles = filteredInsm.filter((item) => item.title.includes('ATEX'));

						// Remove the "ATEX" files from the original filtered array
						filteredInsm = filteredInsm.filter((item) => !item.title.includes('ATEX'));

						// Insert "ATEX" files in the third position from the bottom
						const insertPosition = filteredInsm.length - 2;
						filteredInsm.splice(insertPosition, 0, ...atexFiles);

						let filteredSparep = result.filter((item) => item.fileCategoryId == '9');
						filteredSparep = filteredSparep.sort((a, b) => {
							// Extract the number from the title string using a regular expression
							const numA = a.title.match(/\d{2}/);
							const numB = b.title.match(/\d{2}/);

							if (numA && numB) {
								// If both titles contain numbers, compare them numerically
								return Number(numA[0]) - Number(numB[0]);
							} else if (numA) {
								// If only the first title contains a number, it should come first
								return -1;
							} else if (numB) {
								// If only the second title contains a number, it should come first
								return 1;
							} else {
								// If neither title contains a number, maintain their relative order
								return 0;
							}
						});

						let filteredBrochures = result.filter((item) => item.fileCategoryId == '3');

						filteredBrochures = filteredBrochures.sort((a, b) => {
							// Extract the number from the title string using a regular expression
							const numA = a.title.match(/\d{2}/);
							const numB = b.title.match(/\d{2}/);

							if (numA && numB) {
								// If both titles contain numbers, compare them numerically
								return Number(numA[0]) - Number(numB[0]);
							} else if (numA) {
								// If only the first title contains a number, it should come first
								return -1;
							} else if (numB) {
								// If only the second title contains a number, it should come first
								return 1;
							} else {
								// If neither title contains a number, maintain their relative order
								return 0;
							}
						});
						const filteredDataSheets = result
							.filter((item) => item.fileCategoryId == '8')
							.sort((a, b) => {
								// Extract the number from the title string using a regular expression
								const numA = Number(a.title.match(/\d+/)?.[0]);
								const numB = Number(b.title.match(/\d+/)?.[0]);
								return numA - numB;
							});

						setManu(filteredManu);
						setVideos(filteredVideos);
						setInsm(filteredInsm);
						setSparep(filteredSparep);
						setBrochures(filteredBrochures);
						setDataSheets(filteredDataSheets);
					} else {
						toast.error(t('noData'), toastDefaultOptions);
					}
				})
				.catch((error) => {
					toast.error(t('unexpectedError'), toastDefaultOptions);
				});
		};
		fetchResources();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const apiUrl = process.env.API_URL;

	useEffect(() => {
		const fetchProducts = async () => {
			setIsLoading(true);

			productService
				.getProductsByCategory(1, lng)
				.then((result) => {
					setCadFiles(createProductCadsData(result));
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
				})
				.finally(() => {
					setIsLoading(false);
				});
		};

		fetchProducts();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const [manu, setManu] = useState<ProductFile[]>([]);
	const [videos, setVideos] = useState<ProductFile[]>([]);
	const [insm, setInsm] = useState<ProductFile[]>([]);
	const [sparep, setSparep] = useState<ProductFile[]>([]);
	const [brochures, setBrochures] = useState<ProductFile[]>([]);
	const [cadFiles, setCadFiles] = useState<ProductCadsData[]>([]);
	const [dataSheets, setDataSheets] = useState<ProductFile[]>([]);

	const url = process.env.API_URL;

	useEffect(() => {
		if (searchTerm && searchTerm.length > 0) {
			const elem = document.getElementById(searchTerm);
			elem?.scrollIntoView({
				behavior: 'smooth',
			});
		}
	}, [searchTerm]);
	return (
		<div className="">
			<div className="grid w-full grid-cols-11 pb-4 pt-6 max-laptop:px-4 max-laptop:pt-16 laptop:gap-x-1">
				<div className="col-span-6 max-laptop:hidden"></div>
				<div className="col-span-11 laptop:col-span-5">
					<div className="flex flex-col">
						<h1 className={`pb-3 ${tStyles.cat1}`}>{t('title')}</h1>
						<p className={`pr-4 ${tStyles.cat3}`}>{t('desc')}</p>
					</div>
				</div>
			</div>
			<div className="grid grid-cols-11 laptop:gap-x-1">
				<div className="col-span-11 grid-cols-12 lg:col-span-6 lg:grid-cols-6">
					<Image src={CatalogImage} alt="Resources catalog" className="" />
				</div>
				<div className="col-span-11 max-laptop:flex max-laptop:w-full max-laptop:px-4 lg:col-span-5 lg:grid-cols-6">
					<div className="mt-10 flex w-full flex-col">
						<div
							className="border-t border-t-[#C8C8C8] py-4 max-laptop:w-full "
							key={`resource-item-${t('brochure')}`}
							id="3"
						>
							<HoAccordionResources idMatch={searchTerm == '3'} title={t('brochure')}>
								<div className="flex flex-col">
									<div className="grid-rows-auto flex w-full grid-cols-2 flex-col text-blue-800 laptop:grid">
										{brochures?.map((file, idx) => (
											<div
												key={file.alt + idx}
												className={`${idx % 2 === 0 ? 'laptop:pr-3' : 'laptop:pl-3 laptop:pr-8'} flex w-full items-start justify-between py-1 font-light laptop:text-xs laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-base`}
											>
												<Link
													className={`flex w-full items-start justify-between gap-2 transition ease-in-out hover:opacity-80 max-laptop:items-center`}
													href={`${url}/files/${file.id}/${file.fileName}`}
													target="_blank"
													rel="noopener noreferrer"
												>
													{file.alt}

													<Image
														src={BlueArrow}
														alt="Blue arrow"
														height={500}
														width={500}
														className="h-auto w-auto laptop:mt-[4px] laptop-l:mt-[5px] laptop-xl-extra:mt-[7px]"
													/>
												</Link>
											</div>
										))}
									</div>
								</div>
							</HoAccordionResources>
						</div>
						<div
							className="border border-x-transparent border-b-transparent border-t-[#C8C8C8] py-4"
							key={`resource-item-${t('videos')}`}
							id="2"
						>
							<HoAccordionResources idMatch={searchTerm == '2'} title={t('videos')}>
								<div className="flex flex-col space-y-3">
									<div className="grid-rows-auto flex w-full grid-cols-2 flex-col text-blue-800 laptop:grid">
										{videos?.map((file, idx) => (
											<div
												key={file.alt + idx}
												className={`${idx % 2 === 0 ? 'laptop:pr-3' : 'laptop:pl-3 laptop:pr-8'} flex w-full items-start justify-between py-1 font-light laptop:text-xs laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-base`}
											>
												<Link
													className={`flex w-full items-start justify-between gap-2 transition ease-in-out hover:opacity-80 max-laptop:items-center`}
													href={file.alt}
													target="_blank"
													rel="noopener noreferrer"
												>
													{file.title}
													<Image
														src={BlueArrow}
														alt="Blue arrow"
														height={500}
														width={500}
														className="h-auto w-auto laptop:mt-[4px] laptop-l:mt-[6px]"
													/>
												</Link>
											</div>
										))}
									</div>
								</div>
							</HoAccordionResources>
						</div>
						<div
							className="border border-x-transparent border-b-transparent border-t-[#C8C8C8] py-4"
							key={`resource-item-${t('dataSheets')}`}
							id="8"
						>
							<HoAccordionResources
								idMatch={searchTerm == '8'}
								title={t('dataSheets')}
							>
								<div className="flex flex-col space-y-3">
									<div className="grid-rows-auto flex w-full grid-cols-2 flex-col text-blue-800 laptop:grid">
										{dataSheets?.map((file, idx) => (
											<div
												key={file.alt + idx}
												className={`${idx % 2 === 0 ? 'laptop:pr-3' : 'laptop:pl-3 laptop:pr-8'} flex w-full items-start justify-between py-1 font-light laptop:text-xs laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-base`}
											>
												<Link
													className={`flex w-full items-start justify-between gap-2 transition ease-in-out hover:opacity-80 max-laptop:items-center`}
													href={`${url}/files/${file.id}/${file.fileName}`}
													target="_blank"
													rel="noopener noreferrer"
												>
													{file.title
														.replace(/_/g, ' ')
														.replace(/^\w/, (c) => c.toUpperCase())}
													<Image
														src={BlueArrow}
														alt="Blue arrow"
														height={500}
														width={500}
														className="h-auto w-auto laptop:mt-[4px] laptop-l:mt-[6px]"
													/>
												</Link>
											</div>
										))}
									</div>
								</div>
							</HoAccordionResources>
						</div>
						<div
							className="border border-x-transparent  border-b-transparent border-t-[#C8C8C8] py-4"
							key={`resource-item-${t('cads')}`}
							id="7"
						>
							<HoAccordionResources idMatch={searchTerm == '7'} title={t('cads')} xl>
								{isLoading ? (
									<div className="text-bold flex w-full items-center justify-center">
										Loading...
									</div>
								) : (
									<div className="grid-rows-auto my-2 h-full grid-cols-2 gap-3 laptop:grid">
										{cadFiles?.reverse().map((productCadsData, idx) => (
											<div key={`${productCadsData.pName} - ${idx}`}>
												<HoAccordionResources
													title={productCadsData.pName}
													eClass="pl-0 laptop:pr-[0.5px] "
													blueBtn
													idMatch={cadSeries == productCadsData.ser}
												>
													{productCadsData.cadPairs.length === 0 &&
													!productCadsData.otherCadFiles ? (
														<>{t('noData')}</>
													) : (
														<div className="grid-rows-auto flex w-full grid-cols-1 flex-col font-light text-blue-800 laptop:grid laptop:text-xs laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-base">
															{productCadsData.cadPairs?.map(
																(filePair, idx) =>
																	(filePair.dxf ||
																		filePair.stp) && ( // Wrap in parentheses for clarity
																		<div
																			className={`grid grid-cols-12 gap-3 font-light laptop:text-xs laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-base`}
																			key={`${idx} ${filePair.dxf ? 'dxf' : 'stp'}`}
																		>
																			<p className="col-span-4 text-[#0F0F0F]  max-laptop:col-span-5 mobile-l:col-span-4 tablet:col-span-3 laptop-xl+:col-span-3">{`${filePair.dxf?.title || filePair.stp?.title}`}</p>{' '}
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
																					filePair.stp && (
																						<p>/</p>
																					)}
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
															{productCadsData.otherCadFiles?.map(
																(file, idx) => (
																	<div
																		className="grid w-full grid-cols-12 items-center justify-start"
																		key={file.id}
																	>
																		<p className="col-span-5 w-fit whitespace-nowrap text-[#0F0F0F] mobile-m:col-span-4 tablet:col-span-1 laptop:col-span-4 laptop-l:col-span-2 laptop-xl:col-span-3 laptop-xl+:col-span-2">
																			{`${file.title}`}
																		</p>
																		&nbsp;
																		<Link
																			className={`flex w-full flex-row items-center justify-start transition ease-in-out hover:opacity-80 `}
																			href={`${apiUrl}/files/${file.id}/${file.fileName}`}
																			target="_blank"
																			rel="noopener noreferrer"
																		>
																			stp
																		</Link>
																	</div>
																)
															)}
														</div>
													)}
												</HoAccordionResources>
											</div>
										))}
									</div>
								)}
							</HoAccordionResources>
						</div>
						<div
							className="border border-x-transparent border-b-transparent border-t-[#C8C8C8] py-4"
							key={`resource-item-${t('parts')}`}
							id="9"
						>
							<HoAccordionResources idMatch={searchTerm == '9'} title={t('parts')}>
								<div className="flex flex-col space-y-3">
									<div className="grid-rows-auto flex w-full grid-cols-2 flex-col text-blue-800 laptop:grid">
										{sparep?.map((file, idx) => (
											<div
												key={file.alt + idx}
												className={`${idx % 2 === 0 ? 'laptop:pr-3' : 'laptop:pl-3 laptop:pr-8'} flex w-full items-start justify-between py-1 font-light laptop:text-xs laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-base`}
											>
												<Link
													className={`flex w-full items-start justify-between gap-2 transition ease-in-out hover:opacity-80 max-laptop:items-center`}
													href={`${url}/files/${file.id}/${file.fileName}`}
													target="_blank"
													rel="noopener noreferrer"
												>
													{`${t('parts')} ${lng == 'en-US' ? file.title.toLowerCase() : file.title}`}

													<Image
														src={BlueArrow}
														alt="Blue arrow"
														height={500}
														width={500}
														className="h-auto w-auto laptop:mt-[4px] laptop-l:mt-[6px]"
													/>
												</Link>
											</div>
										))}
									</div>
								</div>
							</HoAccordionResources>
						</div>
						<div
							className="border border-x-transparent border-b-transparent border-t-[#C8C8C8] py-4"
							key={`resource-item-${t('instructions')}`}
							id="6"
						>
							<HoAccordionResources
								idMatch={searchTerm == '6'}
								title={t('instructions')}
							>
								<div className="flex flex-col">
									<div className="grid-rows-auto flex w-full grid-cols-2 flex-col text-blue-800 laptop:grid">
										{insm?.map((file, idx) => (
											<div
												key={file.alt + idx}
												className={`${idx % 2 === 0 ? 'laptop:pr-3' : 'laptop:pl-3 laptop:pr-8'} flex w-full items-start justify-between py-1 font-light laptop:text-xs laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-base`}
											>
												<Link
													className={`flex w-full items-start justify-between gap-2 transition ease-in-out hover:opacity-80 max-laptop:items-center`}
													href={`${url}/files/${file.id}/${file.fileName}`}
													target="_blank"
													rel="noopener noreferrer"
												>
													{file.alt}
													<Image
														src={BlueArrow}
														alt="Blue arrow"
														height={500}
														width={500}
														className="h-auto w-auto laptop:mt-[4px] laptop-l:mt-[6px]"
													/>
												</Link>
											</div>
										))}
									</div>
								</div>
							</HoAccordionResources>
						</div>
						<div
							className="border border-x-transparent border-b-transparent border-t-[#C8C8C8] py-4"
							key={`resource-item-${t('manufacturer')}`}
							id="4"
						>
							<HoAccordionResources
								idMatch={searchTerm == '4'}
								title={t('manufacturer')}
							>
								<div className="flex flex-col space-y-3">
									<div className="grid-rows-auto flex w-full grid-cols-2 flex-col text-blue-800 laptop:grid">
										{manu?.map((file, idx) => (
											<div
												key={file.alt + idx}
												className={`${idx % 2 === 0 ? 'laptop:pr-3' : 'laptop:pl-3 laptop:pr-8'} flex w-full items-start justify-between py-1 font-light laptop:text-xs laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-base`}
											>
												<Link
													className={`flex w-full items-start justify-between gap-2 transition ease-in-out hover:opacity-80 max-laptop:items-center`}
													href={`${url}/files/${file.id}/${file.fileName}`}
													target="_blank"
													rel="noopener noreferrer"
												>
													{file.title}
													<Image
														src={BlueArrow}
														alt="Blue arrow"
														height={500}
														width={500}
														className="h-auto w-auto laptop:mt-[4px] laptop-l:mt-[6px]"
													/>
												</Link>
											</div>
										))}
									</div>
								</div>
							</HoAccordionResources>
						</div>
					</div>
				</div>
			</div>
			<ToastContainer />
		</div>
	);
}
