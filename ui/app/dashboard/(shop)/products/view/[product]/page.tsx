'use client';

import { IProduct, ProductFile, productService } from '@/app/[lng]/_services/products';
import { useLang } from '@/app/dashboard/_context/LangContext';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import UpButton from '@/public/assets/up-button.png';
import DownButton from '@/public/assets/down-button.png';
import EditButton from '@/public/assets/edit-icon.svg';
import DeleteButton from '@/public/assets/delete-icon.svg';
import Link from 'next/link';
import Loader from '@/app/[lng]/_components/Loader';

export default function ViewProduct({ params }: { params: { product: string } }) {
	const { product: pId } = params;

	const { lang } = useLang();

	const [item, setItem] = useState<IProduct | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isDeleting, setIsDeleting] = useState<boolean>(false);

	const [images, setImages] = useState<ProductFile[]>([]);
	const [others, setOthers] = useState<ProductFile[]>([]);
	const [dimensions, setDimensions] = useState<ProductFile[]>([]);
	const [thumbnails, setThumbnails] = useState<ProductFile[]>([]);
	const [photoActive, setPhotoActive] = useState<number>(0);
	const [productCategory, setProductCategory] = useState<number>(1);

	const extractImageData = (dataImages: ProductFile[]) => {
		let imagesData: ProductFile[] = [];
		let dimensionsData: ProductFile[] = [];
		let thumbnailsData: ProductFile[] = [];
		let othersData: ProductFile[] = [];
		dataImages.forEach((image) => {
			if (image.fileCategoryId == '1') {
				imagesData.push({ ...image });
			}
			if (image.fileCategoryId == '5') {
				dimensionsData.push({ ...image });
			}
			if (image.fileCategoryId == '10') {
				thumbnailsData.push({ ...image });
			}
			if (image.fileCategoryId == '3' || image.fileCategoryId == '2') {
				othersData.push({ ...image });
			}
		});
		setImages(imagesData);
		setDimensions(dimensionsData);
		setThumbnails(thumbnailsData);
		setOthers(othersData);
	};

	useEffect(() => {
		setIsLoading(true);
		const fetchProduct = async () => {
			productService
				.getProduct(pId, lang)
				.then((result) => {
					setItem(result);
					if (result.productCategories[0]) {
						setProductCategory(result.productCategories[0].id);
					} else {
						const { series, screws } = result;
						if (series && screws) {
							setProductCategory(1);
						} else {
							setProductCategory(3);
						}
					}
					extractImageData(result.dataImages);
				})
				.catch((error) => {
					const statusCode = error.status;
					if (statusCode === 404) {
						alert('No data found.');
					} else if (statusCode === 500) {
						alert('A server error has occured.');
					}
				})
				.finally(() => {
					setIsLoading(false);
				});
		};
		fetchProduct();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lang]);

	const handleDeleteProduct = async (id: string) => {
		setIsDeleting(true);
		try {
			const result = await productService.deleteProduct(id, lang);
			if (result.isFailed) {
				alert('Failed to delete product.');
			} else {
				alert('Product deleted successfully.');
				window.location.reload();
			}
		} catch (error) {
			alert('Failed to delete product.');
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<div className="container w-full">
			{isLoading ? (
				<Loader />
			) : (
				<>
					<div className="mb-10 flex h-fit w-full items-center justify-center rounded-2xl bg-gray-800 pb-1">
						<div className="flex h-fit w-full items-start justify-between rounded-xl bg-gradient-to-br from-[#f7f7f7] from-45% via-gray-500 via-50% to-gray-800 to-80% p-4">
							<h2
								className={`text-2xl font-semibold text-gray-800`}
							>{`Product details`}</h2>
							<div className="flex items-center">
								<Link href={`/dashboard/products/edit/${pId}`}>
									<Image
										src={EditButton}
										alt="Edit button"
										className="m-2 w-[1vw] transition ease-in-out hover:scale-125"
									/>
								</Link>
								<button
									disabled={isDeleting}
									className={`hover:scale-125 ${isDeleting ? 'opacity-20' : ''} transition ease-in-out`}
									onClick={(e) => {
										e.stopPropagation();
										const confirmDelete = confirm(
											'Are you sure you want to delete the product? This action will delete the product for all languages.'
										);
										if (item && confirmDelete) {
											handleDeleteProduct(item.id);
										}
									}}
								>
									<Image
										src={DeleteButton}
										alt="Delete button"
										className="h-[2vh]"
									/>
								</button>
							</div>
						</div>
					</div>
					{item && (
						<div>
							<div className="grid grid-cols-12">
								<div className="col-span-4 space-y-2">
									{images.length ? (
										<picture>
											<source
												srcSet={`${process.env.API_URL}/files/${images[photoActive]?.id}/${images[photoActive]?.fileName}`}
												type={images[photoActive]?.fileExtension}
											/>
											<img
												src={`${process.env.API_URL}/files/${images[photoActive]?.id}/${images[photoActive]?.fileName}`}
												alt={`${images[photoActive]?.alt}`}
											/>
										</picture>
									) : (
										<div className="my-4 flex w-full items-center justify-center">
											<p>No image available</p>
										</div>
									)}
									{productCategory === 1 && (
										<div className="space-y-2">
											<div className="flex items-center justify-center gap-3 max-lg:hidden">
												<button
													className="transition ease-in-out hover:opacity-80"
													onClick={() => {
														if (item) {
															if (photoActive === 0) {
																const lastPhoto = images.length - 1;
																setPhotoActive(lastPhoto);
															} else {
																setPhotoActive((prev) => prev - 1);
															}
														}
													}}
												>
													<Image
														src={UpButton}
														alt="Up button"
														className="w-[3vw] -rotate-90"
													/>
												</button>
												<button
													className="transition ease-in-out hover:opacity-80"
													onClick={() => {
														if (item) {
															if (images.length - 1 === photoActive) {
																setPhotoActive(0);
															} else {
																setPhotoActive((prev) => prev + 1);
															}
														}
													}}
												>
													<Image
														src={DownButton}
														alt="Down button"
														className="w-[3vw] -rotate-90"
													/>
												</button>
											</div>
											<div className="flex justify-between">
												<p className="font-bold laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-lg">
													Series:
												</p>
												<p className="laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-lg">
													{item.series}
												</p>
											</div>
											<div className="flex justify-between">
												<p className="font-bold laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-lg">
													Industries / best suitable for:
												</p>
												<p className="laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-lg">
													{item.industries.length ? item.industries : '/'}
												</p>
											</div>
											<div className="space-y-2">
												<p className="font-bold laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-lg">
													Description (only used in list view of all
													products):
												</p>
												<p className="laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-lg">
													{item.heading}
												</p>
											</div>
										</div>
									)}
								</div>
								<div className="col-span-8 w-[70%] space-y-2 justify-self-end">
									{productCategory === 3 && (
										<div className="flex justify-between">
											<p className="font-bold laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-lg">
												Name:
											</p>
											<p>{item.heading}</p>
										</div>
									)}
									<div className="flex justify-between">
										<p className="font-bold laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-lg">
											Type:
										</p>
										<p className="laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-lg"> {item.productCategories[0]?.name ?? '/'}</p>
									</div>
									{productCategory === 1 && (
										<div className="w-full space-y-2">
											<div className="flex justify-between">
												<p className="font-bold laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-lg">
													Nominal widths:
												</p>
												<p className="laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-lg">
													{item.nominalWidth ?? '/'}
												</p>
											</div>
											<div className="flex justify-between">
												<p className="font-bold laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-lg">
													Screws:
												</p>
												<p className="laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-lg">
													{item.screws}
												</p>
											</div>
											{item.connectionType ? (
												<div className="flex justify-between">
													<p className="font-bold laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-lg">
														{item.connectionType}:
													</p>
													<p className="laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-lg">
														{item.material}
													</p>
												</div>
											) : null}
											<div className="flex justify-between">
												<p className="font-bold laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-lg">{`Housing: `}</p>
												<p className="laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-lg">
													{item.housing ?? '/'}
												</p>
											</div>
											<div>
												<p className="font-bold laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-lg">
													Dimensions:
												</p>
												{/* eslint-disable-next-line @next/next/no-img-element */}
												{dimensions[0] ? (
													<img
														src={`${process.env.API_URL}/files/${dimensions[0]?.id}/${dimensions[0]?.fileName}`}
														alt={`${process.env.API_URL}/files/${dimensions[0]?.id}/${dimensions[0]?.alt}`}
														className="self-center"
													/>
												) : (
													<div className="my-4 flex w-full items-center justify-center">
														<p>No dimensions image available</p>
													</div>
												)}
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					)}
				</>
			)}
		</div>
	);
}
