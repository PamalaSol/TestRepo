'use client';

import Link from 'next/link';
import Image from 'next/image';

import { useEffect, useRef, useState } from 'react';
import FAQList from '@/app/[lng]/_components/FAQList';
import Footer from '@/app/[lng]/_components/Footer';
import { ProductFile, productService } from '@/app/[lng]/_services/products';
import { IProduct } from '@/app/[lng]/_services/products';
import { ToastContainer, toast } from 'react-toastify';
import { series, toastDefaultOptions } from '@/lib/utils';
import { IProductCategory, productCategoryService } from '@/app/[lng]/_services/productCategory';
import Sleeves from '@/app/[lng]/_components/Sleeves';
import { useTranslation } from '@/app/i18n/client';
import { routeTranslations, fallbackLng } from '@/app/i18n/settings';
import { productOrder } from '../../_interfaces/interfaces';
import { PinchValvesRedefined } from '../../_components/PinchValvesRedefined';
import { ElevateFluidControl } from '../../_components/ElevateFluidControl';
import ProductsSkeleton from '../../_components/ProductsSkeleton';
import ControlsSkeleton from '../../_components/ControlsSkeleton';
import tStyles from '@/app/[lng]/textSizes.module.css';
import WhyHomaticNew from '../../_components/WhyHomaticNew';
import ShortBorder from '../../_components/ShortBorder';
import GrayArrow from '@/public/assets/grey-arrow.svg';
import BlueArrow from '@/public/assets/blue-arrow.svg';
import { fileService, resourcesCatIds } from '../../_services/files';
import { isIOS, isMobile, isMobileSafari, isSafari } from 'react-device-detect';
import { usePathname } from 'next/navigation';
import { slugify } from '../../_utils/slugify';

interface CadPairs {
	dxf?: ProductFile;
	stp?: ProductFile;
}

