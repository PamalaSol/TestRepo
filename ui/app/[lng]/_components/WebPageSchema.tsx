import React, { useEffect } from 'react';
import { baseUrl } from '@/lib/consts';

interface WebPageSchemaProps {
	title: string;
	description: string;
	url: string;
	lng: string;
}

export default function WebPageSchema({ title, description, url, lng }: WebPageSchemaProps) {
	useEffect(() => {
		// Remove existing schema to avoid duplicates when language changes
		const existingSchema = document.querySelector('#webPageSchema');
		if (existingSchema) {
			existingSchema.remove();
		}

		// Create WebPage schema
		const webPageData = {
			'@context': 'https://schema.org',
			'@type': 'WebPage',
			name: title,
			description: description,
			url: url,
			inLanguage: lng,
			publisher: {
				'@type': 'Organization',
				name: 'HO-Matic',
				logo: {
					'@type': 'ImageObject',
					url: `${baseUrl}/assets/logo.png`,
				},
			},
		};

		// Insert the schema into the document
		const script = document.createElement('script');
		script.id = 'webPageSchema';
		script.type = 'application/ld+json';
		script.textContent = JSON.stringify(webPageData);
		document.head.appendChild(script);

		// Cleanup on unmount
		return () => {
			const schema = document.querySelector('#webPageSchema');
			if (schema) {
				schema.remove();
			}
		};
	}, [title, description, url, lng]); // Re-run when props change

	// This component doesn't render anything visible
	return null;
}
