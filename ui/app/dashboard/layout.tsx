'use client';
import Sidebar from '@/app/dashboard/_components/Sidebar';
import { ToastContainer } from 'react-toastify';
import './globals.css';

import LangProvider from './_context/LangContext';
import Header from './_components/Header';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();

	const defaultLayout = (<div>{children}</div>);
	const dashboardLayout = (
		<div className="grid h-screen grid-cols-12">
			<div className="w-full h-full col-span-2">
				<Sidebar />
			</div>
			<div className="container w-full h-full col-span-10 px-8 py-10">
				<Header />
				<div className="h-fit">{children}</div>
			</div>
		</div>
	);

	return (
		<div>
			<LangProvider>
				<title>Ho-Matic Dashboard</title>
				{pathname === '/dashboard/login' ? (
					defaultLayout
				) : (
					dashboardLayout
				)}
			</LangProvider>
			<ToastContainer />
		</div>
	);
}
