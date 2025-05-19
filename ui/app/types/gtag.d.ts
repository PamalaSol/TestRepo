interface Window {
	dataLayer: Array<{
		consent?: {
			analytics_storage?: 'granted' | 'denied';
			ad_storage?: 'granted' | 'denied';
			ad_user_data?: 'granted' | 'denied';
			ad_personalization?: 'granted' | 'denied';
			functionality_storage?: 'granted' | 'denied';
			personalization_storage?: 'granted' | 'denied';
			security_storage?: 'granted' | 'denied';
		};
		event?: string;
		[key: string]: any;
	}>;
	gtag?: (...args: any[]) => void;
}
