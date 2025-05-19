export const fallbackLng = 'de-DE';
export const languages = [fallbackLng, 'en-US', 'fr-FR'];
export const defaultNS = 'translation';
export const cookieName = 'i18next';

// Localized routes mapping
export const routeTranslations = {
	'de-DE': {
		products: 'produkte',
		product: 'produkt',
		post: 'beitrag',
		news: 'neuigkeiten',
		about: 'uber-uns',
		contact: 'kontakt',
		resources: 'downloads',
		'privacy-policy': 'datenschutzerklarung',
		'site-notice': 'impressum',
		shop: 'shop',
		cart: 'warenkorb',
		'pinch-valves': 'quetschventile',
		controls: 'ansteuerungen',
		sleeves: 'ersatzmanschetten',
	},
	'en-US': {
		products: 'products',
		product: 'product',
		post: 'post',
		news: 'news',
		about: 'about-us',
		contact: 'contact',
		resources: 'downloads',
		'privacy-policy': 'privacy-policy',
		'site-notice': 'site-notice',
		shop: 'shop',
		cart: 'cart',
		'pinch-valves': 'pinch-valves',
		controls: 'controls',
		sleeves: 'sleeves',
	},
	'fr-FR': {
		products: 'produits',
		product: 'produit',
		post: 'article',
		news: 'actualites',
		about: 'a-propos',
		contact: 'contact',
		resources: 'downloads',
		'privacy-policy': 'politique-de-confidentialite',
		'site-notice': 'mentions-legales',
		shop: 'boutique',
		cart: 'panier',
		'pinch-valves': 'vannes-a-pincement',
		controls: 'controles',
		sleeves: 'manches',
	},
};

// Helper function to get route translations
export function getLocalizedPath(lng, path) {
	// If no language is provided or it's not in our languages, use fallback
	if (!lng || !languages.includes(lng)) {
		lng = fallbackLng;
	}

	// If path is just '/', return the root path with language
	if (path === '/') {
		return `/${lng}`;
	}

	// Remove leading slash if exists
	const cleanPath = path.startsWith('/') ? path.substring(1) : path;

	// Split the path into segments
	const segments = cleanPath.split('/');

	// Translate each segment that has a translation
	for (let i = 0; i < segments.length; i++) {
		const segment = segments[i];
		// Check if this segment has a translation
		if (routeTranslations[lng] && routeTranslations[lng][segment]) {
			segments[i] = routeTranslations[lng][segment];
		}
	}

	// Reconstruct the path
	return `/${lng}/${segments.join('/')}`;
}

// Helper function to get the canonical path from a localized path
export function getCanonicalPath(localizedPath) {
	if (!localizedPath) return null;

	// Remove leading slash if exists
	const cleanPath = localizedPath.startsWith('/') ? localizedPath.substring(1) : localizedPath;

	// Split the path into segments
	const segments = cleanPath.split('/');

	// The first segment should be the language code
	const lng = segments[0];

	// If it's not a valid language code or we have no segments after it, return null
	if (!languages.includes(lng) || segments.length < 2) {
		return null;
	}

	// Create reverse mapping from localized to canonical
	const reverseMappings = Object.entries(routeTranslations[lng]).reduce(
		(acc, [canonical, localized]) => {
			acc[localized.normalize('NFC')] = canonical;
			return acc;
		},
		{}
	);

	// For each segment after the language code, check if it needs to be translated back to canonical
	for (let i = 1; i < segments.length; i++) {
		const segment = segments[i];
		// If this segment has a reverse mapping, replace it with the canonical version
		const normalizedSegment = segment.normalize('NFC');
		if (reverseMappings[normalizedSegment]) {
			segments[i] = reverseMappings[normalizedSegment];
		}
	}

	// Return the canonical path
	return `/${segments.join('/')}`;
}

export function getOptions(lng = fallbackLng, ns = defaultNS) {
	return {
		// debug: true,
		supportedLngs: languages,
		// preload: languages,
		fallbackLng,
		lng,
		fallbackNS: defaultNS,
		defaultNS,
		ns,
	};
}
