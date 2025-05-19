'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { routeTranslations } from '@/app/i18n/settings';
import { slugify } from '../_utils/slugify';

interface LocalizedLinkProps {
	href: string;
	lng: string;
	children: ReactNode;
	className?: string;
	prefetch?: boolean;
	currentPost?: string; // The post ID
	translatedTitles?: Record<string, string>; // Mapped titles for posts in different languages
	[key: string]: any; // For any other props
}

/**
 * A component that wraps Next.js Link and automatically generates localized URLs
 */
export default function LocalizedLink({
	href,
	lng,
	children,
	className = '',
	prefetch,
	currentPost,
	translatedTitles,
	...rest
}: LocalizedLinkProps) {
	// Function to create a localized URL
	const getLocalizedUrl = (path: string, language: string): string => {
		// Home page case
		if (path === '/' || path === '') {
			return `/${language}`;
		}

		// Remove leading slash if it exists
		const cleanPath = path.startsWith('/') ? path.substring(1) : path;

		// Split the path into segments
		const segments = cleanPath.split('/');

		// If it already has a language prefix, remove it
		if (segments[0] && segments[0].match(/[a-z]{2}-[A-Z]{2}/)) {
			segments.shift();
		}

		// No segments left after removing language prefix
		if (segments.length === 0) {
			return `/${language}`;
		}

		// The first segment is the page name we want to translate
		const firstSegment = segments[0];

		// Special handling for post URLs with translated titles
		if (firstSegment === 'post' && segments.length >= 2 && currentPost) {
			// Get localized post word for the target language
			const langKey = language as keyof typeof routeTranslations;
			const localizedPostSegment = routeTranslations[langKey].post;

			// Get the translated title for this language if available
			const title = translatedTitles?.[language] || segments[1];

			// For the new URL format with title and ID
			if (segments.length >= 3) {
				return `/${language}/${localizedPostSegment}/${title}/${segments[2]}`;
			}

			// If we just have post/id (old format)
			return `/${language}/${localizedPostSegment}/${title}/${currentPost}`;
		}

		// If we have translations for this page
		const langKey = language as keyof typeof routeTranslations;
		if (
			routeTranslations[langKey] &&
			routeTranslations[langKey][
				firstSegment as keyof (typeof routeTranslations)[typeof langKey]
			]
		) {
			segments[0] =
				routeTranslations[langKey][
					firstSegment as keyof (typeof routeTranslations)[typeof langKey]
				];
		}

		// Reconstruct the path
		return `/${language}/${segments.join('/')}`;
	};

	// Generate the localized URL
	const localizedHref = getLocalizedUrl(href, lng);

	return (
		<Link href={localizedHref} className={className} prefetch={prefetch} {...rest}>
			{children}
		</Link>
	);
}
