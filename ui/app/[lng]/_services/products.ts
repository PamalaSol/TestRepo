import { ApiResponse, ProductImage, SimpleResponse } from '../_interfaces/interfaces';
import { IProductCategory } from './productCategory';
import { getToken } from './utils';

const productApiUrl = `${process.env.API_URL}/product`;
const singleProductApiUrl = `${process.env.API_URL}/GetProduct`;
const productCategoryApiUrl = `${process.env.API_URL}/productCategory`;

export interface ProductFile {
	id: string;
	title: string;
	fileName: string;
	fileExtension: string;
	alt: string;
	languageId: string;
	fileCategoryId: string;
}

export interface Product {
	heading: string;
	series: string;
	dimensions?: string;
	quality?: string;
	connectionType?: string;
	housing: string;
	nominalWidth: string;
	size: string;
	productCategories: IProductCategory[];
	material: string;
	suitableFor: string;
	connectionMaterial?: string;
	screws: string;
	industries: string;
	dataImages: ProductFile[];
	dataFiles: ProductFile[];
}

export interface IProduct extends Product {
	id: string;
	createdBy?: string;
	createdDate?: string;
	modifiedBy?: string;
	modifiedOn?: string;
}

export interface IDeleteResponse extends SimpleResponse {
	data: {
		id: number;
	};
}

export const productSuitableForDivider = '|#_!@!_#|';

interface IProductService {
	getProduct: (id: string, lang: string) => Promise<IProduct>;
	getProducts: (lang: string, searchParams?: string) => Promise<IProduct[]>;
	getProductsByCategory: (
		catId: number,
		lang: string,
		searchParams?: Record<string, string>
	) => Promise<IProduct[]>;
	addProduct: (
		heading: string,
		series: string,
		connectionType: string,
		housing: string,
		nominalWidth: string,
		material: string,
		suitableFor: string,
		connectionMaterial: string,
		screws: string,
		industries: string,
		productCategory: number,
		combinedImages: ProductImage[],
		lang: string
	) => Promise<ApiResponse>;
	editProduct: (
		id: string,
		heading: string,
		series: string,
		connectionType: string,
		housing: string,
		nominalWidth: string,
		material: string,
		suitableFor: string,
		connectionMaterial: string,
		screws: string,
		industries: string,
		productCategory: number,
		combinedImages: ProductImage[],
		lang: string
	) => Promise<ApiResponse>;
	deleteProduct: (id: string, lang: string) => Promise<IDeleteResponse>;
	getProductCategory: (id: number, lang: string) => Promise<IProductCategory>;
	getProductCategories: (lang: string) => Promise<IProductCategory[]>;
}

export const productService: IProductService = {
	async getProduct(id: string, lang: string) {
		try {
			const response = await fetch(`${singleProductApiUrl}/${id}`, {
				method: 'GET',
				headers: {
					'Accept-Language': lang,
				},
			});
			const result: ApiResponse = await response.json();
			return Promise.resolve(result.data as IProduct);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	async getProducts(lang: string, searchParams?: string) {
		try {
			const response = await fetch(
				`${productApiUrl}s${searchParams ? `?QueryOptions.SearchTerm=${searchParams}` : ''}`,
				{
					method: 'GET',
					headers: {
						'Accept-Language': lang,
					},
				}
			);
			const result: ApiResponse = await response.json();
			return Promise.resolve(result.data as IProduct[]);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	async getProductsByCategory(
		catId: number,
		lang: string,
		searchParams?: Record<string, string>
	) {
		try {
			const response = await fetch(
				`${productApiUrl}s/${catId}${
					searchParams ? `?${new URLSearchParams(searchParams)}` : ''
				}`,
				{
					method: 'GET',
					headers: {
						'Accept-Language': lang,
					},
				}
			);
			const result: ApiResponse = await response.json();
			return Promise.resolve(result.data as IProduct[]);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	async addProduct(
		heading: string,
		series: string,
		connectionType: string,
		housing: string,
		nominalWidth: string,
		material: string,
		suitableFor: string,
		connectionMaterial: string,
		screws: string,
		industries: string,
		productCategory: number,
		combinedImages: ProductImage[],
		lang: string
	) {
		try {
			let data = new FormData();

			data.append('heading', heading);

			if (productCategory === 1) {
				data.append('series', series);
				data.append('connectionType', connectionType ?? '');
				data.append('housing', housing);
				data.append('nominalWidth', nominalWidth);
				data.append('material', material);
				data.append('suitableFor', suitableFor);
				data.append('connectionMaterial', connectionMaterial);
				data.append('screws', screws);
				data.append('industries', industries);
			}

			data.append('productCategories', `${productCategory}`);

			combinedImages.forEach((image, index) => {
				data.append(`Images[${index}].File`, image.file);
				data.append(`Images[${index}].Alt`, image.alt);
				data.append(`Images[${index}].Category`, `${image.category}`);
			});

			const token = getToken();
			const response = await fetch(productApiUrl, {
				method: 'POST',
				headers: {
					'Accept-Language': lang,
					Authorization: `Bearer ${token}`,
				},
				body: data,
			});

			const result: ApiResponse = await response.json();
			return Promise.resolve(result);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	async editProduct(
		id: string,
		heading: string,
		series: string,
		connectionType: string,
		housing: string,
		nominalWidth: string,
		material: string,
		suitableFor: string,
		connectionMaterial: string,
		screws: string,
		industries: string,
		productCategory: number,
		combinedImages: ProductImage[],
		lang: string
	) {
		try {
			let data = new FormData();

			data.append('id', id);
			data.append('heading', heading);

			if (productCategory === 1) {
				data.append('series', series);
				data.append('connectionType', connectionType ?? '');
				data.append('housing', housing);
				data.append('nominalWidth', nominalWidth);
				data.append('material', material);
				data.append('suitableFor', suitableFor);
				data.append('connectionMaterial', connectionMaterial);
				data.append('screws', screws);
				data.append('industries', industries);
				data.append('productCategories', '1');
			} else if (productCategory === 3) {
				data.append('productCategories', '3');
			}

			combinedImages.forEach((image, index) => {
				data.append(`Images[${index}].File`, image.file);
				data.append(`Images[${index}].Alt`, image.alt);
				data.append(`Images[${index}].Category`, `${image.category}`);
			});

			const token = getToken();
			const response = await fetch(productApiUrl, {
				method: 'PUT',
				headers: {
					'Accept-Language': lang,
					Authorization: `Bearer ${token}`,
				},
				body: data,
			});
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const result: ApiResponse = await response.json();
			return Promise.resolve(result);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	async deleteProduct(id: string, lang: string) {
		try {
			const token = getToken();
			const response = await fetch(`${productApiUrl}/${id}`, {
				method: 'DELETE',
				headers: {
					'Accept-Language': lang,
					Authorization: `Bearer ${token}`,
				},
			});
			const result: IDeleteResponse = await response.json();
			return Promise.resolve(result);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	async getProductCategory(id: number, lang: string) {
		try {
			const response = await fetch(`${productCategoryApiUrl}/${id}`);
			const result: ApiResponse = await response.json();
			return Promise.resolve(result.data as IProductCategory);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	async getProductCategories(lang: string) {
		try {
			const response = await fetch(productCategoryApiUrl);
			const result: ApiResponse = await response.json();
			return Promise.resolve(result.data as IProductCategory[]);
		} catch (error) {
			return Promise.reject(error);
		}
	},
};
