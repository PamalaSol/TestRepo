import { ApiResponse } from '../_interfaces/interfaces';

const aboutApiUrl = `${process.env.API_URL}/About`;
// const token = authService.getToken();

export interface IAbout {
	imageId: string;
	dataImage: string;
	backgroundImageId: string;
	dataBackgroundImage: string;
	title: string;
	subtitle: string;
	infoText: string;
}

export interface AboutResponse extends IAbout {
	id: number;
	createdBy: string;
	createdDate: string;
	modifiedBy: string;
	modifiedOn: string;
}

interface IAboutService {
	getAbout: (lang:string) => Promise<AboutResponse>;
	updateAbout: (
		id: number,
		dataImage: File | null,
		dataBackgroundImage: File | null,
		title: string,
		subtitle: string,
		infoText: string
	) => Promise<IAbout>;
}

export const aboutService: IAboutService = {
	async getAbout(lang:string) {
		try {
			const response = await fetch(aboutApiUrl, {
				method: 'GET',
				headers: {
					'Accept-Language': lang,
				},
			});
			const result: ApiResponse = await response.json();
			return Promise.resolve(result.data as AboutResponse);
		} catch (error) {
			return Promise.reject()

			
		}
	},
	async updateAbout(
		id: number,
		image: File | null,
		backgroundImage: File | null,
		title: string,
		subtitle: string,
		infoText: string
	) {
		try {
			let data = new FormData();
			data.append('id', `${id}`);
			if (image) {
				data.append('image', image);
			}
			if (backgroundImage) {
				data.append('backgroundImage', backgroundImage);
			}
			data.append('title', title);
			data.append('subtitle', subtitle);
			data.append('infoText', infoText);

			const response = await fetch(aboutApiUrl, {
				headers: {
					// Authorization: `Bearer ${token}`,
				},
				method: 'PUT',
				body: data,
			});
			const result: IAbout = await response.json();
			return Promise.resolve(result);
		} catch (error) {
			return Promise.reject(error);
		}
	},
};
