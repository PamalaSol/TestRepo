'use client';

import { useEffect, useRef, useState } from 'react';
import { IProduct, ProductFile, productService } from '../_services/products';
import Link from 'next/link';
import { useTranslation } from '@/app/i18n/client';
import Arrow from '@/public/assets/button.svg';
import ArrowInv from '@/public/assets/buttoninv.svg';
import Image from 'next/image';
import tStyles from '@/app/[lng]/textSizes.module.css';
import { fileService } from '../_services/files';
import { getLocalizedPath, routeTranslations, languages } from '@/app/i18n/settings';

export default function Search({
	lng,
	srch,
	invBg,
}: {
	lng: string;
	srch: string;
	invBg?: boolean;
}) {
	const { t } = useTranslation(lng, 'horiz-scroll');

	const searchContainerRef = useRef<HTMLDivElement>(null);

	const [search, setSearch] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [areProductsLoading, setAreProductsLoading] = useState<boolean>(true);
	const [areFilesLoading, setAreFilesLoading] = useState<boolean>(true);

	const [products, setProducts] = useState<IProduct[]>([]);

	const [sleeveCheck, setSleeveCheck] = useState<boolean>(false);

	const [files, setFiles] = useState<ProductFile[]>([]);
	const [fileCat, setFileCat] = useState<string>('');

	const sleeveText = t('sleeveSearchText');

	useEffect(() => {
		if (!areFilesLoading && !areProductsLoading) {
			setIsLoading(false);
		}
	}, [areFilesLoading, areProductsLoading]);

	useEffect(() => {
		let timeoutId: NodeJS.Timeout | null = null;

		const fetchResutls = async () => {
			setSleeveCheck(false);
			setIsLoading(true);
			setAreFilesLoading(true);
			setAreProductsLoading(true);
			if (search && search.length > 1) {
				productService.getProducts(lng, search).then((result) => {
					if (result) {
						const filteredResult = result
							.filter(
								(item) =>
									item.productCategories[0]?.id === 1 ||
									item.productCategories[0]?.id === 3
							)
							.reverse();

						setProducts(filteredResult);
						const searchLower = search.toLowerCase();
						const sleeveWords = sleeveText.toLowerCase().split(/\s+/);
						const isInSleeves = sleeveWords.some((word) => word.includes(searchLower));

						if (isInSleeves) {
							setSleeveCheck(isInSleeves);
						} else {
							setSleeveCheck(isInSleeves);
						}
						setAreProductsLoading(false);
					} else {
						setProducts([]);
						setAreProductsLoading(false);
					}
				});

				const resourcesCatIds: number[] = [4, 2, 6, 9, 3, 8, 7];
				const checkedSearch = `${search == 'cad' ? 'cad dxf stf' : search}`;
				fileService
					.getFilesByCategory(resourcesCatIds, lng, checkedSearch)
					.then((result) => {
						if (result) {
							setFiles(result);
							setAreFilesLoading(false);
						} else {
							setFiles([]);
							setAreFilesLoading(false);
						}
					});
				checkCategoryMatch(search);
			}
		};

		const handleSearch = () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
			timeoutId = setTimeout(() => {
				fetchResutls();
				timeoutId = null;
			}, 250);
		};

		if (search) {
			handleSearch();
		}

		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [search]);

	const handleOutsideClick = (event: MouseEvent) => {
		if (
			searchContainerRef.current &&
			!searchContainerRef.current.contains(event.target as Element)
		) {
			setSearch('');
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleOutsideClick);
		return () => document.removeEventListener('mousedown', handleOutsideClick);
	}, []);

	const categories: [string, string][] = [
		[t('brochure'), '3'],
		[t('videos'), '2'],
		[t('dataSheets'), '8'],
		[t('cads'), '7'],
		[t('parts'), '9'],
		[t('instructions'), '6'],
		[t('manufacturer'), '4'],
	];

	const [catMatch, setCatMatch] = useState<[string, string][]>([]);

	const checkCategoryMatch = (input: string) => {
		const normalizedInput = input.toLowerCase();

		// Find all categories where either the input contains the category, or the category contains the input
		const matchedCategories = categories.filter(
			(cat) =>
				normalizedInput.includes(cat[0].toLowerCase()) ||
				cat[0].toLowerCase().includes(normalizedInput)
		);

		if (matchedCategories.length > 0) {
			setCatMatch(matchedCategories);
		} else {
			setCatMatch([]);
		}
	};

	return (
		<div
			ref={searchContainerRef}
			className="col-span-11 rounded  transition  ease-in-out max-laptop:flex max-laptop:items-center laptop:text-[0.6rem]   laptop-xl:text-sm laptop-xl-extra:text-base"
			suppressHydrationWarning={true}
		>
			<input
				type="text"
				value={search}
				onChange={({ target: { value } }) => {
					setSleeveCheck(false);
					setProducts([]);
					setSearch(value);
				}}
				placeholder={srch}
				className={`${invBg ? 'text-[#F7F7F7]' : 'text-[#0F0F0F]'} w-full bg-transparent outline-none`}
			/>
			{search.length > 1 ? (
				<ul
					className={`absolute left-0 z-50 max-h-[80vh] w-full space-y-5 self-start overflow-scroll overflow-x-clip border ${invBg ? 'border-[#F7F7F7]' : 'border-[#0F0F0F]'} ${invBg ? 'bg-[#0F0F0F]' : 'bg-[#F7F7F7]'}  px-5 py-3 max-laptop:top-full`}
				>
					{products.length > 0 ||
					sleeveCheck ||
					files.length > 0 ||
					catMatch.length > 0 ? (
						<>
							{products.length > 0 &&
								products.map((product, idx) =>
									product.productCategories[0].id === 1 ? (
										<li
											key={`search-item-${product.id}`}
											onClick={() => setSearch('')}
										>
											<Link
												href={`/${lng}/product/pinch-valves/${product.id}`}
												className="transition ease-in-out hover:opacity-80"
												suppressHydrationWarning={true}
											>
												<div
													className={`flex flex-row items-center justify-between ${invBg ? '' : ''} border-b border-[#C8C8C8]  px-2 pb-4 `}
												>
													<div className="flex flex-col pr-4">
														<h3
															className={`font-medium ${invBg ? 'text-[#F7F7F7]' : 'text-[#0F0F0F]'} ${tStyles.cat2}`}
														>
															{t('series')} {product.series}
														</h3>
														<p
															className={`${tStyles.cat3} line-clamp-3 font-light ${invBg ? 'text-[#F7F7F7]' : 'text-[#0F0F0F]'}`}
														>
															{product.heading}
														</p>
													</div>
													{invBg ? (
														<Image
															src={ArrowInv}
															alt="Button"
															className="w-[10vw] hover:scale-105 max-laptop:min-w-[48px] laptop:w-[5vw]"
														/>
													) : (
														<Image
															src={Arrow}
															alt="Button"
															className="w-[10vw] hover:scale-105 max-laptop:min-w-[48px] laptop:w-[5vw]"
														/>
													)}
												</div>
											</Link>
										</li>
									) : (
										<li
											key={`search-item-${product.id}`}
											onClick={() => setSearch('')}
										>
											<Link
												href={`/${lng}/products/controls`}
												className="transition ease-in-out hover:opacity-80"
												suppressHydrationWarning={true}
											>
												<div
													className={`flex flex-row items-center justify-between border-b border-[#C8C8C8] px-2 pb-4`}
												>
													<div className="flex items-center">
														<h3
															className={`font-medium ${invBg ? 'text-[#F7F7F7]' : 'text-[#0F0F0F]'} ${tStyles.cat2}`}
														>
															{product.heading}
														</h3>
													</div>
													{invBg ? (
														<Image
															src={ArrowInv}
															alt="Button"
															className="w-[10vw] hover:scale-105 max-laptop:min-w-[48px] laptop:w-[5vw]"
														/>
													) : (
														<Image
															src={Arrow}
															alt="Button"
															className="w-[10vw] hover:scale-105 max-laptop:min-w-[48px] laptop:w-[5vw]"
														/>
													)}
												</div>
											</Link>
										</li>
									)
								)}
							{search.length > 1 && sleeveCheck && !isLoading && (
								<li key={`sleeve`} onClick={() => setSearch('')}>
									<Link
										href={`/${lng}/products/sleeves`}
										className="transition ease-in-out hover:opacity-80"
										suppressHydrationWarning={true}
									>
										<div
											className={`flex flex-row items-center justify-between border-b border-[#C8C8C8]  px-2 pb-4`}
										>
											<div className="flex items-center">
												<h3
													className={`font-medium ${invBg ? 'text-[#F7F7F7]' : 'text-[#0F0F0F]'} ${tStyles.cat2}`}
												>
													{t('spareSleeves')}
												</h3>
											</div>
											<Image
												src={Arrow}
												alt="Button"
												className="w-[10vw] hover:scale-105 max-laptop:min-w-[48px] laptop:w-[5vw]"
											/>
										</div>
									</Link>
								</li>
							)}
							{catMatch.length > 0 &&
								catMatch.map((cat, idx) => (
									<li key={cat[0] + idx} onClick={() => setSearch('')}>
										<Link
											href={`/${lng}/${lng in routeTranslations ? routeTranslations[lng as keyof typeof routeTranslations].resources : 'resources'}?searchTerm=${cat[1]}`}
											className="transition ease-in-out hover:opacity-80"
											suppressHydrationWarning={true}
										>
											<div
												className={`flex flex-row items-center justify-between border-b border-[#C8C8C8]  px-2 pb-4`}
											>
												<div className="flex items-center">
													<h3
														className={`font-medium ${invBg ? 'text-[#F7F7F7]' : 'text-[#0F0F0F]'} ${tStyles.cat2}`}
													>
														{cat[0]}
													</h3>
												</div>
												<Image
													src={Arrow}
													alt="Button"
													className="w-[10vw] hover:scale-105 max-laptop:min-w-[48px] laptop:w-[5vw]"
												/>
											</div>
										</Link>
									</li>
								))}
							{files.length > 0 &&
								files.map((file, idx) => (
									<li
										key={`search-item-${file.id}`}
										onClick={() => setSearch('')}
									>
										<Link
											href={
												file.fileCategoryId == '7'
													? (() => {
															const match =
																file.fileName.match(
																	/serie[_\s]?(\d+)/i
																);
															const serieNumber = match
																? match[1]
																: ''; // Safely extract the number or default to an empty string
															return `/${lng}/${lng in routeTranslations ? routeTranslations[lng as keyof typeof routeTranslations].resources : 'resources'}?searchTerm=${file.fileCategoryId}&ser=${serieNumber}`;
														})()
													: `/${lng}/${lng in routeTranslations ? routeTranslations[lng as keyof typeof routeTranslations].resources : 'resources'}?searchTerm=${file.fileCategoryId}`
											}
											className="transition ease-in-out hover:opacity-80"
											suppressHydrationWarning={true}
										>
											<div
												className={`flex flex-row items-center justify-between border-b border-[#C8C8C8]  px-2 pb-4`}
											>
												<div className="flex flex-col pr-4">
													<h3
														className={`font-medium ${invBg ? 'text-[#F7F7F7]' : 'text-[#0F0F0F]'} ${tStyles.cat2}`}
													>
														{file.fileCategoryId == '8'
															? `${file.title
																	.replace(/_/g, ' ')
																	.replace(/^\w/, (c) =>
																		c.toUpperCase()
																	)}`
															: file.fileCategoryId == '7'
																? (() => {
																		// Regex to find "serie" followed by a number
																		const serieNumberMatch =
																			file.fileName.match(
																				/serie[_\s]?(\d+)/i
																			);
																		// If a match is found, extract and display the number
																		return serieNumberMatch
																			? `${t('serie').charAt(0).toUpperCase() + t('serie').slice(1)} ${serieNumberMatch[1]} - ${file.title}`
																			: '';
																	})()
																: `${file.title}`}
													</h3>
													<p
														className={`${tStyles.cat3} line-clamp-3 font-light ${invBg ? 'text-[#F7F7F7]' : 'text-[#0F0F0F]'}`}
													>
														{file.fileCategoryId == '3' &&
															t('brochure')}
														{file.fileCategoryId == '2' && t('videos')}
														{file.fileCategoryId == '8' &&
															t('dataSheets')}
														{file.fileCategoryId == '7' && t('cads')}
														{file.fileCategoryId == '9' && t('parts')}
														{file.fileCategoryId == '6' &&
															t('instructions')}
														{file.fileCategoryId == '4' &&
															t('manufacturer')}
													</p>
												</div>
												<Image
													src={Arrow}
													alt="Button"
													className="w-[10vw] hover:scale-105 max-laptop:min-w-[48px] laptop:w-[5vw]"
												/>
											</div>
										</Link>
									</li>
								))}
						</>
					) : isLoading ? (
						<>Loading...</>
					) : (
						<li className="${invBg?'text-[#F7F7F7]':'text-[#0F0F0F]'} text-base font-light">
							{t('noData')}
						</li>
					)}
				</ul>
			) : null}
		</div>
	);
}
