'use client'
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from 'react';

interface LanguageContextProps {
	lang: string ;
	setLang: Dispatch<SetStateAction<string >>;
}

const LangContext = createContext<LanguageContextProps>({
	lang: 'de-DE',
	setLang: () => {},
});

export const useLang = () => useContext(LangContext);

const LangProvider = ({ children }: { children: React.ReactNode }) => {
	const [lang, setLang] = useState<string>('de-DE');

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const storedLang = localStorage.getItem('lang');
			if (storedLang) {
				setLang(storedLang);
			}
		}
	}, []);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			localStorage.setItem('lang', lang);
		}
	}, [lang]);

	return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
};

export default LangProvider;
