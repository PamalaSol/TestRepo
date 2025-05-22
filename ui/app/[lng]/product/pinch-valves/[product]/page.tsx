import { redirect } from 'next/navigation';
import { productService, IProduct, ProductFile } from '@/app/[lng]/_services/products';
import { fileService } from '@/app/[lng]/_services/files';
import { getLocalizedPath } from '@/app/i18n/settings';
import { UseTranslation } from '@/app/i18n'; // For server-side translations
import ProductClientContent from './product-client-content';

export default async function ProductPage({
	params,
}: {
	params: { product: string; lng: string };
}) {
	const { product: productParam, lng } = params;
	const { t } = await UseTranslation(lng, 'pinchValve');

	let productData: IProduct | null = null;
	let generalResources: ProductFile[] = []; // For brochures, videos etc. not directly in product.dataFiles
	let fetchError: any = null;

	try {
		productData = await productService.getProduct(productParam, lng);

		if (productData == null || productData.productCategories[0]?.id !== 1) {
			// Ensure it IS a pinch valve (category ID 1)
			const localizedControlsPath = getLocalizedPath(lng, '/products/controls');
			redirect(localizedControlsPath);
		}

		if (productData) {
			// Fetch general resources (brochures, videos, etc.)
			// These were previously fetched in useEffect by fileService.getFilesByCategory
			const resourcesCatIds: number[] = [4, 2, 9, 3, 6]; // Note: Category 8 (datasheets) handled from productData.dataFiles
			generalResources = await fileService.getFilesByCategory(resourcesCatIds, lng);
		}
	} catch (error: any) {
		fetchError = error;
		console.error(`Server: Error fetching product data for ${productParam} in ${lng}:`, error);
		// Allow to fall through to error display
	}

	if (!productData) {
		// Handles both product not found (404) and other fetch errors
		let errorMessage = t('noData'); // Default for 404 or if productData is null
		if (fetchError && fetchError.status !== 404) {
			errorMessage = fetchError.status === 500 ? t('serverError') : t('unexpectedError');
		}
		return (
			<div className="flex items-center justify-center w-full h-screen">
				<p>{errorMessage}</p>
			</div>
		);
	}

	return (
		<ProductClientContent
			lng={lng}
			productParam={productParam}
			initialProductData={productData}
			initialResources={generalResources} // Pass the fetched general resources
		/>
	);
}
