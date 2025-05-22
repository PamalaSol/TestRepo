import './globals.css';
import dynamic from 'next/dynamic';
import { fallbackLng, languages, getLocalizedPath } from '../i18n/settings';
import { UseTranslation } from '../i18n';
import { Inter } from 'next/font/google';
import { baseUrl } from '@/lib/consts';

// Dynamically import components that might use browser-specific functionality
const Header = dynamic(() => import('./_components/Header'), { ssr: false });
const MobileHeader = dynamic(() => import('./_components/MobileHeader'), { ssr: false });
const CookieBanner = dynamic(() => import('./_components/CookieBanner'), { ssr: false });
 const OrganizationSchema = dynamic(() => import('./_components/OrganizationSchema'), {
	ssr: false,
}); 

const arimo = Inter({
	weight: ['500', '400', '700', '600', '300'],
	subsets: ['latin'],
	display: 'swap',
});

export async function generateStaticParams() {
	return languages.map((lng) => ({ lng }));
}

export async function generateMetadata({ params: { lng } }: { params: { lng: string } }) {
	if (languages.indexOf(lng) < 0) lng = fallbackLng;
	const { t } = await UseTranslation(lng, 'metadata');

	const currentPath = '/';

	const languageAlternates: { [key: string]: string } = {};
	for (const language of languages) {
		languageAlternates[language] = `${baseUrl}${getLocalizedPath(language, currentPath)}`;
	}
	languageAlternates['x-default'] = `${baseUrl}${getLocalizedPath(fallbackLng, currentPath)}`;

	return {
		title: t('homePageTitle') || '...',
		description: t('homePageDesc') || '...',
		metadataBase: new URL(baseUrl),
		alternates: {
			canonical: `${baseUrl}${getLocalizedPath(lng, currentPath)}`,
			languages: languageAlternates,
		},
	};
}

export default async function LngLayout({
	children,
	params: { lng },
}: {
	children: React.ReactNode;
	params: { lng: string };
}) {
	const { t } = await UseTranslation(lng, 'horiz-scroll');

	return (
		<div className={`${arimo.className} bg-[#f7f7f7]`} suppressHydrationWarning={true}>
			<CookieBanner lng={lng} />
			<div suppressHydrationWarning className="max-laptop:hidden">
				<Header lng={lng} path="/" />
			</div>
			<div className="relative laptop:hidden">
				<MobileHeader
					lng={lng}
					srch={t('search')}
					prods={t('products')}
					pvs={t('pinchValvesMn')}
					rsc="Downloads"
					news={t('news')}
					about={t('about')}
					contact={t('contact')}
					sleevesMn={t('sleevesMn')}
					customs={t('customSolutionsMn')}
					controlsMn={t('controlsMn')}
					commercials={t('commercialProductsMn')}
				/>
			</div>
			<OrganizationSchema lng={lng} />
			<div className="h-[5vh] max-laptop:hidden"></div>
			<div
				className="max-laptop:pt-10 max-mobile-l:pt-0"
				suppressHydrationWarning={true}
			>
				{children}
			</div>
		</div>
	);
}
