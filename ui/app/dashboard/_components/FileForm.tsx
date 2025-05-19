'use client';

import { useCallback, useMemo, useState } from 'react';
import { useLang } from '@/app/dashboard/_context/LangContext';
import { useTranslation } from '@/app/i18n/client';
import { productFilesCatIds, resourcesCatIds } from '@/app/[lng]/_services/files';
import { IFileFormData } from '@/app/[lng]/_interfaces/interfaces';
import RequiredFieldAsterisk from './RequiredFieldAsterisk';

const FileForm = ({
	initialValues,
	onSubmit,
}: {
	initialValues: IFileFormData;
	onSubmit: () => void;
}) => {
	const [title, setTitle] = useState<string>(initialValues.title ?? '');
	const [alt, setAlt] = useState<string>(initialValues.alt ?? '');
	const [category, setCategory] = useState<string>(initialValues.category ?? '');
	const [file, setFile] = useState<File | null>(initialValues.file ?? null);

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

	const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			setFile(event.target.files[0]);
		}
	}, []);

	return (
		<>
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
				<label className={`block font-semibold`} htmlFor="category">{`Category`}</label>
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
		</>
	);
};

export default FileForm;
