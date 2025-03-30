import { ChangeEvent, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import {
  OutlinedInput,
  FormHelperText,
  FormLabel,
  Button,
  Grid,
  Card,
  CardMedia,
} from '@mui/material';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router';
import { FormGrid } from 'src/components/AppTheme/themePrimitives';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import { formatCurrencyBRL, parseCurrencyBRL } from 'src/help/currencyHelp';
import { getRandomImage } from 'src/services/getRandomImage';
import { useSelector } from 'react-redux';
import { selectAuth } from 'src/store/authSlice';
import { ProductType } from 'src/providers/product/ProductProvider';
import { CustomModal } from 'src/components/Modal';

const fileSchema = (isCreate: boolean) =>
  z
    .any()
    .refine((file) => !isCreate || (file && file.name), 'Imagem é obrigatória')
    .refine((file) => !file || file.size <= 5000000, `Tamanho máximo de 5MB.`)
    .refine(
      (file) =>
        !file ||
        ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(
          file.type
        ),
      'Formatos suportados: .jpg, .jpeg, .png, .webp'
    );

const getFormSchema = (isCreate: boolean) =>
  z.object({
    nome: z.string().min(1, 'O nome do produto é obrigatório'),
    preco: z
      .string()
      .min(1, 'O preço é obrigatório')
      .refine((preco) => {
        const precoFloat = parseCurrencyBRL(preco);
        return !isNaN(precoFloat) && precoFloat > 0;
      }, 'O preço deve ser maior que 0'),
    qt_estoque: z
      .number()
      .min(1, 'A quantidade em estoque deve ser maior que 0'),
    qt_vendas: z.number().min(1, 'A quantidade de vendas deve ser maior que 0'),
    marca: z.string().min(1, 'A marca é obrigatória'),
    image: fileSchema(isCreate),
  });

interface ProductFormProps {
  productData?: ProductType;
  updateContextProduct?: (data: ProductType) => void;
}

export default function ProductForm({
  productData,
  updateContextProduct,
}: ProductFormProps) {
  const isCreate = !productData;
  const [modalType, setModalType] = useState<
    'success' | 'error' | 'warning' | ''
  >('');
  const [modalMessage, setModalMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { token } = useSelector(selectAuth);

  const formSchema = getFormSchema(isCreate);

  type FormData = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    getValues,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    values: {
      nome: productData?.nome || '',
      preco: productData?.preco ? formatCurrencyBRL(productData?.preco) : '',
      image: '',
      qt_estoque: productData?.qt_estoque || 0,
      qt_vendas: productData?.qt_vendas || 0,
      marca: productData?.marca || '',
    },
  });

  const updateProduct = async () => {
    if (!productData?.id) {
      return;
    }

    setIsSubmitting(true);

    const data = getValues();

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/product/${productData?.id}`,
        {
          nome: data.nome,
          preco: parseCurrencyBRL(data.preco).toString(),
          qt_estoque: data.qt_estoque,
          qt_vendas: data.qt_vendas,
          marca: data.marca,
          image:
            data.image instanceof File ? getRandomImage() : productData.image,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.id) {
        throw new Error('Erro ao salvar produto');
      }

      if (updateContextProduct) {
        updateContextProduct(response.data);
      }

      setModalMessage('Produto atualizado com sucesso!');
      setModalType('success');
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);

      setModalMessage('Erro ao atualizar o produto.');
      setModalType('error');
    }

    setIsSubmitting(false);
  };

  const createProduct = async () => {
    setIsSubmitting(true);

    const data = getValues();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/product`,
        {
          nome: data.nome,
          preco: parseCurrencyBRL(data.preco).toString(),
          qt_estoque: data.qt_estoque,
          qt_vendas: data.qt_vendas,
          marca: data.marca,
          image: getRandomImage(),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.id) {
        throw new Error('Erro ao salvar produto');
      }

      reset();
      setModalMessage('Produto cadastrado com sucesso!');
      setModalType('success');
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);

      setModalMessage('Erro ao cadastrar produto. Tente novamente.');
      setModalType('error');
    }
    setIsSubmitting(false);
  };

  const handleSubmitForm = () => {
    if (isCreate) {
      createProduct();
    } else {
      updateProduct();
    }
  };

  const onSubmit = () => {
    if (isCreate) {
      setModalMessage('Deseja cadastrar o produto?');
    } else {
      setModalMessage('Tem certeza que deseja salvar as alterações?');
    }
    setModalType('warning');
  };

  const handlePrecoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const numericValue = parseInt(rawValue || '0', 10);
    const centavos = numericValue / 100;

    const formattedValue = formatCurrencyBRL(centavos);
    setValue('preco', formattedValue);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleModalClose = () => {
    if (modalType === 'success') {
      setModalType('');

      if (isCreate) {
        navigate('/products');
      } else {
        handleBack();
      }
    } else {
      setModalType('');
    }
  };

  const previewLogoReducedURL = useMemo(() => {
    const file = getValues('image');
    if (!file || file.length === 0) {
      return null;
    }

    return URL.createObjectURL(file);
  }, [watch('image')]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="nome" required>
              Nome do Produto
            </FormLabel>
            <OutlinedInput
              id="nome"
              placeholder="Nome do Produto"
              {...register('nome')}
              error={!!errors.nome}
              size="small"
            />
            <FormHelperText error>{errors.nome?.message}</FormHelperText>
          </FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="preco" required>
              Preço
            </FormLabel>
            <OutlinedInput
              id="preco"
              {...register('preco')}
              onChange={handlePrecoChange}
              placeholder="R$ 0,00"
              error={!!errors.preco}
              size="small"
            />
            <FormHelperText error>{errors.preco?.message}</FormHelperText>
          </FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="qt_estoque" required>
              Quantidade em Estoque
            </FormLabel>
            <OutlinedInput
              id="qt_estoque"
              placeholder="Quantidade em estoque"
              type="text"
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              {...register('qt_estoque', {
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: 'Apenas números inteiros positivos são permitidos',
                },
              })}
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                input.value = input.value
                  .replace(/^0+/, '')
                  .replace(/[^0-9]/g, '');
              }}
              error={!!errors.qt_estoque}
              size="small"
            />
            <FormHelperText error>{errors.qt_estoque?.message}</FormHelperText>
          </FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="marca" required>
              Marca
            </FormLabel>
            <OutlinedInput
              id="marca"
              placeholder="Marca do Produto"
              {...register('marca')}
              error={!!errors.marca}
              size="small"
            />
            <FormHelperText error>{errors.marca?.message}</FormHelperText>
          </FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="qt_vendas" required>
              Quantidade vendas
            </FormLabel>
            <OutlinedInput
              id="qt_vendas"
              placeholder="Quantidade vendas"
              type="text"
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              {...register('qt_vendas', {
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: 'Apenas números inteiros positivos são permitidos',
                },
              })}
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                input.value = input.value
                  .replace(/^0+/, '')
                  .replace(/[^0-9]/g, '');
              }}
              error={!!errors.qt_vendas}
              size="small"
            />
            <FormHelperText error>{errors.qt_vendas?.message}</FormHelperText>
          </FormGrid>

          <FormGrid
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: { xs: 'center', md: 'flex-end' },
              mt: { xs: 0, md: 4 },
            }}
            size={{ xs: 12, md: 6 }}
          >
            <FormLabel
              htmlFor="image"
              required
              sx={{
                color: 'primary.main',
                cursor: 'pointer',
                '&:hover': {
                  color: 'primary.dark',
                },
              }}
            >
              Clique para adicionar uma imagem
            </FormLabel>
            <input
              id="image"
              type="file"
              accept="image/*"
              {...register('image')}
              onChange={(event) => {
                setValue('image', event.target.files?.[0]);
              }}
              style={{ display: 'none' }}
            />
            <FormHelperText error>
              {typeof errors.image?.message === 'string'
                ? errors.image.message
                : ''}
            </FormHelperText>

            {(previewLogoReducedURL || productData?.image) && (
              <Box mt={4}>
                <Card
                  sx={{
                    width: 182,
                    height: 182,
                    borderRadius: 2,
                    boxShadow: 3,
                  }}
                >
                  <CardMedia
                    component="img"
                    image={previewLogoReducedURL || productData?.image}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Card>
              </Box>
            )}
          </FormGrid>
        </Grid>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column-reverse', sm: 'row' },
            alignItems: 'end',
            flexGrow: 1,
            gap: 4,
            pb: { xs: 12, sm: 0 },
            mt: 10,
            mb: '60px',
            justifyContent: { xs: 'center', sm: 'space-between' },
          }}
        >
          <Button
            startIcon={<ChevronLeftRoundedIcon />}
            onClick={handleBack}
            type="button"
            variant="outlined"
            fullWidth
            sx={{ width: { xs: '100%', sm: 'fit-content' } }}
          >
            Voltar
          </Button>
          <Button
            variant="contained"
            type="submit"
            sx={{ width: { xs: '100%', sm: 'fit-content' } }}
            disabled={isSubmitting}
          >
            {isCreate ? 'Cadastrar' : 'Editar'}
          </Button>
        </Box>
      </form>

      <CustomModal
        handleConfirm={handleSubmitForm}
        isProcessing={isSubmitting}
        handleModalClose={handleModalClose}
        modalMessage={modalMessage}
        modalType={modalType}
      />
    </>
  );
}
