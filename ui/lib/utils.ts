import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ToastOptions } from 'react-toastify';
import { ProductFile } from '@/app/[lng]/_services/products';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const toastDefaultOptions: ToastOptions = {
	position: 'top-center',
	autoClose: 3000,
	hideProgressBar: false,
	closeOnClick: true,
	pauseOnHover: true,
	theme: 'colored',
};

export const extractImageData = (dataImages: ProductFile[]) => {
	if (dataImages) {
		for (let i = 0; i < dataImages.length; i++) {
			if (dataImages[i].fileCategoryId == '1') {
				return i;
			}
		}
	}
	return 0;
};

export type Quality = {
	name: string;
	num: string;
};

export type Version = {
	name: string;
	num: string[];
};

export const series: {
	seriesNum: string;
	dm: string[];
	qualities: Quality[];
	version: Version;
	v2Name?: Version;
	v2Qualities?: Quality[];
}[] = [
	{
		seriesNum: '00',
		dm: ['010.', '015.', '020.', '025.'],
		qualities: [
			{ name: 'NR', num: '001.' },
			{ name: 'NR-L', num: '011.' },
			{ name: 'NR-LH', num: '021.' },
			{ name: 'NBR-LH', num: '121.' },
			{ name: 'EPDM-L', num: '212.' },
			{ name: 'FPM', num: '303.' },
			{ name: 'CR', num: '401.' },
			{ name: 'CSM', num: '501.' },
		],
		version: { name: 'Standard', num: ['000', '100'] },
	},
	{
		seriesNum: '10',
		dm: ['015.', '020.', '025.', '032.'],
		qualities: [
			{ name: 'NR', num: '000.' },
			{ name: 'NR-L', num: '010.' },
			{ name: 'NR-LH', num: '020.' },
			{ name: 'NBR-LH', num: '120.' },
			{ name: 'EPDM-L', num: '212.' },
			{ name: 'FPM', num: '303.' },
			{ name: 'CR', num: '400.' },
			{ name: 'CSM', num: '500.' },
		],
		version: { name: 'Standard', num: ['000', '100'] },
	},
	{
		seriesNum: '20',
		dm: ['032.', '040.'],
		qualities: [
			{ name: 'NR', num: '001.' },
			{ name: 'NR-L', num: '011.' },
			{ name: 'NR-LH', num: '021.' },
			{ name: 'NBR-LH', num: '121.' },
			{ name: 'EPDM-L', num: '212.' },
			{ name: 'FPM', num: '303.' },
			{ name: 'CR', num: '401.' },
			{ name: 'CSM', num: '501.' },
		],
		version: { name: 'Standard', num: ['000', '100'] },
	},
	{
		seriesNum: '21',
		dm: ['032.', '040.'],
		qualities: [
			{ name: 'NR', num: '001.' },
			{ name: 'NR-L', num: '011.' },
			{ name: 'NR-LH', num: '021.' },
			{ name: 'NBR-LH', num: '121.' },
			{ name: 'EPDM-L', num: '212.' },
			{ name: 'FPM', num: '303.' },
			{ name: 'CR', num: '401.' },
			{ name: 'CSM', num: '501.' },
		],
		version: { name: 'Standard', num: ['000', '100'] },
	},
	{
		seriesNum: '40',
		dm: ['050.', '065.', '080.'],
		qualities: [
			{ name: 'NR', num: '001.' },
			{ name: 'NR-L', num: '011.' },
			{ name: 'NR-LH', num: '021.' },
			{ name: 'NBR-LH', num: '121.' },
			{ name: 'EPDM-L', num: '211.' },
			{ name: 'FPM', num: '301.' },
			{ name: 'CR', num: '401.' },
			{ name: 'CSM', num: '501.' },
		],
		version: { name: 'Standard', num: ['000', '100'] },
		v2Name: { name: 'ATEX', num: ['022'] },
		v2Qualities: [
			{ name: 'NR-E', num: '031.' },
			{ name: 'NR-LE', num: '061.' },
			{ name: 'NBR-LE', num: '161.' },
			{ name: 'EPDM-LE', num: '261.' },
		],
	},
	{
		seriesNum: '41',
		dm: ['050.', '065.', '080.', '100.', '125.', '150.'],
		qualities: [
			{ name: 'NR', num: '001.' },
			{ name: 'NR-L', num: '011.' },
			{ name: 'NR-LH', num: '021.' },
			{ name: 'NBR-LH', num: '121.' },
			{ name: 'EPDM-L', num: '211.' },
			{ name: 'FPM', num: '301.' },
			{ name: 'CR', num: '401.' },
			{ name: 'CSM', num: '501.' },
		],
		version: { name: 'Standard', num: ['000', '100'] },
		v2Name: { name: 'ATEX', num: ['022'] },
		v2Qualities: [
			{ name: 'NR-E', num: '031.' },
			{ name: 'NR-LE', num: '061.' },
			{ name: 'NBR-LE', num: '161.' },
			{ name: 'EPDM-LE', num: '261.' },
		],
	},
	{
		seriesNum: '48',
		dm: ['050.', '065.', '080.'],
		qualities: [
			{ name: 'NR', num: '001.' },
			{ name: 'NR-L', num: '011.' },
			{ name: 'NR-LH', num: '021.' },
			{ name: 'NBR-LH', num: '121.' },
			{ name: 'EPDM-L', num: '211.' },
			{ name: 'FPM', num: '301.' },
			{ name: 'CR', num: '401.' },
			{ name: 'CSM', num: '501.' },
		],
		version: { name: 'Standard', num: ['000', '100'] },
		v2Name: { name: 'ATEX', num: ['022'] },
		v2Qualities: [
			{ name: 'NR-E', num: '031.' },
			{ name: 'NR-LE', num: '061.' },
			{ name: 'NBR-LE', num: '161.' },
			{ name: 'EPDM-LE', num: '261.' },
		],
	},
	{
		seriesNum: '50',
		dm: ['040.', '050.', '065.'],
		qualities: [
			{ name: 'NR', num: '000.' },
			{ name: 'NR-L', num: '010.' },
			{ name: 'NR-LH', num: '020.' },
			{ name: 'NBR-LH', num: '120.' },
			{ name: 'EPDM-L', num: '212.' },
			{ name: 'FPM', num: '303.' },
			{ name: 'CR', num: '401.' },
			{ name: 'CSM', num: '501.' },
		],
		version: { name: 'Standard', num: ['000', '100'] },
	},
	{
		seriesNum: '60',
		dm: ['006.'],
		qualities: [
			{ name: 'NR', num: '001.' },
			{ name: 'NR-L', num: '011.' },
			{ name: 'NR-LH', num: '021.' },
			{ name: 'NBR-LH', num: '121.' },
			{ name: 'EPDM-L', num: '212.' },
			{ name: 'FPM', num: '303.' },
			{ name: 'CR', num: '401.' },
			{ name: 'CSM', num: '501.' },
		],
		version: { name: 'Standard', num: ['000', '100'] },
	},
	{
		seriesNum: '70',
		dm: ['010.', '015.', '020.', '025.', '032.', '040.', '050.', '065.'],
		qualities: [
			{ name: 'NR', num: '001.' },
			{ name: 'NR-L', num: '011.' },
			{ name: 'NR-LH', num: '021.' },
			{ name: 'NBR-LH', num: '121.' },
			{ name: 'EPDM-L', num: '212.' },
			{ name: 'FPM', num: '303.' },
			{ name: 'CR', num: '401.' },
			{ name: 'CSM', num: '501.' },
		],
		version: { name: 'Standard', num: ['000', '100'] },
		v2Name: { name: 'ATEX', num: ['000', '100'] },
		v2Qualities: [
			{ name: 'NR-E', num: '031.' },
			{ name: 'NR-LE', num: '061.' },
			{ name: 'NBR-LE', num: '161.' },
			{ name: 'EPDM-LE', num: '262.' },
		],
	},
	{
		seriesNum: '78',
		dm: ['015.', '020.', '025.', '032.', '040.', '050.'],
		qualities: [
			{ name: 'NR', num: '001.' },
			{ name: 'NR-L', num: '011.' },
			{ name: 'NR-LH', num: '021.' },
			{ name: 'NBR-LH', num: '121.' },
			{ name: 'EPDM-L', num: '212.' },
			{ name: 'FPM', num: '303.' },
			{ name: 'CR', num: '401.' },
			{ name: 'CSM', num: '501.' },
		],
		version: { name: 'Standard', num: ['000', '100'] },
		v2Name: { name: 'ATEX', num: ['000', '100'] },
		v2Qualities: [
			{ name: 'NR-E', num: '031.' },
			{ name: 'NR-LE', num: '061.' },
			{ name: 'NBR-LE', num: '161.' },
			{ name: 'EPDM-LE', num: '262.' },
		],
	},
	{
		seriesNum: '80',
		dm: ['010.', '015.', '020.', '025.', '032.', '040.', '050.'],
		qualities: [
			{ name: 'NR', num: '001.' },
			{ name: 'NR-L', num: '011.' },
			{ name: 'NR-LH', num: '021.' },
			{ name: 'NBR-LH', num: '121.' },
			{ name: 'EPDM-L', num: '212.' },
			{ name: 'FPM', num: '303.' },
			{ name: 'CR', num: '401.' },
			{ name: 'CSM', num: '501.' },
		],
		version: { name: 'Standard', num: ['000', '100'] },
		v2Name: { name: 'ATEX', num: ['081', '082', '083'] },
		v2Qualities: [
			{ name: 'NR-E', num: '031.' },
			{ name: 'NR-LE', num: '061.' },
			{ name: 'NBR-LE', num: '161.' },
			{ name: 'EPDM-LE', num: '262.' },
		],
	},
	{
		seriesNum: '88',
		dm: ['015.', '020.', '025.', '032.', '040.', '050.'],
		qualities: [
			{ name: 'NR', num: '001.' },
			{ name: 'NR-L', num: '011.' },
			{ name: 'NR-LH', num: '021.' },
			{ name: 'NBR-LH', num: '121.' },
			{ name: 'EPDM-L', num: '212.' },
			{ name: 'FPM', num: '303.' },
			{ name: 'CR', num: '401.' },
			{ name: 'CSM', num: '501.' },
		],
		version: { name: 'Standard', num: ['000', '100'] },
		v2Name: { name: 'ATEX', num: ['000', '100'] },
		v2Qualities: [
			{ name: 'NR-E', num: '031.' },
			{ name: 'NR-LE', num: '061.' },
			{ name: 'NBR-LE', num: '161.' },
			{ name: 'EPDM-LE', num: '261.' },
		],
	},
];

