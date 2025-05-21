import { postsService } from './[lng]/_services/posts';
import { productService } from './[lng]/_services/products';
import { routeTranslations } from './i18n/settings';
import { slugify } from './[lng]/_utils/slugify';

export default async function sitemap() {
	const url = process.env.GENERAL_URL;
	const langs = ['de-DE', 'en-US', 'fr-FR'];

	const staticEntries = langs.flatMap((lang) => {
		const translations = routeTranslations[lang as keyof typeof routeTranslations];

		return [
			{
				url: `${url}${lang}/`,
				lastModified: new Date(),
				changeFrequency: 'weekly',
				priority: 1.0,
			},
			{
				url: `${url}${lang}/${translations.products}`,
				lastModified: new Date(),
				changeFrequency: 'weekly',
				priority: 0.9,
			},
			{
				url: `${url}${lang}/${translations.products}/${translations['pinch-valves']}`,
				lastModified: new Date(),
				changeFrequency: 'weekly',
				priority: 0.8,
			},
			{
				url: `${url}${lang}/${translations.products}/${translations.controls}`,
				lastModified: new Date(),
				changeFrequency: 'monthly',
				priority: 0.7,
			},
			{
				url: `${url}${lang}/${translations.products}/${translations.sleeves}`,
				lastModified: new Date(),
				changeFrequency: 'monthly',
				priority: 0.7,
			},
			{
				url: `${url}${lang}/${translations.resources}`,
				lastModified: new Date(),
				changeFrequency: 'monthly',
				priority: 0.6,
			},
			{
				url: `${url}${lang}/${translations.news}`,
				lastModified: new Date(),
				changeFrequency: 'weekly',
				priority: 0.7,
			},
			{
				url: `${url}${lang}/${translations.about}`,
				lastModified: new Date(),
				changeFrequency: 'yearly',
				priority: 0.5,
			},
			{
				url: `${url}${lang}/${translations.contact}`,
				lastModified: new Date(),
				changeFrequency: 'yearly',
				priority: 0.4,
			},
			{
				url: `${url}${lang}/${translations['site-notice']}`,
				lastModified: new Date(),
				changeFrequency: 'yearly',
				priority: 0.3,
			},
			{
				url: `${url}${lang}/${translations['privacy-policy']}`,
				lastModified: new Date(),
				changeFrequency: 'yearly',
				priority: 0.3,
			},
		];
	});

	const postEntries = await Promise.all(
		langs.map(async (lang) => {
			try {
				const posts = await postsService.getPosts(lang);
				const translations = routeTranslations[lang as keyof typeof routeTranslations];
				const localizedPostSegment = translations.post;

				return posts.map((post) => {
					const titleSlug = slugify(post.name);
					return {
						url: `${url}${lang}/${localizedPostSegment}/${titleSlug}/${post.id}`,
						lastModified: new Date(),
						changeFrequency: 'weekly',
						priority: 0.8,
					};
				});
			} catch (error) {
				console.error('Error fetching posts for language:', lang, error);
				return [];
			}
		})
	);

	const productEntries = await Promise.all(
		langs.map(async (lang) => {
			try {
				const products = await productService.getProducts(lang);
				const translations = routeTranslations[lang as keyof typeof routeTranslations];

				return products.map((product) => ({
					url: `${url}${lang}/${translations.product}/${translations['pinch-valves']}/${product.id}`,
					lastModified: new Date(),
					changeFrequency: 'weekly',
					priority: 0.8,
				}));
			} catch (error) {
				console.error('Error fetching products for language:', lang, error);
				return [];
			}
		})
	);

	const allEntries = [
		...staticEntries,
		...(await postEntries).flat(),
		...(await productEntries).flat(),
	];

	return allEntries;
}
