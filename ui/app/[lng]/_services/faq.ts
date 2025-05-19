import { ApiResponse, SimpleResponse } from '../_interfaces/interfaces';

export interface Question {
	question: string;
	answer: string;
	isPublished: boolean;
	isPromoted: boolean;
}

export interface IQuestion extends Question {
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
		question: string;
		answer: string;
		isPublished: boolean;
	};
}

const faqUrl = `${process.env.API_URL}/FAQ`;
// const token = authService.getToken();

interface IFaqService {
	getQuestion: (id: number) => Promise<IGetOneResponse>;
	getQuestions: () => Promise<IQuestion[]>;
	addQuestion: (
		question: string,
		answer: string,
		isPublished: boolean,
		isPromoted: boolean
	) => Promise<ApiResponse>;
	editQuestion: (
		id: number,
		question: string,
		answer: string,
		isPublished: boolean,
		isPromoted: boolean
	) => Promise<IGetOneResponse>;
	deleteQuestion: (id: number) => Promise<IDeleteResponse>;
}

export const faqService: IFaqService = {
	async getQuestion(id: number) {
		try {
			const response = await fetch(`${faqUrl}/${id}`, {
				method: 'GET',
			});
			const result: IGetOneResponse = await response.json();
			return Promise.resolve(result);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	async getQuestions() {
		try {
			const response = await fetch(faqUrl);
			const result: ApiResponse = await response.json();
			return Promise.resolve(result.data as IQuestion[]);
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
	async addQuestion(question: string, answer: string, isPublished: boolean, isPromoted: boolean) {
		try {
			const response = await fetch(faqUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					// Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					question,
					answer,
					isPublished,
					isPromoted,
				}),
			});
			const result: ApiResponse = await response.json();
			return Promise.resolve(result);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	async editQuestion(
		id: number,
		question: string,
		answer: string,
		isPublished: boolean,
		isPromoted: boolean
	) {
		try {
			const response = await fetch(faqUrl, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					// Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					id,
					question,
					answer,
					isPublished,
					isPromoted,
				}),
			});
			const result: IGetOneResponse = await response.json();
			return Promise.resolve(result);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	async deleteQuestion(id: number) {
		try {
			const response = await fetch(`${faqUrl}/${id}`, {
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
