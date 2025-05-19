'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useLang } from '../_context/LangContext';
import AddButton from '@/public/assets/add-icon.svg';
import DeleteButton from '@/public/assets/delete-icon.svg';
import { fileService, IFileCategory } from '@/app/[lng]/_services/files';
import { ProductFile } from '@/app/[lng]/_services/products';
import { useTranslation } from '@/app/i18n/client';
import Loader from '@/app/[lng]/_components/Loader';

export default function Files() {
	const showUnusedFeatures = false;

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isDeleting, setIsDeleting] = useState<boolean>(false);
	const [categories, setCategories] = useState<IFileCategory[]>([]);
	const [items, setItems] = useState<ProductFile[]>([]);

	const { lang } = useLang();

	const { t } = useTranslation(lang, 'horiz-scroll');

	const categoriesTranslationMap: { [categoryId: string]: string } = {
		1: 'Photos',
		2: t('videos'),
		3: t('brochure'),
		4: t('manufacturer'),
		5: 'Dimensions',
		6: t('instructions'),
		7: t('cads'),
		8: t('dataSheets'),
		9: t('parts'),
	};

	useEffect(() => {
		const fetchCategories = async () => {
			setIsLoading(true);
			setCategories([]);
			fileService
				.getFileCategories()
				.then((result) => {
					setCategories(result);
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
		fetchCategories();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const fetchFiles = async () => {
			setIsLoading(true);
			setItems([]);
			fileService
				.getFilesByCategory(
					categories.map((c) => c.id),
					lang
				)
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
		if (categories.length) {
			fetchFiles();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lang, categories]);

	const groupedFiles = useMemo(() => {
		return items.reduce(
			(acc, curr) => {
				if (!acc[curr.fileCategoryId]) {
					acc[curr.fileCategoryId] = [];
				}
				acc[curr.fileCategoryId].push(curr);
				return acc;
			},
			{} as Record<string, ProductFile[]>
		);
	}, [items]);

	const handleDeleteFile = async (id: string, fileName: string) => {
		setIsDeleting(true);
		try {
			await fileService.deleteFile(id, fileName, lang);
			alert('File deleted successfully!');
			window.location.reload();
		} catch (error) {
			alert('Failed to delete file.');
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<div className={`${isDeleting ? 'cursor-wait' : ''} space-y-6`}>
			<div className="mb-10 flex h-fit w-full items-center justify-center rounded-2xl bg-gray-800 pb-1">
				<div className="flex h-fit w-full items-start justify-between rounded-xl bg-gradient-to-br from-[#f7f7f7] from-45% via-gray-500 via-50% to-gray-800 to-80% p-4">
					<h2 className={`text-2xl font-semibold text-gray-800`}>{`Files`}</h2>
					<Link href={`/dashboard/files/add`}>
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
				<div className="grid-rows-auto h-full w-full gap-5 tablet:grid">
					{Object.keys(groupedFiles).map((category) => (
						<div
							className="grid-rows-auto h-full w-full grid-cols-5 gap-5 tablet:grid"
							key={`category-${category}`}
						>
							<h3 className={`col-span-5 text-xl font-semibold text-gray-800`}>
								{categoriesTranslationMap[category]
									? categoriesTranslationMap[category]
									: category}{' '}
								({groupedFiles[category]?.length ?? 0})
							</h3>
							{groupedFiles[category]?.map((item, idx) => (
								<div
									key={idx + item.id}
									className={`col-span-1 flex h-full w-full justify-center rounded-2xl bg-gray-800 pb-1 transition ease-in-out hover:shadow-2xl`}
								>
									<div className="w-full rounded-xl bg-gray-200 px-4 py-2">
										<div className="grid h-full w-full grid-cols-12 items-start">
											<Link
												href={`/dashboard/files/view/${item.id}`}
												className="col-span-11 w-full"
											>
												<p className="w-full break-words">
													{item.fileName}
												</p>
											</Link>
											<div className="col-span-1 flex flex-row items-start justify-end">
												{showUnusedFeatures && (
													<Link
														href={`/dashboard/files/edit/${item.id}`}
														className="text-sm font-medium hover:font-semibold"
													>
														<p className="">{`Edit`}</p>
													</Link>
												)}
												<button
													disabled={isDeleting}
													className={`hover:scale-125 ${isDeleting ? 'opacity-20' : ''} transition ease-in-out`}
													onClick={(e) => {
														e.stopPropagation();
														const confirmDelete = confirm(
															'Are you sure you want to delete the file? This action will delete the file for all languages.'
														);
														if (confirmDelete) {
															handleDeleteFile(
																item.id,
																item.fileName
															);
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
											{item.fileExtension.includes('image/') ? (
												<div className="col-span-12 flex flex-row items-center justify-center pt-2">
													<Link href={`/dashboard/files/view/${item.id}`}>
														<picture className="col-span-12">
															<source
																srcSet={`${process.env.API_URL}/files/${item?.id}/${item?.fileName}`}
																type={item.fileExtension}
															/>
															<img
																src={`${process.env.API_URL}/files/${item?.id}/${item?.fileName}`}
																alt={`File ${item?.alt}`}
																className="w-full"
															/>
														</picture>
													</Link>
												</div>
											) : null}
										</div>
									</div>
								</div>
							))}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
