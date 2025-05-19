import { fallbackLng, languages, getLocalizedPath } from '@/app/i18n/settings';
import { UseTranslation } from '@/app/i18n/index';
import { baseUrl } from '@/lib/consts';

export async function generateStaticParams() {
	return languages.map((lng) => ({ lng }));
}

export async function generateMetadata({ params: { lng } }: { params: { lng: string } }) {
	if (languages.indexOf(lng) < 0) lng = fallbackLng;
	const { t } = await UseTranslation(lng, 'metadata');

	const canonicalConceptPath = '/contact'; // Base canonical path

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
		title: t('contactPageTitle') || '...',
		description: t('contactPageDesc') || '...',
		metadataBase: new URL(baseUrl),
		alternates: {
			canonical: currentLocalizedHref,
			languages: languageAlternates,
		},
	};
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
