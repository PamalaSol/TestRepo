import { ApiResponse, FailedResponse, SimpleResponse, SuccessResponse } from '../_interfaces/interfaces';
import { ICategory } from './categories';
import { ITag } from './tags';
import { getToken } from './utils';

export interface Post {
	name: string;
	description: string;
	keywords: string;
	content: string;
	isFeatured: boolean;
	isPromoted: boolean;
	imageId: string;
	dataImage: string;
	alt: string;
	categories: ICategory[];
	tags: ITag[];
}

export interface IPost extends Post {
	id: string;
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

export interface IGetOneResponse extends SimpleResponse {
	data: IPost;
}

const postApiUrl = `${process.env.API_URL}/Post`;

interface IPostsService {
	getPost: (id: string, lang: string) => Promise<IGetOneResponse>;
	getPosts: (lang: string) => Promise<IPost[]>;
	addPost: (
		name: string,
		description: string,
		keywords: string,
		content: string,
		isFeatured: boolean,
		image: File | null,
		alt: string,
		categories: number[],
		tags: number[],
		lang: string
	) => Promise<SuccessResponse | FailedResponse>;
	editPost: (
		id: string,
		name: string,
		description: string,
		keywords: string,
		content: string,
		isFeatured: boolean,
		image: File | null,
		alt: string,
		categories: number[],
		tags: number[],
		lang: string
	) => Promise<SuccessResponse | FailedResponse>;
	deletePost: (id: string, lang: string) => Promise<SuccessResponse | FailedResponse>;
}

export const postsService: IPostsService = {
	async getPost(id: string, lang: string) {
		try {
			const response = await fetch(`${postApiUrl}/${id}`, {
				method: 'GET',
				headers: {
					'Accept-Language': lang,
				},
			});
			const result: IGetOneResponse = await response.json();
			return Promise.resolve(result);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	async getPosts(lang: string) {
		try {
			const response = await fetch(postApiUrl, {
				method: 'GET',
				headers: {
					'Accept-Language': lang,
				},
			});
			const result: ApiResponse = await response.json();
			return Promise.resolve(result.data as IPost[]);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	async addPost(
		name: string,
		description: string,
		keywords: string,
		content: string,
		isFeatured: boolean,
		image: File | null,
		alt: string,
		categories: number[],
		tags: number[],
		lang: string
	) {
		try {
			let data = new FormData();
			data.append('name', name);
			data.append('description', description);
			data.append('keywords', keywords);
			data.append('content', content);
			data.append('isFeatured', `${isFeatured}`);
			if (image) {
				data.append('image', image);
			}
			data.append('alt', alt);
			if (categories.length) {
				data.append('categories', `${categories}`);
			}
			if (tags.length) {
				data.append('tags', `${tags}`);
			}
			const token = getToken();
			const response = await fetch(postApiUrl, {
				method: 'POST',
				headers: {
					'Accept-Language': lang,
					Authorization: `Bearer ${token}`,
				},
				body: data,
			});
			const result: SuccessResponse | FailedResponse = await response.json();
			if (result.errors.length) {
				return Promise.reject(result);
			}
			return Promise.resolve(result);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	async editPost(
		id: string,
		name: string,
		description: string,
		keywords: string,
		content: string,
		isFeatured: boolean,
		image: File | null,
		alt: string,
		categories: number[],
		tags: number[],
		lang: string
	) {
		try {
			let data = new FormData();
			data.append('id', id);
			data.append('name', name);
			data.append('description', description);
			data.append('keywords', keywords);
			data.append('content', content);
			data.append('isFeatured', `${isFeatured}`);
			if (image) {
				data.append('image', image);
			}
			data.append('alt', alt);
			if (categories.length) {
				data.append('categories', `${categories}`);
			}
			if (tags.length) {
				data.append('tags', `${tags}`);
			}
			const token = getToken();
			const response = await fetch(postApiUrl, {
				method: 'PUT',
				headers: {
					'Accept-Language': lang,
					Authorization: `Bearer ${token}`,
				},
				body: data,
			});
			const result: SuccessResponse | FailedResponse = await response.json();
			const failedResponse = (result as FailedResponse);
			if (failedResponse.error) {
				return Promise.reject(failedResponse.error);
			}
			if (result.errors?.length) {
				return Promise.reject(result);
			}
			return Promise.resolve(result);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	async deletePost(id: string, lang: string) {
		try {
			const token = getToken();
			const response = await fetch(`${postApiUrl}/${id}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const result: SuccessResponse | FailedResponse = await response.json();
			if (result.errors.length || Object.values(result.errors).length) {
				return Promise.reject(result);
			}
			return Promise.resolve(result);
		} catch (error) {
			return Promise.reject(error);
		}
	},
};
