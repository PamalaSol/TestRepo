'use client';

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { productService, productSuitableForDivider } from '@/app/[lng]/_services/products';
import RequiredFieldAsterisk from '@/app/dashboard/_components/RequiredFieldAsterisk';
import { ProductImage } from '@/app/[lng]/_interfaces/interfaces';
import { useLang } from '@/app/dashboard/_context/LangContext';
import { useRouter } from 'next/navigation';
import SettingsForm from '@/app/dashboard/_components/SettingsForm';

export default function AddProduct() {
	const [selectedFragment, setSelectedFragment] = useState<number>(1);

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

	const [productCategory, setProductCategory] = useState<number>(1);

	const [images, setImages] = useState<ProductImage[]>([]);
	const [newImageFile, setNewImageFile] = useState<File | null>(null);
	const [newImageAlt, setNewImageAlt] = useState<string>('');

	const [dimension, setDimension] = useState<ProductImage | null>(null);
	const [newDimensionFile, setNewDimensionFile] = useState<File | null>(null);

	const [isSubmittingForm, setIsSubmittingForm] = useState<boolean>(false);

	const [deletingImage, setDeletingImage] = useState<boolean>(false);

	const { lang } = useLang();
	const router = useRouter();

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
			setImages([...images, newImage]);
			setNewImageFile(null);
			setNewImageAlt('');
		}
	};

	const removeExistingImage = (idx: number) => {
		setDeletingImage(true);
		let updatedImages = [...images];
		updatedImages.splice(idx, 1);
		setImages(updatedImages);
		setDeletingImage(false);
	};

	const removeDimension = () => {
		setDimension(null);
		setNewDimensionFile(null);
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
			setNewDimensionFile(null);
		}
	};

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
		if (selectedFragment === 1) {
			if (!heading || !series || !screws) {
				alert('Please fill in all required fields.');
				return;
			}
		} else if (!heading) {
			alert('Please fill in all required fields.');
			return;
		}
		setIsSubmittingForm(true);
		const combinedImages = combineImagesAndDimension();
		try {
			const response = await productService.addProduct(
				heading,
				series,
				connectionType,
				housing,
				nominalWidth,
				material,
				suitableForItems.join(productSuitableForDivider),
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
				alert('Product added successfully');
				setIsSubmittingForm(false);
				router.push('/dashboard/products');
			}
		} catch (error) {
			console.error('Error adding product:', error);
			setIsSubmittingForm(false);
			alert('Failed to add product');
		}
	};

	useEffect(() => {
		setProductCategory(selectedFragment);
		const resetStates = () => {
			setHeading('');
			setSeries('');
			setConnectionType('');
			setHousing('');
			setNominalWidth('');
			setMaterial('');
			setSuitableFor('');
			setSuitableForItems([]);
			setConnectionMaterial('');
			setScrews('');
			setIndustries('');
			setImages([]);
			setNewImageFile(null);
			setNewImageAlt('');
			setDimension(null);
			setNewDimensionFile(null);
		};
		resetStates();
	}, [selectedFragment]);

	return (
		<div className="container px-4 py-6 mx-auto">
			<h2 className="mb-5 text-2xl font-semibold">Add Product</h2>
			<div className="flex items-center justify-center w-full pb-1 mb-10 bg-gray-800 h-fit rounded-2xl">
				<div className="flex h-fit w-full items-start justify-between rounded-xl bg-gradient-to-br from-[#f7f7f7] from-45% via-gray-500 via-50% to-gray-800 to-80% p-4">
					<button
						className={`${selectedFragment === 1 ? 'scale-105 text-lg font-bold text-[#E03616] ' : ''} cursor-pointer font-semibold text-gray-800 hover:scale-105`}
						onClick={() => {
							setSelectedFragment(1);
						}}
					>
						Pinch valve
					</button>
					<button
						className={`${selectedFragment === 3 ? 'scale-105 text-lg font-bold text-[#E03616] ' : ''} cursor-pointer font-semibold text-[#f7f7f7] hover:scale-105`}
						onClick={() => {
							setSelectedFragment(3);
						}}
					>
						Control / Accessory
					</button>
				</div>
			</div>

			<p className="w-full mb-4 font-semibold text-center">
				If you&apos;re adding a new product, the product information must be in German.
			</p>

			<form onSubmit={handleSubmit} className="space-y-3">
				<div className={`flex-col space-y-2`}>
					<label className="block font-semibold" htmlFor="heading">
						Heading <RequiredFieldAsterisk />
					</label>
					<input
						type="text"
						className="w-full p-2 border border-gray-300 rounded"
						name="heading"
						value={heading}
						placeholder={`Insert product heading`}
						onChange={(e) => setHeading(e.target.value)}
					/>
				</div>
				{selectedFragment === 1 && (
					<div className="space-y-2">
						<div className={`flex-col space-y-2`}>
							<label className="block font-semibold" htmlFor="connectionType">
								Connection Type
							</label>
							<textarea
								className="w-full p-2 border border-gray-300 rounded"
								name="connectionType"
								value={connectionType}
								placeholder={`Insert product connection type`}
								onChange={(e) => setConnectionType(e.target.value)}
							/>
						</div>
						<div className={`flex-col space-y-2`}>
							<label className="block font-semibold" htmlFor="housing">
								Housing
							</label>
							<textarea
								className="w-full p-2 border border-gray-300 rounded"
								name="housing"
								value={housing}
								placeholder={`Insert product housing`}
								onChange={(e) => setHousing(e.target.value)}
							/>
						</div>
						<div className={`flex-col space-y-2`}>
							<label className="block font-semibold" htmlFor="series">
								Series {selectedFragment === 1 && <RequiredFieldAsterisk />}
							</label>
							<input
								type="text"
								className="w-full p-2 border border-gray-300 rounded"
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
								className="w-full p-2 border border-gray-300 rounded"
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
								className="w-full p-2 border border-gray-300 rounded"
								name="material"
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
						<hr />
						<div className={`flex-col space-y-2`}>
							<label className="block font-semibold" htmlFor="connectionMaterial">
								Connection Material
							</label>
							<input
								type="text"
								className="w-full p-2 border border-gray-300 rounded"
								name="connectionMaterial"
								value={connectionMaterial}
								placeholder={`Insert product connection material`}
								onChange={(e) => setConnectionMaterial(e.target.value)}
							/>
						</div>
						<div className={`flex-col space-y-2`}>
							<label className="block font-semibold" htmlFor="screws">
								Screws {selectedFragment === 1 && <RequiredFieldAsterisk />}
							</label>
							<input
								type="text"
								className="w-full p-2 border border-gray-300 rounded"
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
								className="w-full p-2 border border-gray-300 rounded"
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
					{images.length ? (
						<>
							<div className="grid grid-cols-6 gap-4 pt-2 mb-4">
								{images.map((img, idx) => (
									<div
										key={`${img.file.name}-${idx}`}
										className="flex flex-col items-center"
									>
										
										<img src={URL.createObjectURL(img.file)} />
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
													removeExistingImage(idx);
												}
											}}
										>
											Delete
										</button>
									</div>
								))}
							</div>
						</>
					) : null}
					{newImageFile ? (
						<div className="grid grid-cols-4">
							<img src={URL.createObjectURL(newImageFile)} />
						</div>
					) : null}
					<div>
						<input
							type="file"
							accept="image/webp"
							className="w-full p-2 border border-gray-300 rounded"
							onChange={handleImageChange}
						/>
						<p className="text-sm text-gray-600">Accepts only webp images</p>
					</div>
					<input
						type="text"
						className="w-full p-2 border border-gray-300 rounded"
						value={newImageAlt}
						name="newImageAlt"
						onChange={(e) => setNewImageAlt(e.target.value)}
						placeholder="Short description of what is on the image"
					/>
					<button
						type="button"
						className={`rounded-xl bg-gray-800 px-4 py-2 ${!newImageFile ? 'text-gray-400' : 'text-white hover:cursor-pointer hover:opacity-90'} transition ease-in-out`}
						disabled={!newImageFile}
						onClick={(e) => {
							addImageToArray();
						}}
					>
						Add Image
					</button>
				</div>
				<hr />
				{/* {selectedFragment === 1 && (
					<div className={`flex-col space-y-2`}>
						<label className="block font-semibold">Settings</label>
						<SettingsForm
							initialValues={{
								series: '',
								dm: '',
								qualities: [],
								version: [],
								v2Name: [],
								v2Qualities: [],
							}}
							onSubmit={() => {
								console.log('Settings form submitted!');
							}}
						/>
					</div>
				)}
				<hr /> */}
				{selectedFragment === 1 && (
					<div className={`flex-col space-y-2`}>
						<label className="block font-semibold">Dimension photo</label>
						<input
							type="file"
							className="w-full p-2 border border-gray-300 rounded"
							onChange={handleDimensionChange}
						/>
						<button
							type="button"
							className={`rounded-xl bg-gray-800 px-4 py-2 ${!newDimensionFile ? 'text-gray-400' : 'text-white hover:cursor-pointer hover:opacity-90'} transition ease-in-out`}
							disabled={!newDimensionFile}
							onClick={(e) => {
								addDimension();
							}}
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
					Add Product
				</button>
			</form>
		</div>
	);
}
