'use client';

import { fileService } from "@/app/[lng]/_services/files";
import { ProductFile } from "@/app/[lng]/_services/products";
import { useLang } from "@/app/dashboard/_context/LangContext";
import { useEffect, useState } from "react";
import { useTranslation } from "@/app/i18n/client";
import Image from 'next/image';
import DeleteButton from '@/public/assets/delete-icon.svg';

export default function ViewFile({ params }: { params: { file: string } }) {
	const { file: fId } = params;

	const { lang } = useLang();

	const { t } = useTranslation(lang, 'horiz-scroll');

	const [item, setItem] = useState<ProductFile | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isDeleting, setIsDeleting] = useState<boolean>(false);

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
		setIsLoading(true);
		const fetchFile = async () => {
			fileService
				.getFileDetails(fId, lang)
				.then((result) => {
					setItem(result);
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
		fetchFile();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lang, fId]);

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
		<div className="container w-full">
			<div className="mb-10 flex h-fit w-full items-center justify-center rounded-2xl bg-gray-800 pb-1">
				<div className="flex h-fit w-full items-start justify-between rounded-xl bg-gradient-to-br from-[#f7f7f7] from-45% via-gray-500 via-50% to-gray-800 to-80% p-4">
					<h2 className={`text-2xl font-semibold text-gray-800`}>{`File details`}</h2>
					<button
						disabled={isDeleting}
						className={`hover:scale-125 ${isDeleting ? 'opacity-20' : ''} transition ease-in-out`}
						onClick={(e) => {
							e.stopPropagation();
							const confirmDelete = confirm(
								'Are you sure you want to delete the file? This action will delete the file for all languages.'
							);
							if (item && confirmDelete) {
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
							className="m-2 w-[1vw] hover:scale-125 transition ease-in-out"
						/>
					</button>
				</div>
			</div>
			{item && (
				<div>
					<div className="grid grid-cols-12">
						<div className="col-span-2 space-y-3">
							{item.fileExtension.includes('image') ? (
								<picture className="col-span-12">
									<source
										srcSet={`${process.env.API_URL}/files/${item?.id}/${item?.fileName}`}
										type={item.fileName}
									/>
									<img
										src={`${process.env.API_URL}/files/${item?.id}/${item?.fileName}`}
										alt={`File ${item?.alt}`}
										className="w-full"
									/>
								</picture>
							) : null}
							<div>
								<p className="font-bold laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-lg">
									File name:
								</p>
								<p className="laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-lg">
									{item.fileName}
								</p>
							</div>
							<div>
								<p className="font-bold laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-lg">
									Alt:
								</p>
								<p className="laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-lg">
									{item.alt}
								</p>
							</div>
							<div>
								<p className="font-bold laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-lg">
									File category:
								</p>
								<p className="laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-lg">
									{categoriesTranslationMap[item.fileCategoryId] ? categoriesTranslationMap[item.fileCategoryId] : item.fileCategoryId}
								</p>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
