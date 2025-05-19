import { fallbackLng, languages, getLocalizedPath } from '@/app/i18n/settings';
import { UseTranslation } from '@/app/i18n/index';
import { baseUrl } from '@/lib/consts';

export async function generateStaticParams() {
	return languages.map((lng) => ({ lng }));
}

export async function generateMetadata({ params: { lng } }: { params: { lng: string } }) {
	if (languages.indexOf(lng) < 0) lng = fallbackLng;
	const { t } = await UseTranslation(lng, 'metadata');

	const canonicalConceptPath = '/about'; // Base canonical path for the "about" section

	// The current page's own correct, localized URL
	const currentLocalizedHref = `${baseUrl}${getLocalizedPath(lng, canonicalConceptPath)}`;

	const languageAlternates = Object.fromEntries(
		languages.map((langOpt) => [
			langOpt,
			`${baseUrl}${getLocalizedPath(langOpt, canonicalConceptPath)}`,
		])
	);
	languageAlternates['x-default'] =
		`${baseUrl}${getLocalizedPath(fallbackLng, canonicalConceptPath)}`;

	return {
		title: t('aboutPageTitle') || '...',
		description: t('aboutPageDesc') || '...',
		metadataBase: new URL(baseUrl),
		alternates: {
			canonical: currentLocalizedHref,
			languages: languageAlternates,
		},
	};
}

export default function AboutLayout({
	children,
}: {
	children: React.ReactNode;
	// params.lng is not used here anymore
}) {
	return <>{children}</>;
}
