import { fallbackLng, languages, getLocalizedPath } from '@/app/i18n/settings';
import { UseTranslation } from '@/app/i18n/index';
import { baseUrl } from '@/lib/consts';

import Script from 'next/script';
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
	const { t } = await UseTranslation(lng, 'metadata');
	const { t: tProducts } = await UseTranslation(lng, 'products');

	try {
		const productData = await productService.getProduct(productId, lng);

		if (!productData || productData.productCategories[0]?.id !== 1) {
			return {
				title: t('productNotFoundPageTitle'),
				description: t('productNotFoundPageDesc'),
				metadataBase: new URL(baseUrl),
				alternates: {
					canonical: `${baseUrl}${getLocalizedPath(lng, '/')}`,
					languages: {},
				},
				robots: { index: false, follow: false },
			};
		}

		const pageTitle = `${tProducts('series')} ${productData.series} - ${productData.nominalWidth} | HO-Matic`;
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
			title: t('loadingPageTitle'),
			description: t('loadingPageDesc'),
			metadataBase: new URL(baseUrl),
			robots: { index: true, follow: false },
		};
	}
}

export default async function ProductLayout({
	params,
	children,
}: {
	params: { product: string; lng: string };
	children: React.ReactNode;
}) {
	let schemaScript = null;

	try {
		const productData = await productService.getProduct(params.product, params.lng);

		if (productData && productData.productCategories[0]?.id === 1) {
			const imageIndex = productData.dataImages.findIndex(
				(img) => Number(img.fileCategoryId) === 1 && img.fileName.includes('copy')
			);
			const imageUrl =
				imageIndex >= 0
					? `${process.env.API_URL}/files/${productData.dataImages[imageIndex].id}/${productData.dataImages[imageIndex].fileName}`
					: null;

			const { t: tProducts } = await UseTranslation(params.lng, 'products');

			const conceptualProductPathForSchema = `/product/pinch-valves/${productData.id}`;
			const localizedProductUrlForSchema = `${baseUrl}${getLocalizedPath(params.lng, conceptualProductPathForSchema)}`;

			const productSchema = {
				'@context': 'https://schema.org',
				'@type': 'Product',
				name: `${tProducts('series')} ${productData.series}`,
				image: imageUrl,
				description: productData.heading,
				url: localizedProductUrlForSchema,
				brand: {
					'@type': 'Brand',
					name: 'HO-Matic',
					logo: `${baseUrl}/_next/static/media/logo.26ffc2b7.svg`,
				},
				manufacturer: {
					'@type': 'Organization',
					name: 'HO-Matic',
				},
			};

			schemaScript = (
				<Script id="product-schema" type="application/ld+json" strategy="afterInteractive">
					{JSON.stringify(productSchema)}
				</Script>
			);
		}
	} catch (error) {
		console.error('Failed to fetch product for schema in ProductLayout:', error);
	}

	return (
		<>
			{schemaScript}
			{children}
		</>
	);
}
