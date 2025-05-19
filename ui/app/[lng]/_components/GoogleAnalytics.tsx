'use client';

import Script from 'next/script';

const GoogleAnalytics = () => {
	const gtmId = 'GTM-M7VSQTG7';

	return (
		<>
			{/* Initialize dataLayer and gtag function first */}
			<Script id="gtm-init" strategy="beforeInteractive">
				{`
					window.dataLayer = window.dataLayer || [];
					function gtag() {
						window.dataLayer.push(arguments);
					}
					
					// Set initial consent state to denied by default - Consent Mode v2
					gtag('consent', 'default', {
						'analytics_storage': 'denied',
						'ad_storage': 'denied',
						'ad_user_data': 'denied',
						'ad_personalization': 'denied',
						'functionality_storage': 'denied',
						'personalization_storage': 'denied',
						'security_storage': 'denied',
						'wait_for_update': 500
					});
				`}
			</Script>

			{/* Then load GTM */}
			<Script id="google-tag-manager" strategy="afterInteractive">
				{`
					// GTM initialization
					(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
					new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
					j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
					'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
					})(window,document,'script','dataLayer','${gtmId}');
				`}
			</Script>

			{/* Initialize stored consent if available */}
			<Script id="consent-init" strategy="afterInteractive">
				{`
					// Try to restore consent from localStorage if available
					try {
						const savedPreferences = localStorage.getItem('consentPreferences');
						if (savedPreferences) {
							const preferences = JSON.parse(savedPreferences);
							
							// Update consent based on saved preferences
							gtag('consent', 'update', {
								'analytics_storage': preferences.analytics_storage ? 'granted' : 'denied',
								'ad_storage': preferences.ad_storage ? 'granted' : 'denied',
								'ad_user_data': preferences.ad_user_data ? 'granted' : 'denied',
								'ad_personalization': preferences.ad_personalization ? 'granted' : 'denied',
								'functionality_storage': preferences.functionality_storage ? 'granted' : 'denied',
								'personalization_storage': preferences.personalization_storage ? 'granted' : 'denied',
								'security_storage': preferences.security_storage ? 'granted' : 'denied'
							});
						}
					} catch (e) {
						console.error('Error restoring consent preferences:', e);
					}
				`}
			</Script>
		</>
	);
};

export default GoogleAnalytics;
