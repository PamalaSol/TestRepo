import { ApiResponse, SimpleResponse } from '../_interfaces/interfaces';
import { ProductFile } from './products';

export interface IProductCategory {
	id: number;
	name: string;
	description: string;
	imageId: string;
	dataImage: ProductFile;
	alt: string;
	createdBy: string;
	createdDate: string;
	modifiedBy: string;
	modifiedOn: string;
	parentProductCategoryId: number;
	parentProductCategory: string;
}

interface ISingleProductCategoriResponse extends SimpleResponse {
	data: IProductCategory;
}

interface IDeleteResponse extends SimpleResponse {
	data: {
		id: number;
	};
}

// interface IProductCategories extends ApiResponse {
// 	data: IProductCategory[]
// }

const categoryApiUrl = `${process.env.API_URL}/productCategory`;

interface IProductCategoryService {
	getCategory: (id: number, lang:string) => Promise<ISingleProductCategoriResponse>;
	getCategories: ( lang:string) => Promise<IProductCategory[]>;
	addCategory: (
		name: string,
		description: string,
		imageId: string,
		dataImage: ProductFile,
		parentCategoryId: number,
		parentCategory: string
	) => Promise<ApiResponse>;
	editCategory: (
		id: number,
		name: string,
		description: string,
		imageId: string,
		dataImage: ProductFile,
		parentCategoryId: number,
		parentCategory: string,
		lang:string
	) => Promise<ISingleProductCategoriResponse>;
	deleteCategory: (id: number) => Promise<IDeleteResponse>;
}

export const productCategoryService: IProductCategoryService = {
	async getCategory(id: number, lang:string) {
		
		try {
			const response = await fetch(`${categoryApiUrl}/${id}`, {
				method: 'GET',
				headers: {
					'Accept-Language':lang,
				},
			});
			const result: ISingleProductCategoriResponse = await response.json();
			return Promise.resolve(result);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	async getCategories(lang:string) {
		try {
			const response = await fetch(`${categoryApiUrl}?QueryOptions.OrderBy=2`, {
				method: 'GET',
				headers: {
					'Accept-Language':lang,
				},
			});
			const result: ApiResponse = await response.json();
			return Promise.resolve(result.data as IProductCategory[]);
		} catch (error) {
			return Promise.reject({
				pageInfo: { totalPages: 0, pageNo: 0 },
				data: [],
				errors:
					error instanceof Error
						? [{ code: '', error: error.message }]
						: [{ code: '', error: 'An error occured' }],
			});
		}
	},
	async addCategory(
		name: string,
		description: string,
		imageId: string,
		dataImage: ProductFile,
		parentCategoryId: number,
		parentCategory: string
	) {
		try {
			const response = await fetch(categoryApiUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					// Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					name,
					description,
					imageId,
					dataImage,
					parentCategoryId,
					parentCategory,
				}),
			});
			const result: ApiResponse = await response.json();
			return Promise.resolve(result);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	async editCategory(
		id: number,
		name: string,
		description: string,
		imageId: string,
		dataImage: ProductFile,
		parentCategoryId: number,
		parentCategory: string
	) {
		try {
			const response = await fetch(categoryApiUrl, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					// Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					id,
					name,
					description,
					imageId,
					dataImage,
					parentCategoryId,
					parentCategory,
				}),
			});
			const result: ISingleProductCategoriResponse = await response.json();
			return Promise.resolve(result);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	async deleteCategory(id: number) {
		try {
			const response = await fetch(`${categoryApiUrl}/${id}`, {
				method: 'DELETE',
				headers: {
					// Authorization: `Bearer ${token}`,
				},
			});
			const result: IDeleteResponse = await response.json();
			return Promise.resolve(result);
		} catch (error) {
			return Promise.reject(error);
		}
	},
};
