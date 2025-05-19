import { fallbackLng, languages, getLocalizedPath } from '@/app/i18n/settings';
import { UseTranslation } from '@/app/i18n/index';
import { baseUrl } from '@/lib/consts';

export async function generateStaticParams() {
	return languages.map((lng) => ({ lng }));
}

export async function generateMetadata({ params: { lng } }: { params: { lng: string } }) {
	if (languages.indexOf(lng) < 0) lng = fallbackLng;
	const { t } = await UseTranslation(lng, 'metadata');

	const currentPath = '/cart'; // Canonical concept path

	const languageAlternates: { [key: string]: string } = {};
	for (const language of languages) {
		const localizedPath = getLocalizedPath(language, currentPath);
		languageAlternates[language] = `${baseUrl}${localizedPath}`;
	}

	languageAlternates['x-default'] = `${baseUrl}${getLocalizedPath(fallbackLng, currentPath)}`;

	return {
		title: t('cartPageTitle'),
		description: t('cartPageDesc'),
		metadataBase: new URL(baseUrl),
		alternates: {
			canonical: `${baseUrl}${getLocalizedPath(lng, currentPath)}`,
			languages: languageAlternates,
		},
	};
}

export default function CartLayout({
	children,
}: {
	children: React.ReactNode;
	// params is not used here anymore after removing <Head>
}) {
	return <>{children}</>;
}