export const seriesNums: string[] = [
	'00',
	'10',
	'20',
	'21',
	'40',
	'41',
	'48',
	'50',
	'60',
	'70',
	'78',
	'80',
	'88',
];

export const defaultSeries: {
	seriesNums: string[];
	dm: string[];
	qualities: Quality[];
	version: Version;
	v2Name: Version;
	v2Qualities: Quality[];
} = {
	seriesNums: ['00', '10', '20', '21', '40', '41', '48', '50', '60', '70', '78', '80', '88'],
	dm: ['015.', '020.', '025.', '032.', '040.', '050.'],
	qualities: [
		{ name: 'NR', num: '001.' },
		{ name: 'NR-L', num: '011.' },
		{ name: 'NR-LH', num: '021.' },
		{ name: 'NBR-LH', num: '121.' },
		{ name: 'EPDM-L', num: '212.' },
		{ name: 'FPM', num: '303.' },
		{ name: 'CR', num: '401.' },
		{ name: 'CSM', num: '501.' },
	],
	version: { name: 'Standard', num: ['000', '100'] },
	v2Name: { name: 'ATEX', num: ['000', '100'] },
	v2Qualities: [
		{ name: 'NR-E', num: '031.' },
		{ name: 'NR-LE', num: '061.' },
		{ name: 'NBR-LE', num: '161.' },
		{ name: 'EPDM-LE', num: '261.' },
	],
};

let allSizesArray: string[] = [];
series.map((serie) => {
	allSizesArray = allSizesArray.concat(
		serie.dm.map((size) => {
			const sizeParts = size.split('.');
			if (sizeParts.length) {
				return sizeParts[0];
			}
			return size;
		})
	);
});
export const allSizes = Array.from(new Set(allSizesArray)).sort();