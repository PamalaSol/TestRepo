import { routeTranslations, languages, fallbackLng } from '@/app/i18n/settings';

/**
 * Gets the localized path for a dynamic route
 * @param lng - Current language code
 * @param routeName - The canonical (English) route name
 * @param dynamicSegment - The dynamic segment value
 * @param additionalSegments - Additional path segments to append
 * @returns Localized path including dynamic segment
 */
export function getDynamicLocalizedPath(
	lng: string,
	routeName: string,
	dynamicSegment: string,
	additionalSegments?: string[]
): string {
	// If language is not supported, use fallback
	if (!languages.includes(lng)) {
		lng = fallbackLng;
	}

	// Get the localized version of the route
	const lngKey = lng as keyof typeof routeTranslations;
	const localizedRoute =
		routeTranslations[lngKey]?.[routeName as keyof (typeof routeTranslations)[typeof lngKey]] ||
		routeName;

	// Construct the path with dynamic segment
	let path = `/${lng}/${localizedRoute}/${dynamicSegment}`;

	// Add any additional segments
	if (additionalSegments?.length) {
		path += `/${additionalSegments.join('/')}`;
	}

	return path;
}

/**
 * Gets the canonical path for a localized dynamic route
 * @param localizedPath - The current localized path
 * @returns The canonical path or null if not found
 */
export function getCanonicalDynamicPath(localizedPath: string): string | null {
	if (!localizedPath) return null;

	// Remove leading slash if exists
	const cleanPath = localizedPath.startsWith('/') ? localizedPath.substring(1) : localizedPath;

	// Split the path into segments
	const segments = cleanPath.split('/');

	// The first segment should be the language code
	const lng = segments[0];

	// If it's not a valid language code or we have no segments after it, return null
	if (!languages.includes(lng) || segments.length < 3) {
		return null;
	}

	// The second segment is the localized route
	const localizedRoute = segments[1];

	// Find the canonical route for this localized route
	const lngKey = lng as keyof typeof routeTranslations;
	const canonicalRoute = Object.entries(routeTranslations[lngKey] || {}).find(
		([, translation]) => translation === localizedRoute
	)?.[0];

	if (!canonicalRoute) {
		return null;
	}

	// Replace the localized route with the canonical one but keep the dynamic segment
	segments[1] = canonicalRoute;

	// Return the canonical path
	return `/${segments.join('/')}`;
}

/**
 * Gets the canonical slug for a dynamic route
 * @param pathname - The current pathname
 * @returns The dynamic segment value
 */
export function getDynamicSegment(pathname: string): string | null {
	if (!pathname) return null;

	// Remove leading slash if exists
	const cleanPath = pathname.startsWith('/') ? pathname.substring(1) : pathname;

	// Split the path into segments
	const segments = cleanPath.split('/');

	// Need at least 3 segments: [lng, route, dynamicSegment]
	if (segments.length < 3) {
		return null;
	}

	// The third segment is the dynamic segment
	return segments[2];
}
