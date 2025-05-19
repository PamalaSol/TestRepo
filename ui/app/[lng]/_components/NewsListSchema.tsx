import React, { useEffect } from 'react';
import { IPost } from '../_services/posts';
import { baseUrl } from '@/lib/consts';
import { routeTranslations } from '@/app/i18n/settings';
import { slugify } from '../_utils/slugify';

interface NewsListSchemaProps {
	posts: IPost[];
	lng: string;
}

export default function NewsListSchema({ posts, lng }: NewsListSchemaProps) {
	useEffect(() => {
		// Remove existing schema to avoid duplicates when language changes
		const existingSchema = document.querySelector('#newsListSchema');
		if (existingSchema) {
			existingSchema.remove();
		}

		// Get the localized 'post' word for this language
		const localizedPostSegment = routeTranslations[lng as keyof typeof routeTranslations].post;

		// Create ItemList schema
		const itemListData = {
			'@context': 'https://schema.org',
			'@type': 'ItemList',
			itemListElement: posts.map((post, index) => {
				const postTitleSlug = slugify(post.name);
				return {
					'@type': 'ListItem',
					position: index + 1,
					item: {
						'@type': 'NewsArticle',
						headline: post.name,
						description: post.description,
						image: post.dataImage ? [post.dataImage] : [],
						datePublished: post.createdDate,
						dateModified: post.modifiedOn,
						url: `${baseUrl}/${lng}/${localizedPostSegment}/${postTitleSlug}/${post.id}`,
					},
				};
			}),
		};

		// Insert the schema into the document
		const script = document.createElement('script');
		script.id = 'newsListSchema';
		script.type = 'application/ld+json';
		script.textContent = JSON.stringify(itemListData);
		document.head.appendChild(script);

		// Cleanup on unmount
		return () => {
			const schema = document.querySelector('#newsListSchema');
			if (schema) {
				schema.remove();
			}
		};
	}, [posts, lng]); // Re-run when posts or language changes

	// This component doesn't render anything visible
	return null;
}
