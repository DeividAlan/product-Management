import axios from 'axios';
import { createContext, useEffect, useMemo, useState } from 'react';
import { Outlet, useParams } from 'react-router';

export type ProductType = {
  id: string;
  nome: string;
  preco: string;
  image: string;
  qt_estoque: number;
  qt_vendas: number;
  marca: string;
  createdAt: string;
};

type ProductContextType = {
  productData: ProductType;
  errorMessage?: string;
  setProductData: (data: ProductType) => void;
};

const ProductContext = createContext<ProductContextType>(
  {} as ProductContextType
);

const fetchProduct = async (id: string): Promise<ProductType> => {
  const productEmpty = {
    id: '',
    nome: '',
    preco: '',
    image: '',
    qt_estoque: 0,
    qt_vendas: 0,
    marca: '',
    createdAt: '',
  };

  //	https://loremflickr.com/400/300?lock=362523

  try {
    const response = await axios.get(
      `https://67ddc6fd471aaaa7428282c2.mockapi.io/api/v1/product/${id}`
    );
    return response.data || productEmpty;
  } catch (error) {
    console.error(error);
    return productEmpty;
  }
};

interface ProductContextProviderProps {
  errorMessage?: string;
}

function ProductContextProvider({ errorMessage }: ProductContextProviderProps) {
  const { id } = useParams<{ id: string }>();
  const [productData, setProductData] = useState<ProductType>({
    id: '',
    nome: '',
    preco: '',
    image: '',
    qt_estoque: 0,
    qt_vendas: 0,
    marca: '',

    createdAt: '',
  });

  useEffect(() => {
    if (id) {
      fetchProduct(id).then((data) => {
        setProductData(data);
      });
    }

    console.log('foiiiiiiiii');
  }, [id]);

  const contextValue = useMemo(
    () => ({
      productData,
      errorMessage,
      setProductData,
    }),
    [productData, errorMessage, setProductData]
  );

  return (
    <ProductContext.Provider value={contextValue}>
      <Outlet />
    </ProductContext.Provider>
  );
}

export { ProductContextProvider, ProductContext };
