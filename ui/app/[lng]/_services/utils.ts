import { FailedResponse, ILink, IPartner } from '../_interfaces/interfaces';
import { IPost } from './posts';

export const links: ILink[] = [
	{
		title: 'HO-Matic Pinch Valves',
		description:
			'Engineered for durability and efficiency, our pinch valves are perfect for handling even the most demanding applications.',
		link: '/products/pinch-valves',
		src: '',
	},
	{
		title: 'Controls & Accessories',
		description:
			'Enhance your valve performance with our comprehensive range of controls and accessories. Designed for seamless integration, these products offer you the flexibility and reliability needed for optimal valve operation.',
		link: '/products/controls',
		src: '',
	},
	{
		title: 'Spare Sleeves',
		description:
			'Maintain your valves’ peak performance with high quality sleeves. Crafted for longevity and perfect fit, our sleeves are the ideal solution for cost-effective valve maintenance.',
		link: '/products/sleeves',
		src: '',
	},
	{
		title: 'Custom Solutions',
		description:
			'Tailored to meet your specific needs, our custom solutions provide innovative and bespoke valve configurations. Let our expertise in customization bring your unique valve requirements to life, ensuring unparalleled performance.',
		link: '/products#custom-solutions',
		src: '',
	},
];

export const partners: IPartner[] = [
	{
		title: 'Buschjost Magnetventile',
		heading: 'Magnetventile',
		description:
			'The Buschjost process valve range includes a variety of different solenoid valves and air-operated valves for controlling and regulating gaseous and liquid media in pressure-carrying pipelines.',
		width: 35,
		height: 28,
		image: '/assets/home-partner-magnetventile.png',
		link: 'https://www.buschjostventile.de/en',
	},
	{
		title: 'Ross Europa GmbH',
		heading: 'Pneumatikventile',
		description:
			'Premium pneumatics without limits – since 1960. Your consultant and supplier of solenoid valves and problem solvers for the control and shut-off of medium-carrying pipelines.',
		width: 26,
		height: 19,
		image: '/assets/home-partner-pneumatikventile.png',
		link: 'https://www.rosseuropa.com/en',
	},
];

export const getToken = () => {
	if (typeof document !== 'undefined') {
		const cookies = document.cookie.split(';');
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i].trim();
			if (cookie.startsWith('token=')) {
				return cookie.substring(6);
			}
		}
	}
	return '';
};

export const dataUrlToFile = async (dataUrl: string, fileName: string) => {
	const result: Response = await fetch(dataUrl);
	const blob: Blob = await result.blob();
	return new File([blob], fileName);
};

export const getErrorMessage = (error: FailedResponse) => {
	let errorMessage = ``;
	if (error.title) {
		errorMessage = errorMessage.concat(error.title);
	}
	if (error.errors) {
		if (Array.isArray(error.errors)) {
			error.errors.map((e) => {
				errorMessage = errorMessage.concat((e as { error: string }).error);
			});
		} else {
			errorMessage = errorMessage.concat(Object.values(error.errors ?? {}).join(' '));
		}
	}
	return errorMessage;
};

export const sortPostsByDate = (a: IPost, b: IPost) => {
	const firstDate = new Date(a.createdDate);
	const secondDate = new Date(b.createdDate);
	return secondDate.getTime() - firstDate.getTime();
}