// src/pages/NotFound.tsx
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import AppTheme from 'src/components/AppTheme';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <AppTheme>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <Typography variant="h3" color="error" gutterBottom>
          404 - Página Não Encontrada
        </Typography>
        <Typography variant="h6">
          A página que você está procurando não existe ou foi removida.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Voltar para a página inicial
        </Button>
      </Box>
    </AppTheme>
  );
}
