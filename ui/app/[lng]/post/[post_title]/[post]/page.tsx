/* eslint-disable @next/next/no-img-element */
'use client';

import Loader from '@/app/[lng]/_components/Loader';
import { IGetOneResponse, postsService } from '@/app/[lng]/_services/posts';
import tStyles from '@/app/[lng]/textSizes.module.css';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/app/i18n/client';
import DOMPurify from 'dompurify';
import { slugify } from '@/app/[lng]/_utils/slugify';
import { useRouter } from 'next/navigation';
import NewsArticleSchema from '@/app/[lng]/_components/NewsArticleSchema';
import BreadcrumbSchema from '@/app/[lng]/_components/BreadcrumbSchema';
import { baseUrl } from '@/lib/consts';
import { routeTranslations } from '@/app/i18n/settings';

export default function Post({
	params,
}: {
	params: { post: string; post_title: string; lng: string };
}) {
	const { post, post_title, lng } = params;
	const router = useRouter();

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [postDetails, setPostDetails] = useState<IGetOneResponse>();
	const [error, setError] = useState<string>('');

	const { t } = useTranslation(lng, 'news');

	// Get the localized 'post' and 'news' words for this language
	const localizedPostSegment = routeTranslations[lng as keyof typeof routeTranslations].post;
	const localizedNewsSegment = routeTranslations[lng as keyof typeof routeTranslations].news;

	useEffect(() => {
		const fetchPost = () => {
			postsService
				.getPost(post, lng)
				.then((result) => {
					setPostDetails(result);

					// Check if slug from URL matches the post title
					const expectedSlug = slugify(result.data.name);
					if (post_title !== expectedSlug) {
						// Redirect to the correct URL with proper slug
						router.replace(`/${lng}/post/${expectedSlug}/${post}`);
						return;
					}

					document.title = `${result.data.name}`;
					const metaDescription = document.querySelector('meta[name="description"]');
					if (metaDescription) {
						const truncatedDescription =
							result.data.description.length > 155
								? result.data.description.slice(0, 155 - 1) + '…'
								: result.data.description;
						metaDescription.setAttribute('content', truncatedDescription);
					} else {
						// If <meta name="description"> tag doesn't exist, create and append it
						const newMeta = document.createElement('meta');
						newMeta.name = 'description';
						const truncatedDescription =
							result.data.description.length > 155
								? result.data.description.slice(0, 155 - 1) + '…'
								: result.data.description;
						newMeta.content = truncatedDescription;
						document.head.appendChild(newMeta);
					}
				})
				.catch((error) => {
					const statusCode = error.response?.status;
					if (statusCode === 404) {
						setError(t('noData'));
					} else if (statusCode === 500) {
						setError(t('serverError'));
					} else {
						setError(t('unexpectedError'));
					}
				})
				.finally(() => {
					setIsLoading(false);
				});
		};

		fetchPost();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [post, post_title, lng, router]);

	const url = process.env.GENERAL_URL;
	const unusedFeatures = false;
	return (
		<>
			{!isLoading && postDetails?.data && (
				<>
					<NewsArticleSchema post={postDetails.data} lng={lng} slug={post_title} />
					<BreadcrumbSchema
						items={[
							{
								name: t('home') || 'Home',
								url: `${baseUrl}/${lng}`,
							},
							{
								name: t('news') || 'News',
								url: `${baseUrl}/${lng}/${localizedNewsSegment}`,
							},
							{
								name: postDetails.data.name,
								url: `${baseUrl}/${lng}/${localizedPostSegment}/${post_title}/${post}`,
							},
						]}
						lng={lng}
					/>
				</>
			)}
			{!isLoading ? (
				<div className="relative grid grid-cols-11 gap-2 px-4 py-6">
					{postDetails?.data.dataImage ? (
						<div className="top-0 col-span-11 h-fit w-fit lg:col-span-6 laptop:sticky">
							<img
								src={postDetails?.data.dataImage ? postDetails.data.dataImage : ''}
								alt="alt"
							/>
						</div>
					) : null}
					<div
						className={`col-span-11 ${postDetails?.data.dataImage ? 'lg:col-span-5' : 'lg:col-span-11'}`}
					>
						<div className="flex flex-col space-y-3">
							<div className="flex flex-col">
								<h1 className={`pb-3 ${tStyles.postTitleDetails}`}>
									{postDetails?.data.name}
								</h1>
							</div>
							<div
								className="post-details-content flex flex-col space-y-3"
								dangerouslySetInnerHTML={{
									__html: DOMPurify.sanitize(postDetails?.data.content || ''),
								}}
							/>
						</div>
					</div>
				</div>
			) : (
				<div className="grid grid-cols-12">
					<div className="col-span-12 flex w-full items-center justify-center text-center">
						<Loader />
					</div>
				</div>
			)}
		</>
	);
}
