import CategoryIcon from '@mui/icons-material/Category';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import AppTheme from '../AppTheme';
import { Outlet, useNavigate } from 'react-router';
import { Navigation } from '@toolpad/core';
import { Account } from '@toolpad/core/Account';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectAuth } from 'src/store/authSlice';
import { Box, Typography } from '@mui/material';

const NAVIGATION: Navigation = [
  {
    segment: 'products',
    title: 'Produtos',
    icon: <CategoryIcon />,
  },
  {
    segment: 'products/create',
    title: 'Cadastrar produto',
    icon: <AddCircleIcon />,
  },
];

export default function MainLayout() {
  const dispatch = useDispatch();
  const { user } = useSelector(selectAuth);
  const navigate = useNavigate();

  const authentication = useMemo(() => {
    return {
      signIn: () => {},
      signOut: () => {
        dispatch(logout());
      },
    };
  }, [dispatch]);

  useEffect(() => {
    if (user === null) {
      navigate('/');
    }
  }, [user, navigate]);

  if (user === null) {
    return null;
  }

  const session = {
    user: user,
  };

  return (
    <AppTheme>
      <ReactRouterAppProvider
        navigation={NAVIGATION}
        authentication={authentication}
        session={session}
      >
        <DashboardLayout
          disableCollapsibleSidebar
          slots={{
            toolbarActions: () => null,
            appTitle: () => (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                mx={{ xs: 'auto' }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: '500',
                    color: (theme) => theme.palette.primary.contrastText,
                    textAlign: 'center',
                    letterSpacing: 0,
                  }}
                >
                  Gestão de Produtos
                </Typography>
              </Box>
            ),
            toolbarAccount: () => (
              <Account localeText={{ accountSignOutLabel: 'Sair' }} />
            ),
          }}
        >
          <Outlet />
        </DashboardLayout>
      </ReactRouterAppProvider>
    </AppTheme>
  );
}
