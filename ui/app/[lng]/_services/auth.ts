import {
	IConfirmPassword,
	ILogin,
	ILoginResponse,
	IRegister,
	IRegisterResponse,
	IResetEmailResponse,
	IUserResponse,
} from '../_interfaces/interfaces';

export const authenticate = (email: string, password: string) => {
	return Promise.resolve({
		user: {
			email,
		},
		token: '',
	});
};

interface IAuthService {
	register: (user: IRegister) => Promise<IRegisterResponse>;
	confirmPassword: (
		user: string,
		auth: string,
		credentials: IConfirmPassword
	) => Promise<IRegisterResponse>;
	login: (credentials: ILogin) => Promise<ILoginResponse>;
	logout: () => void;
	resetPassword: (email: string) => Promise<IResetEmailResponse>;
	getToken: () => string;
	getRefreshToken: () => string;
	getUser: () => IUserResponse;
	isAdmin: () => boolean;
}

const authApiUrl = `${process.env.API_URL}/Account`;

export const authService: IAuthService = {
	register: async ({
		name,
		lastName,
		email,
		profilePictureFile,
		social,
		website,
		info,
	}: IRegister) => {
		try {
			let data = new FormData();
			data.append('name', name);
			data.append('lastName', lastName);
			data.append('email', email);
			data.append('profilePictureFile', profilePictureFile);
			data.append('social', social);
			data.append('website', website);
			data.append('info', info);
			const response = await fetch(`${authApiUrl}/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: data,
			});
			const result: IRegisterResponse = await response.json();
			if (result.data) {
				return Promise.resolve(result);
			} else {
				return Promise.reject(result.errors);
			}
		} catch (error) {
			return Promise.reject(error);
		}
	},
	confirmPassword: async (
		user: string,
		resetPassToken: string,
		credentials: IConfirmPassword
	) => {
		try {
			const response = await fetch(
				`${authApiUrl}/resetPassword/${user}/${encodeURIComponent(resetPassToken)}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(credentials),
				}
			);
			const result: IRegisterResponse = await response.json();
			if (result.errors.length === 0) {
				return Promise.resolve(result);
			} else {
				return Promise.reject(result);
			}
		} catch (error) {
			return Promise.reject(error);
		}
	},
	login: async (credentials: ILogin) => {
		try {
			const response = await fetch(`${authApiUrl}/authenticate`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(credentials),
			});
			const result: ILoginResponse = await response.json();
			if (result.data) {
				document.cookie = `user=${result.data.user}; path=/; max-age=${60 * 60 * 24 * 7}; secure; SameSite=Strict`;
				document.cookie = `token=${result.data.accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; secure; SameSite=Strict`;
				return Promise.resolve(result);
			} else {
				return Promise.reject(result.errors);
			}
		} catch (error) {
			return Promise.reject(error);
		}
	},
	logout: () => {
		document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
		document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
	},
	resetPassword: async (email: string) => {
		try {
			const response = await fetch(`${authApiUrl}/generatePasswordReset/${email}`, {
				method: 'POST',
			});
			const result: IResetEmailResponse = await response.json();
			if (result.errors.length === 0) {
				return Promise.resolve(result);
			} else {
				return Promise.reject(result.errors);
			}
		} catch (error) {
			return Promise.reject(error);
		}
	},
	getToken: () => {
		const token = localStorage.getItem('token');
		return token ? token : '';
	},
	getRefreshToken: () => {
		const refreshToken = localStorage.getItem('refreshToken');
		return refreshToken ? refreshToken : '';
	},
	getUser: () => {
		const user = localStorage.getItem('user');
		return user ? JSON.parse(user) : null;
	},
	isAdmin: () => {
		const user = authService.getUser();
		if (!user || !user.roles) {
			return false;
		}
		return user.roles.includes('Admin');
	},
};
