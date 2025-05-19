'use client';

import { useCallback, useState } from 'react';
import { IPostFormData } from '@/app/[lng]/_interfaces/interfaces';
import RequiredFieldAsterisk from './RequiredFieldAsterisk';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Dynamically import ReactQuill
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const PostForm = ({
	initialValues,
	handleFormChange,
}: {
	initialValues: IPostFormData;
	handleFormChange: (form: IPostFormData) => void;
}) => {
	const showUnusedFeatures = false;

	const [name, setName] = useState<string>(initialValues.name ?? '');
	const [description, setDescription] = useState<string>(initialValues.description ?? '');
	const [keywords, setKeywords] = useState<string>(initialValues.keywords ?? '');
	const [content, setContent] = useState<string>(initialValues.content ?? '');
	const [isFeatured, setIsFeatured] = useState<boolean>(initialValues.isFeatured ?? false);
	const [fetchedImage, setFetchedImage] = useState<File | null>(initialValues.image ?? null);
	const [image, setImage] = useState<File | null>(null);
	const [alt, setAlt] = useState<string>(initialValues.alt ?? '');
	const [category, setCategory] = useState<string>('');
	const [categories, setCategories] = useState<string[]>(initialValues.categories ?? []);
	const [tag, setTag] = useState<string>('');
	const [tags, setTags] = useState<string[]>(initialValues.tags ?? []);

	const addCategory = () => {
		const trimmedCategory = `${category.trim()}`;
		if (categories.length) {
			const foundCategoryIdx = categories.findIndex(
				(t) => trimmedCategory.toLowerCase() === t.toLowerCase()
			);
			if (foundCategoryIdx === -1) {
				handleChangeState('categories', [...categories, trimmedCategory]);
				setCategory('');
			}
		} else {
			handleChangeState('categories', [trimmedCategory]);
			setCategory('');
		}
	};

	const removeCategory = (index: number) => {
		let updatedCategories = [...categories];
		updatedCategories.splice(index, 1);
		handleChangeState('categories', updatedCategories);
	};

	const addTag = () => {
		const trimmedTag = `${tag.trim()}`;
		if (tags.length) {
			const foundTagIdx = tags.findIndex((t) => tag.toLowerCase() === t.toLowerCase());
			if (foundTagIdx === -1) {
				handleChangeState('tags', [...tags, trimmedTag]);
				setTag('');
			}
		} else {
			handleChangeState('tags', [trimmedTag]);
			setTag('');
		}
	};

	const removeTag = (index: number) => {
		let updatedTags = [...tags];
		updatedTags.splice(index, 1);
		handleChangeState('tags', updatedTags);
	};

	const handleChangeState = useCallback(
		(
			field:
				| 'name'
				| 'description'
				| 'keywords'
				| 'content'
				| 'isFeatured'
				| 'image'
				| 'alt'
				| 'categories'
				| 'tags',
			value: string | boolean | File | null | string[]
		) => {
			switch (field) {
				case 'name':
					setName(value as string);
					break;
				case 'description':
					setDescription(value as string);
					break;
				case 'keywords':
					setKeywords(value as string);
					break;
				case 'content':
					setContent(value as string);
					break;
				case 'isFeatured':
					setIsFeatured(value as boolean);
					break;
				case 'image':
					setImage(value as File | null);
					break;
				case 'alt':
					setAlt(value as string);
					break;
				case 'categories':
					setCategories(value as string[]);
					break;
				case 'tags':
					setTags(value as string[]);
					break;
			}
			handleFormChange({
				name,
				description,
				keywords,
				content,
				image,
				alt,
				isFeatured,
				categories,
				tags,
				[field]: value
			});
		},
		[name, description, keywords, content, image, alt, isFeatured, categories, tags]
	);

	return (
		<>
			<div className={`flex-col space-y-2`}>
				<label className={`block font-semibold`} htmlFor="name">
					{`Name`} <RequiredFieldAsterisk />
				</label>
				<input
					className={`w-full rounded border border-gray-300 p-2`}
					type="text"
					name="name"
					value={name}
					placeholder={`Insert name`}
					onChange={(e) => handleChangeState('name', e.currentTarget.value)}
					required
				/>
			</div>
			<div className={`flex-col space-y-2`}>
				<label
					className={`block font-semibold`}
					htmlFor="description"
				>{`Description`}</label>
				<textarea
					className={`w-full rounded border border-gray-300 p-2`}
					name="description"
					value={description}
					placeholder={`Insert description`}
					onChange={(e) => handleChangeState('description', e.currentTarget.value)}
				/>
			</div>
			<div className={`flex-col space-y-2`}>
				<label className={`block font-semibold`} htmlFor="content">
					{`Content`} <RequiredFieldAsterisk />
				</label>
				<ReactQuill
					className={`w-full bg-white`}
					placeholder={`Insert content`}
					value={content}
					onChange={(e) => {
						if (e === '<p><br></p>') {
							handleChangeState('content', '');
						} else {
							handleChangeState('content', e);
						}
					}}
					modules={{
						toolbar: [
							[{ header: [1, 2, 3, false] }],
							['bold', 'italic', 'underline', 'strike'],
							[{ align: [] }],
							[{ list: 'ordered' }, { list: 'bullet' }],
							['link', 'image'],
							['clean'],
						],
					}}
				/>
			</div>
			<div className={`flex-col space-y-2`}>
				<label
					className={`block font-semibold`}
					htmlFor="isFeatured"
				>{`Is featured`}</label>
				<input
					type="checkbox"
					name="isFeatured"
					checked={isFeatured}
					onChange={(e) => handleChangeState('isFeatured', e.currentTarget.checked)}
				/>
			</div>
			<div className={`flex-col space-y-2`}>
				<label className={`block font-semibold`} htmlFor="image">{`Image`}</label>
				{fetchedImage && !image ? (
					<div className="grid grid-cols-4">
						<img src={URL.createObjectURL(fetchedImage)} />
					</div>
				) : null}
				{image ? (
					<div className="grid grid-cols-4">
						<img src={URL.createObjectURL(image)} />
					</div>
				) : null}
				<div>
					<input
						className={`w-full rounded border border-gray-300 bg-white p-2`}
						type="file"
						accept="image/webp"
						name="image"
						placeholder={`Insert image`}
						onChange={(e) =>
							handleChangeState('image', e.target?.files ? e.target?.files[0] : null)
						}
					/>
					<p className="text-sm text-gray-600">Accepts only webp images</p>
				</div>
			</div>
			<div className={`flex-col space-y-2`}>
				<label className={`block font-semibold`} htmlFor="alt">{`Alt`}</label>
				<input
					className={`w-full rounded border border-gray-300 p-2`}
					type="text"
					name="alt"
					value={alt}
					placeholder={`Insert alt`}
					onChange={(e) => handleChangeState('alt', e.currentTarget.value)}
				/>
			</div>
			{showUnusedFeatures && (
				<>
					<div className={`flex-col space-y-2`}>
						<label
							className={`block font-semibold`}
							htmlFor="category"
						>{`Category`}</label>
						<input
							className={`w-full rounded border border-gray-300 p-2`}
							type="text"
							name="category"
							value={category}
							placeholder={`Insert category`}
							onChange={(e) => setCategory(e.currentTarget.value)}
						/>
						<button
							className={`rounded-xl bg-gray-800 px-4 py-2 ${category === '' ? 'text-gray-400' : 'text-white hover:cursor-pointer hover:opacity-90'} transition ease-in-out`}
							type="button"
							onClick={addCategory}
							disabled={category === ''}
						>
							{`Add category`}
						</button>
						<label className={`block font-semibold`}>{`Categories`}</label>
						{categories.length ? (
							<ul>
								{categories.map((c, idx) => (
									<li key={`category-item-${c}`}>
										{c}{' '}
										<button
											className={`font-semibold text-red-700`}
											title="Remove category"
											onClick={() => removeCategory(idx)}
										>
											X
										</button>
									</li>
								))}
							</ul>
						) : (
							<p className={`my-3`}>{`No categories found`}</p>
						)}
					</div>
					<div className={`flex-col space-y-2`}>
						<label className={`block font-semibold`} htmlFor="tag">{`Tag`}</label>
						<input
							className={`w-full rounded border border-gray-300 p-2`}
							type="text"
							name="tag"
							value={tag}
							placeholder={`Insert tag`}
							onChange={(e) => setTag(e.currentTarget.value)}
						/>
						<button
							className={`rounded-xl bg-gray-800 px-4 py-2 ${tag === '' ? 'text-gray-400' : 'text-white hover:cursor-pointer hover:opacity-90'} transition ease-in-out`}
							type="button"
							onClick={addTag}
							disabled={tag === ''}
						>
							{`Add tag`}
						</button>
						<label className={`block font-semibold`}>{`Tags`}</label>
						{tags.length ? (
							<ul>
								{tags.map((t, idx) => (
									<li key={`tag-item-${t}`}>
										{t}{' '}
										<button
											className={`font-semibold text-red-700`}
											title="Remove tag"
											onClick={() => removeTag(idx)}
										>
											X
										</button>
									</li>
								))}
							</ul>
						) : (
							<p className={`my-3`}>{`No tags found`}</p>
						)}
					</div>
					<div className={`flex-col space-y-2`}>
						<label
							className={`block font-semibold`}
							htmlFor="keywords"
						>{`Keywords`}</label>
						<input
							className={`w-full rounded border border-gray-300 p-2`}
							type="text"
							name="keywords"
							value={keywords}
							placeholder={`Insert keywords`}
							onChange={(e) => handleChangeState('keywords', e.currentTarget.value)}
						/>
					</div>
				</>
			)}
		</>
	);
};

export default PostForm;
