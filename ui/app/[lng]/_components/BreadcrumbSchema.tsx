import React, { useEffect } from 'react';
import { baseUrl } from '@/lib/consts';
import { routeTranslations } from '@/app/i18n/settings';

interface BreadcrumbItem {
	name: string;
	url: string;
}

interface BreadcrumbSchemaProps {
	items: BreadcrumbItem[];
	lng: string;
}

export default function BreadcrumbSchema({ items, lng }: BreadcrumbSchemaProps) {
	useEffect(() => {
		// Remove existing schema to avoid duplicates when language changes
		const existingSchema = document.querySelector('#breadcrumbSchema');
		if (existingSchema) {
			existingSchema.remove();
		}

		// Create breadcrumb schema
		const breadcrumbData = {
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: items.map((item, index) => ({
				'@type': 'ListItem',
				position: index + 1,
				name: item.name,
				item: item.url,
			})),
		};

		// Insert the schema into the document
		const script = document.createElement('script');
		script.id = 'breadcrumbSchema';
		script.type = 'application/ld+json';
		script.textContent = JSON.stringify(breadcrumbData);
		document.head.appendChild(script);

		// Cleanup on unmount
		return () => {
			const schema = document.querySelector('#breadcrumbSchema');
			if (schema) {
				schema.remove();
			}
		};
	}, [items, lng]); // Re-run when items or language changes

	// This component doesn't render anything visible
	return null;
}
