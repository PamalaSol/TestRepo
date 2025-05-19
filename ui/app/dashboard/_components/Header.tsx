import React from 'react';
import { useLang } from '../_context/LangContext';

const Header = () => {
	const { lang, setLang } = useLang();
	return (
		<div className="container mb-4 flex h-fit w-full items-center justify-end gap-3 outline-none">
			<button
				className={`${lang === 'en-US' ? 'font-bold' : ''}`}
				onClick={() => {
					setLang('en-US');
					window.location.reload();
				}}
			>
				EN
			</button>
			<button
				className={`${lang === 'de-DE' ? 'font-bold' : ''}`}
				onClick={() => {
					setLang('de-DE');
					window.location.reload();
				}}
			>
				DE
			</button>
			<button
				className={`${lang === 'fr-FR' ? 'font-bold' : ''}`}
				onClick={() => {
					setLang('fr-FR');
					window.location.reload();
				}}
			>
				FR
			</button>
		</div>
	);
};

export default Header;
