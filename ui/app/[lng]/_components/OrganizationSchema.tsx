'use client';

import { baseUrl } from '@/lib/consts';
import { useEffect, useRef } from 'react';

// Define type for language-specific dictionaries
type SupportedLanguage = 'de-DE' | 'en-US' | 'fr-FR';

interface OrganizationSchemaProps {
	lng: string;
}

export default function OrganizationSchema({ lng }: OrganizationSchemaProps) {
	const scriptRef = useRef<HTMLScriptElement | null>(null);

	// Map language codes
	const langCode = lng.includes('-')
		? lng
		: {
				de: 'de-DE',
				en: 'en-US',
				fr: 'fr-FR',
			}[lng as 'de' | 'en' | 'fr'] || 'de-DE';

	useEffect(() => {
		// Organization name
		const orgName = 'HO-Matic';

		// Organization description based on language
		const descriptions: Record<SupportedLanguage, string> = {
			'de-DE': 'An der Spitze der Branche in Sachen Quetschventile',
			'en-US': 'Leading the Industry in Pinch Valve Excellence',
			'fr-FR': "Leader de l'industrie en matière de vannes à manchon",
		};
		const orgDescription = descriptions[langCode as SupportedLanguage] || descriptions['de-DE'];

		// Organization URL
		const orgUrl = `https://ho-matic.ch/${langCode}/`;

		// Organization logo
		const orgLogo = `${baseUrl}/assets/logo.svg`;

		// Organization social profiles
		const orgSocialProfiles = [
			'https://www.linkedin.com/company/ho-matic/',
			'https://www.youtube.com/@ho-maticag9119/videos',
			'https://www.instagram.com/homaticag/',
		];

		// Organization address
		const orgStreetAddress = 'Alte Obfelderstrasse 55 8910 Affoltern a. A.';

		const cities: Record<SupportedLanguage, string> = {
			'de-DE': 'Zürich',
			'en-US': 'Zurich',
			'fr-FR': 'Zurich',
		};
		const orgCity = cities[langCode as SupportedLanguage] || cities['de-DE'];

		const orgPostalCode = '8910';

		const countries: Record<SupportedLanguage, string> = {
			'de-DE': 'Schwiiz',
			'en-US': 'Switzerland',
			'fr-FR': 'Suisse',
		};
		const orgCountry = countries[langCode as SupportedLanguage] || countries['de-DE'];

		// Organization contact point
		const orgPhone = '+41 (0)43 322 70 80';
		const orgEmail = 'info@ho-matic.ch';

		const contactTypes: Record<SupportedLanguage, string> = {
			'de-DE': 'Kundendienst',
			'en-US': 'Customer Service',
			'fr-FR': 'Service Client',
		};
		const orgContactType = contactTypes[langCode as SupportedLanguage] || contactTypes['de-DE'];

		const langMap: Record<SupportedLanguage, string[]> = {
			'de-DE': ['Deutsch', 'Englisch', 'Französisch'],
			'en-US': ['English', 'German', 'French'],
			'fr-FR': ['Français', 'Allemand', 'Anglais'],
		};
		const orgAvailableLanguages = langMap[langCode as SupportedLanguage] || langMap['de-DE'];

		// Generate schema JSON
		const organizationSchema = {
			'@context': 'https://schema.org',
			'@type': 'Organization',
			name: orgName,
			description: orgDescription,
			url: orgUrl,
			logo: orgLogo,
			sameAs: orgSocialProfiles,
			address: {
				'@type': 'PostalAddress',
				streetAddress: orgStreetAddress,
				addressLocality: orgCity,
				postalCode: orgPostalCode,
				addressCountry: orgCountry,
			},
			contactPoint: {
				'@type': 'ContactPoint',
				telephone: orgPhone,
				email: orgEmail,
				contactType: orgContactType,
				availableLanguage: orgAvailableLanguages,
			},
		};

		// First, remove any existing organization schema scripts
		const existingScripts = document.querySelectorAll(
			'script[data-schema-type="organization"]'
		);
		existingScripts.forEach((script) => {
			script.remove();
		});

		// Create a new script element
		const script = document.createElement('script');
		script.type = 'application/ld+json';
		script.textContent = JSON.stringify(organizationSchema);
		script.id = 'organization-schema';
		script.setAttribute('data-schema-type', 'organization');
		script.setAttribute('data-language', langCode);

		// Add it to the document head
		document.head.appendChild(script);

		// Store reference to script for cleanup
		scriptRef.current = script;

		// Cleanup on unmount
		return () => {
			if (scriptRef.current && document.head.contains(scriptRef.current)) {
				document.head.removeChild(scriptRef.current);
			}
		};
	}, [lng, langCode]);

	// This component doesn't render anything visible
	return null;
}
