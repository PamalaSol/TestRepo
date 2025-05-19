import { MetadataRoute } from 'next';
import { languages } from './i18n/settings';

export default function robots(): MetadataRoute.Robots {
	const url = process.env.GENERAL_URL;

	// Allow root paths and language-specific paths
	const allowPaths = ['/', ...languages];

	// Dashboard paths should still be disallowed
	const disallowPaths = ['/dashboard'];

	return {
		rules: [
			{
				userAgent: '*',
				allow: allowPaths,
				disallow: disallowPaths,
			},
		],
		sitemap: `${url}sitemap.xml`,
	};
}
