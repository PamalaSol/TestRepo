/** @type {import('next').NextConfig} */
const apiUrl = process.env.API_URL;

const nextConfig = {
	trailingSlash: true,
	reactStrictMode: false,
	swcMinify: true,
	env: {
		API_URL: apiUrl,
	},
	async redirects() {
		return [
			{ source: '/', destination: '/de-DE', permanent: true },
			{ source: '/en/', destination: '/en-US', permanent: true },
			{ source: '/fr/', destination: '/fr-FR', permanent: true },

			// Old post URLs to new structure - handled by middleware dynamically
			// { source: '/:lng/post/:post', destination: '/:lng/post/:post', permanent: false },
			// { source: '/:lng/beitrag/:post', destination: '/:lng/beitrag/:post', permanent: false },
			// { source: '/:lng/article/:post', destination: '/:lng/article/:post', permanent: false },

			{ source: '/ueber-uns/firma', destination: '/de-DE/about', permanent: true },
			{ source: '/en/about-us/company', destination: '/en-US/about', permanent: true },
			{
				source: '/fr/a-propos-de-nous/societe',
				destination: '/fr-FR/about',
				permanent: true,
			},
			{ source: '/news', destination: '/de-DE/news', permanent: true },
			{ source: '/en/news', destination: '/en-US/news', permanent: true },
			{ source: '/fr/news', destination: '/fr-FR/news', permanent: true },
			{
				source: '/downloads/broschueren-anleitungen',
				destination: '/de-DE/resources',
				permanent: true,
			},
			{
				source: '/en/downloads/brochure-instructions',
				destination: '/en-US/resources',
				permanent: true,
			},
			{
				source: '/fr/downloads/brochure-instructions',
				destination: '/fr-FR/resources',
				permanent: true,
			},
			{
				source: '/produkte/homatic-quetschventile/produkteuebersicht',
				destination: '/de-DE/products/pinch-valves',
				permanent: true,
			},
			{
				source: '/en/products/homatic-pinch-valve/product-overview',
				destination: '/en-US/products/pinch-valves',
				permanent: true,
			},
			{
				source: '/fr/produits/vannes-a-manchon-homatic/presentation-de-produits',
				destination: '/fr-FR/products/pinch-valves',
				permanent: true,
			},
			// Old product URLs to new structure with pinch-valves
			{
				source: '/:lng/product/:id',
				destination: '/:lng/product/pinch-valves/:id',
				permanent: true,
			},
			{
				source: '/produkte/homatic-quetschventile/produkteuebersicht/serie-00',
				destination: '/de-DE/product/pinch-valves/287af5b9-987e-47c9-b67d-ea07fb202936',
				permanent: true,
			},
			{
				source: '/en/products/homatic-pinch-valve/product-overview/series-00',
				destination: '/en-US/product/pinch-valves/287af5b9-987e-47c9-b67d-ea07fb202936',
				permanent: true,
			},
			{
				source: '/fr/produits/vannes-a-manchon-homatic/presentation-de-produits/serie-00',
				destination: '/fr-FR/product/pinch-valves/287af5b9-987e-47c9-b67d-ea07fb202936',
				permanent: true,
			},
			{
				source: '/produkte/homatic-quetschventile/produkteuebersicht/serie-10',
				destination: '/de-DE/product/pinch-valves/56588334-86df-44b4-8da2-94a613c57800',
				permanent: true,
			},
			{
				source: '/en/products/homatic-pinch-valve/product-overview/series-10',
				destination: '/en-US/product/pinch-valves/56588334-86df-44b4-8da2-94a613c57800',
				permanent: true,
			},
			{
				source: '/fr/produits/vannes-a-manchon-homatic/presentation-de-produits/serie-10',
				destination: '/fr-FR/product/pinch-valves/56588334-86df-44b4-8da2-94a613c57800',
				permanent: true,
			},
			{
				source: '/produkte/homatic-quetschventile/produkteuebersicht/serie-20',
				destination: '/de-DE/product/pinch-valves/36322a29-ce46-4261-8ee8-500cea0381b8',
				permanent: true,
			},
			{
				source: '/en/products/homatic-pinch-valve/product-overview/series-20',
				destination: '/en-US/product/pinch-valves/36322a29-ce46-4261-8ee8-500cea0381b8',
				permanent: true,
			},
			{
				source: '/fr/produits/vannes-a-manchon-homatic/presentation-de-produits/serie-20',
				destination: '/fr-FR/product/pinch-valves/36322a29-ce46-4261-8ee8-500cea0381b8',
				permanent: true,
			},
			{
				source: '/produkte/homatic-quetschventile/produkteuebersicht/serie-21',
				destination: '/de-DE/product/pinch-valves/0fe774e4-1227-41d0-804e-bf368cb11d86',
				permanent: true,
			},
			{
				source: '/en/products/homatic-pinch-valve/product-overview/series-21',
				destination: '/en-US/product/pinch-valves/0fe774e4-1227-41d0-804e-bf368cb11d86',
				permanent: true,
			},
			{
				source: '/fr/produits/vannes-a-manchon-homatic/presentation-de-produits/serie-21',
				destination: '/fr-FR/product/pinch-valves/0fe774e4-1227-41d0-804e-bf368cb11d86',
				permanent: true,
			},
			{
				source: '/produkte/homatic-quetschventile/produkteuebersicht/serie-40',
				destination: '/de-DE/product/pinch-valves/037461ff-d48c-4a7c-946b-860342b700cb',
				permanent: true,
			},
			{
				source: '/en/products/homatic-pinch-valve/product-overview/series-40',
				destination: '/en-US/product/pinch-valves/037461ff-d48c-4a7c-946b-860342b700cb',
				permanent: true,
			},
			{
				source: '/fr/produits/vannes-a-manchon-homatic/presentation-de-produits/serie-40',
				destination: '/fr-FR/product/pinch-valves/037461ff-d48c-4a7c-946b-860342b700cb',
				permanent: true,
			},
			{
				source: '/produkte/homatic-quetschventile/produkteuebersicht/serie-41',
				destination: '/de-DE/product/pinch-valves/ac49d9e4-97f1-422c-ad28-6a31b3b32554',
				permanent: true,
			},
			{
				source: '/en/products/homatic-pinch-valve/product-overview/series-41',
				destination: '/en-US/product/pinch-valves/ac49d9e4-97f1-422c-ad28-6a31b3b32554',
				permanent: true,
			},
			{
				source: '/fr/produits/vannes-a-manchon-homatic/presentation-de-produits/serie-41',
				destination: '/fr-FR/product/pinch-valves/ac49d9e4-97f1-422c-ad28-6a31b3b32554',
				permanent: true,
			},
			{
				source: '/produkte/homatic-quetschventile/produkteuebersicht/serie-48',
				destination: '/de-DE/product/pinch-valves/01730ce8-d530-41b4-87c0-008e550b4353',
				permanent: true,
			},
			{
				source: '/en/products/homatic-pinch-valve/product-overview/customized-1',
				destination: '/en-US/product/pinch-valves/01730ce8-d530-41b4-87c0-008e550b4353',
				permanent: true,
			},
			{
				source: '/fr/produits/vannes-a-manchon-homatic/presentation-de-produits/solutions-client-1',
				destination: '/fr-FR/product/pinch-valves/01730ce8-d530-41b4-87c0-008e550b4353',
				permanent: true,
			},
			{
				source: '/produkte/homatic-quetschventile/produkteuebersicht/serie-50',
				destination: '/de-DE/product/pinch-valves/a5f8b20d-8bea-4445-b560-879ede56a523',
				permanent: true,
			},
			{
				source: '/en/products/homatic-pinch-valve/product-overview/series-50',
				destination: '/en-US/product/pinch-valves/a5f8b20d-8bea-4445-b560-879ede56a523',
				permanent: true,
			},
			{
				source: '/fr/produits/vannes-a-manchon-homatic/presentation-de-produits/serie-50',
				destination: '/fr-FR/product/pinch-valves/a5f8b20d-8bea-4445-b560-879ede56a523',
				permanent: true,
			},
			{
				source: '/produkte/homatic-quetschventile/produkteuebersicht/serie-60',
				destination: '/de-DE/product/pinch-valves/05ede3c2-d196-4565-943c-aba0861f50d7',
				permanent: true,
			},
			{
				source: '/en/products/homatic-pinch-valve/product-overview/series-60',
				destination: '/en-US/product/pinch-valves/05ede3c2-d196-4565-943c-aba0861f50d7',
				permanent: true,
			},
			{
				source: '/fr/produits/vannes-a-manchon-homatic/presentation-de-produits/serie-60',
				destination: '/fr-FR/product/pinch-valves/05ede3c2-d196-4565-943c-aba0861f50d7',
				permanent: true,
			},
			{
				source: '/produkte/homatic-quetschventile/produkteuebersicht/serie-70',
				destination: '/de-DE/product/pinch-valves/99a37e6e-b563-453f-9c7d-038cf48eb389',
				permanent: true,
			},
			{
				source: '/en/products/homatic-pinch-valve/product-overview/series-70',
				destination: '/en-US/product/pinch-valves/99a37e6e-b563-453f-9c7d-038cf48eb389',
				permanent: true,
			},
			{
				source: '/fr/produits/vannes-a-manchon-homatic/presentation-de-produits/serie-70',
				destination: '/fr-FR/product/pinch-valves/99a37e6e-b563-453f-9c7d-038cf48eb389',
				permanent: true,
			},
			{
				source: '/produkte/homatic-quetschventile/produkteuebersicht/serie-78',
				destination: '/de-DE/product/pinch-valves/93234677-4849-48fb-af98-1b46ed31a869',
				permanent: true,
			},
			{
				source: '/en/products/homatic-pinch-valve/product-overview/series-70-1',
				destination: '/en-US/product/pinch-valves/93234677-4849-48fb-af98-1b46ed31a869',
				permanent: true,
			},
			{
				source: '/fr/produits/vannes-a-manchon-homatic/presentation-de-produits/serie-70-1',
				destination: '/fr-FR/product/pinch-valves/93234677-4849-48fb-af98-1b46ed31a869',
				permanent: true,
			},
			{
				source: '/produkte/homatic-quetschventile/produkteuebersicht/serie-80',
				destination: '/de-DE/product/pinch-valves/33d88f37-88d7-416d-9c96-baac490ecc38',
				permanent: true,
			},
			{
				source: '/en/products/homatic-pinch-valve/product-overview/series-80',
				destination: '/en-US/product/pinch-valves/33d88f37-88d7-416d-9c96-baac490ecc38',
				permanent: true,
			},
			{
				source: '/fr/produits/vannes-a-manchon-homatic/presentation-de-produits/serie-80',
				destination: '/fr-FR/product/pinch-valves/33d88f37-88d7-416d-9c96-baac490ecc38',
				permanent: true,
			},
			{
				source: '/produkte/homatic-quetschventile/produkteuebersicht/ho-matic-quetschventil-serie-88',
				destination: '/de-DE/product/pinch-valves/03f0cf3e-518a-487d-a511-32cd42412e49',
				permanent: true,
			},
			{
				source: '/en/products/homatic-pinch-valve/product-overview/homatic-pinch-valve-series-88',
				destination: '/en-US/product/pinch-valves/03f0cf3e-518a-487d-a511-32cd42412e49',
				permanent: true,
			},
			{
				source: '/fr/produits/vannes-a-manchon-homatic/presentation-de-produits/vannes-a-manchon-homatic-serie-88',
				destination: '/fr-FR/product/pinch-valves/03f0cf3e-518a-487d-a511-32cd42412e49',
				permanent: true,
			},
			{
				source: '/produkte/homatic-quetschventile/schlauchmanschetten-qualitaeten',
				destination: '/de-DE/products/sleeves',
				permanent: true,
			},
			{
				source: '/en/products/homatic-pinch-valve/sleeve-qualities',
				destination: '/en-US/products/sleeves',
				permanent: true,
			},
			{
				source: '/fr/produits/vannes-a-manchon-homatic/qualite-de-manchons',
				destination: '/fr-FR/products/sleeves',
				permanent: true,
			},
			{
				source: '/produkte/homatic-quetschventile/produkteuebersicht/ansteuerungen',
				destination: '/de-DE/products/controls',
				permanent: true,
			},
			{
				source: '/en/products/homatic-pinch-valve/product-overview/triggering',
				destination: '/en-US/products/controls',
				permanent: true,
			},
			{
				source: '/fr/produits/vannes-a-manchon-homatic/presentation-de-produits/pilotages',
				destination: '/fr-FR/products/controls',
				permanent: true,
			},
			{ source: '/kontakt/kontaktformular', destination: '/de-DE/contact', permanent: true },
			{ source: '/en/contact/contact-form', destination: '/en-US/contact', permanent: true },
			{
				source: '/fr/contact/formulaire-de-contact',
				destination: '/fr-FR/contact',
				permanent: true,
			},
		];
	},
};

module.exports = nextConfig;
