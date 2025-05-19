'use client';
import { IProduct, productService } from '@/app/[lng]/_services/products';
import { extractImageData } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLang } from '../../_context/LangContext';
import AddButton from '@/public/assets/add-icon.svg';
import DeleteButton from '@/public/assets/delete-icon.svg';
import Loader from '@/app/[lng]/_components/Loader';

export default function Products() {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isDeleting, setIsDeleting] = useState<boolean>(false);
	const [items, setItems] = useState<IProduct[]>([]);

	const { lang } = useLang();

	const separateProducts = () => {
		const category1Items: IProduct[] = [];
		const category2Items: IProduct[] = [];
		items.forEach((item) => {
			let productCategoryId = 1;
			if (item.productCategories[0]) {
				productCategoryId = item.productCategories[0].id;
			} else {
				const { series, screws } = item;
				if (series && screws) {
					productCategoryId = 1;
				} else {
					productCategoryId = 3;
				}
			}
			if (productCategoryId === 1) {
				category1Items.push(item);
			} else if (productCategoryId === 3) {
				category2Items.push(item);
			}
		});
		setPvs(category1Items);
		setControls(category2Items);
	};

	useEffect(() => {
		const fetchProducts = async () => {
			setIsLoading(true);
			setItems([]);
			setPvs([]);
			setControls([]);
			productService
				.getProducts(lang)
				.then((result) => {
					setItems(result);
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
		fetchProducts();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lang]);

	useEffect(() => {
		separateProducts();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [items]);

	const [controls, setControls] = useState<IProduct[]>([]);
	const [pvs, setPvs] = useState<IProduct[]>([]);

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
		<div className={`${isDeleting ? 'cursor-wait' : ''} space-y-6`}>
			<div className="mb-10 flex h-fit w-full items-center justify-center rounded-2xl bg-gray-800 pb-1">
				<div className="flex h-fit w-full items-start justify-between rounded-xl bg-gradient-to-br from-[#f7f7f7] from-45% via-gray-500 via-50% to-gray-800 to-80% p-4">
					<h2 className={`text-2xl font-semibold text-gray-800`}>{`Products`}</h2>
					<Link href={`/dashboard/products/add`}>
						<Image
							src={AddButton}
							alt="Add button"
							className="m-2 w-[1vw] hover:scale-125 transition ease-in-out"
						/>
					</Link>
				</div>
			</div>
			{isLoading ? (
				<Loader />
			) : (
				<>
					<p className="text-xl font-semibold">Pinch valves ({pvs.length})</p>
					<div className="grid-rows-auto h-full w-full grid-cols-5 gap-5 tablet:grid laptop-l:grid-cols-4 tablet:grid-cols-3">
						{pvs.map((item, idx) => (
							<div
								key={idx + item.id}
								className={`col-span-1 flex h-full w-full items-center justify-center rounded-2xl bg-gray-800 pb-1 transition ease-in-out hover:scale-105 hover:shadow-2xl`}
							>
								<div className="h-full w-full rounded-xl bg-gray-200 p-4">
									<div className="grid w-full grid-cols-12 pb-2">
										<Link
											href={`/dashboard/products/view/${item.id}`}
											className="col-span-9 w-full"
										>
											<p className="w-full">Series {item.series}</p>
										</Link>
										<div className="col-span-3 flex flex-row items-center justify-end space-x-1">
											<Link
												href={`/dashboard/products/edit/${item.id}`}
												className="text-sm font-medium hover:font-semibold"
											>
												<p className="">{`Edit`}</p>
											</Link>
											<button
												disabled={isDeleting}
												className={`hover:scale-125 ${isDeleting ? 'opacity-20' : ''} transition ease-in-out`}
												onClick={(e) => {
													e.stopPropagation();
													const confirmDelete = confirm(
														'Are you sure you want to delete the product? This action will delete the product for all languages.'
													);
													if (confirmDelete) {
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
									<Link href={`/dashboard/products/view/${item.id}`} className="pt-2">
										{item.dataImages && (
											<picture>
												{/* WebP source for modern browsers */}
												<source
													srcSet={`${process.env.API_URL}/files/${item.dataImages[extractImageData(item.dataImages) == undefined ? 0 : extractImageData(item.dataImages)]?.id}/${item.dataImages[extractImageData(item.dataImages) == undefined ? 0 : extractImageData(item.dataImages)]?.fileName}`}
													type="image/webp"
												/>
												<img
													src={`${process.env.API_URL}/files/${item.dataImages[extractImageData(item.dataImages) == undefined ? 0 : extractImageData(item.dataImages)]?.id}/${item.dataImages[extractImageData(item.dataImages) == undefined ? 0 : extractImageData(item.dataImages)]?.fileName}`}
													alt={`Products series ${item.dataImages[extractImageData(item.dataImages) == undefined ? 0 : extractImageData(item.dataImages)]?.alt ?? item.series}`}
													className="w-[80vw] max-laptop:px-7 laptop:w-[30vw]"
												/>
											</picture>
										)}
									</Link>
								</div>
							</div>
						))}
					</div>
					<p className="text-xl font-semibold">Controls ({controls.length})</p>
					<div className="grid-rows-auto h-full w-full grid-cols-5 gap-5 tablet:grid laptop-l:grid-cols-4 tablet:grid-cols-3">
						{controls.map((item, idx) => (
							<div
								key={idx + item.id}
								className={`col-span-1 flex h-full w-full items-center justify-center rounded-2xl bg-gray-800 pb-1 transition ease-in-out hover:scale-105 hover:shadow-2xl`}
							>
								<div className="flex h-full w-full flex-col items-center justify-between rounded-xl bg-gray-200 p-4">
									<div className="grid w-full grid-cols-12 items-start space-x-2">
										<Link
											href={`/dashboard/products/view/${item.id}`}
											className="col-span-9 w-full"
										>
											<p className="w-full">{item.heading}</p>
										</Link>
										<div className="col-span-3 flex flex-row items-center justify-end space-x-1">
											<Link
												href={`/dashboard/products/edit/${item.id}`}
												className="text-sm font-medium hover:font-semibold"
											>
												<p className="">{`Edit`}</p>
											</Link>
											<button
												disabled={isDeleting}
												className={`hover:scale-125 ${isDeleting ? 'opacity-20' : ''} transition ease-in-out`}
												onClick={(e) => {
													handleDeleteProduct(item.id);
													e.stopPropagation();
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
									<Link href={`/dashboard/products/view/${item.id}`}>
										{item.dataImages && (
											<picture>
												<source
													srcSet={`${process.env.API_URL}/files/${item.dataImages[extractImageData(item.dataImages) == undefined ? 0 : extractImageData(item.dataImages)]?.id}/${item.dataImages[extractImageData(item.dataImages) == undefined ? 0 : extractImageData(item.dataImages)]?.fileName}`}
													type="image/webp"
												/>
												<img
													src={`${process.env.API_URL}/files/${item.dataImages[extractImageData(item.dataImages) == undefined ? 0 : extractImageData(item.dataImages)]?.id}/${item.dataImages[extractImageData(item.dataImages) == undefined ? 0 : extractImageData(item.dataImages)]?.fileName}`}
													alt={`Products series ${item.dataImages[extractImageData(item.dataImages) == undefined ? 0 : extractImageData(item.dataImages)]?.alt ?? item.series}`}
													className="w-[80vw] max-laptop:px-7 laptop:w-[30vw]"
												/>
											</picture>
										)}
									</Link>
								</div>
							</div>
						))}
					</div>
				</>
			)}
		</div>
	);
}
