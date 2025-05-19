'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { languages, getCanonicalPath, routeTranslations } from '@/app/i18n/settings';
import LocalizedLink from './LocalizedLink';
import { postsService } from '../_services/posts';
import { slugify } from '../_utils/slugify';

interface LanguageSwitcherProps {
	currentLng: string;
	className?: string;
}

/**
 * A component that renders language switching links with localized URLs
 */
export default function LanguageSwitcher({ currentLng, className = '' }: LanguageSwitcherProps) {
	const pathname = usePathname();
	const [translatedTitles, setTranslatedTitles] = useState<Record<string, string>>({});
	const [currentPost, setCurrentPost] = useState<string | null>(null);

	// Function to get the canonical path for the current localized URL
	const extractCanonicalPath = (path: string) => {
		// If canonicalPath isn't found, fall back to 'root'
		return getCanonicalPath(path) || '/';
	};

	// Get the canonical path for the current URL
	const canonicalPath = extractCanonicalPath(pathname);

	// Check if current page is a post page and extract post ID
	useEffect(() => {
		// Check if this is a post URL
		const segments = pathname.split('/').filter(Boolean);

		// Check if the second segment is 'post' or any of its translations
		const isPostRoute =
			segments.length >= 3 &&
			(segments[1] === 'post' || segments[1] === 'beitrag' || segments[1] === 'article');

		if (isPostRoute) {
			// For new URL structure /[lng]/post/[post_title]/[post]
			// The post ID is now the last segment
			const postId = segments[segments.length - 1];
			setCurrentPost(postId);

			// Fetch translated titles for all languages
			const fetchTranslatedTitles = async () => {
				const titlePromises = languages.map(async (lng) => {
					try {
						const postData = await postsService.getPost(postId, lng);
						return { lng, title: slugify(postData.data.name) };
					} catch (error) {
						console.error(`Error fetching post in ${lng}:`, error);
						return { lng, title: '' }; // Empty title as fallback
					}
				});

				const titles = await Promise.all(titlePromises);
				const titlesMap: Record<string, string> = {};
				titles.forEach(({ lng, title }) => {
					titlesMap[lng] = title;
				});

				setTranslatedTitles(titlesMap);
			};

			fetchTranslatedTitles();
		}
	}, [pathname]);

	return (
		<div className={className}>
			{languages.map((lng) => (
				<LocalizedLink
					key={lng}
					href={canonicalPath}
					lng={lng}
					className={`language-switcher-link ${currentLng === lng ? 'active' : ''}`}
					currentPost={currentPost || undefined}
					translatedTitles={translatedTitles}
				>
					{lng.split('-')[0]}
				</LocalizedLink>
			))}
		</div>
	);
}
