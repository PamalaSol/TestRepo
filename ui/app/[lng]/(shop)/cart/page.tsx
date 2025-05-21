'use client';

import { useTranslation } from '@/app/i18n/client';
import styles from './cart.module.css';
import SleeveImage from '@/public/assets/products/spare-sleeves.webp';
import StaticImage from 'next/image';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { productOrder } from '../../_interfaces/interfaces';
import { fullOrder, orderItem, shopService } from '../../_services/shop';
import DeleteButton from '@/public/assets/delete-button.svg';
import { toastDefaultOptions } from '@/lib/utils';
import { ToastContainer, toast } from 'react-toastify';
import tStyles from '@/app/[lng]/textSizes.module.css';
import ReCAPTCHA from 'react-google-recaptcha';

export default function Cart({ params: { lng } }: { params: { lng: string } }) {
	const { t } = useTranslation(lng, 'cart');
	const [orders, setOrders] = useState<productOrder[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [isOrder, setIsOrder] = useState<boolean>(false);
	const [customerId, setCustomerId] = useState<string>('');
	const [customerName, setCustomerName] = useState<string>('');
	const [company, setCompany] = useState<string>('');
	const [street, setStreet] = useState<string>('');
	const [zip, setZip] = useState<string>('');
	const [customerEmail, setCustomerEmail] = useState<string>('');
	const [customerPhone, setCustomerPhone] = useState<string>('');

	const [isDifferentAddress, setIsDifferentAddress] = useState<boolean>(true);
	const [shipId, setShipId] = useState<string>('');
	const [shippingCompany, setShippingCompany] = useState<string>('');
	const [shipName, setShipName] = useState<string>('');
	const [shippingStreet, setShippingStreet] = useState<string>('');
	const [shippingZip, setShippingZip] = useState<string>('');
	const [shippingCountry, setShippingCountry] = useState<string>('');
	const [additionalInfo, setAdditionalInfo] = useState<string>('');
	const [shippingCostNeeded, setShippingCostNeeded] = useState<boolean>(false);
	const [packagingCostNeeded, setPackagingCostNeeded] = useState<boolean>(false);
	const [extraReqHighlight, setextraReqHighlight] = useState<boolean>(false);

	const [orderFlag, setOrderFlag] = useState<boolean>(false);

	const [privPol, setPrivPol] = useState<boolean>(false);
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

	useEffect(() => {
		setIsLoading(true);
		const vLS = localStorage.getItem('orders');
		if (vLS) {
			const notSorted = JSON.parse(vLS);
			const uniqueOrders = notSorted.reduce((acc: productOrder[], order: productOrder) => {
				const existingOrder = acc.find((o) => o.orderNo === order.orderNo);
				if (existingOrder) {
					// Combine amounts if orderNo is the same
					existingOrder.amount += order.amount;
				} else {
					acc.push(order);
				}
				return acc;
			}, []);
			const sortedOrders = uniqueOrders.sort((a: productOrder, b: productOrder) => {
				const categoryA = typeof a.category === 'string' ? a.category : '';
				const categoryB = typeof b.category === 'string' ? b.category : '';

				// Sort alphabetically based on category strings
				return categoryA.localeCompare(categoryB);
			});
			setOrders(sortedOrders);
		} else {
			setOrders([]);
		}
		setIsLoading(false);
	}, [orderFlag]);

	const setLocalStorage = (newOrders: productOrder[]) => {
		localStorage.removeItem('orders');
		localStorage.setItem('orders', JSON.stringify(newOrders));
	};

	const deleteItem = (idx: number) => {
		setOrders((prevOrders) => {
			const newOrders = prevOrders.filter((_, index) => index !== idx);
			setLocalStorage(newOrders);
			window.dispatchEvent(new Event('storageItems'));
			return newOrders;
		});
	};
	const relativeRef = useRef<HTMLDivElement>(null);
	const fixedRef = useRef<HTMLParagraphElement>(null);

	useEffect(() => {
		const setFixedWidth = () => {
			if (relativeRef.current && fixedRef.current) {
				const relativeWidth = relativeRef.current.offsetWidth;
				fixedRef.current.style.width = `${relativeWidth}px`;
			}
		};

		// Call the function initially and on window resize
		setFixedWidth();
		window.addEventListener('resize', setFixedWidth);

		// Clean up the event listener
		return () => {
			window.removeEventListener('resize', setFixedWidth);
		};
	}, []);

	const handleExtraReqChange = (idx: number, event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setOrders((prevOrders) => {
			const updatedOrders = [...prevOrders];
			updatedOrders[idx].extraReq = event.target.value;
			setLocalStorage(updatedOrders);
			return updatedOrders;
		});
	};

	const hasEmptyExtraReq = () => {
		return orders.some(
			(order) => order.category === '3' && (!order.extraReq || order.extraReq.trim() === '')
		);
	};

	const callOrderService = (orderItems: orderItem[], captcha: string) => {
		const fullOrder: fullOrder = {
			isOrder: isOrder,
			company: company,
			name: customerName,
			street: street,
			zip: zip,
			email: customerEmail,
			phone: customerPhone,
			isDifferentAddress: isDifferentAddress,
			shippingCompany: shippingCompany,
			shippingName: shipName,
			shippingStreet: shippingStreet,
			shippingZip: shippingZip,
			shippingCountry: shippingCountry,
			shippingCostNeeded: shippingCostNeeded,
			packagingCostNeeded: packagingCostNeeded,
			description: `${additionalInfo ? additionalInfo : ''}`,
			orderedItems: orderItems,
		};

		shopService
			.postOrder(lng, fullOrder, captcha)
			.then((result) => {
				if (!result.isSuccessful || result.errors.length > 0) {
					toast.error(t('unexpectedError'), toastDefaultOptions);
					return;
				} else {
					toast.success(t('sent'), toastDefaultOptions);
					localStorage.removeItem('orders');
					window.dispatchEvent(new Event('storageItems'));
					setOrderFlag((prev) => !prev);
				}
			})
			.catch((error) => {
				toast.error(t('unexpectedError'), toastDefaultOptions);
			});
	};

	const [captcha, setCaptcha] = useState<string | null>(null);
	const [captchaPopupOpen, setCaptchaPopupOpen] = useState<boolean>(false);

	useEffect(() => {
		if (captcha) {
			setCaptchaPopupOpen(false);
			checkCaptcha();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [captcha]);

	const checkCaptcha = () => {
		if (captcha) {
			const vLS = localStorage.getItem('orders');
			if (!vLS || vLS.length < 3) {
				toast.error(t('cartEmpty'), toastDefaultOptions);
			} else {
				const localFormat = JSON.parse(vLS);
				const formattedOrder: orderItem[] = [];
				localFormat.forEach((item: productOrder) => {
					const newItem: orderItem = {
						quantity: item.amount.toString(),
					};

					switch (item.category) {
						case '1':
							newItem.valve = item.orderNo;
							newItem.sleeve = item.sleeveNo;
							break;
						case '2':
							newItem.sleeve = item.orderNo;
							break;
						case '3':
							newItem.sparePart = item.orderNo;
							newItem.itemDescription = item.extraReq;
							break;
						default:
							console.warn(`Unknown category: ${item.category}`);
					}

					formattedOrder.push(newItem);
				});

				callOrderService(formattedOrder, captcha);
			}
		} else {
			toast.error(t('verifyHuman'), toastDefaultOptions);
		}
	};

	const handlePrivChange = () => {
		setPrivPol((prev) => !prev);
	};

	const validateData = () => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (
			company === '' ||
			customerName === '' ||
			street === '' ||
			zip === '' ||
			customerEmail === '' ||
			customerPhone === '' ||
			!privPol
		) {
			toast.error(t('infoMissingMsg'), toastDefaultOptions);
			setFlag((prev) => !prev);
			return false;
		} else if (!emailRegex.test(customerEmail)) {
			toast.error(t('emailError'), toastDefaultOptions);
			return false;
		} else if (hasEmptyExtraReq()) {
			setextraReqHighlight(true);
			toast.error(t('controlInfoMsg'), toastDefaultOptions);
		} else {
			return true;
		}
	};

	const apiUrl = process.env.API_URL;
	const siteKey = process.env.NEXT_PUBLIC_SITE_KEY_CAPTCHA!;

	const unusedFeatures = false;

	return (
		<div className={`mt-4 p-4 max-laptop:relative max-laptop:mt-[5vh]`}>
			<div className={`grid grid-cols-11 gap-3`}>
				<div
					className="relative z-10 col-span-6 flex overflow-clip max-laptop:col-span-11"
					ref={relativeRef}
				>
					<div
						className={`${styles.label} flex gap-2 max-laptop:flex-col lg:fixed laptop:items-center laptop:gap-6`}
						ref={fixedRef}
					>
						<p>{t('info')}</p>
						<div className="flex items-center gap-3">
							<div className="flex gap-1 ">
								<input
									type="checkbox"
									checked={!isOrder}
									onChange={() => {
										setIsOrder(false);
									}}
									className={`cursor-pointer rounded border border-gray-600 checked:accent-[#306abf] `}
								/>

								<p className="">{t('requestOffer')}</p>
							</div>
							<div className="flex gap-1">
								<input
									type="checkbox"
									checked={isOrder}
									onChange={() => {
										setIsOrder(true);
									}}
									className={`cursor-pointer rounded border border-gray-600 checked:accent-[#306abf] `}
								/>

								<p className="">{t('order')}</p>
							</div>
						</div>
					</div>
				</div>
				<h1
					className={`flex items-end max-laptop:hidden ${styles.label} col-span-5  items-end border-b border-b-[#0F0F0F] font-bold lg:flex`}
				>
					{t('orders')}
				</h1>
			</div>
			<div className={`grid-cols-11 gap-6 lg:grid`}>
				<div className={`col-span-6 lg:relative`}>
					<div className=" lg:fixed lg:w-[48vw]">
						<div className={`grid-rows-7 grid `}>
							{unusedFeatures && (
								<div className={styles.input}>
									<input
										type="text"
										placeholder={t('id')}
										className={`w-full bg-[#f7f7f7] outline-none ${tStyles.cat3} ${animate && customerId === '' ? 'animate-pulseBorder rounded border-[1.5px] border-red-500' : 'border-[1.5px] border-transparent'} `}
										onChange={(event) => setCustomerId(event.target.value)}
									/>
								</div>
							)}
							<div className={styles.input}>
								<input
									type="text"
									placeholder={t('company')}
									className={`w-full bg-[#f7f7f7] outline-none ${tStyles.cat3} ${animate && company === '' ? 'animate-pulseBorder rounded border-[1.5px] border-red-500' : 'border-[1.5px] border-transparent'}`}
									onChange={(event) => setCompany(event.target.value)}
								/>
							</div>
							<div className={styles.input}>
								<input
									type="text"
									placeholder={t('name')}
									className={`w-full bg-[#f7f7f7] outline-none ${tStyles.cat3} ${animate && customerName === '' ? 'animate-pulseBorder rounded border-[1.5px] border-red-500' : 'border-[1.5px] border-transparent'}`}
									onChange={(event) => setCustomerName(event.target.value)}
								/>
							</div>
							<div className={styles.input}>
								<input
									type="text"
									placeholder={t('street')}
									className={`w-full bg-[#f7f7f7] outline-none ${tStyles.cat3} ${animate && street === '' ? 'animate-pulseBorder rounded border-[1.5px] border-red-500' : 'border-[1.5px] border-transparent'}`}
									onChange={(event) => setStreet(event.target.value)}
								/>
							</div>
							<div className={styles.input}>
								<input
									type="text"
									placeholder={t('zip')}
									className={`w-full bg-[#f7f7f7] outline-none ${tStyles.cat3} ${animate && zip === '' ? 'animate-pulseBorder rounded border-[1.5px] border-red-500' : 'border-[1.5px] border-transparent'}`}
									onChange={(event) => setZip(event.target.value)}
								/>
							</div>
							<div className={styles.input}>
								<input
									type="text"
									placeholder={t('email')}
									className={`w-full bg-[#f7f7f7] outline-none ${tStyles.cat3} ${animate && customerEmail === '' ? 'animate-pulseBorder rounded border-[1.5px] border-red-500' : 'border-[1.5px] border-transparent'}`}
									onChange={(event) => setCustomerEmail(event.target.value)}
								/>
							</div>
							<div className={styles.input}>
								<input
									type="text"
									placeholder={t('phone')}
									className={`w-full bg-[#f7f7f7] outline-none ${tStyles.cat3} ${animate && customerPhone === '' ? 'animate-pulseBorder rounded border-[1.5px] border-red-500' : 'border-[1.5px] border-transparent'}`}
									onChange={(event) => setCustomerPhone(event.target.value)}
								/>
							</div>
							<div
								className={`${styles.checkPlus} my-2 flex max-laptop:flex-col laptop:items-center laptop:gap-6 ${isOrder ? 'hidden' : ''} `}
							>
								<div className="flex gap-1 ">
									<input
										type="checkbox"
										checked={shippingCostNeeded}
										onChange={() => {
											setShippingCostNeeded((prev) => !prev);
										}}
										className={`cursor-pointer rounded border border-gray-600 checked:accent-[#306abf] `}
									/>

									<p className="">{t('shipCost')}</p>
								</div>
								<div className="flex gap-1">
									<input
										type="checkbox"
										checked={packagingCostNeeded}
										onChange={() => {
											setPackagingCostNeeded((prev) => !prev);
										}}
										className={`cursor-pointer rounded border border-gray-600 checked:accent-[#306abf] `}
									/>

									<p className="">{t('packCost')}</p>
								</div>
							</div>
						</div>

						<div className={`mt-2 grid`}>
							<div
								className={`${styles.label} flex max-laptop:flex-col laptop:items-center laptop:gap-6`}
							>
								<p>{t('shipA')}</p>

								<div className="flex gap-1 ">
									<input
										type="checkbox"
										checked={!isDifferentAddress}
										onChange={() => {
											setIsDifferentAddress((prev) => !prev);
										}}
										className={`cursor-pointer rounded border border-gray-600 checked:accent-[#306abf] `}
									/>

									<p className="">{t('diffAddress')}</p>
								</div>
							</div>
							<div className={`grid grid-rows-5`}>
								<div
									className={`${!isDifferentAddress ? 'hidden' : ''} ${styles.input}`}
								>
									<input
										type="text"
										placeholder={t('company')}
										className={`w-full bg-[#f7f7f7] outline-none ${tStyles.cat3} `}
										onChange={(event) => setShippingCompany(event.target.value)}
									/>
								</div>
								<div
									className={`${!isDifferentAddress ? 'hidden' : ''} ${styles.input}`}
								>
									<input
										type="text"
										placeholder={t('name')}
										className={`w-full bg-[#f7f7f7] outline-none ${tStyles.cat3} `}
										onChange={(event) => setShipName(event.target.value)}
									/>
								</div>
								<div
									className={`${!isDifferentAddress ? 'hidden' : ''} ${styles.input}`}
								>
									<input
										type="text"
										placeholder={t('street')}
										className={`w-full bg-[#f7f7f7] outline-none ${tStyles.cat3} `}
										onChange={(event) => setShippingStreet(event.target.value)}
									/>
								</div>
								<div
									className={`${!isDifferentAddress ? 'hidden' : ''} ${styles.input}`}
								>
									<input
										type="text"
										placeholder={t('zip')}
										className={`w-full bg-[#f7f7f7] outline-none ${tStyles.cat3} `}
										onChange={(event) => setShippingZip(event.target.value)}
									/>
								</div>
								<div
									className={`${!isDifferentAddress ? 'hidden' : ''} ${styles.input}`}
								>
									<input
										type="text"
										placeholder={t('country')}
										className={`w-full bg-[#f7f7f7] outline-none ${tStyles.cat3} `}
										onChange={(event) => setShippingCountry(event.target.value)}
									/>
								</div>
							</div>
						</div>
						<div className={`mt-6`}>
							<div className="mt-5 space-y-2">
								<p className={`${styles.label}`}>{t('policyTitle')}</p>
								<div className="flex items-start justify-start gap-2">
									<div
										className={`${animate && !privPol ? 'animate-pulseBorder rounded border-[1.5px] border-red-500' : 'border-[1.5px] border-transparent'} mt-1 flex h-4 w-5 rounded`}
									>
										<input
											type="checkbox"
											checked={privPol}
											onChange={handlePrivChange}
											className={`cursor-pointer rounded border border-gray-600 checked:accent-[#306abf] `}
										/>
									</div>
									<p className={`${tStyles.policyCart} text-justify `}>
										{t('policyText')}
									</p>
								</div>
							</div>
							<p className={`${styles.label} mt-5`}>{t('iInfo')}</p>
							<div
								className={`mt-6 min-h-[10vh] w-full border-b border-b-[#D9D9D9] text-sm`}
							>
								<textarea
									placeholder={t('infoMsg')}
									className={`h-[7vh] w-full resize-none bg-[#f7f7f7] outline-none ${tStyles.cat3} `}
									onChange={(event) => setAdditionalInfo(event.target.value)}
								/>
							</div>
						</div>
					</div>
				</div>
				<p
					className={`mb-2 mt-6 flex items-end laptop:hidden ${styles.label} col-span-5  items-end border-b border-b-[#0F0F0F] font-bold lg:flex`}
				>
					{t('orders')}
				</p>
				{isLoading ? (
					<div className="col-span-5 mt-10 flex w-full items-center justify-center">
						<strong>Loading items...</strong>
					</div>
				) : orders.length < 1 ? (
					<div className="col-span-5 mt-10 flex w-full items-center justify-center">
						<strong>{t('emptyCart')}</strong>
					</div>
				) : (
					<div className={`col-span-5 max-laptop:relative`}>
						{captchaPopupOpen && (
							<div className="fixed inset-0 z-30 flex h-screen w-full items-center justify-center ">
								<div
									className="absolute inset-0  z-30 h-[110vh] w-[screen]  opacity-50 laptop:bg-gray-500"
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
						<div>
							{orders.map((order, idx) => (
								<div
									className={`grid h-full w-full grid-cols-6 max-tablet:grid-rows-2 laptop:h-[27vh]`}
									key={`cart-item-${idx}`}
								>
									{order.category === '2' ? (
										<>
											<StaticImage
												src={SleeveImage}
												alt="sleeve"
												loading="lazy"
												className="col-span-2 w-[75%]  scale-75 max-laptop:col-span-6"
											/>
										</>
									) : (
										<>
											<picture className="col-span-2 flex items-center justify-center overflow-hidden pr-2 max-laptop:col-span-6">
												<img
													src={`${process.env.NEXT_PUBLIC_API_URL}/files/${order.imgString}/fillerText`}
													alt={`Products series ${order.imgString}`}
													width="100"
													height="100"
													loading="lazy"
													className={`max-h-[200px] max-w-[200px] object-contain`}
												/>
											</picture>
										</>
									)}

									<div
										className={`col-span-2 flex  flex-col items-start justify-center max-laptop:col-span-6 max-tablet:col-span-4`}
									>
										<p className={order.category === '1' ? '' : 'hidden'}>
											{t('series')} {order.orderNo?.substring(0, 2)}:{' '}
											{order.orderNo}
										</p>

										<p className={order.category !== '2' ? 'hidden' : ''}>
											{t('sleeve')}: {order.orderNo}
										</p>
										<p className={order.category === '3' ? '' : 'hidden'}>
											{order.orderNo}
										</p>
										<textarea
											name="extraReq"
											className={`${order.category === '3' ? '' : 'hidden'} w-full ${extraReqHighlight && order.extraReq === '' ? 'animate-pulse border-2 border-red-500' : ''} scrollbar-hidden resize-none overflow-y-scroll bg-[#f7f7f7] outline-none`}
											value={order.extraReq}
											onChange={(event) => handleExtraReqChange(idx, event)}
											placeholder={t('extraInfo')}
										/>
									</div>
									<div className="col-span-1 flex items-center justify-center ">
										<input
											type="number"
											name="amount"
											id={`amount-${idx}`}
											value={order.amount}
											onChange={(e) => {
												setOrders((prev) => {
													const updatedOrders = [...prev];
													updatedOrders[idx].amount = Number(
														e.target.value
													);
													setLocalStorage(updatedOrders);
													return updatedOrders;
												});
											}}
											className="w-[3vw] border-b border-b-[#0F0F0F] bg-[#f7f7f7] pl-2 max-tablet:w-[80%] "
										/>
									</div>
									<div className="items-cetner col-span-1 flex w-full justify-end">
										<StaticImage
											src={DeleteButton}
											alt="delete button"
											className="min-w-[48px] outline-none hover:cursor-pointer"
											onClick={() => {
												deleteItem(idx);
											}}
										/>
									</div>
								</div>
							))}
						</div>
						<div
							className={`flex w-full items-center justify-end border-t border-t-[#0F0F0F] py-2  ${orders.length < 1 ? 'hidden' : ''}`}
						>
							<button
								onClick={() => {
									setextraReqHighlight(false);

									if (validateData()) {
										setCaptchaPopupOpen(true);
									}
								}}
								className={`rounded bg-[#0F0F0F] px-3 py-1 text-sm uppercase text-white`}
							>
								{t('send')}
							</button>
						</div>
					</div>
				)}
			</div>
			<ToastContainer />
		</div>
	);
}
