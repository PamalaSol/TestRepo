import Loader from './_components/Loader';
import { fallbackLng, languages, getLocalizedPath } from '@/app/i18n/settings';
import { UseTranslation } from '@/app/i18n/index';
import { baseUrl } from '@/lib/consts';

export async function generateStaticParams() {
	return languages.map((lng) => ({ lng }));
}

export async function generateMetadata({ params: { lng } }: { params: { lng: string } }) {
	if (languages.indexOf(lng) < 0) lng = fallbackLng;
	const { t } = await UseTranslation(lng, 'metadata');

	return {
		title: t('loadingPageTitle'),
		description: t('loadingPageDesc'),
		metadataBase: new URL(baseUrl),
		robots: { index: false, follow: false },
	};
}

export default function Loading() {
	return (
		<div className="flex w-full items-center justify-center">
			<Loader />
		</div>
	);
}
