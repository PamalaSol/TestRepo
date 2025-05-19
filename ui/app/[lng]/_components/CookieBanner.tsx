'use client';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/app/i18n/client';
import { usePathname } from 'next/navigation';

interface ConsentPreferences {
	analytics_storage: boolean;
	ad_storage: boolean;
	ad_user_data: boolean;
	ad_personalization: boolean;
	functionality_storage: boolean;
	personalization_storage: boolean;
	security_storage: boolean;
	essential_storage: boolean;
}

const CookieBanner = ({ lng }: { lng: string }) => {
	const { t } = useTranslation(lng, 'cookies');
	const [showBanner, setShowBanner] = useState(false);
	const [showDetails, setShowDetails] = useState(false);
	const [preferences, setPreferences] = useState<ConsentPreferences>({
		analytics_storage: false,
		ad_storage: false,
		ad_user_data: false,
		ad_personalization: false,
		functionality_storage: false,
		personalization_storage: false,
		security_storage: false,
		essential_storage: true,
	});
	const pathname = usePathname();

	useEffect(() => {
		const savedPreferences = localStorage.getItem('consentPreferences');

		if (!savedPreferences) {
			setShowBanner(true);
		} else {
			const parsedPreferences = JSON.parse(savedPreferences);
			setPreferences(parsedPreferences);

			updateGTMConsent(parsedPreferences);
		}

		if (preferences.essential_storage) {
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname]);

	const updateGTMConsent = (consentPreferences: ConsentPreferences) => {
		if (typeof window !== 'undefined') {
			window.dataLayer = window.dataLayer || [];

			// First update data layer (keep for compatibility)
			window.dataLayer.push({
				event: 'update_consent',
				consent: {
					analytics_storage: consentPreferences.analytics_storage ? 'granted' : 'denied',
					ad_storage: consentPreferences.ad_storage ? 'granted' : 'denied',
					ad_user_data: consentPreferences.ad_user_data ? 'granted' : 'denied',
					ad_personalization: consentPreferences.ad_personalization
						? 'granted'
						: 'denied',
					functionality_storage: consentPreferences.functionality_storage
						? 'granted'
						: 'denied',
					personalization_storage: consentPreferences.personalization_storage
						? 'granted'
						: 'denied',
					security_storage: consentPreferences.security_storage ? 'granted' : 'denied',
				},
			});

			// Create a function to attempt gtag consent update
			const updateConsent = () => {
				if (typeof window.gtag === 'function') {
					window.gtag('consent', 'update', {
						analytics_storage: consentPreferences.analytics_storage
							? 'granted'
							: 'denied',
						ad_storage: consentPreferences.ad_storage ? 'granted' : 'denied',
						ad_user_data: consentPreferences.ad_user_data ? 'granted' : 'denied',
						ad_personalization: consentPreferences.ad_personalization
							? 'granted'
							: 'denied',
						functionality_storage: consentPreferences.functionality_storage
							? 'granted'
							: 'denied',
						personalization_storage: consentPreferences.personalization_storage
							? 'granted'
							: 'denied',
						security_storage: consentPreferences.security_storage
							? 'granted'
							: 'denied',
					});
					return true;
				}
				return false;
			};

			// Try to update consent immediately
			if (!updateConsent()) {
				// If gtag isn't available yet, retry a few times with increasing delay
				let attempts = 0;
				const maxAttempts = 5;
				const retryInterval = 300; // milliseconds

				const retryUpdate = () => {
					attempts++;
					if (updateConsent()) {
						// Success - no logging needed
					} else if (attempts < maxAttempts) {
						setTimeout(retryUpdate, retryInterval * attempts);
					}
					// No warning if all attempts fail
				};

				setTimeout(retryUpdate, retryInterval);
			}
		}
	};

	const savePreferences = (newPreferences: ConsentPreferences) => {
		localStorage.setItem('consentPreferences', JSON.stringify(newPreferences));

		updateGTMConsent(newPreferences);
	};

	const handleAcceptAll = () => {
		const allAccepted = {
			...preferences,
			analytics_storage: true,
			ad_storage: true,
			functionality_storage: true,
			personalization_storage: true,
			security_storage: true,
			ad_user_data: true,
			ad_personalization: true,
		};
		setPreferences(allAccepted);
		savePreferences(allAccepted);
		setShowBanner(false);
	};

	const handleAcceptNecessary = () => {
		const onlyNecessary = {
			...preferences,
			analytics_storage: false,
			ad_storage: false,
			functionality_storage: false,
			personalization_storage: false,
			security_storage: false,
		};
		setPreferences(onlyNecessary);
		savePreferences(onlyNecessary);
		setShowBanner(false);
	};

	const handleSavePreferences = () => {
		savePreferences(preferences);
		setShowBanner(false);
	};

	if (!showBanner) return null;

	return (
		<div className="fixed bottom-0 z-50 w-full bg-white p-4 shadow-lg">
			<div className="mx-auto max-w-6xl">
				<p className="mb-4 text-gray-800">{t('text')}</p>

				{showDetails ? (
					<div className="mb-4 space-y-2">
						{/* Essential cookies - always checked and disabled */}
						<div className="flex items-center gap-2">
							<input
								type="checkbox"
								id="essential"
								checked={true}
								disabled
								className="cursor-not-allowed opacity-60"
							/>
							<label
								htmlFor="essential"
								className="cursor-not-allowed opacity-60"
								title={t('Essential cookies cannot be disabled')}
							>
								{t('Essential cookies')} ({t('Required')})
							</label>
						</div>

						<div className="flex items-center gap-2">
							<input
								type="checkbox"
								id="analytics"
								checked={preferences.analytics_storage}
								onChange={(e) =>
									setPreferences((prev) => ({
										...prev,
										analytics_storage: e.target.checked,
									}))
								}
							/>
							<label htmlFor="analytics">{t('Analytics cookies')}</label>
						</div>
						<div className="flex items-center gap-2">
							<input
								type="checkbox"
								id="ads"
								checked={preferences.ad_storage}
								onChange={(e) =>
									setPreferences((prev) => ({
										...prev,
										ad_storage: e.target.checked,
									}))
								}
							/>
							<label htmlFor="ads">{t('Advertising cookies')}</label>
						</div>
						<div className="flex items-center gap-2">
							<input
								type="checkbox"
								id="functionality"
								checked={preferences.functionality_storage}
								onChange={(e) =>
									setPreferences((prev) => ({
										...prev,
										functionality_storage: e.target.checked,
									}))
								}
							/>
							<label htmlFor="functionality">{t('Functionality cookies')}</label>
						</div>
						<div className="flex items-center gap-2">
							<input
								type="checkbox"
								id="personalization"
								checked={preferences.personalization_storage}
								onChange={(e) =>
									setPreferences((prev) => ({
										...prev,
										personalization_storage: e.target.checked,
									}))
								}
							/>
							<label htmlFor="personalization">{t('Personalization cookies')}</label>
						</div>
						<div className="flex items-center gap-2">
							<input
								type="checkbox"
								id="security"
								checked={preferences.security_storage}
								onChange={(e) =>
									setPreferences((prev) => ({
										...prev,
										security_storage: e.target.checked,
									}))
								}
							/>
							<label htmlFor="security">{t('Security cookies')}</label>
						</div>

						<div className="flex items-center gap-2">
							<input
								type="checkbox"
								id="ad_user_data"
								checked={preferences.ad_user_data}
								onChange={(e) =>
									setPreferences((prev) => ({
										...prev,
										ad_user_data: e.target.checked,
									}))
								}
							/>
							<label htmlFor="ad_user_data">{t('Ad User Data cookies')}</label>
						</div>
						<div className="flex items-center gap-2">
							<input
								type="checkbox"
								id="ad_personalization"
								checked={preferences.ad_personalization}
								onChange={(e) =>
									setPreferences((prev) => ({
										...prev,
										ad_personalization: e.target.checked,
									}))
								}
							/>
							<label htmlFor="ad_personalization">
								{t('Ad Personalization cookies')}
							</label>
						</div>
					</div>
				) : null}

				<div className="flex flex-col gap-2 sm:flex-row">
					<button
						onClick={handleAcceptNecessary}
						className="w-full rounded bg-gray-500 px-4 py-2 text-white sm:w-auto"
					>
						{t('Accept necessary')}
					</button>
					<button
						onClick={() => setShowDetails(!showDetails)}
						className="w-full rounded bg-gray-200 px-4 py-2 text-gray-700 sm:w-auto"
					>
						{showDetails ? t('Hide preferences') : t('Show preferences')}
					</button>
					{showDetails ? (
						<button
							onClick={handleSavePreferences}
							className="w-full rounded bg-blue-500 px-4 py-2 text-white sm:w-auto"
						>
							{t('Save preferences')}
						</button>
					) : (
						<button
							onClick={handleAcceptAll}
							className="w-full rounded bg-blue-500 px-4 py-2 text-white sm:w-auto"
						>
							{t('Accept all')}
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default CookieBanner;
