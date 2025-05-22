import { fallbackLng, languages, getLocalizedPath } from '@/app/i18n/settings';
import { UseTranslation } from '@/app/i18n/index';
import { baseUrl } from '@/lib/consts';
import { productService } from '../../../_services/products';

export async function generateStaticParams() {
	return languages.map((lng) => ({ lng }));
}

export async function generateMetadata({
	params: { lng, product: productId },
}: {
	params: { lng: string; product: string };
}) {
	if (languages.indexOf(lng) < 0) lng = fallbackLng;
	const { t: tMeta } = await UseTranslation(lng, 'metadata'); // For metadata specific
	const { t: tProducts } = await UseTranslation(lng, 'products'); // For product specific terms like 'series'

	try {
		const productData = await productService.getProduct(productId, lng);

		if (!productData || productData.productCategories[0]?.id !== 1) {
			return {
				title: tMeta('productNotFoundPageTitle'),
				description: tMeta('productNotFoundPageDesc'),
				metadataBase: new URL(baseUrl),
				alternates: {
					canonical: `${baseUrl}${getLocalizedPath(lng, '/')}`, // Consider if this should be a more relevant fallback
					languages: {}, // Keep as is or populate if meaningful for not found
				},
				robots: { index: false, follow: false }, // Corrected
			};
		}

		const pageTitle = `${tProducts('series')} ${productData.series} - ${productData.nominalWidth} | HO-Matic`; // Using tProducts
		const pageDescription = productData.heading;

		const canonicalConceptPath = `/product/pinch-valves/${productId}`;
		const currentLocalizedHref = `${baseUrl}${getLocalizedPath(lng, canonicalConceptPath)}`;

		const languageAlternates: { [key: string]: string } = {};
		languages.forEach((langOpt) => {
			languageAlternates[langOpt] =
				`${baseUrl}${getLocalizedPath(langOpt, canonicalConceptPath)}`;
		});
		languageAlternates['x-default'] =
			`${baseUrl}${getLocalizedPath(fallbackLng, canonicalConceptPath)}`;

		return {
			title: pageTitle,
			description: pageDescription,
			metadataBase: new URL(baseUrl),
			alternates: {
				canonical: currentLocalizedHref,
				languages: languageAlternates,
			},
		};
	} catch (error) {
		console.error('Error fetching product data for metadata:', error);
		return {
			title: tMeta('loadingPageTitle'), // Or a more generic error title from metadata namespace
			description: tMeta('loadingPageDesc'),
			metadataBase: new URL(baseUrl),
			robots: { index: false, follow: false }, // Corrected for errors
		};
	}
}

export default async function ProductLayout({ 
	children,
}: {
	params: { product: string; lng: string }; // Not needed if not fetching data
	children: React.ReactNode;
}) {
	let schemaScript = null; // Schema script temporarily removed

	return (
		<>
			{schemaScript}
			{children}
		</>
	);
}
