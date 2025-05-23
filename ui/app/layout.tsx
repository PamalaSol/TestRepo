import 'react-toastify';
import GoogleAnalytics from './[lng]/_components/GoogleAnalytics';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const apiUrl = process.env.NEXT_PUBLIC_API_URL;

	return (
		<html lang={'de-DE'} className="bg-[#f7f7f7]">
			<head>
				{apiUrl && <link rel="preconnect" href={apiUrl} />}
				<GoogleAnalytics />
			</head>
			<body>
				<noscript>
					<iframe
						src={`https://www.googletagmanager.com/ns.html?id=GTM-M7VSQTG7`}
						height="0"
						width="0"
						style={{ display: 'none', visibility: 'hidden' }}
					/>
				</noscript>
				<main>{children}</main>
			</body>
		</html>
	);
}
