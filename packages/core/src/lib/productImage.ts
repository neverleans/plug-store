import productPlaceholder from '@/assets/product-placeholder.jpg';
import categoryPlaceholder from '@/assets/category-placeholder.jpg';

export const PRODUCT_PLACEHOLDER = productPlaceholder;
export const CATEGORY_PLACEHOLDER = categoryPlaceholder;

/** Returns the given src or a universal product placeholder when missing/empty. */
export const safeImage = (src?: string | null): string =>
  src && src.trim() !== '' ? src : productPlaceholder;

/** Returns the given src or a universal category placeholder when missing/empty. */
export const safeCategoryImage = (src?: string | null): string =>
  src && src.trim() !== '' ? src : categoryPlaceholder;

/** React onError handler — swaps to product placeholder. */
export const onImgError: React.ReactEventHandler<HTMLImageElement> = (e) => {
  const img = e.currentTarget;
  if (!img.src.endsWith(productPlaceholder)) img.src = productPlaceholder;
};

/** React onError handler — swaps to category placeholder. */
export const onCategoryImgError: React.ReactEventHandler<HTMLImageElement> = (e) => {
  const img = e.currentTarget;
  if (!img.src.endsWith(categoryPlaceholder)) img.src = categoryPlaceholder;
};
