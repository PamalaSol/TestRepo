import { ApiResponse, SimpleResponse } from '../_interfaces/interfaces';

export interface Tag {
	name: string;
	description: string;
}

export interface ITag extends Tag {
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
		createdBy: string;
		createdDate: string;
		modifiedBy: string;
		modifiedOn: string;
	};
}

const tagApiUrl = `${process.env.API_URL}/Tag`;
// const token = authService.getToken();

interface ITagService {
	getTag: (id: number) => Promise<IGetOneResponse>;
	getTags: () => Promise<ITag[]>;
	addTag: (name: string, description: string) => Promise<ApiResponse>;
	editTag: (id: number, name: string, description: string) => Promise<IGetOneResponse>;
	deleteTag: (id: number) => Promise<IDeleteResponse>;
}

export const tagService: ITagService = {
	async getTag(id: number) {
		try {
			const response = await fetch(`${tagApiUrl}/${id}`, {
				method: 'GET',
			});
			const result: IGetOneResponse = await response.json();
			return Promise.resolve(result);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	async getTags() {
		try {
			const response = await fetch(tagApiUrl);
			const result: ApiResponse = await response.json();
			return Promise.resolve(result.data as ITag[]);
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
	async addTag(name: string, description: string) {
		try {
			const response = await fetch(tagApiUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					// Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					name,
					description,
				}),
			});
			const result: ApiResponse = await response.json();
			return Promise.resolve(result);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	async editTag(id: number, name: string, description: string) {
		try {
			const response = await fetch(tagApiUrl, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					// Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					id,
					name,
					description,
				}),
			});
			const result: IGetOneResponse = await response.json();
			return Promise.resolve(result);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	async deleteTag(id: number) {
		try {
			const response = await fetch(`${tagApiUrl}/${id}`, {
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
