'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { getDynamicLocalizedPath } from '../_utils/routeHelpers';

interface DynamicLocalizedLinkProps {
	href: string;
	lng: string;
	routeName: string;
	dynamicSegment: string;
	children: ReactNode;
	className?: string;
	additionalSegments?: string[];
	prefetch?: boolean;
	[key: string]: any; // For any other props
}

/**
 * A component that generates localized URLs for dynamic routes
 */
export default function DynamicLocalizedLink({
	href,
	lng,
	routeName,
	dynamicSegment,
	children,
	className = '',
	additionalSegments,
	prefetch,
	...rest
}: DynamicLocalizedLinkProps) {
	// Generate the localized URL for the dynamic route
	const localizedHref = getDynamicLocalizedPath(
		lng,
		routeName,
		dynamicSegment,
		additionalSegments
	);

	return (
		<Link href={localizedHref} className={className} prefetch={prefetch} {...rest}>
			{children}
		</Link>
	);
}
