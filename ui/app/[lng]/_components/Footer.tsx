'use client';

import { useTranslation } from '@/app/i18n/client';
import { toastDefaultOptions } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';
import Logo from '@/public/assets/logo.svg';
import ShortBorder from './ShortBorder';
import YT from '@/public/assets/social-media/yt.svg';
import LI from '@/public/assets/social-media/li.svg';
import IG from '@/public/assets/social-media/ig.svg';
import YTD from '@/public/assets/social-media/yt-g.svg';
import LID from '@/public/assets/social-media/li-g.svg';
import IGD from '@/public/assets/social-media/ig-g.svg';

export default function Footer({
	theme,
	lng,
	invBg,
}: {
	theme: 'light' | 'dark';
	lng: string;
	invBg?: boolean;
}) {
	const { t } = useTranslation(lng, 'footer');
	const unusedFeatures = false;
	return (
		<footer className={`realtive w-full pb-12 ${!invBg ? 'bg-[#f7f7f7]' : 'bg-[#0F0F0F]'}`}>
			<div className="relative grid-cols-11 px-4 laptop:grid">
				<div
					className={`absolute left-[54.45%] top-4 z-20 h-full w-[1px] ${invBg ? 'bg-[#313131]' : 'bg-[#C8C8C8]'} max-laptop:hidden`}
				></div>
				<div className="col-span-6">
					<ShortBorder invBg={invBg} />
					<div className={`relative h-full grid-cols-6  py-3`}>
						<div className="flex flex-col justify-between h-full ">
							<div className="flex flex-col space-y-3">
								<Link href={`/${lng}/`}>
									<Image
										src={Logo}
										alt="Homatic Footer Logo"
										className="w-[50%] laptop:w-[10vw]"
									/>
								</Link>
							</div>
							<div className="flex self-end gap-3 mr-3 h-fit w-fit justify-self-end max-laptop:hidden">
								<a
									target="_blank"
									rel="noopener noreferrer"
									className=" text-xs uppercase text-[#B7B7B7] transition ease-in-out hover:opacity-80"
									href={`https://www.instagram.com/homaticag/`}
									suppressHydrationWarning={true}
								>
									<Image src={invBg?IG:IGD} alt="Instagram" className="w-[2vw]" />
								</a>
								<a
									target="_blank"
									rel="noopener noreferrer"
									className=" text-xs uppercase text-[#B7B7B7] transition ease-in-out hover:opacity-80"
									href={`https://www.youtube.com/@ho-maticag9119/videos`}
									suppressHydrationWarning={true}
								>
									<Image src={invBg?YT:YTD} alt="Youtube" className="w-[2vw]" />
								</a>
								<a
									target="_blank"
									rel="noopener noreferrer"
									className=" text-xs uppercase text-[#B7B7B7] transition ease-in-out hover:opacity-80"
									href={`https://www.linkedin.com/company/ho-matic`}
									suppressHydrationWarning={true}
								>
									<Image src={invBg?LI:LID} alt="LinkedIn" className="w-[2vw]" />
								</a>
							</div>
						</div>
					</div>
					<ShortBorder hid invBg={invBg} />
				</div>
				<div className="col-span-5">
					<ShortBorder side={true} hid invBg={invBg} />
					<div className={`flex h-full flex-col justify-between pt-3 laptop:px-3`}>
						<div className="flex flex-col space-y-5">
							<div className="flex flex-col space-y-2">
								<Link
									className="min-w-[48px] text-xs uppercase text-[#B7B7B7] transition ease-in-out hover:opacity-80"
									href={`/${lng}/`}
								>
									{t('home')}
								</Link>
								<Link
									className="min-w-[48px] text-xs uppercase text-[#B7B7B7] transition ease-in-out hover:opacity-80"
									href={`/${lng}/products`}
								>
									{t('products')}
								</Link>
								<Link
									className="min-w-[48px] text-xs uppercase text-[#B7B7B7] transition ease-in-out hover:opacity-80"
									href={`/${lng}/resources`}
								>
									Downloads
								</Link>
								<Link
									className="min-w-[48px] text-xs uppercase text-[#B7B7B7] transition ease-in-out hover:opacity-80"
									href={`/${lng}/news`}
								>
									{t('news')}
								</Link>
								<Link
									className="min-w-[48px] text-xs uppercase text-[#B7B7B7] transition ease-in-out hover:opacity-80"
									href={`/${lng}/about`}
								>
									{t('about')}
								</Link>
								<Link
									className="min-w-[48px] text-xs uppercase text-[#B7B7B7] transition ease-in-out hover:opacity-80"
									href={`/${lng}/contact`}
								>
									{t('contact')}
								</Link>

								<Link
									className="min-w-[48px] text-xs uppercase text-[#B7B7B7] transition ease-in-out hover:opacity-80"
									href={`/${lng}/cart`}
								>
									{t('cart')}
								</Link>
								<Link
									className="min-w-[48px] text-xs uppercase text-[#B7B7B7] transition ease-in-out hover:opacity-80"
									href={`/${lng}/site-notice`}
								>
									{t('notice')}
								</Link>
								<Link
									className="min-w-[48px] text-xs uppercase text-[#B7B7B7] transition ease-in-out hover:opacity-80"
									href={`/${lng}/privacy-policy`}
								>
									{t('privPol')}
								</Link>
								<button
									className="flex min-w-[48px] items-center justify-start text-xs uppercase text-[#B7B7B7] transition ease-in-out hover:opacity-80"
									onClick={() => {
										navigator.clipboard.writeText('info@ho-matic.ch');
										toast.success(t('clipboard'), toastDefaultOptions);
									}}
								>
									{'Email'}
								</button>

								<a
									target="_blank"
									rel="noopener noreferrer"
									className="min-w-[48px] text-xs uppercase text-[#B7B7B7] transition ease-in-out hover:opacity-80 laptop:hidden"
									href={`https://www.instagram.com/homaticag/`}
									suppressHydrationWarning={true}
								>
									{t('Instagram')}
								</a>
								<a
									target="_blank"
									rel="noopener noreferrer"
									className="min-w-[48px] text-xs uppercase text-[#B7B7B7] transition ease-in-out hover:opacity-80 laptop:hidden"
									href={`https://www.youtube.com/@ho-maticag9119/videos`}
									suppressHydrationWarning={true}
								>
									{t('YouTube')}
								</a>
								<a
									target="_blank"
									rel="noopener noreferrer"
									className="min-w-[48px] text-xs uppercase text-[#B7B7B7] transition ease-in-out hover:opacity-80 laptop:hidden"
									href={`https://www.linkedin.com/company/ho-matic`}
									suppressHydrationWarning={true}
								>
									{t('LinkedIn')}
								</a>
							</div>
						</div>
						<button
							className={`mb-4 mt-20 text-start text-xl text-[${!invBg ? '#111111' : '#B7B7B7'}] transition ease-in-out hover:opacity-80`}
							onClick={() =>
								window.scrollTo({
									top: 0,
									left: 0,
									behavior: 'smooth',
								})
							}
						>
							{t('top')}
						</button>
					</div>
					<ShortBorder side={true} invBg={invBg} />
				</div>
			</div>
		</footer>
	);
}
