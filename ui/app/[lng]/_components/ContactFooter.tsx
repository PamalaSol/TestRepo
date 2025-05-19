import { useTranslation } from '@/app/i18n/client';
import Link from 'next/link';
import tStyles from '@/app/[lng]/textSizes.module.css';

export default function ContactFooter({ theme, lng }: { theme: 'light' | 'dark'; lng: string }) {
	const { t } = useTranslation(lng, 'contact');

	const find = (
		<div
			className={`grid-cols-6 laptop:${theme === 'light' ? 'order-2' : 'order-1 '} text-[#C8C8C8]`}
		>
			<div className={`flex flex-col space-y-${theme === 'light' ? '5' : '1'}`}>
			<p
					className={`text-light text-base ${theme === 'light' ? 'text-[#111111]' : 'text-[#E3E3E3]'}`}
				>
					{t('find')}
				</p>
				<div
					className={`flex ${theme === 'light' ? 'max-laptop:flex-col' : 'flex-row space-x-2'} laptop:gap-3`}
				>
					<Link
						href="https://www.facebook.com"
						target="_blank"
						rel="noopener noreferrer"
						className="text-xs transition ease-in-out hover:opacity-80"
					>{`FB`}</Link>
					<Link
						href="https://www.instagram.com"
						target="_blank"
						rel="noopener noreferrer"
						className="text-xs transition ease-in-out hover:opacity-80"
					>{`IG`}</Link>
					<Link
						href="https://www.instagram.com"
						target="_blank"
						rel="noopener noreferrer"
						className="text-xs transition ease-in-out hover:opacity-80"
					>{`IN`}</Link>
				</div>
			</div>
		</div>
	);

	const address = (
		<div
			className={`grid-cols-6 laptop:${theme === 'light' ? 'order-1' : 'order-2'} text-[#C8C8C8]`}
		>
			<div className="grid-cols-5 col-span-3 laptop:grid">
				<div className={`laptop:col-span-3 flex flex-col gap-2 whitespace-nowrap`}>
					<div className={`flex flex-col max-laptop:w-full gap-2 ${tStyles.homeFooter}`}>
						<div className="flex flex-col">
							<p>{`HO-Matic AG`}</p>
							<p>{`Alte Obfelderstrasse 55`}</p>
							<p>{`8910 Affoltern a. A.`}</p>
							<p>Schweiz</p>
						</div>
						<div className="flex flex-col max-laptop:w-full">
							<div className="flex gap-3 max-laptop:w-full">
								<p className="col-span-1">phone:</p>
								<div className="flex items-center justify-end w-full col-span-2 ">
									<p>{`+41 (0)43 322 70 80 `}</p>
								</div>
							</div>
							<div className="flex gap-3">
								<p className="col-span-1">fax:</p>
								<div className="flex items-center justify-end w-full col-span-2">
									<p>{`+41 (0)43 322 70 88 `}</p>
								</div>
							</div>
							<div className="flex gap-3">
								<p className="col-span-1">mail:</p>
								<div className="flex items-center justify-end w-full col-span-2 text-[#306abf] transition ease-in-out hover:opacity-80">
									<Link
									href={`mailto:info@ho-matic.ch`}
									target="_blank"
									rel="noopener noreferrer"
									>{`info(at)ho-matic.ch`}</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
	return (
		<div className={`laptop:w-full`}>
			<div className="grid w-full grid-cols-2 max-laptop:hidden">{address}</div>

			<div className="flex items-center justify-between w-full laptop:hidden">{address}</div>
		</div>
	);
}
