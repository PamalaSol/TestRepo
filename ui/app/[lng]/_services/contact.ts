import { ApiResponse, SimpleResponse } from '../_interfaces/interfaces';

export interface IContact {
	subject: string;
	email: string;
	name: string;
	message: string;
}

interface GoogleResponse {
	success: boolean;
	challenge_ts: string;
	hostname: string;
  }
const contactApiUrl = `${process.env.API_URL}/contact`;

interface IContactService {
	sendMessage: (
		subject: string,
		email: string,
		name: string,
		company:string,
		message: string,
		lang:string,
		captchaToken:string
	) => Promise<ApiResponse>;
}

export const contactService: IContactService = {
	async sendMessage(subject, email, name, company, message, lang, captchaToken) {
		try {
			const url = new URL(contactApiUrl);
			url.searchParams.append('captchaToken', captchaToken);

			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept-Language': lang,
				},
				body: JSON.stringify({
					subject,
					email,
					company,
					name,
					message,
				}),
			});
			const result: ApiResponse = await response.json();
			return Promise.resolve(result);
		} catch (error) {
			return Promise.reject(error);
		}
	},
};
