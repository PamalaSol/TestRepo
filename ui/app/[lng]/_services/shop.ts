import { ApiResponse } from '../_interfaces/interfaces';

export interface orderItem {
	valve?: string;
	sleeve?: string;
	sparePart?: string;
	quantity: string;
	itemDescription?: string;
}

interface cInfo {
	customerId?: string;
	company: string;
	name: string;
	street: string;
	zip: string;
	email: string;
	phone: string;
}
interface shipInfo {
	shippingId?: string;
	shippingCompany?: string;
	shippingName?: string;
	shippingStreet?: string;
	shippingZip?: string;
	shippingCountry?: string;
	shippingEmail?: string;
	shippingCostNeeded?: boolean;
	packagingCostNeeded?: boolean;
}
export interface fullOrder extends cInfo, shipInfo {
	isOrder: boolean;
	description?: string;
	isDifferentAddress: boolean;
	orderedItems: orderItem[];
}
interface IShopService {
	getOrders: (lang: string) => Promise<ApiResponse>;
	getOrder: (id: string, lang: string) => Promise<ApiResponse>;
	postOrder: (lang: string, fullOrder: fullOrder, captcha: string) => Promise<ApiResponse>;
}

const orderApiUrl = `${process.env.API_URL}/Order`;

export const shopService: IShopService = {
	async getOrders(lang: string) {
		try {
			const response = await fetch(`${orderApiUrl}`, {
				method: 'GET',
				headers: {
					'Accept-Language': lang,
				},
			});
			const result: ApiResponse = await response.json();
			return Promise.resolve(result);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	async getOrder(id: string, lang: string) {
		try {
			const response = await fetch(`${orderApiUrl}/${id}`, {
				method: 'GET',
				headers: {
					'Accept-Language': lang,
				},
			});
			const result: ApiResponse = await response.json();
			return Promise.resolve(result);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	async postOrder(lang: string, fullOrder: fullOrder, captcha: string) {
		try {
			const newUrl = new URL(orderApiUrl);
			newUrl.searchParams.append('captchaToken', captcha);

			const response = await fetch(`${newUrl}`, {
				method: 'POST',
				headers: {
					'Accept-Language': lang,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(fullOrder),
			});
			const result: ApiResponse = await response.json();
			return Promise.resolve(result);
		} catch (error) {
			return Promise.reject(error);
		}
	},
};
