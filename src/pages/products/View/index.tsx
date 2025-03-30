import { Grid, Box, Typography, CardMedia, Button } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import AppTheme from 'src/components/AppTheme';
import useProductContext from 'src/providers/product/useProductContext';
import { useSelector } from 'react-redux';
import { selectAuth } from 'src/store/authSlice';
import { CustomModal } from 'src/components/Modal';

export default function ProductView() {
  const { productData } = useProductContext();
  const { token } = useSelector(selectAuth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalType, setModalType] = useState<
    'success' | 'error' | 'warning' | ''
  >('');
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

  const handleModalClose = () => {
    setModalType('');
    setModalMessage('');
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    handleModalClose();

    try {
      await axios.delete(
        `https://67ddc6fd471aaaa7428282c2.mockapi.io/api/v1/product/${productData.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setModalMessage('Produto removido com sucesso!');
      setTimeout(() => {
        navigate('/products');
      }, 2000);
    } catch (error) {
      console.log(error);
      setModalMessage('Erro ao remover o produto. Tente novamente.');
    }
    setIsSubmitting(false);
  };

  const handleSetModalType = ({
    type,
    message,
  }: {
    type: 'success' | 'error' | 'warning';
    message: string;
  }) => {
    setModalMessage(message);
    setModalType(type);
  };

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
          <Typography variant="h4">{productData.nome}</Typography>
          <Box sx={{ ml: 'auto', display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate(`/products/${productData.id}/edit`)}
            >
              Editar
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() =>
                handleSetModalType({
                  type: 'warning',
                  message: 'Tem certeza que deseja remover esse produto?',
                })
              }
            >
              Remover
            </Button>
          </Box>
        </Box>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <CardMedia
              component="img"
              image={productData.image}
              alt={productData.nome}
              sx={{
                objectFit: 'cover',
                height: '300px',
                objectPosition: 'center',
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box>
              <Grid container>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Preço
                  </Typography>
                  <Typography variant="h4" component="h2" gutterBottom>
                    {productData.preco}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Quantidade em Estoque
                  </Typography>
                  <Typography variant="h4" component="h2" gutterBottom>
                    {productData.qt_estoque}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Quantidade de Vendas
                  </Typography>
                  <Typography variant="h4" component="h2" gutterBottom>
                    {productData.qt_vendas}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Marca
                  </Typography>
                  <Typography variant="h4" component="h2" gutterBottom>
                    {productData.marca}
                  </Typography>
                </Grid>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  Criado em
                </Typography>
                <Typography variant="h4" component="h2" gutterBottom>
                  {new Date(productData.createdAt).toLocaleString()}
                </Typography>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <CustomModal
        handleConfirm={handleDelete}
        isProcessing={isSubmitting}
        handleModalClose={handleModalClose}
        modalMessage={modalMessage}
        modalType={modalType}
      />
    </AppTheme>
  );
}