export default function ProductsCategory({
	params: { lng },
	params,
}: {
	params: { category: string; lng: string };
}) {
	// Get the English version of the category for internal use
	const category = params.category;
	const { t } = useTranslation(lng, 'products');

	// Map localized category back to English version for internal API calls
	const getEnglishCategory = (localizedCategory: string): string => {
		// Create reverse mapping for this language
		const reverseMappings = Object.entries(
			(routeTranslations[lng as keyof typeof routeTranslations] || {}) as Record<
				string,
				string
			>
		).reduce(
			(acc, [canonical, localized]) => {
				acc[localized] = canonical;
				return acc;
			},
			{} as Record<string, string>
		);

		// Check if this is already an English category
		if (['pinch-valves', 'controls', 'sleeves'].includes(localizedCategory)) {
			return localizedCategory;
		}

		// If it's a localized version, return the English equivalent
		return reverseMappings[localizedCategory] || localizedCategory;
	};

	// Get the canonical English category for internal use
	const englishCategory = getEnglishCategory(category);

	const baseUrl = process.env.NEXT_PUBLIC_GENERAL_URL;
	useEffect(() => {
		// Only push for pinch-valves category
		if (englishCategory === 'pinch-valves') {
			// Get product data from your state or fetch it here
			const fetchDataAndPushToDataLayer = async () => {
				try {
					// Fetch your products data

					const products = await productService.getProductsByCategory(1, params.lng);

					// Prepare the product data in a simplified format for the data layer
					const productData = products
						.map((product) => {
							const imageIndex = product.dataImages.findIndex(
								(img) =>
									Number(img.fileCategoryId) === 1 &&
									img.fileName.includes('copy')
							);

							const imageUrl =
								imageIndex >= 0
									? `${process.env.API_URL}/files/${product.dataImages[imageIndex].id}/${product.dataImages[imageIndex].fileName}`
									: null;

							return {
								id: product.id,
								series: product.series,
								seriesTranslated: `${t('series')} ${product.series}`,
								imageUrl: imageUrl,
								productUrl: `${baseUrl}/${params.lng}/product/${product.id}`,
							};
						})
						.filter((product) => product.imageUrl !== null);

					// Push to dataLayer
					window.dataLayer = window.dataLayer || [];
					window.dataLayer.push({
						event: 'productListView',
						productCategory: englishCategory,
						products: productData,
						baseUrl: window.location.origin,
						language: lng,
					});
				} catch (error) {
					console.error('Error pushing to dataLayer:', error);
				}
			};

			fetchDataAndPushToDataLayer();
		}
	}, [englishCategory, lng]);

	const unusedFeatures = false;

	let allSizes: string[] = [];
	series.map((serie) => {
		allSizes = allSizes.concat(
			serie.dm.map((size) => {
				const sizeParts = size.split('.');
				if (sizeParts.length) {
					return sizeParts[0];
				}
				return size;
			})
		);
	});
	const sizes = Array.from(new Set(allSizes)).sort();

	const connections: string[] = [
		t('Tri-Clamp'),
		t('Flange'),
		t('Threaded Cover'),
		t('O-Ring'),
		t('Screw Connection'),
		t('Clamping Cone'),
		t('Clamping Ring'),
		t('Threaded Ring'),
		t('Threaded Cap'),
	];
	const housings: string[] = [
		t('POM white / POM-ELS'),
		t('Aluminium'),
		t('Cast aluminum'),
		t('Stainless steel'),
		t('Alu6026'),
	];

	let allSleeveQualities: string[] = [];
	series.map((serie) => {
		allSleeveQualities = allSleeveQualities.concat(
			serie.qualities.map((quality) => quality.name)
		);
	});
	const sleeveQualities: string[] = Array.from(new Set(allSleeveQualities)).sort();

	const [size, setSize] = useState<string>('');
	const [connection, setConnection] = useState<string>('');
	const [housingMaterial, setHousingMaterial] = useState<string>('');
	const [sleeveQuality, setSleeveQuality] = useState<string>('');
	const [search, setSearch] = useState<string>('');

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isLoadingCat, setIsLoadingCat] = useState<boolean>(true);
	const [products, setProducts] = useState<IProduct[]>([]);
	const [categories, setCategories] = useState<IProductCategory | undefined>(undefined);

	const [transformItem, setTransformItem] = useState<{
		css: string;
		idx?: number;
		item?: string;
	}>({
		css: '',
		idx: 0,
	});

	useEffect(() => {
		const fetchProducts = async () => {
			setIsLoading(true);
			let searchParams: Record<string, string> = {};
			if (connection) {
				searchParams['Connection'] = connection;
			}
			if (housingMaterial) {
				searchParams['HousingMaterial'] = housingMaterial;
			}
			if (search) {
				searchParams['SearchTerm'] = search;
			}
			productService
				.getProductsByCategory(
					englishCategory === 'pinch-valves'
						? 1
						: englishCategory === 'sleeves'
							? 2
							: englishCategory === 'controls'
								? 3
								: 1,
					lng,
					searchParams
				)
				.then((result) => {
					let filteredProducts = result;

					if (size) {
						const sizeFilter = size + '.';
						filteredProducts = result.filter((product) =>
							series.some(
								(serie) =>
									serie.seriesNum === product.series &&
									serie.dm.includes(sizeFilter)
							)
						);
					}

					if (sleeveQuality) {
						filteredProducts = filteredProducts.filter((product) =>
							series.some(
								(serie) =>
									serie.seriesNum === product.series &&
									(serie.qualities.some(
										(quality) => quality.name === sleeveQuality
									) ||
										(serie.v2Qualities
											? serie.v2Qualities.some(
													(v2Quality) => v2Quality.name === sleeveQuality
												)
											: false))
							)
						);
					}

					setProducts(filteredProducts.reverse());
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
		const fetchCategory = async () => {
			setIsLoadingCat(true);
			productCategoryService
				.getCategory(
					englishCategory === 'pinch-valves'
						? 1
						: englishCategory === 'sleeves'
							? 2
							: englishCategory === 'controls'
								? 3
								: 1,
					lng
				)
				.then((result) => {
					setCategories(result.data);
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
					setIsLoadingCat(false);
				});
		};
		fetchCategory();
		fetchProducts();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [englishCategory, size, connection, housingMaterial, sleeveQuality, search]);

	const extractImageData = (dataImages: ProductFile[]) => {
		for (let i = 0; i < dataImages.length; i++) {
			if (dataImages[i].fileCategoryId == '1' && dataImages[i].fileName.includes('copy')) {
				return i;
			}
		}

		return -1;
	};
	const extractControlImageData = (dataImages: ProductFile[]) => {
		for (let i = 0; i < dataImages.length; i++) {
			if (dataImages[i].fileCategoryId == '1') {
				return i;
			}
		}

		return -1;
	};

	const extractThumbnailImageData = (dataImages: ProductFile[]) => {
		for (let i = 0; i < dataImages.length; i++) {
			if (dataImages[i].fileCategoryId == '10') {
				return i;
			}
		}
		return -1;
	};

	const addToCart = (
		imgString: string,
		orderNo: string,
		amount: number,
		category: string,
		extraReq: string
	) => {
		const ls = localStorage.getItem('orders');
		let newOrder: productOrder = {
			imgString: imgString,
			orderNo: orderNo,
			sleeveNo: '',
			amount: amount,
			category: category,
			extraReq: extraReq,
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
	};

	const [insm, setInsm] = useState<ProductFile | null>(null);
	const [servInstructions, setServInstructions] = useState<ProductFile | null>(null);
	const [instructions41, setInstruction41] = useState<ProductFile[]>([]);
	const [video, setVideo] = useState<ProductFile | null>(null);
	const [spareP, setSpareP] = useState<ProductFile | null>(null);
	const [brochure, setBrochure] = useState<ProductFile | null>(null);
	const [cadFiles, setCadFiles] = useState<CadPairs[]>([]);
	const [otherCadFiles, setOtherCadFiles] = useState<ProductFile[] | null>(null);
	const [dataSheets, setDataSheets] = useState<ProductFile | null>(null);

	const cleanupProductDownloads = () => {
		setInsm(null);
		setServInstructions(null);
		setInstruction41([]);
		setVideo(null);
		setSpareP(null);
		setBrochure(null);
		setCadFiles([]);
		setOtherCadFiles(null);
		setDataSheets(null);
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

	const [isLoadingDownloads, setIsLoadingDownloads] = useState<boolean>(true);
	const getDownloads = (prod: IProduct) => {
		setIsLoadingDownloads(true);
		setCadFiles(createProductCadsData(prod));
		const fetchResources = async (product: IProduct) => {
			fileService
				.getFilesByCategory(resourcesCatIds, lng)
				.then((result) => {
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
				})
				.catch((error: any) => {
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
					setIsLoadingDownloads(false);
				});
		};
		fetchResources(prod);
	};

	const url = process.env.GENERAL_URL;
	const apiUrl = process.env.API_URL;

	const [currProdHover, setCurrProdHover] = useState<IProduct | null>(null);
	const [mouseInButton, setMouseInButton] = useState<boolean>(true);
	const [isHoveringProduct, setIsHoveringProduct] = useState<boolean>(false);
	const [downloadsOpen, setDownloadsOpen] = useState<boolean>(false);

	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(event: TouchEvent) {
			if (
				downloadsOpen &&
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setDownloadsOpen(false);
			}
		}

		// Listen for both touchstart and mousedown events
		document.addEventListener('touchstart', handleClickOutside);

		return () => {
			document.removeEventListener('touchstart', handleClickOutside);
		};
	}, [downloadsOpen]);

	useEffect(() => {
		if (mouseInButton || isHoveringProduct) {
		} else {
			setCurrProdHover(null);
			cleanupProductDownloads();
		}
	}, [mouseInButton, isHoveringProduct]);

	const [isSaf, setIsSaf] = useState<boolean>(false);

	useEffect(() => {
		if (isSafari || isIOS || isMobile || isMobileSafari) {
			setIsSaf(true);
		}
	}, []);

	const pathname = usePathname();

	useEffect(() => {
		// Intersection Observer callback
		const handleIntersection = (entries: IntersectionObserverEntry[]) => {
			entries.forEach((entry) => {
				const isVisible = entry.isIntersecting;

				if (entry.target.id === 'cont2') {
					if (isVisible) {
						// Entering the element, dispatch toBlack
						window.dispatchEvent(new Event('toBlack'));
					} else {
						// Exiting the element, dispatch toWhite
						window.dispatchEvent(new Event('toWhite'));
					}
				}
			});
		};

		const observerOptions: IntersectionObserverInit = {
			root: null,
			threshold: 0,
			rootMargin: '0px 0px -100% 0px',
		};
		// Create the observer
		const observer = new IntersectionObserver(handleIntersection, observerOptions);

		// Get the element to observe
		const cont2Element = document.querySelector('#cont2');

		// Type-check if element exists before observing
		if (cont2Element) observer.observe(cont2Element);

		return () => observer.disconnect();
	}, [pathname]);

	const header = (
		<div className="mb-20 mt-4 grid w-full grid-cols-11 gap-x-2 px-4 py-6 max-laptop:mt-8">
			<div className="col-span-11 lg:col-span-6"></div>
			<div
				className="col-span-11 grid-cols-12 lg:col-span-5 lg:grid-cols-6"
				onPointerEnter={() => {
					setTransformItem({
						css: 'animate-pulse ',
						item: 'header',
					});
				}}
				onPointerLeave={() => {
					setTransformItem({ css: '', idx: 0, item: '' });
				}}
			>
				<h1 className={`pb-3 ${tStyles.cat1}`}>{categories?.name}</h1>
				<p className={tStyles.cat3}>{categories?.description}</p>

				<div className="flex flex-row justify-end">
					<Link
						href={`/${lng}/${t('contact')}`}
						className={`mt-2 flex gap-3 whitespace-nowrap text-[#306abf] transition ease-in-out hover:opacity-80 ${tStyles.cat3} ${transformItem.item === 'header' ? `${transformItem.css}` : ''}`}
					>
						{t('contact')}
						<Image
							src={BlueArrow}
							height={500}
							width={500}
							alt="arrow"
							className={`h-auto w-auto`}
						/>
					</Link>
				</div>
			</div>
		</div>
	);

	const pinchValveSection = (
		<>
			<div className="mb-2 grid w-full grid-cols-11 gap-x-2 px-4">
				<div className="col-span-11 flex w-full lg:col-span-6">
					<div className="grid h-fit w-full grid-cols-12 gap-2 self-end laptop:text-xs laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-base">
						<div className="relative col-span-12 grid-cols-3 border-b border-b-[#0F0F0F] tablet:col-span-3">
							<select
								value={size}
								onChange={({ target: { value } }) => setSize(value)}
								className="w-full appearance-none bg-transparent py-1 text-[#8B8B8B] outline-none"
							>
								<option key={'select-size'} value={''}>
									{t('selectSize')}
								</option>
								{sizes.map((item, idx) => (
									<option key={`size-${idx}-${item}`} value={item}>
										{item}
									</option>
								))}
							</select>
							<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
								<svg
									className="h-4 w-4 text-gray-700"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 9l-7 7-7-7"
									></path>
								</svg>
							</div>
						</div>
						<div className="relative col-span-12 grid-cols-3 border-b border-b-[#0F0F0F] tablet:col-span-3">
							<select
								value={connection}
								onChange={({ target: { value } }) => setConnection(value)}
								className="w-full appearance-none bg-transparent py-1 text-[#8B8B8B] outline-none"
							>
								<option key={'select-connection'} value={''}>
									{t('selConnection')}
								</option>
								{connections.map((item, idx) => (
									<option key={`connection-${idx}-${item}`} value={item}>
										{item}
									</option>
								))}
							</select>
							<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
								<svg
									className="h-4 w-4 text-gray-700"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 9l-7 7-7-7"
									></path>
								</svg>
							</div>
						</div>
						<div className="relative col-span-12 grid-cols-3 border-b border-b-[#0F0F0F] tablet:col-span-3">
							<select
								value={housingMaterial}
								onChange={({ target: { value } }) => setHousingMaterial(value)}
								className="w-full appearance-none bg-transparent py-1 text-[#8B8B8B] outline-none"
							>
								<option key={'select-housing-material'} value={''}>
									{t('selhousingMat')}
								</option>
								{housings.map((item, idx) => (
									<option key={`hm-${idx}-${item}`} value={item}>
										{item}
									</option>
								))}
							</select>
							<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
								<svg
									className="h-4 w-4 text-gray-700"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 9l-7 7-7-7"
									></path>
								</svg>
							</div>
						</div>
						<div className="relative col-span-12 grid-cols-3 border-b border-b-[#0F0F0F] tablet:col-span-3">
							<select
								value={sleeveQuality}
								onChange={({ target: { value } }) => setSleeveQuality(value)}
								className="w-full appearance-none bg-transparent py-1 text-[#8B8B8B] outline-none"
							>
								<option key={'select-sleeve-quality'} value={''}>
									{t('selQuality')}
								</option>
								{sleeveQualities.map((item, idx) => (
									<option key={`quality-${idx}-${item}`} value={item}>
										{item}
									</option>
								))}
							</select>
							<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
								<svg
									className="h-4 w-4 text-gray-700"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 9l-7 7-7-7"
									></path>
								</svg>
							</div>
						</div>
					</div>
				</div>
				<div className="laptop-xl-extra:texs-base col-span-11 flex h-full w-full justify-between border-b border-b-[#0F0F0F] outline-none lg:col-span-5 laptop:text-xs laptop-l:text-xs laptop-xl:text-sm">
					<input
						type="text"
						value={search}
						onChange={({ target: { value } }) => setSearch(value)}
						placeholder={t('search')}
						className="w-full self-end bg-transparent py-1 pb-1 outline-none"
					/>
					<Image src={GrayArrow} alt="arrow" className="w-[4%]" />
				</div>
			</div>
			{isLoading ? (
				<div>
					<ProductsSkeleton />
				</div>
			) : (
				<div
					className={`relative flex w-full flex-col px-4 laptop:grid laptop:auto-rows-auto laptop:grid-cols-11`}
				>
					<div className="absolute left-[54.45%] z-10 h-full w-[1px] bg-[#C8C8C8] max-laptop:hidden"></div>
					{products?.map((product, idx) => {
						const isHovered = currProdHover?.id === product.id;
						const desktopLayout = (
							<>
								<div
									className={`relative m-0 grid h-full grid-cols-10 p-0 pb-3 max-laptop:hidden`}
								>
									<div
										onMouseEnter={() => {
											setMouseInButton(true);
											setCurrProdHover(product);
											getDownloads(product);
										}}
										onMouseLeave={() => {
											setMouseInButton(false);
										}}
										className="absolute right-0 top-5"
									>
										<Image
											src="/assets/products/file-hover-icon.svg"
											alt="Button"
											width={48}
											height={48}
											priority
											className={`h-[48px] w-[48px] transition ease-in-out hover:opacity-80`}
										/>
										{isHovered && (
											<div
												className={`absolute right-full top-0 z-20 mt-1 h-fit w-[23vw] border-2 border-[#4877C4] bg-white text-[#306abf] ${tStyles.cat3}`}
												onMouseEnter={() => {
													setIsHoveringProduct(true);
												}}
												onMouseLeave={() => {
													setIsHoveringProduct(false);
												}}
											>
												<div
													className={`flex ${isSaf ? 'h-fit' : 'h-full w-full'} flex-col gap-1 p-4`}
												>
													<p className={`${tStyles.cat1} text-[#0F0F0F]`}>
														{isLoadingDownloads
															? `Loading...`
															: `Downloads`}
													</p>
													{dataSheets && (
														<Link
															className={`flex ${isLoadingDownloads ? 'hidden' : ''} w-full flex-row items-center justify-between transition ease-in-out hover:opacity-80`}
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
															className={`flex ${isLoadingDownloads ? 'hidden' : ''} w-full flex-row items-center justify-between transition ease-in-out hover:opacity-80`}
															href={`${apiUrl}/files/${spareP?.id}/${spareP?.fileName}`}
															target="_blank"
															rel="noopener noreferrer"
														>
															{`${t('parts')} ${lng == 'en-US' ? spareP?.title.toLowerCase() : spareP?.title}`}
														</Link>
													)}
													{brochure && (
														<Link
															className={`flex ${isLoadingDownloads ? 'hidden' : ''} w-full flex-row items-center justify-between transition ease-in-out hover:opacity-80`}
															href={`${apiUrl}/files/${brochure?.id}/${brochure?.fileName}`}
															target="_blank"
															rel="noopener noreferrer"
														>
															{brochure?.title}
														</Link>
													)}
													{insm && (
														<Link
															className={`flex ${isLoadingDownloads ? 'hidden' : ''} w-full flex-row items-center justify-between transition ease-in-out hover:opacity-80`}
															href={`${apiUrl}/files/${insm?.id}/${insm?.fileName}`}
															target="_blank"
															rel="noopener noreferrer"
														>
															{insm?.title}
														</Link>
													)}
													{servInstructions &&
														!(currProdHover?.series == '41') && (
															<Link
																key={servInstructions.id}
																className={`flex ${isLoadingDownloads ? 'hidden' : ''} w-full flex-row items-center justify-between transition ease-in-out hover:opacity-80`}
																href={`${apiUrl}/files/${servInstructions.id}/${servInstructions.fileName}`}
																target="_blank"
																rel="noopener noreferrer"
															>
																{t('servInst')}
															</Link>
														)}
													{currProdHover?.series == '41' &&
														instructions41 &&
														instructions41.map((file, idx) => (
															<Link
																key={file.id}
																className={`flex ${isLoadingDownloads ? 'hidden' : ''} w-full flex-row items-center justify-between transition ease-in-out hover:opacity-80`}
																href={`${apiUrl}/files/${file.id}/${file.fileName}`}
																target="_blank"
																rel="noopener noreferrer"
															>
																{file.title}
															</Link>
														))}
													{video && (
														<Link
															className={`flex ${isLoadingDownloads ? 'hidden' : ''} w-full flex-row items-center justify-between transition ease-in-out hover:opacity-80`}
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
																className={`${tStyles.cat4} mt-3 font-light text-[#0F0F0F] ${isLoadingDownloads ? 'hidden' : ''}`}
															>
																{t('cads')}
															</p>
															{cadFiles.map(
																(filePair, idx) =>
																	(filePair.dxf ||
																		filePair.stp) && ( // Wrap in parentheses for clarity
																		<div
																			className={`grid grid-cols-12 ${isLoadingDownloads ? 'hidden' : ''} gap-3`}
																			key={`${idx} ${filePair.dxf ? 'dxf' : 'stp'}`}
																		>
																			<p
																				className={`col-span-6 text-[#0F0F0F] laptop-l:col-span-4 laptop-xl+:col-span-3`}
																			>{`${filePair.dxf?.title || filePair.stp?.title}`}</p>{' '}
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
															{otherCadFiles?.map((file, idx) => (
																<div
																	className={`grid grid-cols-12 ${isLoadingDownloads ? 'hidden' : ''} w-full items-center justify-start`}
																	key={file.id}
																>
																	<p
																		className={`col-span-4 w-fit whitespace-nowrap text-[#0F0F0F] laptop-l:col-span-3 laptop-xl+:col-span-1`}
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
											</div>
										)}
									</div>
									<div
										className={`col-span-9 flex flex-col justify-between ${idx % 2 === 0 ? '' : 'laptop:pl-1'}`}
									>
										<div>
											<Link
												href={`/${lng}/${t('product')}/${product.id}`}
												className="row-span-2 flex w-full justify-center"
											>
												<picture className="lg:w-[30vw]">
													<img
														src={`${process.env.API_URL}/files/${product.dataImages[extractImageData(product.dataImages)]?.id}/${product.dataImages[extractImageData(product.dataImages)]?.fileName}`}
														alt={`Products series ${product.dataImages[extractImageData(product.dataImages)]?.alt ?? product.series}`}
														className="max-laptop:px-7"
													/>
												</picture>
											</Link>
											<div
												className={`flex flex-col gap-2 self-start laptop:${idx % 2 === 0 ? 'w-[80%]' : 'w-[90%]'}`}
											>
												<p className={`${tStyles.cat1}`}>
													{' '}
													{t('series')} {product.series}
													<span className={`${tStyles.cat1} font-light`}>
														: {product.nominalWidth}
													</span>
												</p>

												<p
													className={`laptop:leading-0 break-words text-justify text-[#B2B2B2] laptop-l:leading-[1.2rem] ${tStyles.productDescExtra}`}
												>
													{product.heading}
												</p>
											</div>
										</div>
										<div className="overwlow-clip self-start">
											<p
												className={`line-clamp-1 text-[#4877C4] ${tStyles.industries}`}
											>
												{`${t('suitable')}`}
												{product.industries}
											</p>
										</div>
									</div>

									<div
										className={`col-span-1 flex h-full flex-col items-end justify-end px-1`}
									>
										<Link
											href={`/${lng}/${t('product')}/${product.id}`}
											className=""
										>
											<Image
												src="/assets/small-button.svg"
												alt="Button"
												width={53}
												height={53}
												priority
												className={`${transformItem.idx === idx ? `${transformItem.css}` : ''} h-[40px] w-[40px] transition ease-in-out hover:opacity-80`}
											/>
										</Link>
									</div>
								</div>
							</>
						);

						const mobileLayout = (
							<>
								<div className={`flex flex-col laptop:hidden`}>
									<div className={`flex h-fit w-full items-end`}>
										<div className="flex h-fit w-full items-center justify-end">
											<div
												onClick={() => {
													setDownloadsOpen((prev) => !prev);
													setCurrProdHover(product);
													getDownloads(product);
												}}
												className="relative"
											>
												<Image
													src="/assets/products/file-hover-icon.svg"
													alt="Button"
													width={53}
													height={53}
													priority
													className={`-mr-[4px] h-[48px] w-[48px] transition ease-in-out hover:opacity-80`}
												/>
												{downloadsOpen && isHovered && (
													<div
														ref={dropdownRef}
														className={`absolute right-full top-0 z-50 mt-1 h-fit w-[75vw] border-2 border-[#4877C4] bg-white text-[#306abf] mobile-m:w-[78vw] mobile-l:w-[80vw] ${tStyles.cat3}`}
													>
														<div
															className={`flex ${isSaf ? 'h-fit' : 'h-full w-full'} flex-col gap-1 p-4`}
														>
															<p
																className={`${tStyles.cat1} text-[#0F0F0F]`}
															>
																{isLoadingDownloads
																	? `Loading...`
																	: `Downloads`}
															</p>
															{dataSheets && (
																<Link
																	className={`flex ${isLoadingDownloads ? 'hidden' : ''} w-full flex-row items-center justify-between transition ease-in-out hover:opacity-80`}
																	href={`${apiUrl}/files/${dataSheets?.id}/${dataSheets?.fileName}`}
																	target="_blank"
																	rel="noopener noreferrer"
																>
																	{capitalizeTitle(
																		dataSheets?.title.replace(
																			/_/g,
																			' '
																		)
																	)}
																</Link>
															)}
															{spareP && (
																<Link
																	className={`flex ${isLoadingDownloads ? 'hidden' : ''} w-full flex-row items-center justify-between transition ease-in-out hover:opacity-80`}
																	href={`${apiUrl}/files/${spareP?.id}/${spareP?.fileName}`}
																	target="_blank"
																	rel="noopener noreferrer"
																>
																	{`${t('parts')} ${spareP?.title.toLowerCase()}`}
																</Link>
															)}
															{brochure && (
																<Link
																	className={`flex ${isLoadingDownloads ? 'hidden' : ''} w-full flex-row items-center justify-between transition ease-in-out hover:opacity-80`}
																	href={`${apiUrl}/files/${brochure?.id}/${brochure?.fileName}`}
																	target="_blank"
																	rel="noopener noreferrer"
																>
																	{brochure?.title}
																</Link>
															)}
															{insm && (
																<Link
																	className={`flex ${isLoadingDownloads ? 'hidden' : ''} w-full flex-row items-center justify-between transition ease-in-out hover:opacity-80`}
																	href={`${apiUrl}/files/${insm?.id}/${insm?.fileName}`}
																	target="_blank"
																	rel="noopener noreferrer"
																>
																	{insm?.title}
																</Link>
															)}
															{servInstructions &&
																!(
																	currProdHover?.series == '41'
																) && (
																	<Link
																		key={servInstructions.id}
																		className={`flex ${isLoadingDownloads ? 'hidden' : ''} w-full flex-row items-center justify-between transition ease-in-out hover:opacity-80`}
																		href={`${apiUrl}/files/${servInstructions.id}/${servInstructions.fileName}`}
																		target="_blank"
																		rel="noopener noreferrer"
																	>
																		{t('servInst')}
																	</Link>
																)}
															{currProdHover?.series == '41' &&
																instructions41 &&
																instructions41.map((file, idx) => (
																	<Link
																		key={file.id}
																		className={`flex ${isLoadingDownloads ? 'hidden' : ''} w-full flex-row items-center justify-between transition ease-in-out hover:opacity-80`}
																		href={`${apiUrl}/files/${file.id}/${file.fileName}`}
																		target="_blank"
																		rel="noopener noreferrer"
																	>
																		{file.title}
																	</Link>
																))}
															{video && (
																<Link
																	className={`flex ${isLoadingDownloads ? 'hidden' : ''} w-full flex-row items-center justify-between transition ease-in-out hover:opacity-80`}
																	href={video.alt}
																	target="_blank"
																	rel="noopener noreferrer"
																>
																	{video?.title}
																</Link>
															)}
															{(cadFiles.length > 0 ||
																otherCadFiles) && (
																<>
																	<p
																		className={`${tStyles.cat4} mt-3 font-light text-[#0F0F0F] ${isLoadingDownloads ? 'hidden' : ''}`}
																	>
																		{t('cads')}
																	</p>
																	{cadFiles.map(
																		(filePair, idx) =>
																			(filePair.dxf ||
																				filePair.stp) && ( // Wrap in parentheses for clarity
																				<div
																					className={`grid grid-cols-12 ${isLoadingDownloads ? 'hidden' : ''} gap-3`}
																					key={`${idx} ${filePair.dxf ? 'dxf' : 'stp'}`}
																				>
																					<p
																						className={`laptop-cl+:col-span-2 text-[#0F0F0F] max-laptop:col-span-5 mobile-m:col-span-4 laptop-l:col-span-2`}
																					>{`${filePair.dxf?.title || filePair.stp?.title}`}</p>{' '}
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
																								<p>
																									/
																								</p>
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
																	{otherCadFiles?.map(
																		(file, idx) => (
																			<div
																				className={`grid grid-cols-12 ${isLoadingDownloads ? 'hidden' : ''} w-full items-center justify-start`}
																				key={file.id}
																			>
																				<p
																					className={`col-span-4 w-fit whitespace-nowrap text-[#0F0F0F] mobile-m:col-span-3 tablet:col-span-2`}
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
																		)
																	)}
																</>
															)}
														</div>
													</div>
												)}
											</div>
										</div>
									</div>
									<Link
										href={`/${lng}/${t('product')}/${product.id}`}
										className="row-span-2 flex w-full justify-center"
									>
										<picture>
											{unusedFeatures && (
												<source
													srcSet={`${process.env.API_URL}/files/${product.dataImages[extractImageData(product.dataImages)]?.id}/${product.dataImages[extractImageData(product.dataImages)]?.fileName}`}
													type="image/webp"
												/>
											)}
											<img
												src={`${process.env.API_URL}/files/${product.dataImages[extractImageData(product.dataImages)]?.id}/${product.dataImages[extractImageData(product.dataImages)]?.fileName}`}
												alt={`Products series ${product.dataImages[extractImageData(product.dataImages)]?.alt ?? product.series}`}
												className="max-laptop:px-7"
											/>
										</picture>
									</Link>

									<div className={`flex flex-col gap-1`}>
										<div className="flex flex-col gap-3">
											<p className={`${tStyles.productTitle}`}>
												{' '}
												{t('series')} {product.series}
												<span
													className={`${tStyles.productTitle} font-light`}
												>
													: {product.nominalWidth}
												</span>
											</p>

											<p
												className={`text-justify leading-[14px] text-[#B2B2B2] ${tStyles.productDescExtra}`}
											>
												{product.heading}
											</p>
										</div>
										<div
											className={`flex h-fit w-full items-center justify-between`}
										>
											<p
												className={`line-clamp-1 text-[#4877C4] ${tStyles.productDesc}`}
											>
												{`${t('suitable')} `}
												{product.industries}
											</p>
											<Link
												href={`/${lng}/${t('product')}/${product.id}`}
												className=""
											>
												<Image
													src="/assets/small-button.svg"
													alt="Button"
													width={53}
													height={53}
													priority
													className={`${transformItem.idx === idx ? `${transformItem.css}` : ''} h-[40px] w-[40px] transition ease-in-out hover:opacity-80`}
												/>
											</Link>
										</div>
									</div>
								</div>
							</>
						);

						return (
							<div
								key={`product-item-series-${product.series}-${idx}`}
								className={`${idx % 2 === 0 ? 'laptop:col-span-6 laptop:pr-2' : 'laptop:col-span-5 laptop:pl-2 '}`}
								onPointerEnter={() => {
									if (window.matchMedia('(min-width: 1024px)').matches) {
										setTransformItem({ css: 'scale-110', idx: idx });
									}
								}}
								onPointerLeave={() => {
									if (window.matchMedia('(min-width: 1024px)').matches) {
										setTransformItem({ css: '', idx: 0, item: '' });
									}
								}}
							>
								{desktopLayout}

								<div className="laptop:hidden">{mobileLayout}</div>
								<ShortBorder
									top={
										(products.length % 2 === 0 && idx > products.length - 2) ||
										(products.length % 2 !== 0 && idx === products.length - 1)
											? true
											: false
									}
								/>
							</div>
						);
					})}
				</div>
			)}
			<div>
				<FAQList lng={lng} />
			</div>

			<section className="w-full text-[#0F0F0F]" id="cont2">
				<WhyHomaticNew lng={lng} />
				<section className="w-full text-[#0F0F0F]">
					<ElevateFluidControl lng={lng} />
					<div className="relative grid grid-cols-11 gap-3 bg-[#0F0F0F] px-4 text-[#F7F7F7]">
						<div className="absolute left-[54.45%] z-10 h-full w-[1px] bg-[#313131] max-laptop:hidden"></div>
						<PinchValvesRedefined lng={lng} />
						<div className={`col-span-11 grid-cols-12 lg:col-span-5 lg:grid-cols-6`}>
							<ShortBorder side={true} invBg />
							<Image
								src={`/assets/valve-explosion.webp`}
								alt={`Valve`}
								width={813}
								height={327}
								className="-mb-2 justify-self-center max-laptop:pt-2"
							/>
						</div>
					</div>
				</section>

				<Footer theme={'light'} lng={lng} invBg />
			</section>
		</>
	);

	const sleevesSection = <Sleeves lng={lng} />;

	const controlsSection = (
		<>
			<div className="relative grid w-full grid-cols-11 gap-x-2 px-4">
				<div className="absolute left-[54.45%] top-4 z-10 h-full w-[1px] bg-[#C8C8C8] max-laptop:hidden"></div>
				{isLoading ? (
					<ControlsSkeleton />
				) : (
					<>
						{products?.map((control, idx) => {
							return (
								<div
									key={`product-item-controls-${idx}`}
									className={`col-span-11 ${
										idx % 2 === 0 ? 'lg:col-span-6 ' : 'lg:col-span-5'
									}`}
								>
									{idx % 2 === 0 ? <ShortBorder /> : <ShortBorder side={true} />}
									<div
										className={`h-full grid-cols-12 py-3 lg:grid-cols-6 ${
											idx % 2 === 0 ? 'lg:col-span-6 ' : 'lg:col-span-5'
										}`}
									>
										<div className="flex h-full flex-col justify-between space-y-1">
											<p className="text-base font-medium">
												{control.heading}
											</p>
											{unusedFeatures && (
												<h3 className={`pt-5 ${tStyles.cat2}`}>
													{control.industries}
												</h3>
											)}
											<div className="flex w-full flex-row justify-center">
												<picture className="laptop:max-w-[20vw]">
													{unusedFeatures && (
														<source
															srcSet={`${apiUrl}/files/${control.dataImages[extractControlImageData(control.dataImages)]?.id}/${control.dataImages[extractControlImageData(control.dataImages)]?.fileName}`}
															type="image/webp"
														/>
													)}
													<img
														src={`${apiUrl}/files/${control.dataImages[extractControlImageData(control.dataImages)]?.id}/${control.dataImages[extractControlImageData(control.dataImages)]?.fileName}`}
														alt={`Products series ${control.dataImages[0]?.alt ?? control.series}`}
														className="laptop:max-w-[16vw]"
													/>
												</picture>
											</div>
											<div className="flex w-full items-center justify-end">
												<button
													className="h-fit rounded-3xl bg-[#0F0F0F] px-8 py-1 text-sm font-light text-white transition ease-in-out hover:opacity-80"
													onClick={() => {
														addToCart(
															control?.dataImages[
																extractControlImageData(
																	control.dataImages
																)
															]?.id
																? control.dataImages[
																		extractControlImageData(
																			control.dataImages
																		)
																	].id
																: '',
															control.heading,
															1,
															'3',
															''
														);
													}}
												>
													{t('add')}
												</button>
											</div>

											{unusedFeatures && (
												<button
													onClick={() => {
														addToCart(
															control?.dataImages[
																extractThumbnailImageData(
																	control.dataImages
																)
															]?.id
																? control.dataImages[
																		extractThumbnailImageData(
																			control.dataImages
																		)
																	].id
																: '',
															control.heading,
															1,
															'3',
															''
														);
													}}
													className="flex flex-row justify-end"
												>
													<Image
														src="/assets/small-button.svg"
														alt="Button"
														width={53}
														height={53}
														priority
														className="transition ease-in-out hover:opacity-80"
													/>
												</button>
											)}
										</div>
									</div>
								</div>
							);
						})}
					</>
				)}
			</div>

			<Footer theme={'light'} lng={lng} />
			<ToastContainer />
		</>
	);

	switch (englishCategory) {
		case 'pinch-valves':
			return (
				<>
					{header}
					{pinchValveSection}
				</>
			);
		case 'controls':
			return (
				<>
					{header}
					{controlsSection}
				</>
			);
		case 'sleeves':
			return <>{sleevesSection}</>;

		default:
			return <>{t('notFound')}</>;
	}
}
