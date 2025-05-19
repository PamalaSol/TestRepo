import { Quality, Version } from "@/lib/utils";

export type DataResponse = unknown;

export interface SimpleResponse {
	errors: any[];
	isFailed: boolean;
	message: string | null;
	metadata: Record<string, unknown>;
	messageWithErrors: string;
	isSuccessful: boolean;
}

export interface PaginationResponse {
	pageSize: number;
	currentPage: number;
	firstPage: string;
	lastPage: string;
	totalPages: number;
	totalRecords: number;
	nextPage: string;
	previousPage: string;
	data: DataResponse;
}

export interface SuccessResponse extends SimpleResponse {
	data: PaginationResponse;
}

export interface FailedResponse {
	error?: string,
	errors: Record<string, string>,
	status: number;
	title: string;
	traceId: string;
	type: string;
}

export type ErrorResponse = {
	code: string;
	error: string;
};

export interface ApiResponse extends PaginationResponse {
	errors: Array<ErrorResponse>;
	isSuccessful: boolean;
	message: string | null;
	isFailed: boolean;
};

export interface IConfirmPassword {
	password: string;
	confirmPassword: string;
}

export interface ILogin {
	email: string;
	password: string;
	rememberMe: boolean;
}

export interface IRegister {
	name: string;
	lastName: string;
	email: string;
	profilePictureFile: File;
	social: string;
	website: string;
	info: string;
}

export interface IUserResponse {
	profilePictureId: string | null;
	dataProfilePhoto: string;
	name: string;
	lastName: string;
	userName: string;
	email: string;
	roles: string[];
	deposit: number;
	id: string;
}

export interface ILoginResponse extends SimpleResponse {
	data: {
		accessToken: string;
		// refreshToken: string
		user: IUserResponse;
		success: boolean;
		requires2Fa: boolean;
		isLockedOut: boolean;
		isNotAllowed: boolean;
	};
}

export interface IRegisterResponse extends SimpleResponse {
	data: {
		id: string;
		name: string;
		lastName: string;
	};
}

export interface IResetEmailResponse extends SimpleResponse {
	data: null;
}

export interface ILink {
	title: string;
	description: string;
	link: string;
	src:string
}

export interface IProduct {
	heading: string;
	description: string;
	series: string;
	dimensions: string;
	width: number;
	height: number;
	link: string;
	image: string;
}

export interface IPartner {
	title: string;
	heading: string;
	description: string;
	image: string;
	width: number;
	height: number;
	link: string;
}

export interface IFAQ {
	question: string;
	answer: string;
	link: string;
}

export interface productOrder {
	imgString?: string;
	orderNo?: string;
	sleeveNo?: string;
	amount: number;
	category: string;
	extraReq?: string;
}

export interface ProductImage {
	file: File;
	alt: string;
	category: number;
}

export interface IProductFormData {
	heading: string;
	series: string;
	connectionType: string;
	housing: string;
	nominalWidth: string;
	material: string;
	suitableFor: string;
	connectionMaterial: string;
	screws: string;
	industries: string;
	productCategory: number;
	combinedImages: ProductImage[];
}

export interface IPostFormData {
	name: string;
    description: string;
    keywords: string;
    content: string;
	isFeatured: boolean;
    image: File | null;
    alt: string;
    categories: string[];
    tags: string[];
}

export interface IFileFormData {
	title: string;
    alt: string;
    category: string;
    file: File | null;
}

export interface ISettingsFormData {
	series: string;
	dm: string;
	qualities: Quality[];
	version: Version[];
	v2Name?: Version[];
	v2Qualities?: Quality[];
}

export interface IGoogleConsentModeV2 {
	ad_storage: 'granted' | 'denied';
	ad_user_data: 'granted' | 'denied';
	analytics_storage: 'granted' | 'denied';
	ad_personalization?: 'granted' | 'denied';
	functionality_storage?: 'granted' | 'denied';
	personalization_storage?: 'granted' | 'denied';
	security_storage?: 'granted' | 'denied';
	wait_for_update?: number;
}