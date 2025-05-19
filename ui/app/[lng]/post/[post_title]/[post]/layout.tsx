import Footer from '@/app/[lng]/_components/Footer';
import { fallbackLng, languages, routeTranslations, getLocalizedPath } from '@/app/i18n/settings';
import { UseTranslation } from '@/app/i18n/index';
import { baseUrl } from '@/lib/consts';
import { postsService } from '@/app/[lng]/_services/posts';
import { slugify } from '@/app/[lng]/_utils/slugify';
import React from 'react';

export async function generateStaticParams() {
	return languages.map((lng) => ({ lng }));
}

export async function generateMetadata({
	params: { lng, post, post_title },
}: {
	params: { lng: string; post: string; post_title: string };
}) {
	if (languages.indexOf(lng) < 0) lng = fallbackLng;
	const { t } = await UseTranslation(lng, 'metadata');

	const languageAlternates: { [key: string]: string } = {};
	let canonicalUrl = '';
	let pageTitle = t('loadingPageTitle');
	let pageDescription = t('loadingPageDesc');

	const basePostConceptPath = '/post'; // The conceptual, unlocalized segment for a post URL structure
	try {
		const currentPostDetails = await postsService.getPost(post, lng);
		const currentActualSlug = slugify(currentPostDetails.data.name);
		// For the canonical URL, get the localized path for the current language and post concept
		// e.g., /de-DE/beitrag or /en-US/post
		const currentLocalizedBasePath = getLocalizedPath(lng, basePostConceptPath).replace(
			`/${lng}`,
			''
		); // e.g. /beitrag or /post
		canonicalUrl = `${baseUrl}/${lng}${currentLocalizedBasePath}/${currentActualSlug}/${post}`;

		pageTitle = currentPostDetails.data.name;
		pageDescription = currentPostDetails.data.description.substring(0, 160); // Basic truncation

		const alternatePromises = languages.map(async (langOpt) => {
			try {
				const postData = await postsService.getPost(post, langOpt);
				const localizedSlugForLangOpt = slugify(postData.data.name);
				const langOptLocalizedBasePath = getLocalizedPath(
					langOpt,
					basePostConceptPath
				).replace(`/${langOpt}`, '');
				const path = `/${langOpt}${langOptLocalizedBasePath}/${localizedSlugForLangOpt}/${post}`;
				return { language: langOpt, path: `${baseUrl}${path}` };
			} catch (error) {
				console.warn(`Post ID ${post} not found or error in language ${langOpt}:`, error);
				const langOptLocalizedBasePath = getLocalizedPath(
					langOpt,
					basePostConceptPath
				).replace(`/${langOpt}`, '');
				const fallbackPath = `/${langOpt}${langOptLocalizedBasePath}/${post_title}/${post}`; // Use slug from URL as fallback
				return { language: langOpt, path: `${baseUrl}${fallbackPath}` };
			}
		});

		const alternates = await Promise.all(alternatePromises);
		alternates.forEach((alt) => {
			if (alt.path) languageAlternates[alt.language] = alt.path;
		});

		const defaultLangAlternate = alternates.find((alt) => alt.language === fallbackLng);
		if (defaultLangAlternate?.path) {
			languageAlternates['x-default'] = defaultLangAlternate.path;
		} else {
			const fallbackDefaultLocalizedBasePath = getLocalizedPath(
				fallbackLng,
				basePostConceptPath
			).replace(`/${fallbackLng}`, '');
			languageAlternates['x-default'] =
				`${baseUrl}/${fallbackLng}${fallbackDefaultLocalizedBasePath}/${post_title}/${post}`;
		}
	} catch (error) {
		// Main error fetching current post for canonical
		console.error(`Failed to generate metadata for post ID ${post} in ${lng}:`, error);
		const currentLocalizedBasePath = getLocalizedPath(lng, basePostConceptPath).replace(
			`/${lng}`,
			''
		);
		canonicalUrl = `${baseUrl}/${lng}${currentLocalizedBasePath}/${post_title}/${post}`; // Fallback canonical

		languages.forEach((langOpt) => {
			const langOptLocalizedBasePath = getLocalizedPath(langOpt, basePostConceptPath).replace(
				`/${langOpt}`,
				''
			);
			languageAlternates[langOpt] =
				`${baseUrl}/${langOpt}${langOptLocalizedBasePath}/${post_title}/${post}`;
		});
		const fallbackDefaultLocalizedBasePath = getLocalizedPath(
			fallbackLng,
			basePostConceptPath
		).replace(`/${fallbackLng}`, '');
		languageAlternates['x-default'] =
			`${baseUrl}/${fallbackLng}${fallbackDefaultLocalizedBasePath}/${post_title}/${post}`;
	}

	return {
		title: pageTitle,
		description: pageDescription,
		metadataBase: new URL(baseUrl),
		alternates: {
			canonical: canonicalUrl,
			languages: languageAlternates,
		},
	};
}

export default function PostLayout({
	children,
	params: { lng },
}: {
	children: React.ReactNode;
	params: { lng: string };
}) {
	return (
		<>
			{children}
			<Footer theme={'light'} lng={lng} />
		</>
	);
}
