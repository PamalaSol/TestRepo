'use client';
import { IFAQ } from '../_interfaces/interfaces';
import HoAccordion from './HoAccordion';
import tStyles from '@/app/[lng]/textSizes.module.css';

export default function FAQItem({ faq }: { faq: IFAQ }) {
	return (
		<HoAccordion title={faq.question}>
			<div className="flex flex-col space-y-3">
				<p className={tStyles.cat3}>{faq.answer}</p>
			</div>
		</HoAccordion>
	);
}
