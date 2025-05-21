/* eslint-disable @next/next/no-img-element */
'use client';

import tStyles from '@/app/[lng]/textSizes.module.css';
import { useTranslation } from '@/app/i18n/client';
import { toastDefaultOptions } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import ProductsSkeleton from '../_components/ProductsSkeleton';
import ShortBorder from '../_components/ShortBorder';
import { IPost, postsService } from '../_services/posts';
import { slugify } from '../_utils/slugify';
import { routeTranslations } from '@/app/i18n/settings';
import NewsListSchema from '../_components/NewsListSchema';
import BreadcrumbSchema from '../_components/BreadcrumbSchema';
import WebPageSchema from '../_components/WebPageSchema';
import { baseUrl } from '@/lib/consts';
import { sortPostsByDate } from '../_services/utils';
import styles from './news.module.css';

export default function News({ params }: { params: { lng: string } }) {
	const { lng } = params;
	const { t } = useTranslation(lng, 'news');
	const [isLoading, setIsLoading] = useState<boolean>(true);

	// Get the localized 'post' word for this language
	const localizedPostSegment = routeTranslations[lng as keyof typeof routeTranslations].post;

	// Get the localized 'news' word for this language
	const localizedNewsSegment = routeTranslations[lng as keyof typeof routeTranslations].news;

	const [posts, setPosts] = useState<IPost[]>([]);
	useEffect(() => {
		const fetchPosts = async () => {
			setIsLoading(true);
			postsService
				.getPosts(lng)
				.then((result) => {
					if (result.length === 0) {
						toast.error(t('noData'), toastDefaultOptions);
					}
					setPosts(result.sort(sortPostsByDate));
				})
				.catch((error) => {
					if (error.response && error.response.status) {
						const statusCode = error.response.status;
						if (statusCode === 404) {
							toast.error(t('noData'), toastDefaultOptions);
						} else if (statusCode === 500) {
							toast.error(t('serverError'), toastDefaultOptions);
						}
					} else {
						toast.error(t('unexpectedError'), toastDefaultOptions);
					}
				})
				.finally(() => {
					setIsLoading(false);
				});
		};

		fetchPosts();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const url = process.env.GENERAL_URL;

	const [transformItem, setTransformItem] = useState<{
		css: string;
		idx?: number;
		item?: string;
	}>({
		css: '',
		idx: 0,
	});

	return (
		<div className="relative">
			{!isLoading && (
				<>
					<WebPageSchema
						title={t('title') || 'News'}
						description={t('desc') || 'Latest news and updates'}
						url={`${baseUrl}/${lng}/${localizedNewsSegment}`}
						lng={lng}
					/>
					{posts.length > 0 && (
						<>
							<NewsListSchema posts={posts} lng={lng} />
							<BreadcrumbSchema
								items={[
									{
										name: t('home') || 'Home',
										url: `${baseUrl}/${lng}`,
									},
									{
										name: t('title') || 'News',
										url: `${baseUrl}/${lng}/${localizedNewsSegment}`,
									},
								]}
								lng={lng}
							/>
						</>
					)}
				</>
			)}

			<div className="mb-20 grid grid-cols-11 gap-x-2 max-laptop:mt-10 max-laptop:px-4 laptop:mt-0">
				<div className="col-span-11 lg:col-span-6"></div>
				<div className="col-span-11 py-6 pr-2 lg:col-span-5 ">
					<h1 className={`pb-3 ${tStyles.cat1}`}>{t('title')}</h1>
					<p className={`${tStyles.cat3}`}>{t('desc')}</p>
				</div>
			</div>

			{!isLoading ? (
				<div
					className={`flex w-full flex-col px-4 laptop:grid laptop:grid-cols-11 laptop:grid-rows-[auto]`}
					style={{ gridAutoRows: '1fr' }}
				>
					<div className="col-span-6 w-full pr-1 max-laptop:hidden">
						<div className={`my-2 h-[0.5px] w-full bg-[#C8C8C8]`}></div>
					</div>
					<div className="col-span-5 w-full pl-1 ">
						<div className={`my-2 h-[0.5px] w-full bg-[#C8C8C8]`}></div>
					</div>

					{posts.map((post, idx) => {
						// Generate the slug for the post title
						const postTitleSlug = slugify(post.name);

						const desktopLayout = (
							<div className="relative flex h-full flex-col pb-3 max-laptop:hidden">
								<div
									className={`${idx % 2 === 0 ? 'pr-2' : 'pl-2'} flex flex-1 flex-col`}
								>
									<div className="flex h-full flex-col">
										<Link
											href={`/${lng}/${localizedPostSegment}/${postTitleSlug}/${post.id}`}
											className="flex w-full justify-center"
										>
											<picture className="">
												<img
													src={post.dataImage ? post.dataImage : ''}
													alt={post.name}
													width="600"
													height="400"
													loading="lazy"
													className="h-[40vh] max-laptop:px-7"
												/>
											</picture>
										</Link>
										<div className="mt-4 flex flex-1 flex-col">
											<div
												className={`${idx % 2 === 0 ? 'w-[80%]' : 'w-[90%]'} mb-3`}
											>
												<p className={`${tStyles.cat1} break-words`}>
													{post.name}
												</p>
											</div>

											<div className="relative mb-10 mt-2 flex flex-1 flex-col">
												<p
													className={`laptop:leading-0 break-words text-justify text-[#B2B2B2] laptop-l:leading-[1.2rem] ${tStyles.productDescExtra}`}
												>
													{post.description}
												</p>
											</div>
										</div>
									</div>
								</div>

								<div className="absolute right-0 top-0 mr-1 flex flex-col justify-end">
									<p className="text-right font-medium laptop:text-3xl">
										{new Date(post.createdDate).toLocaleString('default', {
											day: '2-digit',
										})}
									</p>
									<p className="text-right text-sm font-light laptop:text-xl">
										{new Date(post.createdDate).toLocaleString('default', {
											month: 'long',
										})}
									</p>
								</div>
								<Link
									href={`/${lng}/${localizedPostSegment}/${postTitleSlug}/${post.id}`}
									className="absolute bottom-3 right-1"
								>
									<Image
										src="/assets/small-button.svg"
										alt="Button"
										width={53}
										height={53}
										priority
										className={`${transformItem.idx === idx ? `${transformItem.css}` : ''}  h-[40px] w-[40px] transition ease-in-out hover:opacity-80`}
									/>
								</Link>
							</div>
						);
						const mobileLayout = (
							<>
								<div
									className={`${styles.newsItem} grid h-full grid-cols-10 laptop:hidden`}
								>
									<div className="col-span-9 h-full w-full">
										<Link
											href={`/${lng}/${localizedPostSegment}/${postTitleSlug}/${post.id}`}
											className={`${styles.imageContainer}`}
										>
											<picture>
												<img
													src={post.dataImage ? post.dataImage : ''}
													alt={post.name}
													width="600"
													height="400"
													loading="lazy"
													className=""
												/>
											</picture>
										</Link>

										<div
											className={`${styles.contentWrapper} flex h-full flex-col`}
										>
											<div
												className={`${styles.titleContainer} flex flex-col gap-1`}
											>
												<p
													className={`${tStyles.postTitle} leading-[15px]`}
												>
													{post.name}
												</p>
											</div>
											<div className={`${styles.descriptionContainer}`}>
												<p
													className={`text-justify leading-[14px] text-[#B2B2B2] ${tStyles.productDescExtra}`}
												>
													{post.description}
												</p>
											</div>
										</div>
									</div>
									<div
										className={`col-span-1 flex h-full w-full flex-col justify-between`}
									>
										<div className="mr-1 flex flex-col justify-end ">
											<p className="text-right font-medium laptop:text-3xl">
												{new Date(post.createdDate).toLocaleString(
													'default',
													{
														day: '2-digit',
													}
												)}
											</p>
											<p className="text-right text-sm font-light laptop:text-xl">
												{new Date(post.createdDate).toLocaleString(
													'default',
													{
														month: 'long',
													}
												)}
											</p>
										</div>
										<Link
											href={`/${lng}/${localizedPostSegment}/${postTitleSlug}/${post.id}`}
											className={`${styles.arrowContainer}`}
										>
											<Image
												src="/assets/small-button.svg"
												alt="Button"
												width={53}
												height={53}
												priority
												className={`${transformItem.idx === idx ? `${transformItem.css}` : ''} h-[40px] w-[40px] transition ease-in-out hover:opacity-80`}
											/>
										</Link>
									</div>
								</div>
							</>
						);

						return (
							<div
								key={`product-item-series-${post.id}-${idx}`}
								className={`${idx % 2 === 0 ? 'laptop:col-span-6 laptop:border-r laptop:border-r-[#C8C8C8] ' : 'laptop:col-span-5 '} flex flex-col`}
								style={{ height: '100%' }}
								onPointerEnter={() => {
									if (window.matchMedia('(min-width: 1024px)').matches) {
										setTransformItem({ css: 'scale-110', idx: idx });
									}
								}}
								onPointerLeave={() => {
									if (window.matchMedia('(min-width: 1024px)').matches) {
										setTransformItem({ css: '', idx: 0, item: '' });
									}
								}}
							>
								{desktopLayout}
								<div className="laptop:hidden">
									{mobileLayout}
									{idx !== posts.length - 1 && <ShortBorder top={false} />}
								</div>
								{(posts.length % 2 === 0 && idx >= posts.length - 2) ||
								(posts.length % 2 !== 0 && idx === posts.length - 1) ? (
									<></>
								) : (
									<div className="max-laptop:hidden">
										<ShortBorder side={idx % 2 === 0 ? false : true} />
									</div>
								)}
							</div>
						);
					})}
				</div>
			) : (
				<ProductsSkeleton news />
			)}
			<ToastContainer />
		</div>
	);
}
