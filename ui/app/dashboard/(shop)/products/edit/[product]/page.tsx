'use client';

import RequiredFieldAsterisk from '@/app/dashboard/_components/RequiredFieldAsterisk';
import { ProductImage } from '@/app/[lng]/_interfaces/interfaces';
import { fileService } from '@/app/[lng]/_services/files';
import {
	IProduct,
	ProductFile,
	productService,
	productSuitableForDivider as divider,
} from '@/app/[lng]/_services/products';
import Loading from '@/app/[lng]/loading';
import { useLang } from '@/app/dashboard/_context/LangContext';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

export default function EditProduct({ params }: { params: { product: string } }) {
	const { product: pId } = params;

	const { lang } = useLang();

	const router = useRouter();

	const [item, setItem] = useState<IProduct | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [existingImages, setExistingImages] = useState<ProductFile[]>([]);
	const [others, setOthers] = useState<ProductFile[]>([]);
	const [dimensions, setDimensions] = useState<ProductFile[]>([]);
	const [thumbnails, setThumbnails] = useState<ProductFile[]>([]);

	const [heading, setHeading] = useState<string>('');
	const [series, setSeries] = useState<string>('');
	const [connectionType, setConnectionType] = useState<string>('');
	const [housing, setHousing] = useState<string>('');
	const [nominalWidth, setNominalWidth] = useState<string>('');
	const [material, setMaterial] = useState<string>('');
	const [suitableFor, setSuitableFor] = useState<string>('');
	const [suitableForItems, setSuitableForItems] = useState<string[]>([]);
	const [connectionMaterial, setConnectionMaterial] = useState<string>('');
	const [screws, setScrews] = useState<string>('');
	const [industries, setIndustries] = useState<string>('');

	const [productCategory, setProductCategory] = useState<number>(0);

	const [images, setImages] = useState<ProductImage[]>([]);
	const [newImageFile, setNewImageFile] = useState<File | null>(null);
	const [newImageAlt, setNewImageAlt] = useState<string>('');

	const [dimension, setDimension] = useState<ProductImage | null>(null);
	const [newDimensionFile, setNewDimensionFile] = useState<File | null>(null);

	const [isSubmittingForm, setIsSubmittingForm] = useState<boolean>(false);

	const [deletingImage, setDeletingImage] = useState<boolean>(false);

	const addSuitableForItem = () => {
		const trimmedSuitableForItem = `${suitableFor.trim()}`;
		if (suitableForItems.length) {
			const foundSuitableForItemIdx = suitableForItems.findIndex(
				(t) => trimmedSuitableForItem.toLowerCase() === t.toLowerCase()
			);
			if (foundSuitableForItemIdx === -1) {
				setSuitableForItems((prev) => [...prev, trimmedSuitableForItem]);
				setSuitableFor('');
			}
		} else {
			setSuitableForItems((prev) => [...prev, trimmedSuitableForItem]);
			setSuitableFor('');
		}
	};

	const removeSuitableForItem = (index: number) => {
		let updatedSuitableForItems = [...suitableForItems];
		updatedSuitableForItems.splice(index, 1);
		setSuitableForItems(updatedSuitableForItems);
	};

	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files ? e.target.files[0] : null;
		if (file) {
			setNewImageFile(file);
		}
	};

	const handleDimensionChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files ? e.target.files[0] : null;
		if (file) {
			setNewDimensionFile(file);
		}
	};

	const addImageToArray = () => {
		if (newImageFile) {
			const newImage: ProductImage = {
				file: newImageFile,
				alt: newImageAlt,
				category: 1,
			};
			setImages((prev) => [...prev, newImage]);
			setNewImageFile(null);
			setNewImageAlt('');
		}
	};

	const defaultDimensionFileMeta = {
		alt: 'Dimensions photo',
		category: 5,
	};

	const addDimension = () => {
		if (newDimensionFile) {
			setDimension({
				file: newDimensionFile,
				...defaultDimensionFileMeta,
			});
		}
	};

	const extractImageData = (dataImages: ProductFile[]) => {
		const existingImages: ProductFile[] = [];
		const dimensions: ProductFile[] = [];
		const thumbnails: ProductFile[] = [];
		const others: ProductFile[] = [];

		dataImages.forEach((image) => {
			if (image.fileCategoryId == '1') {
				existingImages.push(image);
			} else if (image.fileCategoryId == '5') {
				dimensions.push(image);
			} else if (image.fileCategoryId == '10') {
				thumbnails.push(image);
			} else if (image.fileCategoryId == '3' || image.fileCategoryId == '2') {
				others.push(image);
			}
		});
		setExistingImages(existingImages);
		setDimensions(dimensions);
		setThumbnails(thumbnails);
		setOthers(others);
	};

	const fillProductData = (product: IProduct) => {
		if (product.heading) setHeading(product.heading);
		if (product.series) setSeries(product.series);
		if (product.connectionType) setConnectionType(product.connectionType);
		if (product.housing) setHousing(product.housing);
		if (product.nominalWidth) setNominalWidth(product.nominalWidth);
		if (product.material) setMaterial(product.material);
		if (product.suitableFor) setSuitableForItems(product.suitableFor.split(divider));
		if (product.connectionMaterial) setConnectionMaterial(product.connectionMaterial);
		if (product.screws) setScrews(product.screws);
		if (product.industries) setIndustries(product.industries);
		if (product.dataImages) {
			extractImageData(product.dataImages);
		}
	};

	useEffect(() => {
		setIsLoading(true);
		const fetchProducts = async () => {
			try {
				const result = await productService.getProduct(pId, lang);
				setItem(result);
				let productCategoryId = 1;
				if (result.productCategories[0]) {
					productCategoryId = result.productCategories[0]?.id;
				} else {
					const { series, screws } = result;
					if (series && screws) {
						productCategoryId = 1;
					} else {
						productCategoryId = 3;
					}
				}
				setProductCategory(productCategoryId);
				fillProductData(result);
			} catch (error) {
				alert('An error has occured: ' + error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchProducts();
	}, [lang]);

	const combineImagesAndDimension = (): ProductImage[] => {
		let combinedArray: ProductImage[] = [];
		if (images.length) {
			combinedArray = [...images];
		}
		if (dimension) {
			combinedArray.push(dimension);
		}
		// if (newImageFile) {
		// 	combinedArray.push({ file: newImageFile, alt: newImageAlt, category: 1 });
		// }
		// if (newDimensionFile) {
		// 	combinedArray.push({
		// 		file: newDimensionFile,
		// 		...defaultDimensionFileMeta,
		// 	});
		// }
		return combinedArray;
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (productCategory === 1) {
			if (!heading || !series || !screws) {
				alert('Please fill in all required fields.');
				return;
			}
		} else if (heading === '') {
			alert('Please fill in all required fields.');
			return;
		}
		setIsSubmittingForm(true);
		const combinedImages = combineImagesAndDimension();
		try {
			const response = await productService.editProduct(
				pId,
				heading,
				series,
				connectionType,
				housing,
				nominalWidth,
				material,
				suitableForItems.join(divider),
				connectionMaterial,
				screws,
				industries,
				productCategory,
				combinedImages,
				lang
			);
			if (response.isFailed === true) {
				alert('An error occured.');
			} else {
				setIsSubmittingForm(false);
				router.push(`/dashboard/products/view/${item?.id}`);
				alert('Product edited successfully');
			}
		} catch (error) {
			console.log('Error adding product:', error);
			setIsSubmittingForm(false);
			alert('Failed to edit product');
		}
	};

	const removeExistingImage = (index: number, dim: boolean) => {
		if (dim) {
			if (dimensions[index]) {
				deleteImageFile(index, dimensions[index].id, dimensions[index].fileName, dim);
			}
		} else {
			if (existingImages[index]) {
				deleteImageFile(
					index,
					existingImages[index].id,
					existingImages[index].fileName,
					dim
				);
			}
		}
	};

	const deleteImageFile = async (index: number, id: string, name: string, dim: boolean) => {
		setDeletingImage(true);
		try {
			const result = await fileService.deleteFile(id, name, lang);
			if (dim) {
				setDimension(null);
				setDimensions([]);
			} else {
				setExistingImages(existingImages.filter((_, i) => i !== index));
			}
			alert('Image deleted');
		} catch (error) {
			alert('An error occured: ' + error);
		} finally {
			setDeletingImage(false);
		}
	};

	const removeImage = (index: number) => {
		setImages(images.filter((_, i) => i !== index));
	};

	const removeDimension = () => {
		setDimension(null);
	};

	return (
		<div className="container mx-auto px-4 py-6">
			<h2 className="mb-5 text-2xl font-semibold">Edit Product</h2>
			{isLoading ? null : (
				<div className="mb-10 flex h-fit w-full items-center justify-center rounded-2xl bg-gray-800 pb-1">
					<div className="flex h-fit w-full items-start justify-between rounded-xl bg-gradient-to-br from-[#f7f7f7] from-45% via-gray-500 via-50% to-gray-800 to-80% p-4">
						<p className="scale-105 text-lg font-semibold text-gray-800">
							{`${
								productCategory === 1
									? `Pinch valve series ${series}`
									: productCategory === 3
										? 'Control / Accessory'
										: 'Product'
							}`}
						</p>
					</div>
				</div>
			)}
			<p className="mb-4 w-full text-center font-semibold">
				To edit an existing product, first choose the language you want to edit in the top
				right. Then edit the information for said language.
			</p>
			{isLoading ? (
				<Loading />
			) : (
				<form onSubmit={handleSubmit} className="space-y-3">
					<div className={`flex-col space-y-2`}>
						<label className="block font-semibold">
							Heading <RequiredFieldAsterisk />
						</label>
						<input
							type="text"
							className="w-full rounded border border-gray-300 p-2"
							name="heading"
							value={heading}
							onChange={(e) => setHeading(e.target.value)}
						/>
					</div>
					{productCategory === 1 && (
						<div className={`flex-col space-y-2`}>
							<div className={`flex-col space-y-2`}>
								<label className="block font-semibold" htmlFor="connectionType">
									Connection Type
								</label>
								<textarea
									className="w-full rounded border border-gray-300 p-2"
									name="connectionType"
									value={connectionType}
									placeholder={`Insert product connection type`}
									onChange={(e) => setConnectionType(e.target.value)}
								></textarea>
							</div>
							<div className={`flex-col space-y-2`}>
								<label className="block font-semibold" htmlFor="housing">
									Housing
								</label>
								<textarea
									className="w-full rounded border border-gray-300 p-2"
									name="housing"
									value={housing}
									placeholder={`Insert product housing`}
									onChange={(e) => setHousing(e.target.value)}
								></textarea>
							</div>
							<div className={`flex-col space-y-2`}>
								<label className="block font-semibold" htmlFor="series">
									Series {productCategory === 1 && <RequiredFieldAsterisk />}
								</label>
								<input
									type="text"
									className="w-full rounded border border-gray-300 p-2"
									name="series"
									value={series}
									placeholder={`Insert product series`}
									onChange={(e) => setSeries(e.target.value)}
								/>
							</div>
							<div className={`flex-col space-y-2`}>
								<label className="block font-semibold" htmlFor="nominalWidth">
									Nominal Width
								</label>
								<input
									type="text"
									className="w-full rounded border border-gray-300 p-2"
									name="nominalWidth"
									value={nominalWidth}
									placeholder={`Insert product nominal width`}
									onChange={(e) => setNominalWidth(e.target.value)}
								/>
							</div>
							<div className={`flex-col space-y-2`}>
								<label className="block font-semibold" htmlFor="material">
									Material
								</label>
								<input
									type="text"
									className="w-full rounded border border-gray-300 p-2"
									value={material}
									placeholder={`Insert product material`}
									onChange={(e) => setMaterial(e.target.value)}
								/>
							</div>
							<div className={`flex-col space-y-3`}>
								<div className={`flex-col space-y-2`}>
									<label
										className={`block font-semibold`}
										htmlFor="suitableFor"
									>{`Suitable For`}</label>
									<input
										type="text"
										className={`w-full rounded border border-gray-300 p-2`}
										name="suitableFor"
										value={suitableFor}
										placeholder={`Insert product suitable for`}
										onChange={(e) => setSuitableFor(e.currentTarget.value)}
									/>
									<button
										className={`rounded-xl bg-gray-800 px-4 py-2 ${suitableFor === '' ? 'text-gray-400' : 'text-white hover:cursor-pointer hover:opacity-90'} transition ease-in-out`}
										type="button"
										onClick={addSuitableForItem}
										disabled={suitableFor === ''}
									>
										{`Add suitable for`}
									</button>
								</div>
								<div className={`flex-col space-y-2`}>
									<label
										className={`block font-semibold`}
									>{`Suitable For items`}</label>
									{suitableForItems.length ? (
										<ul>
											{suitableForItems.map((s, idx) => (
												<li key={`suitable-for-item-${s}`}>
													{s}{' '}
													<button
														className={`font-semibold text-red-700`}
														title="Remove suitable for item"
														onClick={() => removeSuitableForItem(idx)}
													>
														X
													</button>
												</li>
											))}
										</ul>
									) : (
										<p className={`my-3`}>{`No items found`}</p>
									)}
								</div>
							</div>
							<div className={`flex-col space-y-2`}>
								<label className="block font-semibold" htmlFor="connectionMaterial">
									Connection Material
								</label>
								<input
									type="text"
									className="w-full rounded border border-gray-300 p-2"
									name="connectionMaterial"
									value={connectionMaterial}
									placeholder={`Insert product connection material`}
									onChange={(e) => setConnectionMaterial(e.target.value)}
								/>
							</div>
							<div className={`flex-col space-y-2`}>
								<label className="block font-semibold" htmlFor="screws">
									Screws {productCategory === 1 && <RequiredFieldAsterisk />}
								</label>
								<input
									type="text"
									className="w-full rounded border border-gray-300 p-2"
									name="screws"
									value={screws}
									placeholder={`Insert product screws`}
									onChange={(e) => setScrews(e.target.value)}
								/>
							</div>
							<div className={`flex-col space-y-2`}>
								<label className="block font-semibold" htmlFor="industries">
									Industries
								</label>
								<input
									type="text"
									className="w-full rounded border border-gray-300 p-2"
									name="industries"
									value={industries}
									placeholder={`Insert product industries`}
									onChange={(e) => setIndustries(e.target.value)}
								/>
							</div>
						</div>
					)}
					<div className={`flex-col space-y-2`}>
						<label className="block font-semibold">Images</label>
						{existingImages.length > 0 && (
							<>
								<br />
								<div className="mb-4 grid grid-cols-6 gap-4 pt-2">
									{existingImages.map((img, index) => (
										<div key={img.id} className="flex flex-col items-center">
											<picture>
												<source
													srcSet={`${process.env.API_URL}/files/${img.id}/${img.fileName}`}
													type={img.fileExtension}
												/>
												<img
													src={`${process.env.API_URL}/files/${img.id}/${img.fileName}`}
													alt={`${img.alt}`}
													className="lg:-mt-10"
												/>
											</picture>
											<span>{img.alt}</span>
											<button
												type="button"
												disabled={deletingImage}
												className={`${deletingImage ? 'opacity-50' : ''} mt-2 rounded bg-red-600 px-2 py-1 text-white transition-opacity ease-in hover:opacity-90`}
												onClick={() => {
													const confirmDelete = confirm(
														'Are you sure you want to delete the image?'
													);
													if (confirmDelete) {
														removeExistingImage(index, false);
													}
												}}
											>
												Delete
											</button>
										</div>
									))}
								</div>
							</>
						)}
						<div>
							{newImageFile ? (
								<div className="grid grid-cols-4">
									<img src={URL.createObjectURL(newImageFile)} />
								</div>
							) : null}
							<input
								type="file"
								accept="image/webp"
								className="w-full rounded border border-gray-300 p-2"
								onChange={handleImageChange}
							/>
							<p className="text-sm text-gray-600">Accepts only webp images</p>
						</div>
						<input
							type="text"
							className="mt-2 w-full rounded border border-gray-300 p-2"
							value={newImageAlt}
							onChange={(e) => setNewImageAlt(e.target.value)}
							placeholder="Short description of what is on the image"
						/>
						<button
							type="button"
							className={`rounded-xl bg-gray-800 px-4 py-2 ${!newImageFile ? 'text-gray-400' : 'text-white hover:cursor-pointer hover:opacity-90'} transition ease-in-out`}
							disabled={!newImageFile}
							onClick={() => {
								addImageToArray();
								if (productCategory === 3) {
									removeExistingImage(0, false);
								}
							}}
						>
							Add Image
						</button>
						{productCategory === 3 && (
							<p className={`font-semibold text-red-700`}>The old image will be deleted.</p>
						)}
						{images.length > 0 && (
							<div className="mt-4 grid grid-cols-6 gap-4">
								{images.map((img, index) => (
									<div
										key={index}
										className="relative flex flex-col items-center"
									>
										<img
											src={URL.createObjectURL(img.file)}
											alt={img.alt}
											className="h-auto w-full"
										/>
										<span>{img.alt}</span>
										<button
											type="button"
											disabled={deletingImage}
											className={`${deletingImage ? 'opacity-50' : ''} mt-2 rounded bg-red-600 px-2 py-1 text-white transition-opacity ease-in hover:opacity-90`}
											onClick={() => removeImage(index)}
										>
											Delete
										</button>
									</div>
								))}
							</div>
						)}
					</div>
					{productCategory === 1 && (
						<div className={`flex-col space-y-2`}>
							<label className="block font-semibold">Dimension photo</label>
							{dimensions.length > 0 && (
								<div className="grid grid-cols-4 gap-4">
									{dimensions.map((img, index) => (
										<div
											key={img.id}
											className="flex flex-col items-center space-y-2"
										>
											<picture>
												<source
													srcSet={`${process.env.API_URL}/files/${img.id}/${img.fileName}`}
													type={img.fileExtension}
												/>
												<img
													src={`${process.env.API_URL}/files/${img.id}/${img.fileName}`}
													alt={`${img.alt}`}
												/>
											</picture>
											<span>{img.alt}</span>
											<button
												type="button"
												disabled={deletingImage}
												className={`${deletingImage ? 'opacity-50 transition-opacity ease-in' : ''} mt-2 rounded bg-red-600 px-2 py-1 text-white`}
												onClick={() => {
													const confirmDelete = confirm(
														'Are you sure you want to delete the image?'
													);
													if (confirmDelete) {
														removeExistingImage(index, true);
													}
												}}
											>
												Delete
											</button>
										</div>
									))}
								</div>
							)}
							<div>
								{newDimensionFile ? (
									<div className="grid grid-cols-4">
										<img src={URL.createObjectURL(newDimensionFile)} />
									</div>
								) : null}
								<input
									type="file"
									className="w-full rounded border border-gray-300 p-2"
									onChange={handleDimensionChange}
									disabled={dimensions.length >= 1}
								/>
							</div>
							<button
								type="button"
								className={`mt-2 rounded-xl bg-gray-800 px-4 py-2 ${!newDimensionFile || dimensions.length >= 1 ? 'text-gray-400' : 'text-white hover:cursor-pointer hover:opacity-90'} transition ease-in-out`}
								onClick={addDimension}
								disabled={!newDimensionFile || dimensions.length >= 1}
							>
								Add Dimension Photo
							</button>
							{dimension && (
								<div className="grid grid-cols-4">
									<div className="relative mt-4 flex flex-col items-center space-y-2">
										<img
											src={URL.createObjectURL(dimension.file)}
											alt={dimension.alt}
											className="h-auto w-full"
											/>
										<span>{dimension.alt}</span>
										<button
											type="button"
											disabled={deletingImage}
											className={`${deletingImage ? 'opacity-50 transition-opacity ease-in' : ''} mt-2 rounded bg-red-600 px-2 py-1 text-white`}
											onClick={removeDimension}
										>
											Delete
										</button>
									</div>
								</div>
							)}
						</div>
					)}
					<hr />
					<button
						type="submit"
						className={`border-5 rounded-xl border px-4 py-2 ${!isSubmittingForm ? 'border-gray-800 text-gray-800 hover:cursor-pointer hover:bg-gray-800 hover:text-white hover:opacity-90' : 'border-gray-600 text-gray-600'} transition ease-in-out`}
						disabled={isSubmittingForm}
					>
						Edit Product
					</button>
				</form>
			)}
		</div>
	);
}
