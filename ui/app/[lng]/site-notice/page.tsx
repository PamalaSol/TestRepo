'use client';
import { useTranslation } from '@/app/i18n/client';

import tStyles from '@/app/[lng]/textSizes.module.css';

export default function Impressium({ params: { lng } }: { params: { lng: string } }) {
	const { t } = useTranslation(lng, 'impressium');

	const address = (
		<div>
			<p>HO-Matic AG</p>
			<p>Alte Obfelderstrasse 55</p>
			<p>8910 Affoltern am Albis</p>
		</div>
	);
	const contData = (
		<div>
			<p>Phone: +41 43 322 70 80</p>
			<p>Telefax: +41 43 322 70 88</p>
			<p>E-mail: info@ho-matic.ch</p>
		</div>
	);
	return (
		<div className="grid w-full h-full grid-cols-11 mb-10">
			<div className={`col-span-6 mt-6 flex flex-col gap-6 px-4 ${tStyles.cat5}`}>
				<div>
					<h1 className={`${tStyles.policyPageTitle} `}>{t('notice')}</h1>
				</div>
				<div className="flex flex-col gap-3">
					{address}
					<div>

					<p>{t('comReg')}</p>
					<p>{t('reg')}</p>
					</div>
					<div>
						<p className={`${tStyles.cat2}`}>{t('contact')}</p>
						{contData}
					</div>
					<div>
						<p className={`${tStyles.cat2}`}>{t('responsible')}</p>
						{address}
					</div>
					<p>{t('willing')}</p>
				</div>

				<div>
					<p className={`${tStyles.policyTitles}`}>{t('contLiab')}</p>
					<p>{t('contLiabText1')}</p>
					<p>{t('contLiabText2')}</p>
				</div>
				<div>
					<p className={`${tStyles.policyTitles}`}>{t('linkLiab')}</p>
					<p>{t('linkLiabText1')}</p>
					<p>{t('linkLiabText2')}</p>
				</div>
				<div>
					<p className={`${tStyles.policyTitles}`}>{t('copyright')}</p>
					<p>{t('copText1')}</p>
					<p>{t('copText2')}</p>
				</div>
			</div>
			<div className="grid-cols-5"></div>
		</div>
	);
}
