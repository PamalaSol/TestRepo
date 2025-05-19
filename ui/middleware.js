import { NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';
import { languages, routeTranslations, getCanonicalPath } from './app/i18n/settings';
import { postsService } from './app/[lng]/_services/posts';
import { slugify } from './app/[lng]/_utils/slugify';

acceptLanguage.languages(languages);

const JWTExpCheck = (token) => {
	var exp = JSON.parse(atob(token.value.split('.')[1])).exp;
	if (exp <= Math.floor(Date.now() / 1000)) {
		return false;
	}
	return true;
};

export const config = {
	// matcher: '/:lng*'
	matcher: [
		'/dashboard/:path*',
		'/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)',
	],
};

// Helper to find canonical route
function getCanonicalRouteFromLocalized(path) {
	// Check each language's route translations
	for (const lng of languages) {
		const langTranslations = routeTranslations[lng];
		// Create reverse mapping from localized to canonical
		const reverseMappings = Object.entries(langTranslations).reduce(
			(acc, [canonical, localized]) => {
				acc[localized] = canonical;
				return acc;
			},
			{}
		);

		// Split the path to get segments
		const segments = path.split('/').filter(Boolean);

		// If first segment is language code
		if (segments[0] === lng && segments.length > 1) {
			// Check if second segment is a localized route
			const localizedRoute = segments[1];
			const canonicalRoute = reverseMappings[localizedRoute];

			if (canonicalRoute) {
				// Replace the localized route with canonical
				segments[1] = canonicalRoute;
				return `/${segments.join('/')}`;
			}
		}
	}

	return null;
}

// Function to check if path is an old-style post URL
function isOldStylePostUrl(pathname) {
	const pathSegments = pathname.split('/').filter(Boolean);
	return (
		pathSegments.length === 3 &&
		languages.includes(pathSegments[0]) &&
		(pathSegments[1] === 'post' ||
			pathSegments[1] === 'beitrag' ||
			pathSegments[1] === 'article')
	);
}

// Function to check if path is a post URL without a title slug
function isPostUrlWithoutTitle(pathname) {
	const pathSegments = pathname.split('/').filter(Boolean);
	return (
		pathSegments.length === 3 &&
		languages.includes(pathSegments[0]) &&
		(pathSegments[1] === 'post' ||
			pathSegments[1] === 'beitrag' ||
			pathSegments[1] === 'article')
	);
}

// Function to check if path is an old-style product URL
function isOldStyleProductUrl(pathname) {
	const pathSegments = pathname.split('/').filter(Boolean);
	return pathSegments.length === 3 && pathSegments[1] === 'product';
}

// Check for language-switching on post pages
async function handlePostLanguageSwitching(req) {
	// We've disabled all post-related redirects to fix the redirect loop
	return null;
}

export async function middleware(req) {
	if (req.nextUrl.pathname === '/robots.txt' || req.nextUrl.pathname === '/sitemap.xml') {
		return NextResponse.next();
	}
	if (req.nextUrl.pathname.indexOf('icon') > -1 || req.nextUrl.pathname.indexOf('chrome') > -1) {
		return NextResponse.next();
	}

	if (req.nextUrl.pathname === '/dashboard/login') {
		const token = req.cookies.get('token');
		if (token) {
			if (JWTExpCheck(token)) {
				return NextResponse.redirect(new URL('/dashboard', req.url));
			} else {
				return NextResponse.next();
			}
		} else {
			return NextResponse.next();
		}
	}

	if (req.nextUrl.pathname.startsWith('/dashboard')) {
		if (req.cookies.get('token')) {
			if (JWTExpCheck(req.cookies.get('token'))) {
				return NextResponse.next();
			} else {
				return NextResponse.redirect(new URL('/dashboard/login', req.url));
			}
		} else {
			return NextResponse.redirect(new URL('/dashboard/login', req.url));
		}
	}

	// Check if URL has a language prefix
	const pathSegments = req.nextUrl.pathname.split('/').filter(Boolean);
	const hasLangPrefix = languages.some((lang) => pathSegments[0] === lang);

	// If no language prefix, redirect to default language
	if (!hasLangPrefix && pathSegments.length > 0) {
		// Check if this is a localized route without a language prefix
		// This is a fallback that shouldn't be needed with proper links
		return NextResponse.redirect(new URL(`/de-DE${req.nextUrl.pathname}`, req.url), {
			status: 301,
		});
	}

	// Check if URL has a language prefix but uses canonical route names
	// In this case we map the URL to use localized route names
	if (hasLangPrefix && pathSegments.length > 1) {
		const lng = pathSegments[0];

		// Check each path segment after the language prefix for possible translation
		let hasChanges = false;
		for (let i = 1; i < pathSegments.length; i++) {
			const segment = pathSegments[i];

			// Check if this segment has a localized version
			if (routeTranslations[lng] && routeTranslations[lng][segment]) {
				// Get the localized version of this route
				const localizedRoute = routeTranslations[lng][segment];

				// Only set flag if needed
				if (localizedRoute !== segment) {
					// Replace the canonical route with localized one
					pathSegments[i] = localizedRoute;
					hasChanges = true;
				}
			}
		}

		// Only redirect if we made changes
		if (hasChanges) {
			return NextResponse.redirect(new URL(`/${pathSegments.join('/')}`, req.url), {
				status: 301,
			});
		}
	}

	// Check for old-style post URLs (without title)
	if (isPostUrlWithoutTitle(req.nextUrl.pathname)) {
		const pathSegments = req.nextUrl.pathname.split('/').filter(Boolean);
		const lng = pathSegments[0];
		const postId = pathSegments[2];

		try {
			// Fetch the post to get its title
			const postData = await postsService.getPost(postId, lng);
			const titleSlug = slugify(postData.data.name);

			// Redirect to the new URL format with title
			const localizedPostSegment = pathSegments[1]; // Already localized from the URL
			return NextResponse.redirect(
				new URL(`/${lng}/${localizedPostSegment}/${titleSlug}/${postId}`, req.url),
				{ status: 301 }
			);
		} catch (error) {
			console.error('Error fetching post for URL redirect:', error);
			// If we can't fetch the post, just continue with the existing URL
		}
	}

	// Check if this is a localized route that needs mapping to internal canonical route
	const canonicalPath = getCanonicalPath(req.nextUrl.pathname);
	if (canonicalPath) {
		// Clone the request and rewrite the path to the canonical version
		// This doesn't change the URL but internally routes to the canonical page
		const url = req.nextUrl.clone();
		url.pathname = canonicalPath;
		return NextResponse.rewrite(url);
	}

	if (!languages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`))) {
		return NextResponse.redirect(new URL(`/de-DE`, req.url), { status: 307 });
	}

	// Handle special case for post language switching
	const postLanguageRedirect = await handlePostLanguageSwitching(req);
	if (postLanguageRedirect) {
		return postLanguageRedirect;
	}

	// Old product URL format is handled by next.config.js redirects
	// if (isOldStyleProductUrl(req.nextUrl.pathname)) {
	// 	const pathSegments = req.nextUrl.pathname.split('/').filter(Boolean);
	// 	const lng = pathSegments[0];
	// 	const productId = pathSegments[2];

	// 	return NextResponse.redirect(new URL(`/${lng}/product/pinch-valves/${productId}`, req.url), { status: 301 }); // Ensure this would have been 301 if active
	// }

	return NextResponse.next();
}
