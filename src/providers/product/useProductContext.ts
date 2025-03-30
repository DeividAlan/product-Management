import { useContext } from 'react';
import { ProductContext } from './ProductProvider';

export default function useProductContext() {
  const context = useContext(ProductContext);

  return context;
}
