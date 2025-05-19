import { ApiResponse, SimpleResponse } from '../_interfaces/interfaces';

export interface Category {
	name: string;
	description: string;
	imageId: string;
	dataImage: string;
	parentCategoryId: number;
	parentCategory: string;
}

export interface ICategory extends Category {
	id: number;
	createdBy: string;
	createdDate: string;
	modifiedBy: string;
	modifiedOn: string;
}

interface IDeleteResponse extends SimpleResponse {
	data: {
		id: number;
	};
}

interface IGetOneResponse extends SimpleResponse {
	data: {
		id: number;
		name: string;
		description: string;
		imageId: string;
		dataImage: string;
		parentCategoryId: number;
		parentCategory: string;
		createdBy: string;
		createdDate: string;
		modifiedBy: string;
		modifiedOn: string;
	};
}

const categoryApiUrl = `${process.env.API_URL}/Category`;
// const token = authService.getToken();

interface ICategoryService {
	getCategory: (id: number) => Promise<IGetOneResponse>;
	getCategories: () => Promise<ICategory[]>;
	addCategory: (
		name: string,
		description: string,
		imageId: string,
		dataImage: string,
		parentCategoryId: number,
		parentCategory: string
	) => Promise<ApiResponse>;
	editCategory: (
		id: number,
		name: string,
		description: string,
		imageId: string,
		dataImage: string,
		parentCategoryId: number,
		parentCategory: string
	) => Promise<IGetOneResponse>;
	deleteCategory: (id: number) => Promise<IDeleteResponse>;
}

export const categoryService: ICategoryService = {
	async getCategory(id: number) {
		try {
			const response = await fetch(`${categoryApiUrl}/${id}`, {
				method: 'GET',
			});
			const result: IGetOneResponse = await response.json();
			return Promise.resolve(result);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	async getCategories() {
		try {
			const response = await fetch(categoryApiUrl);
			const result: ApiResponse = await response.json();
			return Promise.resolve(result.data as ICategory[]);
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
		dataImage: string,
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
		dataImage: string,
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
			const result: IGetOneResponse = await response.json();
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
