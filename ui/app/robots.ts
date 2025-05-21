import { MetadataRoute } from 'next';
// import { languages } from './i18n/settings'; // No longer needed with this approach

export default function robots(): MetadataRoute.Robots {
	const url = process.env.GENERAL_URL;

	// Dashboard paths should still be disallowed
	const disallowPaths = ['/dashboard/']; // Using trailing slash for directory convention

	return {
		rules: [
			{
				userAgent: '*',
				// By omitting the 'allow' directive, we default to allowing all paths
				// that are not explicitly disallowed.
				disallow: disallowPaths,
			},
		],
		sitemap: `${url}/sitemap.xml`, // This was previously fixed
	};
}
