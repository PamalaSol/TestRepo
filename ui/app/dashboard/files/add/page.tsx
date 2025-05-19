'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useCallback, useMemo, useState } from 'react';
import { useTranslation } from '@/app/i18n/client';
import { useLang } from '../../_context/LangContext';
import { fileService, productFilesCatIds, resourcesCatIds } from '@/app/[lng]/_services/files';
import RequiredFieldAsterisk from '@/app/dashboard/_components/RequiredFieldAsterisk';

export default function AddFile() {
	const [title, setTitle] = useState<string>('');
	const [alt, setAlt] = useState<string>('');
	const [category, setCategory] = useState<string>('');
	const [file, setFile] = useState<File | null>(null);
	const [isSubmittingForm, setIsSubmittingForm] = useState<boolean>(false);

	const router = useRouter();

	const { lang } = useLang();

	const { t } = useTranslation(lang, 'horiz-scroll');

	const categories = useMemo(() => {
		const categoriesIds = resourcesCatIds.concat(productFilesCatIds);
		return categoriesIds
			.map((categoryId) => {
				let name = '';
				switch (categoryId) {
					case 1:
						name = 'Photos';
						break;
					case 2:
						name = t('videos');
						break;
					case 3:
						name = t('brochure');
						break;
					case 4:
						name = t('manufacturer');
						break;
					case 5:
						name = 'Dimensions';
						break;
					case 6:
						name = t('instructions');
						break;
					case 7:
						name = t('cads');
						break;
					case 8:
						name = t('dataSheets');
						break;
					case 9:
						name = t('parts');
						break;
				}
				return {
					id: categoryId,
					name,
				};
			})
			.sort((a, b) => a.id - b.id);
	}, []);

	const submitForm = useCallback(
		async (e: FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			if (!title) {
				alert('Please enter a title.');
				return;
			}
			if (!file) {
				alert('Please upload a file.');
				return;
			}
			setIsSubmittingForm(true);
			try {
				const response = await fileService.addFile(
					title,
					alt,
					parseInt(category),
					file,
					lang
				);
				if (response.isFailed === true) {
					alert('An error occured.');
				} else {
					alert('File added successfully');
				}
				setIsSubmittingForm(false);
				router.push('/dashboard/files');
			} catch (error) {
				setIsSubmittingForm(false);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[title, alt, category, file, lang]
	);

	const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			setFile(event.target.files[0]);
		}
	}, []);

	return (
		<div>
			<h2 className={`my-5 text-2xl font-semibold`}>{`Add File`}</h2>
			<p className="mb-4 w-full text-center font-semibold">
				If you&apos;re adding a new file, the file information must be in German.
			</p>
			<form className={`flex-col space-y-3`} onSubmit={submitForm}>
				<div className={`flex-col space-y-2`}>
					<label className={`block font-semibold`} htmlFor="title">
						{`Title`} <RequiredFieldAsterisk />
					</label>
					<input
						className={`w-full rounded border border-gray-300 p-2`}
						type="text"
						name="title"
						value={title}
						placeholder={`Insert title`}
						onChange={(e) => setTitle(e.currentTarget.value)}
						required
					/>
				</div>
				<div className={`flex-col space-y-2`}>
					<label className={`block font-semibold`} htmlFor="alt">{`Alt`}</label>
					<input
						className={`w-full rounded border border-gray-300 p-2`}
						type="text"
						name="alt"
						value={alt}
						placeholder={`Insert alt text`}
						onChange={(e) => setAlt(e.currentTarget.value)}
						required
					/>
				</div>
				<div className={`flex-col space-y-2`}>
					<label className={`block font-semibold`} htmlFor="alt">{`Category`}</label>
					<select
						className={`w-full rounded border border-gray-300 p-2`}
						name="category"
						value={category}
						onChange={(e) => setCategory(e.target.value)}
					>
						<option value="">Select category</option>
						{categories.map((category) => (
							<option key={category.id} value={category.id}>
								{category.name}
							</option>
						))}
					</select>
				</div>
				<div className={`flex-col space-y-2`}>
					<label className={`block font-semibold`} htmlFor="file">
						{`File`} <RequiredFieldAsterisk />
					</label>
					<input
						className={`w-full rounded border border-gray-300 p-2`}
						type="file"
						name="file"
						onChange={handleFileChange}
						required
					/>
				</div>
				<input
					className={`border-5 rounded-xl border px-4 py-2 ${!isSubmittingForm ? 'border-gray-800 text-gray-800 hover:cursor-pointer hover:bg-gray-800 hover:text-white hover:opacity-90' : 'border-gray-600 text-gray-600'} transition ease-in-out`}
					type="submit"
					value="Add File"
					disabled={isSubmittingForm}
				/>
			</form>
		</div>
	);
}
