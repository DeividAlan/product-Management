import { createBrowserRouter } from 'react-router';
import Login from 'src/pages/auth/Login';
import Register from '../pages/auth/Register';
import List from '../pages/products/List';
import View from 'src/pages/products/View';
import Create from '../pages/products/Create';
import Edit from '../pages/products/Edit';
import { isAuthenticated, requireAuth } from './authLoader';

const router = createBrowserRouter([
  { path: '/', element: <Login />, loader: isAuthenticated },
  { path: '/register', element: <Register />, loader: isAuthenticated },
  {
    path: '/products',
    loader: requireAuth,
    children: [
      { index: true, element: <List /> },
      { path: 'create', element: <Create /> },
      { path: ':id', element: <View /> },
      { path: ':id/edit', element: <Edit /> },
    ],
  },
]);

export default router;
