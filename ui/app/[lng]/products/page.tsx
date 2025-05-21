'use client';

import Link from 'next/link';
import Image from 'next/image';
import tStyles from '@/app/[lng]/textSizes.module.css';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { toastDefaultOptions } from '@/lib/utils';
import { IProductCategory, productCategoryService } from '../_services/productCategory';
import { useTranslation } from '@/app/i18n/client';
import Footer from '../_components/Footer';
import Loader from '../_components/Loader';
import ProductsValve from '@/public/assets/products/product-valves.webp';
import Button from '@/public/assets/button.svg';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import ReadyToElevate
const ReadyToElevate = dynamic(() => import('../_components/ReadyToElevate'), {
	loading: () => <p>Loading...</p>,
	ssr: false,
});

export default function Products({ params: { lng } }: { params: { lng: string } }) {
	const { t } = useTranslation(lng, 'products');

	const [categories, setCategories] = useState<IProductCategory[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		setIsLoading(true);
		const fetchCategories = async () => {
			productCategoryService
				.getCategories(lng)
				.then((result) => {
					setCategories(result);
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
		fetchCategories();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const [transformItem, setTransformItem] = useState<{
		css: string;
		idx?: number;
		item?: string;
	}>({
		css: '',
		idx: 0,
	});
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

	return (
		<>
			{!isLoading ? (
				<section
					className="grid h-full grid-cols-11 max-laptop:px-4 laptop:h-screen laptop:gap-x-2"
					id="contentSec"
				>
					<div className=" col-span-11 flex w-fit justify-center self-center justify-self-center max-laptop:mt-10 max-laptop:w-[80vw] lg:col-span-6 laptop:h-[95vh]">
						<Image
							src={ProductsValve}
							alt="Products valve"
							priority
							className="h-fit max-h-[95vh] w-fit"
						/>
					</div>
					<div className="col-span-11 flex h-full flex-col overflow-hidden py-6 lg:col-span-5 laptop:h-[95vh] laptop:justify-between ">
						<div>
							<h1 className={`pb-3 ${tStyles.cat1}`}>{t('title')}</h1>
							<p className={tStyles.cat3}>{t('description')}</p>
						</div>

						<div className="mt-16 flex flex-col">
							{categories.map((category, idx) => (
								<div
									className={`grid grid-cols-12 border-t border-[#C8C8C8] py-7`}
									key={`link-item-${category.name.toLowerCase()}-${category.alt}`}
									onPointerEnter={() => {
										setTransformItem({ css: 'laptop:scale-110 ', idx: idx });
									}}
									onPointerLeave={() => {
										setTransformItem({ css: '', idx: 0, item: '' });
									}}
								>
									<div className="col-span-8 flex h-full items-center">
										<div className="flex flex-col laptop:w-[85%]">
											<h3 className={`pb-3 ${tStyles.cat2}`}>
												{category.name}
											</h3>
											<p className={tStyles.cat3}>{category.description}</p>
										</div>
									</div>
									<div className="col-span-2 grid-cols-2"></div>
									<div className="col-span-2 flex h-full items-center max-laptop:justify-end">
										<Link
											href={`/${lng}/${t('products')}/${category.id === 1 ? 'pinch-valves' : category.id === 2 ? 'sleeves' : 'controls'}`}
											className="w-[10vw]"
										>
											<Image
												src={Button}
												alt="Button"
												loading="lazy"
												className={`${transformItem.idx === idx ? `${transformItem.css}` : ''} transition ease-in-out hover:opacity-80 laptop:w-[5vw]`}
											/>
										</Link>
									</div>
								</div>
							))}

							<div
								className={`grid grid-cols-12 border-t border-[#C8C8C8] pt-7`}
								key={`link-item-custom-solutions`}
								onPointerEnter={() => {
									setTransformItem({ css: 'laptop:scale-110 ', idx: 5 });
								}}
								onPointerLeave={() => {
									setTransformItem({ css: '', idx: 0, item: '' });
								}}
							>
								<div className="col-span-8 flex h-full items-center">
									<div className="flex flex-col laptop:w-full">
										<h3 className={`pb-3 ${tStyles.cat2}`}>{t('customSol')}</h3>
										<p className={tStyles.cat3}>{t('customSolDesc')}</p>
									</div>
								</div>
								<div className="col-span-2 grid-cols-2"></div>
								<div className="col-span-2 flex h-full items-center max-laptop:justify-end">
									<Link href={`/${lng}/contact`} className="w-[10vw]">
										<Image
											src={Button}
											alt="Button"
											loading="lazy"
											className={`${transformItem.idx === 5 ? `${transformItem.css}` : ''} transition ease-in-out hover:opacity-80 laptop:w-[5vw]`}
										/>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</section>
			) : (
				<div className="flex h-screen w-full justify-center" id="loader">
					<Loader />
				</div>
			)}
			<div id="cont2">
				<section className="w-full border-none text-[#F7F7F7]">
					<div className="grid grid-cols-11 border-none bg-[#0F0F0F] px-4 pt-4">
						<ReadyToElevate lng={lng} />
						<div className={`col-span-11 grid-cols-12 lg:col-span-5 lg:grid-cols-6`}>
							<Image
								src={`/assets/products/valve-open-products.webp`}
								alt={`Valve`}
								width={813}
								height={327}
								loading="lazy"
								className="-mr-4 justify-self-end"
							/>
						</div>
					</div>
				</section>
				<section className="">
					<Footer theme={'light'} lng={lng} invBg />
				</section>
				<ToastContainer />
			</div>
		</>
	);
}
