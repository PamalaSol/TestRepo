import { fallbackLng, languages, routeTranslations, getLocalizedPath } from '@/app/i18n/settings';
import { UseTranslation } from '@/app/i18n/index';
import { baseUrl } from '@/lib/consts';
import { productService } from '../../_services/products';

export async function generateStaticParams() {
	return languages.map((lng) => ({ lng }));
}

// Helper function to get English category from localized version
function getEnglishCategory(localized: string, lng: string): string {
	const langTranslations = routeTranslations[lng as keyof typeof routeTranslations] || {};
	const reverseMappings = Object.entries(langTranslations).reduce(
		(acc, [canonical, localizedVal]) => {
			acc[localizedVal] = canonical;
			return acc;
		},
		{} as Record<string, string>
	);

	if (['pinch-valves', 'controls', 'sleeves'].includes(localized)) {
		return localized;
	}
	return reverseMappings[localized] || localized;
}

export async function generateMetadata({ params }: { params: { lng: string; category: string } }) {
	let { lng, category: localizedCategoryFromUrl } = params;
	if (languages.indexOf(lng) < 0) lng = fallbackLng;

	const englishCategory = getEnglishCategory(localizedCategoryFromUrl, lng);

	const { t } = await UseTranslation(lng, 'metadata');
	let title;
	let description;
	if (englishCategory === 'sleeves') {
		title = t('sleevesPageTitle');
		description = t('sleevesPageDesc');
	} else if (englishCategory === 'controls') {
		title = t('controlsPageTitle');
		description = t('controlsPageDesc');
	} else if (englishCategory === 'pinch-valves') {
		title = t('pinchValvePageTitle');
		description = t('pinchValvePageDesc');
	} else {
		title = t('productsPageTitle');
		description = t('productsPageDesc');
	}

	const canonicalConceptPath = `/products/${englishCategory}`;

	const currentLocalizedHref = `${baseUrl}${getLocalizedPath(lng, canonicalConceptPath)}`;

	const languageAlternates: { [k: string]: string } = {};
	languages.forEach((langOpt) => {
		languageAlternates[langOpt] =
			`${baseUrl}${getLocalizedPath(langOpt, canonicalConceptPath)}`;
	});
	languageAlternates['x-default'] =
		`${baseUrl}${getLocalizedPath(fallbackLng, canonicalConceptPath)}`;

	return {
		title: title,
		description: description,
		metadataBase: new URL(baseUrl),
		alternates: {
			canonical: currentLocalizedHref,
			languages: languageAlternates,
		},
	};
}

export default async function ProductsCategoryLayout({
	params,
	children,
}: {
	params: { category: string; lng: string };
	children: React.ReactNode;
}) {
	return <div className="products-category">{children}</div>;
}
