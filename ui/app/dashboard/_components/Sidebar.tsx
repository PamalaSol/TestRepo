'use client';

import { authService } from '@/app/[lng]/_services/auth';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const Sidebar = () => {
	const showUnusedFeatures = false;

	const [loading, setLoading] = useState<boolean>(false);

	const router = useRouter();
	const pathname = usePathname();
	
	const handleLogout = async () => {
		setLoading(true);
		try {
			authService.logout();
			router.push('/dashboard/login');
		} catch (error) {
			alert('Logout failed');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container flex h-full flex-col gap-3 bg-gray-800 px-10 py-8 text-white">
			<h2 className={`mb-3 text-2xl font-bold`}>{`Dashboard`}</h2>
			<div className="flex h-full flex-col gap-16">
				<div className="flex flex-col gap-5">
					{showUnusedFeatures && (
						<div>
							<Link
								className={`mb-3 rounded-xl bg-gray-500 px-3 py-2 text-2xl font-semibold`}
								href={'/dashboard/pages'}
							>
								{`Pages`}
							</Link>
							<Link
								className={`mb-3 rounded-xl bg-gray-500 px-3 py-2 text-2xl font-semibold`}
								href={'/dashboard/categories'}
							>
								{`Categories`}
							</Link>
							<Link
								className={`mb-3 rounded-xl bg-gray-500 px-3 py-2 text-2xl font-semibold`}
								href={'/dashboard/tags'}
							>
								{`Tags`}
							</Link>
							<Link
								className={`mb-3 rounded-xl bg-gray-500 px-3 py-2 text-2xl font-semibold`}
								href={'/dashboard/menus'}
							>
								{`Menus`}
							</Link>
							<Link
								className={`mb-3 rounded-xl bg-gray-500 px-3 py-2 text-2xl font-semibold`}
								href={'/dashboard/users'}
							>
								{`Users`}
							</Link>
							<Link
								className={`mb-3 rounded-xl bg-gray-500 px-3 py-2 text-2xl font-semibold`}
								href={'/dashboard/settings'}
							>
								{`Settings`}
							</Link>
						</div>
					)}
					<Link
						href={'/dashboard/posts'}
						className={`cursor-pointer rounded-xl border-2 border-white px-6 py-3 ${pathname.includes('posts') ? 'font-bold bg-gray-700' : 'font-semibold'} hover:bg-gray-700 hover:text-gray-100 focus:outline-none`}
					>
						{`Posts`}
					</Link>
					<Link
						href={'/dashboard/products'}
						className={`cursor-pointer rounded-xl border-2 border-white px-6 py-3 ${pathname.includes('products') ? 'font-bold bg-gray-700' : 'font-semibold'} hover:bg-gray-700 hover:text-gray-100 focus:outline-none`}
					>
						{`Products`}
					</Link>
					<Link
						href={'/dashboard/files'}
						className={`cursor-pointer rounded-xl border-2 border-white px-6 py-3 ${pathname.includes('files') ? 'font-bold bg-gray-700' : 'font-semibold'} hover:bg-gray-700 hover:text-gray-100 focus:outline-none`}
					>
						{`Files`}
					</Link>
					{showUnusedFeatures && <h2 className={`mb-3 text-xl font-semibold`}>{`Shop`}</h2>}
					{showUnusedFeatures && (
						<Link
							className={`mb-3 rounded-xl bg-gray-500 px-3 py-2 text-2xl font-semibold`}
							href={'dashboard/orders'}
						>
							{`Orders`}
						</Link>
					)}
				</div>
				<button
					className={`cursor-pointer rounded-xl border border-1 border-white px-6 py-3 font-semibold hover:bg-gray-700 hover:text-gray-100 focus:outline-none`}
					onClick={handleLogout}
					disabled={loading}
				>
					{`Logout`}
				</button>
			</div>
		</div>
	);
};

export default Sidebar;
