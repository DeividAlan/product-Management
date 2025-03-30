import axios, { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import { createContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate, useParams } from 'react-router';
import { selectAuth } from 'src/store/authSlice';

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

const fetchProduct = async (
  id: string,
  token: string
): Promise<ProductType> => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/product/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.data.id) {
    throw new Error('Produto não encontrado');
  }

  return response.data;
};

function ProductContextProvider() {
  const { id } = useParams<{ id: string }>();
  const { enqueueSnackbar } = useSnackbar();
  const { token } = useSelector(selectAuth);
  const navigate = useNavigate();

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
      fetchProduct(id, token!)
        .then((data) => {
          setProductData(data);
        })
        .catch((error) => {
          if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;

            if (axiosError.response && axiosError.response.status === 404) {
              navigate('/404');
              return;
            }
          }

          enqueueSnackbar(
            'Erro ao carregar o produto. Tente novamente mais tarde!'
          );
          navigate(-1);
        });
    }
  }, [id]);

  const contextValue = useMemo(
    () => ({
      productData,
      setProductData,
    }),
    [productData, setProductData]
  );

  return (
    <ProductContext.Provider value={contextValue}>
      <Outlet />
    </ProductContext.Provider>
  );
}

export { ProductContextProvider, ProductContext };
