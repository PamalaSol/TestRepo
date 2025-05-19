import Footer from '../_components/Footer';
import { fallbackLng, languages, getLocalizedPath } from '@/app/i18n/settings';
import { UseTranslation } from '@/app/i18n/index';
import { baseUrl } from '@/lib/consts';

export async function generateStaticParams() {
	return languages.map((lng) => ({ lng }));
}
export async function generateMetadata({ params: { lng } }: { params: { lng: string } }) {
	if (languages.indexOf(lng) < 0) lng = fallbackLng;
	const { t } = await UseTranslation(lng, 'metadata');

	const canonicalConceptPath = '/resources';

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
		title: t('resourcesPageTitle'),
		description: t('resourcesPageDesc'),
		metadataBase: new URL(baseUrl),
		alternates: {
			canonical: currentLocalizedHref,
			languages: languageAlternates,
		},
	};
}
export default function ResourcesLayout({
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
