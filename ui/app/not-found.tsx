'use client';

import Link from 'next/link';
import { useTranslation } from './i18n/client';
import { UseTranslation as ServerUseTranslation } from './i18n';
import { fallbackLng, languages, baseUrl } from './i18n/settings';

export async function generateMetadata({ params }: { params: { lng?: string } }) {
	const currentLng = params?.lng || fallbackLng;
	const { t } = await ServerUseTranslation(currentLng, 'metadata');

	return {
		title: t('notFoundPageTitle') || 'Page Not Found',
		description: t('notFoundPageDesc') || 'The page you are looking for does not exist.',
		metadataBase: new URL(baseUrl),
		robots: {
			index: false,
			follow: false,
		},
	};
}

export default function NotFound({ lng: lngFromProps }: { lng?: string }) {
	const currentLng = lngFromProps || fallbackLng;
	const { t } = useTranslation(currentLng, 'notfound');
	return (
		<div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
			<h1 className="mb-6 text-3xl font-semibold">{t('title')}</h1>
			<p className="mb-8 text-gray-600">{t('desc')}</p>
			<Link
				href="/"
				className="rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
			>
				{t('returnHome')}
			</Link>
		</div>
	);
}
