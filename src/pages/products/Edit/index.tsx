import AppTheme from 'src/components/AppTheme';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import ProductForm from '../components/ProductForm';
import useProductContext from 'src/providers/product/useProductContext';

export default function Edit() {
  const { productData, setProductData } = useProductContext();

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
          <Typography variant="h4">{`Editar Produto: ${productData.nome}`}</Typography>
        </Box>
        <ProductForm
          productData={productData}
          updateContextProduct={setProductData}
        />
      </Box>
    </AppTheme>
  );
}
