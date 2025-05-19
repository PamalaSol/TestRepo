import React, { useEffect } from 'react';
import { IPost } from '../_services/posts';
import { baseUrl } from '@/lib/consts';

interface NewsArticleSchemaProps {
	post: IPost;
	lng: string;
	slug: string;
}

export default function NewsArticleSchema({ post, lng, slug }: NewsArticleSchemaProps) {
	useEffect(() => {
		// Remove any existing schema to avoid duplicates when language changes
		const existingSchema = document.querySelector('#newsArticleSchema');
		if (existingSchema) {
			existingSchema.remove();
		}

		// Process keywords if they exist
		const keywordsList = post.keywords ? post.keywords.split(',').map((kw) => kw.trim()) : [];

		// Create the schema markup
		const schemaData = {
			'@context': 'https://schema.org',
			'@type': 'NewsArticle',
			headline: post.name,
			description: post.description,
			image: post.dataImage ? [post.dataImage] : [],
			datePublished: post.createdDate,
			dateModified: post.modifiedOn,
			keywords: keywordsList,
			author: {
				'@type': 'Organization',
				name: 'HO-Matic',
			},
			publisher: {
				'@type': 'Organization',
				name: 'HO-Matic',
				logo: {
					'@type': 'ImageObject',
					url: `${baseUrl}/assets/logo.png`,
				},
			},
			mainEntityOfPage: {
				'@type': 'WebPage',
				'@id': `${baseUrl}/${lng}/post/${slug}/${post.id}`,
			},
			inLanguage: lng,
			articleBody: post.content ? stripHtml(post.content) : post.description,
		};

		// Create a script element to insert the schema
		const script = document.createElement('script');
		script.id = 'newsArticleSchema';
		script.type = 'application/ld+json';
		script.textContent = JSON.stringify(schemaData);
		document.head.appendChild(script);

		// Cleanup on unmount
		return () => {
			const schema = document.querySelector('#newsArticleSchema');
			if (schema) {
				schema.remove();
			}
		};
	}, [post, lng, slug]); // Re-run when post data, language, or slug changes

	// Helper function to strip HTML from content
	const stripHtml = (html: string) => {
		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = html;
		return tempDiv.textContent || tempDiv.innerText || '';
	};

	// This component doesn't render anything visible
	return null;
}
