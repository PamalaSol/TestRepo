'use client';
import { useTranslation } from '@/app/i18n/client';

import tStyles from '@/app/[lng]/textSizes.module.css';
import DOMPurify from 'dompurify';

export default function PrivPol({ params: { lng } }: { params: { lng: string } }) {
	const { t } = useTranslation(lng, 'privacyPolicy');

	const address = (
		<div className="flex flex-col gap-2 my-2">
			<div>
				<p>HO-Matic AG</p>
				<p>Alte Obfelderstrasse 55</p>
				<p>8910 Affoltern am Albis</p>
			</div>
			<div>
				<p>Phone: +41 43 322 70 80</p>
				<p>E-mail: +41 43 322 70 88</p>
			</div>
		</div>
	);
	return (
		<div className="grid w-full h-full grid-cols-11 mb-10">
			<div className={`col-span-6 mt-6 flex flex-col gap-6 px-4 ${tStyles.cat5}`}>
				<div>
					<h1 className={`${tStyles.policyPageTitle} mb-4`}>{t('privPol')}</h1>
				</div>
				<div>
					<p className={`${tStyles.cat4} mb-1`}>{t('overview')}</p>
					<p className={`${tStyles.policyTitles}`}>{t('genTitle')}</p>
					<p>{t('gentext')}</p>
				</div>
				<div>
					<p className={`${tStyles.policyTitles}`}>{t('dataRecordTitle')}</p>
					<p className={`${tStyles.cat2} my-2`}>{t('q1')}</p>
					<p>{t('a1')}</p>
					<p className={`${tStyles.cat2} my-2`}>{t('q2')}</p>
					<p>{t('a2')}</p>
					<p className={`${tStyles.cat2} my-2`}>{t('q3')}</p>
					<p>{t('a3')}</p>
					<p className={`${tStyles.cat2} my-2`}>{t('q4')}</p>
					<p>{t('a4')}</p>
				</div>
				<div>
					<p className={`${tStyles.policyTitles}`}>{t('toolsTitle')}</p>
					<p>{t('toolsText')}</p>
				</div>
				<div>
					<p className={`${tStyles.cat4} mb-1`}>{t('generalInfo')}</p>
					<p className={`${tStyles.policyTitles}`}>{t('dataProtTitle')}</p>
					<p>{t('dataProtText')}</p>
				</div>
				<div>
					<p className={`${tStyles.policyTitles}`}>{t('controllerTitle')}</p>
					<p>{t('controller1')}</p>
					{address}
					<p>{t('controller2')}</p>
				</div>
				<div>
					<p className={`${tStyles.policyTitles}`}>{t('rebocationTitle')}</p>
					<p>{t('revocationText')}</p>
				</div>
				<div>
					<p className={`${tStyles.policyTitles}`}>{t('objectTitle')}</p>
					<p>{t('objectText')}</p>
				</div>
				<div>
					<p className={`${tStyles.policyTitles}`}>{t('complaintTitle')}</p>
					<p>{t('complaintText')}</p>
				</div>
				<div>
					<p className={`${tStyles.policyTitles}`}>{t('portabTitle')}</p>
					<p>{t('portabText')}</p>
				</div>
				<div>
					<p className={`${tStyles.policyTitles}`}>{t('sslTitle')}</p>
					<p>{t('sslText')}</p>
				</div>
				<div>
					<p className={`${tStyles.policyTitles}`}>{t('blockTitle')}</p>
					<p>{t('blockText')}</p>
				</div>
				<div>
					<p className={`${tStyles.policyTitles}`}>{t('restrictTitle')}</p>
					<p>{t('restrict1')}</p>
					<ul className="flex flex-col gap-2 pl-5 my-2 list-disc">
						<li>{t('restrict2')}</li>
						<li>{t('restrict3')}</li>
						<li>{t('restrict4')}</li>
						<li>{t('restrict5')}</li>
					</ul>
					<p>{t('restrict6')}</p>
				</div>
				<div>
					<p className={`${tStyles.cat4} mb-1`}>{t('recording')}</p>
					<p className={`${tStyles.policyTitles}`}>{t('cookiesTitle')}</p>
					<p>{t('cookiesText')}</p>
				</div>
				<div>
					<p className={`${tStyles.policyTitles}`}>{t('logTitle')}</p>
					<p>{t('log1')}</p>
					<ul className="flex flex-col gap-2 pl-5 my-2 list-disc">
						<li>{t('log2')}</li>
						<li>{t('log3')}</li>
						<li>{t('log4')}</li>
						<li>{t('log5')}</li>
						<li>{t('log6')}</li>
					</ul>
					<p>{t('log7')}</p>
				</div>
				<div>
					<p className={`${tStyles.policyTitles}`}>{t('contactTitle')}</p>
					<p>{t('contactText')}</p>
				</div>
				<div>
					<p className={`${tStyles.policyTitles}`}>{t('requestTitle')}</p>
					<p>{t('requestText')}</p>
				</div>
				<div>
					<p className={`${tStyles.cat4} mb-1`}>{t('analysis')}</p>
					<p className={`${tStyles.policyTitles}`}>{t('googleTitle')}</p>
					<p>{t('googleText')}</p>
				</div>
				<div>
					<p className={`${tStyles.cat2}`}>{t('ipTitle')}</p>
					<p>{t('ipText')}</p>
				</div>
				<div>
					<p className={`${tStyles.cat2}`}>{t('pluginTitle')}</p>
					<p>{t('pluginText')}: </p>
					<a
						href="https://tools.google.com/dlpage/gaoptout?hl=en."
						target="_blank"
						rel="noopener noreferrer"
						className="cursor-pointer text-[#306abf]"
					>
						{' '}
						https://tools.google.com/dlpage/gaoptout?hl=en.
					</a>
				</div>
				<div>
					<p className={`${tStyles.cat2}`}>{t('objectDataTitle')}</p>
					<p>{t('objectDataText')}: </p>{' '}
					<a
						href="https://support.google.com/analytics/answer/6004245?hl=en."
						target="_blank"
						rel="noopener noreferrer"
						className="cursor-pointer text-[#306abf]"
					>
						{' '}
						https://support.google.com/analytics/answer/6004245?hl=en.
					</a>
				</div>
				<div>
					<p className={`${tStyles.cat2}`}>{t('processTitle')}</p>
					<p>{t('processText')}</p>
				</div>
				<div>
					<p className={`${tStyles.cat4} mb-1`}>{t('5')}</p>
					<p className={`${tStyles.policyTitles}`}>{t('fontsTitle')}</p>
					<p>{t('fonts1')}</p>
					<p>{t('fonts2')}: </p>
					<a
						href="https://developers.google.com/fonts/faq"
						target="_blank"
						rel="noopener noreferrer"
						className="cursor-pointer text-[#306abf]"
					>
						{' '}
						https://developers.google.com/fonts/faq
					</a>
					<p>{t('fonts3')}: </p>
					<a
						href="https://policies.google.com/privacy?hl=en."
						target="_blank"
						rel="noopener noreferrer"
						className="cursor-pointer text-[#306abf]"
					>
						{' '}
						https://policies.google.com/privacy?hl=en.
					</a>
				</div>
			</div>
			<div className="grid-cols-5"></div>
		</div>
	);
}
