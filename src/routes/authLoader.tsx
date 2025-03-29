import { redirect } from 'react-router';
import { store } from '../store/store';
import { selectAuth } from '../store/authSlice';

export const requireAuth = async (): Promise<null> => {
  const state = store.getState();

  if (!selectAuth(state).isAuthenticated) {
    throw redirect('/');
  }
  return null;
};

export const isAuthenticated = async (): Promise<null> => {
  const state = store.getState();

  if (selectAuth(state).isAuthenticated) {
    throw redirect('/products');
  }
  return null;
};
