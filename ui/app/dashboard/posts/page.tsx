'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLang } from '../_context/LangContext';
import AddButton from '@/public/assets/add-icon.svg';
import DeleteButton from '@/public/assets/delete-icon.svg';
import { IPost, postsService } from '@/app/[lng]/_services/posts';
import Loader from '@/app/[lng]/_components/Loader';
import { sortPostsByDate } from '@/app/[lng]/_services/utils';

export default function Posts() {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isDeleting, setIsDeleting] = useState<boolean>(false);
	const [featuredItems, setFeaturedItems] = useState<IPost[]>([]);
	const [items, setItems] = useState<IPost[]>([]);

	const { lang } = useLang();

	useEffect(() => {
		const fetchPosts = async () => {
			setIsLoading(true);
			setItems([]);
			postsService
				.getPosts(lang)
				.then((result) => {
					let featuredItems: IPost[] = [];
					let items: IPost[] = [];
					result.map((item) => {
						if (item.isFeatured) {
							featuredItems.push(item);
						} else {
							items.push(item);
						}
					});
					setFeaturedItems(featuredItems.sort(sortPostsByDate));
					setItems(items.sort(sortPostsByDate));
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
		fetchPosts();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lang]);

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

	const renderPost = (item: IPost, idx: number) => {
		return (
			<div
				key={idx + item.id}
				className={`col-span-1 flex h-full w-full items-center justify-center rounded-2xl bg-gray-800 pb-1 transition ease-in-out hover:shadow-2xl`}
			>
				<div className="h-full w-full rounded-xl bg-gray-200 px-4 py-2">
					<div className="grid w-full grid-cols-12">
						<Link
							href={`/dashboard/posts/view/${item.id}`}
							className="col-span-10 w-full"
						>
							<p className="w-full font-semibold">{item.name}</p>
						</Link>
						<div className="col-span-2 flex flex-row items-center justify-end space-x-1">
							<Link
								href={`/dashboard/posts/edit/${item.id}`}
								className="font-medium hover:font-semibold"
							>
								<p className="">{`Edit`}</p>
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
										handleDeletePost(item.id);
									}
								}}
							>
								<Image src={DeleteButton} alt="Delete button" className="h-[2vh]" />
							</button>
						</div>
						<div className="col-span-12">
							{item.dataImage && (
								<picture>
									{/* WebP source for modern browsers */}
									<source srcSet={item.dataImage} type="image/webp" />
									<img
										src={item.dataImage}
										alt={item.alt}
										className="w-[80vw] py-2 max-laptop:px-7 laptop:w-[30vw]"
									/>
								</picture>
							)}
							<p className="w-full break-words">
								{item.description.slice(0, 100)}
								{item.description.length >= 100 ? '...' : ''}
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className={`${isDeleting ? 'cursor-wait' : ''} space-y-6`}>
			<div className="mb-10 flex h-fit w-full items-center justify-center rounded-2xl bg-gray-800 pb-1">
				<div className="flex h-fit w-full items-start justify-between rounded-xl bg-gradient-to-br from-[#f7f7f7] from-45% via-gray-500 via-50% to-gray-800 to-80% p-4">
					<h2 className={`text-2xl font-semibold text-gray-800`}>{`Posts`}</h2>
					<Link href={`/dashboard/posts/add`}>
						<Image
							src={AddButton}
							alt="Add button"
							className="m-2 w-[1vw] hover:scale-125"
						/>
					</Link>
				</div>
			</div>
			{isLoading ? (
				<Loader />
			) : (
				<>
					{featuredItems.length ? (
						<>
							<h3
								className={`text-xl font-semibold text-gray-800`}
							>{`Featured (${featuredItems.length})`}</h3>
							<div className="grid-rows-auto h-full w-full grid-cols-4 gap-5 tablet:grid">
								{featuredItems.map((item, idx) => renderPost(item, idx))}
							</div>
							<hr />
						</>
					) : null}
					<div className="grid-rows-auto h-full w-full grid-cols-4 gap-5 tablet:grid">
						{items.map((item, idx) => renderPost(item, idx))}
					</div>
				</>
			)}
		</div>
	);
}
