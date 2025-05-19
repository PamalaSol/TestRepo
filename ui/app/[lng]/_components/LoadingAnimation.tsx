'use client'

import React from 'react';
import Loading from '@/public/assets/animations/Loading.json';
import dynamic from 'next/dynamic';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
const LoadingAnimation = () => {
	return <Lottie animationData={Loading} loop className='w-full laptop:w-[5vw] opacity-[70%]'></Lottie>;
};

export default LoadingAnimation;
