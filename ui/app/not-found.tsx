'use client';

import Link from 'next/link';
import { useTranslation } from './i18n/client';
import { UseTranslation as ServerUseTranslation } from './i18n';
import { fallbackLng } from './i18n/settings';
import { baseUrl } from '@/lib/consts';

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
		<div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
			<h1 className="mb-6 text-3xl font-semibold">{t('title')}</h1>
			<p className="mb-8 text-gray-600">{t('desc')}</p>
			<Link
				href="/"
				className="px-6 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
			>
				{t('returnHome')}
			</Link>
		</div>
	);
}
