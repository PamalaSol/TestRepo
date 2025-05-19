import { ApiResponse, IUserResponse } from '../_interfaces/interfaces';

interface IUserService {
	getUsers: () => Promise<IUserResponse[]>;
	getUserById: (id: string) => Promise<IUserResponse>;
	getUserByEmail: (email: string) => Promise<IUserResponse>;
	createUser: (
		name: string,
		lastName: string,
		email: string,
		profilePictureFile: File,
		social: string,
		website: string,
		info: string
	) => Promise<IUserResponse>;
	updateUser: (
		id: string,
		name: string,
		lastName: string,
		profilePictureFile: File,
		social: string,
		website: string,
		info: string
	) => Promise<IUserResponse>;
	deleteUser: (userId: string) => Promise<IUserResponse>;
}

const userApiUrl = `${process.env.API_URL}/Account`;
// const token = authService.getToken();

export const userService: IUserService = {
	async getUsers() {
		try {
			const response = await fetch(userApiUrl);
			const result: ApiResponse = await response.json();
			return Promise.resolve(result.data as IUserResponse[]);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	async getUserById(id: string) {
		try {
			const response = await fetch(`${userApiUrl}/${id}`);
			const result: ApiResponse = await response.json();
			return Promise.resolve(result.data as IUserResponse);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	async getUserByEmail(email: string) {
		try {
			const response = await fetch(`${userApiUrl}/${email}`);
			const result: ApiResponse = await response.json();
			return Promise.resolve(result.data as IUserResponse);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	async createUser(
		name: string,
		lastName: string,
		email: string,
		profilePictureFile: File,
		social: string,
		website: string,
		info: string
	) {
		try {
			let data = new FormData();
			data.append('name', name);
			data.append('lastName', lastName);
			data.append('email', email);
			data.append('profilePictureFile', profilePictureFile);
			data.append('social', social);
			data.append('website', website);
			data.append('info', info);
			const response = await fetch(`${userApiUrl}/create`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					// Authorization: `Bearer ${token}`,
				},
				body: data,
			});
			const result: ApiResponse = await response.json();
			return Promise.resolve(result.data as IUserResponse);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	async updateUser(
		id: string,
		name: string,
		lastName: string,
		profilePictureFile: File,
		social: string,
		website: string,
		info: string
	) {
		try {
			let data = new FormData();
			data.append('name', name);
			data.append('lastName', lastName);
			data.append('profilePictureFile', profilePictureFile);
			data.append('social', social);
			data.append('website', website);
			data.append('info', info);
			const response = await fetch(`${userApiUrl}/updateuser/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					// Authorization: `Bearer ${token}`,
				},
				body: data,
			});
			const result: ApiResponse = await response.json();
			return Promise.resolve(result.data as IUserResponse);
		} catch (error) {
			return Promise.reject(error);
		}
	},
	async deleteUser(userId: string) {
		try {
			const response = await fetch(`${userApiUrl}/${userId}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					// Authorization: `Bearer ${token}`,
				},
			});
			const result: ApiResponse = await response.json();
			return Promise.resolve(result.data as IUserResponse);
		} catch (error) {
			return Promise.reject(error);
		}
	},
};
