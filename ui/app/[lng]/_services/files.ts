import { ApiResponse, SimpleResponse } from '../_interfaces/interfaces';
import { IDeleteResponse, ProductFile } from './products';
import { getToken } from './utils';

const fileApiUrl = `${process.env.API_URL}/file`;
const filesApiUrl = `${process.env.API_URL}/files`;
const fileCategoryApiUrl = `${process.env.API_URL}/fileCategory`;

export const resourcesCatIds: number[] = [4, 2, 9, 3, 8, 6];
export const productFilesCatIds: number[] = [1, 5, 7];
export interface FileCategory {
	name: string;
	description: string;
	imageId: string;
	dataImage: string;
	alt: string;
}

export interface IFileCategory extends FileCategory {
	id: number;
	createdBy: string;
	createdDate: string;
	modifiedBy: string;
	modifiedOn: string;
}

interface iExtendedProductFile extends ProductFile {
	fileGuid: string;
	fileExtension: string;
}

export interface IFiles {
	files: ProductFile[];
}

interface IFileService {
	getFile: (id: string, lng: string) => Promise<ProductFile>;
	getFileDetails: (id: string, lng: string) => Promise<ProductFile>;
	addFile: (
		title: string,
		alt: string,
		category: number,
		file: File,
		lng: string
	) => Promise<ApiResponse>;
	deleteFile: (id: string, fileName: string, lang: string) => Promise<string>;
	getFileCategories: () => Promise<IFileCategory[]>;
	getFileCategory: (id: string) => Promise<IFileCategory>;
	getFilesByCategory: (
		catIds: number[],
		lang: string,
		searchTerm?: string
	) => Promise<ProductFile[]>;
}

export const fileService: IFileService = {
	async getFileDetails(fileId: string, lng: string) {
		try {
			const response = await fetch(`${fileApiUrl}/${fileId}`, {
				method: 'GET',
				headers: {
					'Accept-Language': lng,
					fileId,
				},
			});
			const result: ApiResponse = await response.json();
			return Promise.resolve(result.data as ProductFile);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	async getFile(id: string, lng: string) {
		try {
			const response = await fetch(`${filesApiUrl}/${id}/fillerText`, {
				method: 'GET',
				headers: {
					'Accept-Language': lng,
				},
			});
			const result: ApiResponse = await response.json();
			return Promise.resolve(result.data as ProductFile);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	async addFile(title: string, alt: string, category: number, file: File, lng: string) {
		try {
			const data = new FormData();
			data.append('file', file);
			const response = await fetch(
				`${filesApiUrl}?${new URLSearchParams({
					title,
					alt,
					category: category.toString(),
				})}`,
				{
					method: 'POST',
					headers: {
						'Accept-Language': lng,
					},
					body: data,
				}
			);
			const result: ApiResponse = await response.json();
			return Promise.resolve(result);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	async deleteFile(id: string, fileName: string, lang: string) {
		try {
			const token = getToken();
			const response = await fetch(`${filesApiUrl}/${id}/${fileName}`, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Accept-Language': lang,
				},
				method: 'DELETE',
			});
			const result = await response;
			return Promise.resolve(`${result}`);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	async getFileCategories() {
		try {
			const response = await fetch(fileCategoryApiUrl);
			const result: ApiResponse = await response.json();
			return Promise.resolve(result.data as IFileCategory[]);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	async getFileCategory(id: string) {
		try {
			const response = await fetch(`${fileCategoryApiUrl}/${id}`);
			const result: ApiResponse = await response.json();
			return Promise.resolve(result.data as IFileCategory);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	async getFilesByCategory(catIds: number[], lang: string, searchTerm?: string) {
		const categoryParams = catIds.map((catId) => `categories=${catId}`).join('&');
		try {
			const params = new URLSearchParams({
				PageSize: '500',
				...(searchTerm && searchTerm.length > 0 ? { SearchTerm: searchTerm } : {}),
			});
			const response = await fetch(`${filesApiUrl}?${categoryParams}&${params}`, {
				method: 'GET',
				headers: {
					'Accept-Language': lang,
				},
			});
			const result: ApiResponse = await response.json();
			const files = result.data as ProductFile[];
			return Promise.resolve(files);
		} catch (error) {
			return Promise.reject(error);
		}
	},
};
