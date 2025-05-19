'use client';

import { IProductFormData, ProductImage } from '@/app/[lng]/_interfaces/interfaces';
import { productSuitableForDivider } from '@/app/[lng]/_services/products';
import { ChangeEvent, useState } from 'react';
import RequiredFieldAsterisk from './RequiredFieldAsterisk';

const ProductForm = ({
	initialValues,
	onSubmit,
}: {
	initialValues: IProductFormData;
	onSubmit: () => void;
}) => {
	const [heading, setHeading] = useState<string>(initialValues.heading ?? '');
	const [series, setSeries] = useState<string>(initialValues.series ?? '');
	const [connectionType, setConnectionType] = useState<string>(
		initialValues.connectionType ?? ''
	);
	const [housing, setHousing] = useState<string>(initialValues.housing ?? '');
	const [nominalWidth, setNominalWidth] = useState<string>(initialValues.nominalWidth ?? '');
	const [material, setMaterial] = useState<string>(initialValues.material ?? '');
	const [suitableFor, setSuitableFor] = useState<string>('');
	const [suitableForItems, setSuitableForItems] = useState<string[]>(
		initialValues.suitableFor?.split(productSuitableForDivider) ?? []
	);
	const [connectionMaterial, setConnectionMaterial] = useState<string>(
		initialValues.connectionMaterial ?? ''
	);
	const [screws, setScrews] = useState<string>(initialValues.screws ?? '');
	const [industries, setIndustries] = useState<string>(initialValues.industries ?? '');

	const [productCategory, setProductCategory] = useState<number>(1);

	const [images, setImages] = useState<ProductImage[]>([]);
	const [newImageFile, setNewImageFile] = useState<File | null>(null);
	const [newImageAlt, setNewImageAlt] = useState<string>('');

	const [dimension, setDimension] = useState<ProductImage | null>(null);
	const [newDimensionFile, setNewDimensionFile] = useState<File | null>(null);
	const [selectedFragment, setSelectedFragment] = useState<number>(1);

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

	const addDimension = () => {
		if (newDimensionFile) {
			const newDimension: ProductImage = {
				file: newDimensionFile,
				alt: 'Dimensions photo',
				category: 5,
			};
			setDimension(newDimension);
		}
	};

	return (
		<>
			<div className={`flex-col space-y-2`}>
				<label className="block text-gray-700" htmlFor="heading">
					Heading <RequiredFieldAsterisk />
				</label>
				<input
					type="text"
					className="w-full rounded border border-gray-300 p-2"
					name="heading"
					value={heading}
					placeholder={`Insert product heading`}
					onChange={(e) => setHeading(e.target.value)}
				/>
			</div>
			{selectedFragment === 1 && (
				<div className="space-y-2">
					<div className={`flex-col space-y-2`}>
						<label className="block text-gray-700" htmlFor="connectionType">
							Connection Type
						</label>
						<textarea
							className="w-full rounded border border-gray-300 p-2"
							name="connectionType"
							value={connectionType}
							placeholder={`Insert product connection type`}
							onChange={(e) => setConnectionType(e.target.value)}
						/>
					</div>
					<div className={`flex-col space-y-2`}>
						<label className="block text-gray-700" htmlFor="housing">
							Housing
						</label>
						<textarea
							className="w-full rounded border border-gray-300 p-2"
							name="housing"
							value={housing}
							placeholder={`Insert product housing`}
							onChange={(e) => setHousing(e.target.value)}
						/>
					</div>
					<div className={`flex-col space-y-2`}>
						<label className="block text-gray-700" htmlFor="series">
							Series {selectedFragment === 1 && <RequiredFieldAsterisk />}
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
						<label className="block text-gray-700" htmlFor="nominalWidth">
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
						<label className="block text-gray-700" htmlFor="material">
							Material
						</label>
						<input
							type="text"
							className="w-full rounded border border-gray-300 p-2"
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
							<label className={`block font-semibold`}>{`Suitable For items`}</label>
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
						<label className="block text-gray-700" htmlFor="screws">
							Screws
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
						<label className="block text-gray-700" htmlFor="industries">
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
				<label className="block text-gray-700">Images</label>
				<div>
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
					className="w-full rounded border border-gray-300 p-2"
					value={newImageAlt}
					onChange={(e) => setNewImageAlt(e.target.value)}
					placeholder="Short description of what is on the image"
				/>

				<button
					type="button"
					className="rounded-xl bg-gray-800 px-4 py-2 text-white"
					onClick={(e) => {
						addImageToArray();
					}}
				>
					Add Image
				</button>
			</div>
			{selectedFragment === 1 && (
				<div className={`flex-col space-y-2`}>
					<label className="block text-gray-700">Dimension photo</label>
					<input
						type="file"
						className="w-full rounded border border-gray-300 p-2"
						onChange={handleDimensionChange}
					/>
					<button
						type="button"
						className="rounded-xl bg-gray-800 px-4 py-2 text-white"
						onClick={(e) => {
							addDimension();
						}}
					>
						Add Image
					</button>
				</div>
			)}
		</>
	);
};

export default ProductForm;
