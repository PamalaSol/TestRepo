'use client';
import VerticalScroll from './_components/Home/VerticalScroll';
import HorizontalScroll from './_components/Home/HorizontalScroll';
// import Head from 'next/head'; // Removed Head import
import DisableZoom from './_components/Home/DisableZoom';

export default function Home({ params: { lng } }: { params: { lng: string } }) {
	return (
		<div>
			<div className="max-lg:hidden" suppressHydrationWarning>
				<DisableZoom />
				<HorizontalScroll lng={lng} />
			</div>
			<div className="lg:hidden">
				<VerticalScroll lng={lng} />
			</div>
		</div>
	);
}
