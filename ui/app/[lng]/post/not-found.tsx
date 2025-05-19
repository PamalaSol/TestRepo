'use client';

import { useTranslation } from '@/app/i18n/client';
import Link from 'next/link';

export default function PostNotFound({ params }: { params: { lng: string } }) {
	const { t } = useTranslation(params.lng, 'common');

	return (
		<div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16">
			<h1 className="mb-4 text-3xl font-bold">{t('postNotFound')}</h1>
			<p className="mb-8 text-lg">{t('postNotFoundDescription')}</p>
			<Link
				href={`/${params.lng}/news`}
				className="rounded-md bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
			>
				{t('backToNews')}
			</Link>
		</div>
	);
}
