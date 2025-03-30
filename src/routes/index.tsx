import { createBrowserRouter } from 'react-router';
import Login from 'src/pages/auth/Login';
import Register from '../pages/auth/Register';
import ProductList from '../pages/products/List';
import ProductView from 'src/pages/products/View';
import ProductCreate from '../pages/products/Create';
import ProductEdit from '../pages/products/Edit';
import { isAuthenticated, requireAuth } from './authLoader';
import MainLayout from 'src/components/MainLayout';
import { ProductContextProvider } from 'src/providers/product/ProductProvider';

const router = createBrowserRouter([
  { path: '/', element: <Login />, loader: isAuthenticated },
  { path: '/register', element: <Register />, loader: isAuthenticated },
  {
    path: '/products',
    element: <MainLayout />,
    loader: requireAuth,
    children: [
      { index: true, element: <ProductList /> },
      { path: 'create', element: <ProductCreate /> },
      {
        path: ':id',
        element: <ProductContextProvider />,
        children: [
          { index: true, element: <ProductView /> },
          { path: 'edit', element: <ProductEdit /> },
        ],
      },
    ],
  },
]);

export default router;
