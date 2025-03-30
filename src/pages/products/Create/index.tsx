import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import AppTheme from 'src/components/AppTheme';
import ProductForm from '../components/ProductForm';

export default function Create() {
  return (
    <AppTheme>
      <Box
        sx={{
          padding: 3,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          maxWidth: { sm: '100%', md: 1024 },
        }}
        height={{
          sm: 'calc(100dvh - var(--template-frame-height, 100px))',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            marginBottom: 4,
          }}
        >
          <Typography variant="h4">Cadastrar Novo Produto</Typography>
        </Box>
        <ProductForm />
      </Box>
    </AppTheme>
  );
}
