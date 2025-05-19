import { ApiResponse } from '../_interfaces/interfaces';

const settingsApiUrl = `${process.env.API_URL}/Settings`;
// const token = authService.getToken();

export interface ISettings {
	id: number;
	siteTitle: string;
	siteDescription: string;
	isMaintenanceMode: boolean;
	logoUrl: string;
	showSearchBar: boolean;
	contactEmail: string;
	enableShoppingCart: boolean;
	defaultCurrency: string;
	postsPerPage: number;
	allowComments: boolean;
	themeColor: string;
	defaultLanguage: string;
	dateFormat: string;
	currencySymbol: string;
	version: number;
}

const Settings: ISettings = {
	id: 1,
	siteTitle: '',
	siteDescription: '',
	isMaintenanceMode: false,
	logoUrl: '',
	showSearchBar: false,
	contactEmail: '',
	enableShoppingCart: false,
	defaultCurrency: '',
	postsPerPage: 0,
	allowComments: false,
	themeColor: '',
	defaultLanguage: '',
	dateFormat: '',
	currencySymbol: '',
	version: 0,
};

export interface SettingsResponse extends ISettings {
	createdBy: string;
	createdDate: string;
	modifiedBy: string;
	modifiedOn: string;
}

interface ISettingsService {
	getSettings: () => Promise<SettingsResponse>;
	updateSettings: (
		id: number,
		siteTitle: string,
		siteDescription: string,
		isMaintenanceMode: boolean,
		logoUrl: string,
		showSearchBar: boolean,
		contactEmail: string,
		enableShoppingCart: boolean,
		defaultCurrency: string,
		postsPerPage: number,
		allowComments: boolean,
		themeColor: string,
		defaultLanguage: string,
		dateFormat: string,
		currencySymbol: string,
		version: number
	) => Promise<ISettings>;
}

export const aboutService: ISettingsService = {
	async getSettings() {
		try {
			const response = await fetch(settingsApiUrl);
			const result: ApiResponse = await response.json();
			return Promise.resolve(result.data as SettingsResponse);
		} catch (error) {
			return Promise.reject(
				Object.assign(Settings, {
					id: 0,
					createdBy: '',
					createdDate: '',
					modifiedBy: '',
					modifiedOn: '',
				})
			);
		}
	},
	async updateSettings(
		id: number,
		siteTitle: string,
		siteDescription: string,
		isMaintenanceMode: boolean,
		logoUrl: string,
		showSearchBar: boolean,
		contactEmail: string,
		enableShoppingCart: boolean,
		defaultCurrency: string,
		postsPerPage: number,
		allowComments: boolean,
		themeColor: string,
		defaultLanguage: string,
		dateFormat: string,
		currencySymbol: string,
		version: number
	) {
		try {
			const response = await fetch(settingsApiUrl, {
				headers: {
					// Authorization: `Bearer ${token}`,
				},
				method: 'PUT',
				body: JSON.stringify({
					id,
					siteTitle,
					siteDescription,
					isMaintenanceMode,
					logoUrl,
					showSearchBar,
					contactEmail,
					enableShoppingCart,
					defaultCurrency,
					postsPerPage,
					allowComments,
					themeColor,
					defaultLanguage,
					dateFormat,
					currencySymbol,
					version,
				}),
			});
			const result: ISettings = await response.json();
			return Promise.resolve(result);
		} catch (error) {
			return Promise.reject(error);
		}
	},
};
