'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Background from '@/public/assets/home-valve-homatic.webp';
import { authService } from '@/app/[lng]/_services/auth';
import { useRouter } from 'next/navigation';

const LogIn = () => {
	useEffect(() => {
		document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
		document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
	}, []);

	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);

	const rememberMe = false;

	const router = useRouter();

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (email === '' || password === '') {
			alert('Please enter your information');
		} else {
			setLoading(true);
			try {
				const response = await authService.login({
					email: email.toLowerCase().trim(),
					password,
					rememberMe,
				});
				if (response.isFailed) {
					alert('Login failed');
				} else {
					router.push('/dashboard/products');
				}
			} catch (error) {
				alert('Login failed');
			} finally {
				setLoading(false);
			}
		}
	};

	return (
		<div className="flex h-screen w-screen items-center justify-center bg-[#C8C8C8]">
			<Image
				alt="Valve"
				src={Background}
				className="top-50% fixed left-0 z-10 w-full bg-cover opacity-30"
			/>
			<form
				onSubmit={handleSubmit}
				className="z-20 flex h-[80vh] w-[80vw] flex-col items-center justify-center gap-3 rounded-xl bg-black bg-opacity-70 px-4 laptop:w-[40vw]"
			>
				<h2 className="mb-2 text-3xl font-bold text-white">Ho-Matic Admin Log in</h2>
				<div className="mb-4 px-2 text-lg">
					<input
						className="w-fit rounded-3xl border-none bg-[#C8C8C8] px-6 py-2 text-center text-inherit placeholder-slate-200 shadow-lg outline-none backdrop-blur-md"
						type="email"
						name="email"
						placeholder="E-mail"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div className="mb-4 text-lg">
					<input
						className="rounded-3xl border-none bg-[#C8C8C8] px-6 py-2 text-center text-inherit placeholder-slate-200 shadow-lg outline-none backdrop-blur-md"
						type="password"
						name="password"
						placeholder="*********"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<div className="mt-8 flex justify-center text-lg font-medium text-black">
					<button
						disabled={loading}
						type="submit"
						className={`rounded-3xl bg-[#C8C8C8] px-10 py-2 shadow-xl backdrop-blur-md transition-colors duration-300 ${loading ? "text-gray-500" : "text-gray-700 hover:bg-yellow-600"} disabled:opacity-20`}
					>
						{`Log${loading ? "ing" : ""} in`}
					</button>
				</div>
			</form>
		</div>
	);
};

export default LogIn;
