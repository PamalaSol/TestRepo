'use client';

import { FormEvent, useEffect, useLayoutEffect, useState } from 'react';
import { contactService } from '../_services/contact';
import { useTranslation } from '@/app/i18n/client';
import BlueArrow from '@/public/assets/blue-arrow.svg';
import GrayArrow from '@/public/assets/gray-arrow.svg';
import Image from 'next/image';
import ReCAPTCHA from 'react-google-recaptcha';
import { toastDefaultOptions } from '@/lib/utils';
import { ToastContainer, toast } from 'react-toastify';
import tStyles from '@/app/[lng]/textSizes.module.css';
import { usePathname } from 'next/navigation';

interface ContactFormProps {
	theme: 'light' | 'dark';
	lng: string;
	onSubmissionResult?: (success: boolean) => void; // New callback prop
}

export default function ContactForm({ theme, lng, onSubmissionResult }: ContactFormProps) {
	const { t } = useTranslation(lng, 'contact');

	const pathname = usePathname();

	const [name, setName] = useState<string>('');
	const [subject, setSubject] = useState<string>('');
	const [company, setCompany] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [message, setMessage] = useState<string>('');
	const [privPol, setPrivPol] = useState<boolean>(false);
	const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);

	const [captcha, setCaptcha] = useState<string | null>(null);
	const [captchaPopupOpen, setCaptchaPopupOpen] = useState<boolean>(false);

	const [flag, setFlag] = useState<boolean>(false);
	const [animate, setAnimate] = useState(false);
	const [isInitialRender, setIsInitialRender] = useState(true);

	useLayoutEffect(() => {
		if (!isInitialRender) {
			setAnimate(true);
			const timer = setTimeout(() => {
				setAnimate(false);
			}, 3000); // Animation duration
			return () => clearTimeout(timer);
		} else {
			setIsInitialRender(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [flag]);
	const handleSubmitContactForm = (e: FormEvent) => {
		e.preventDefault();
		if (
			name === '' ||
			subject === '' ||
			company === '' ||
			email === '' ||
			message === '' ||
			!privPol
		) {
			toast.error(t('infoMissingMsg'), toastDefaultOptions);
			setFlag((prev) => !prev);
		} else {
			setCaptchaPopupOpen(true);
		}
	};

	useEffect(() => {
		if (captcha) {
			setCaptchaPopupOpen(false);
			checkCaptcha();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [captcha]);

	function validateEmail(email: string) {
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		return emailPattern.test(email);
	}
	const checkCaptcha = () => {
		if (captcha) {
			setIsSendingMessage(true);

			contactService
				.sendMessage(subject, email, name, company, message, lng, captcha)
				.then((response) => {
					if (!response.isSuccessful) {
						if (pathname !== `/${lng}`) {
							toast.error(t('notSend'), toastDefaultOptions);
						} else {
							onSubmissionResult?.(false);
						}
					} else {
						if (pathname !== `/${lng}`) {
							toast.success(t('sent'), toastDefaultOptions);
						} else {
							onSubmissionResult?.(true);
						}
					}
				})
				.catch((error) => {
					if (pathname !== `/${lng}`) {
						toast.error(t('notSend'), toastDefaultOptions);
					} else {
						onSubmissionResult?.(false);
					}
				})
				.finally(() => {
					setIsSendingMessage(false);
				});
		} else {
			toast.error(t('verifyHuman'), toastDefaultOptions);
		}
	};

	const siteKey = process.env.NEXT_PUBLIC_SITE_KEY_CAPTCHA!;
	const handleChange = () => {
		setPrivPol((prev) => !prev);
	};
	return (
		<div className='max-laptop:relative'>
			{pathname !== `/${lng}` && <ToastContainer />}

			{captchaPopupOpen && (
				<div className="fixed inset-0 z-30 flex items-center justify-center w-screen h-screen ">
					<div
						className="absolute inset-0 -top-[10vh] z-30 h-[110vh] w-screen opacity-50 laptop:bg-gray-500"
						onClick={() => {
							setCaptcha(null);
							setCaptchaPopupOpen(false);
						}}
					></div>
					<ReCAPTCHA
						hl={lng === 'fr-FR' ? 'fr' : lng === 'de-DE' ? 'de-CH' : 'en'}
						sitekey={siteKey}
						className="z-40"
						onChange={setCaptcha}
					/>
				</div>
			)}
			<form onSubmit={handleSubmitContactForm}>
				<div className="flex flex-col space-y-8">
					<div className="grid grid-cols-12 space-x-2">
						<div className="grid-cols-6 col-span-6">
							<div className={`flex flex-col space-y-1`}>
								<label
									htmlFor="name"
									className={`text-xs uppercase ${theme !== 'dark' ? 'text-[#0F0F0F]' : 'text-[#F7F7F7]'}`}
								>
									{t('name')}
								</label>
								<input
									type="text"
									name="name"
									value={name}
									onChange={({ target: { value } }) => setName(value)}
									placeholder={t('nameL')}
									className={` ${animate && name === '' ? 'animate-pulseBorder rounded border border-red-500' : ''}  w-full border border-x-transparent border-b-[#898989] border-t-transparent bg-transparent outline-none ${theme === 'light' ? 'text-[#232323]' : 'text-[#D0D0D0]'} ::placeholder:text-[#898989] focus:${theme === 'light' ? 'border-b-[#191919]' : 'border-b-[#898989]'}`}
								/>
							</div>
						</div>
						<div className="grid-cols-6 col-span-6">
							<div className="flex flex-col space-y-1">
								<label
									htmlFor="subject"
									className={`text-xs uppercase ${theme !== 'dark' ? 'text-[#0F0F0F]' : 'text-[#F7F7F7]'}`}
								>
									{t('subject')}
								</label>
								<input
									type="text"
									name="subject"
									value={subject}
									onChange={({ target: { value } }) => setSubject(value)}
									placeholder={t('subjectL')}
									className={`${animate && subject === '' ? 'animate-pulseBorder rounded border border-red-500' : ''} w-full border border-x-transparent border-b-[#898989] border-t-transparent bg-transparent outline-none ${theme === 'light' ? 'text-[#232323]' : 'text-[#D0D0D0]'} ::placeholder:text-[#898989] focus:${theme === 'light' ? 'border-b-[#191919]' : 'border-b-[#898989]'}`}
								/>
							</div>
						</div>
					</div>
					<div className="grid grid-cols-12 space-x-2">
						<div className="grid-cols-6 col-span-6">
							<div className="flex flex-col space-y-1">
								<label
									htmlFor="company"
									className={`text-xs uppercase ${theme !== 'dark' ? 'text-[#0F0F0F]' : 'text-[#F7F7F7]'}`}
								>
									{t('company')}
								</label>
								<input
									type="text"
									name="company"
									value={company}
									onChange={({ target: { value } }) => setCompany(value)}
									placeholder={t('companyL')}
									className={`${animate && company === '' ? 'animate-pulseBorder rounded border border-red-500' : ''} w-full border border-x-transparent border-b-[#898989] border-t-transparent bg-transparent outline-none ${theme === 'light' ? 'text-[#232323]' : 'text-[#D0D0D0]'} ::placeholder:text-[#898989] focus:${theme === 'light' ? 'border-b-[#191919]' : 'border-b-[#898989]'}`}
								/>
							</div>
						</div>
						<div className="grid-cols-6 col-span-6">
							<div className="flex flex-col space-y-1">
								<label
									htmlFor="email"
									className={`text-xs uppercase ${theme !== 'dark' ? 'text-[#0F0F0F]' : 'text-[#F7F7F7]'}`}
								>
									{t('email')}
								</label>
								<input
									type="text"
									name="email"
									value={email}
									onChange={({ target: { value } }) => setEmail(value)}
									placeholder={t('emailL')}
									className={`${animate && email === '' ? 'animate-pulseBorder rounded border border-red-500' : ''} w-full border border-x-transparent border-b-[#898989] border-t-transparent bg-transparent outline-none ${theme === 'light' ? 'text-[#232323]' : 'text-[#D0D0D0]'} ::placeholder:text-[#898989] focus:${theme === 'light' ? 'border-b-[#191919]' : 'border-b-[#898989]'}`}
								/>
							</div>
						</div>
					</div>
					<div className="grid-cols-12 col-span-12">
						<div className="flex flex-col space-y-1">
							<label
								htmlFor="message"
								className={`text-xs uppercase text-[#F7F7F7] outline-none`}
							>
								{t('message')}
							</label>
							<textarea
								name="message"
								value={message}
								onChange={({ target: { value } }) => setMessage(value)}
								placeholder={t('messageL')}
								className={`${animate && message === '' ? 'animate-pulseBorder rounded border border-red-500' : ''} w-full border border-x-transparent border-b-[#898989] border-t-transparent bg-transparent outline-none ${theme === 'light' ? 'text-[#232323]' : 'text-[#D0D0D0]'} ::placeholder:text-[#898989] focus:${theme === 'light' ? 'border-b-[#191919]' : 'border-b-[#898989]'}`}
								rows={4}
							/>
						</div>
					</div>
					<div
						className={`col-span-12 grid-cols-12 space-y-2 ${theme !== 'dark' ? 'text-[#0F0F0F]' : 'text-[#F7F7F7]'}`}
					>
						<p className={`text-xs uppercase  outline-none`}>{t('policyTitle')}</p>
						<div className="flex items-start justify-start gap-2 ">
							<div
								className={`${animate && !privPol ? 'animate-pulseBorder rounded border-[1.5px] border-red-500' : 'border-[1.5px] border-transparent'} mt-1 flex h-4 w-5 rounded`}
							>
								<input
									type="checkbox"
									checked={privPol}
									onChange={handleChange}
									className={`cursor-pointer rounded border border-gray-600   checked:accent-[#306abf] `}
								/>
							</div>
							<p className={`${tStyles.cat3} text-justify leading-[20px]`}>
								{t('policyText')}
							</p>
						</div>
					</div>
					<div className="flex flex-row justify-end">
						<button
							type="submit"
							className={`text-light flex cursor-pointer items-center gap-3 text-base opacity-80 ${theme !== 'dark' ? 'text-[#306abf]' : 'text-[#F7F7F7]'} ${isSendingMessage ? 'cursor-wait opacity-80' : 'cursor-pointer opacity-100'} transition ease-in-out hover:opacity-80`}
							disabled={isSendingMessage}
						>
							{t('submit')}{' '}
							{pathname === `/${lng}` ? (
								<Image
									src={GrayArrow}
									alt="arrow"
									height={500}
									width={500}
									className="w-auto h-auto "
								/>
							) : (
								<Image
									src={BlueArrow}
									alt="arrow"
									height={500}
									width={500}
									className="w-auto h-auto "
								/>
							)}
						</button>
					</div>
				</div>
			</form>
		</div>
	);
}
