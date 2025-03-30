import { RouterProvider } from 'react-router';
import { Provider } from 'react-redux';
import { store } from './store/store';
import router from './routes';
import { SnackbarProvider } from 'notistack';

export default function App() {
  return (
    <Provider store={store}>
      <SnackbarProvider>
        <RouterProvider router={router} />
      </SnackbarProvider>
    </Provider>
  );
}
