'use client';
import { useTranslation } from '@/app/i18n/client';
import FAQItem from '../_components/FAQItem';
import { IFAQ } from '../_interfaces/interfaces';
import ShortBorder from './ShortBorder';

export const FAQList = ({ lng }: { lng: string }) => {
	const { t } = useTranslation(lng, 'faq');
	const faqs: IFAQ[] = [
		{
			question: t('q1'),
			answer: t('a1'),
			link: '',
		},
		{
			question: t('q2'),
			answer: t('a2'),
			link: '',
		},
		{
			question: t('q3'),
			answer: t('a3'),
			link: '',
		},
		{
			question: t('q4'),
			answer: t('a4'),
			link: '',
		},
		{
			question: t('q5'),
			answer: t('a5'),
			link: '',
		},
		{
			question: t('q6'),
			answer: t('a6'),
			link: '',
		},
		{
			question: t('q7'),
			answer: t('a7'),
			link: '',
		},
		{
			question: t('q8'),
			answer: t('a8'),
			link: '',
		},
		{
			question: t('q9'),
			answer: t('a9'),
			link: '',
		},
		{
			question: t('q10'),
			answer: t('a10'),
			link: '',
		},
		{
			question: t('q11'),
			answer: t('a11'),
			link: '',
		},
	];
	return (
		<div className="relative grid w-full grid-cols-11 ">
			<div className='w-[1px] max-laptop:hidden bg-[#C8C8C8] absolute h-full z-10 left-[54.45%]'>
			</div>
			{faqs.map((faq, idx) => (
				<div
					className={`col-span-11 grid-cols-12  px-4 laptop:${idx%2===0?'pr-3':'pl-3'} lg:grid-cols-6  ${
						idx % 2 === 0
							? ' lg:col-span-6 '
							: ' lg:col-span-5'
					}  `}
					key={`faq-item-${faq.question}-${idx}`}
				>
					{( idx%2===0) && <ShortBorder side={true} hid/> }
					{( idx%2!==0) && <ShortBorder side={false} hid/> }
					<div className='laptop:hidden'>
						<ShortBorder />
					</div>
					<div className={``}>

					<FAQItem faq={faq} />
					</div>
				</div>
			))}
		</div>
	);
};
export default FAQList;
