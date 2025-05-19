'use client';
import { useLang } from '@/app/dashboard/_context/LangContext';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import EditButton from '@/public/assets/edit-icon.svg';
import DeleteButton from '@/public/assets/delete-icon.svg';
import Link from 'next/link';
import { IGetOneResponse, postsService } from '@/app/[lng]/_services/posts';
import DOMPurify from 'dompurify';
import Loader from '@/app/[lng]/_components/Loader';

export default function ViewPost({ params }: { params: { post: string } }) {
	const { post: pId } = params;

	const { lang } = useLang();

	const [item, setItem] = useState<IGetOneResponse | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isDeleting, setIsDeleting] = useState<boolean>(false);

	useEffect(() => {
		setIsLoading(true);
		const fetchPost = async () => {
			postsService
				.getPost(pId, lang)
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
		fetchPost();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lang]);

	const formatDate = (date: string) => {
		const d = new Date(date);
		const options: Intl.DateTimeFormatOptions = {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric',
		};
		return d.toLocaleDateString('en-US', options);
	};

	const handleDeletePost = async (id: string) => {
		setIsDeleting(true);
		try {
			const result = await postsService.deletePost(id, lang);
			alert('Post deleted successfully.');
			window.location.reload();
		} catch (error) {
			alert('Failed to delete post.');
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<div className="container w-full">
			<div className="mb-10 flex h-fit w-full items-center justify-center rounded-2xl bg-gray-800 pb-1">
				<div className="flex h-fit w-full items-start justify-between rounded-xl bg-gradient-to-br from-[#f7f7f7] from-45% via-gray-500 via-50% to-gray-800 to-80% p-4">
					<h2 className={`text-2xl font-semibold text-gray-800`}>{`Post details`}</h2>
					<div className="flex items-center">
						<Link href={`/dashboard/posts/edit/${pId}`}>
							<Image
								src={EditButton}
								alt="Edit button"
								className="m-2 w-[1vw] hover:scale-125 transition ease-in-out"
							/>
						</Link>
						<button
							disabled={isDeleting}
							className={`hover:scale-125 ${isDeleting ? 'opacity-20' : ''} transition ease-in-out`}
							onClick={(e) => {
								e.stopPropagation();
								const confirmDelete = confirm(
									'Are you sure you want to delete the post? This action will delete the post for all languages.'
								);
								if (confirmDelete) {
									handleDeletePost(pId);
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
			{isLoading ? (
				<Loader />
			) : (
				<>
					{item?.data && (
						<div>
							<div className="grid grid-cols-12">
								<div className="col-span-8 space-y-3">
									<div>
										<p className="font-bold laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-lg">
											Name:
										</p>
										<p className="laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-lg break-words">
											{item.data.name}
										</p>
									</div>
									<div>
										<p className="font-bold laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-lg">
											Description
										</p>
										<p className="laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-lg break-words">
											{item.data.description}
										</p>
									</div>
									<div>
										<p className="font-bold laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-lg">
											Content
										</p>
										<div
											className="laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-lg break-words"
											dangerouslySetInnerHTML={{
												__html: DOMPurify.sanitize(item.data.content || ''),
											}}
										/>
									</div>
								</div>
								<div className="col-span-4 space-y-3">
									{item.data.dataImage?.length > 0 ? (
										<picture>
											<source
												srcSet={`${process.env.API_URL}/files/${item.data.imageId}/${item.data.imageId}`}
												type="image/webp"
											/>
											<img
												src={`${process.env.API_URL}/files/${item.data.imageId}/${item.data.imageId}`}
												alt={`${item.data.imageId}`}
											/>
										</picture>
									) : (
										<div className="flex w-full items-center justify-center">
											<p>No image available</p>
										</div>
									)}
									{item.data.alt && (
										<div>
											<p className="font-bold laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-lg">
												Alt
											</p>
											<p className="laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-lg">
												{item.data.alt}
											</p>
										</div>
									)}
									<div>
										<p className="font-bold laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-lg">
											Is Featured
										</p>
										<p className="laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-lg">
											<input
												type="checkbox"
												name="isFeatured"
												checked={item.data.isFeatured}
												disabled
											/>
										</p>
									</div>
									{item.data.categories.length > 0 && (
										<div>
											<p className="font-bold laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-lg">
												Categories
											</p>
											<div className="flex w-full items-center justify-center">
												<p>No categories</p>
											</div>
										</div>
									)}
									{item.data.tags.length > 0 && (
										<div>
											<p className="font-bold laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-lg">
												Tags
											</p>
											<div className="flex w-full items-center justify-center">
												<p>No tags</p>
											</div>
										</div>
									)}
									{item.data.keywords && (
										<div>
											<p className="font-bold laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-lg">
												Keywords
											</p>
											<p className="laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-lg">
												{item.data.keywords}
											</p>
										</div>
									)}
									<div>
										<p className="font-bold laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-lg">
											Created
										</p>
										<p className="laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-lg">
											{formatDate(item.data.createdDate)}
										</p>
									</div>
									{item.data.createdDate !== item.data.modifiedOn && (
										<div>
											<p className="font-bold laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-lg">
												Modified
											</p>
											<p className="laptop:text-[0.6rem] laptop-l:text-xs laptop-xl:text-sm laptop-xl-extra:text-lg">
												{formatDate(item.data.modifiedOn)}
											</p>
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
