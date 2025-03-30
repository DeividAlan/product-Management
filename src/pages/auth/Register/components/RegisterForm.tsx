import React, { useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import {
  Grid,
  OutlinedInput,
  FormHelperText,
  FormLabel,
  Button,
  MenuItem,
  Select,
  FormControl,
  Modal,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import { formatCpf, validateCpf } from 'src/help/cpfHelp';
import { FormGrid } from 'src/components/AppTheme/themePrimitives';
import { useNavigate } from 'react-router';
import { CheckCircle, Error as ErrorIcon } from '@mui/icons-material';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';

const formSchema = z.object({
  firstName: z.string().min(1, 'O nome é obrigatório'),
  lastName: z.string().min(1, 'O sobrenome é obrigatório'),
  cpf: z
    .string()
    .min(14, 'CPF inválido')
    .max(14, 'CPF inválido')
    .refine((cpf) => validateCpf(cpf), 'CPF inválido'),
  sexo: z.string().min(1, 'É obrigatório selecionar uma opção'),
  birthDate: z.string().min(1, 'Data de nascimento é obrigatória'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  zip: z.string().length(9, 'CEP inválido'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  state: z.string().min(2, 'Estado é obrigatório'),
  address: z.string().min(1, 'Logradouro é obrigatório'),
  neighborhood: z.string().min(1, 'Bairro é obrigatório'),
  complement: z.string().min(1, 'Complemento é obrigatório'),
});

type FormData = z.infer<typeof formSchema>;

export default function RegisterForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalError, setModalError] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/user`,
        {
          nome: data.firstName,
          sobrenome: data.lastName,
          cpf: data.cpf,
          sexo: data.sexo,
          dt_nascimento: data.birthDate,
          cep: data.zip,
          cidade: data.city,
          estado: data.state,
          logradouro: data.address,
          bairro: data.neighborhood,
          complemento: data.complement,
          email: data.email,
          senha: data.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.data.id) {
        throw new Error('Erro ao salvar usuário');
      }

      reset();
      setModalMessage('Usuário cadastrado com sucesso!');
      setModalError(false);
      setOpenModal(true);
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);

      setModalMessage('Erro ao cadastrar usuário. Tente novamente.');
      setModalError(true);
      setOpenModal(true);
    }
    setLoading(false);
  };

  const formatCep = (cep: string) => {
    cep = cep.replace(/\D/g, '');

    if (cep.length > 8) {
      cep = cep.slice(0, 8);
    }

    if (cep.length <= 5) {
      cep = cep.replace(/(\d{5})/, '$1');
    } else if (cep.length <= 8) {
      cep = cep.replace(/(\d{5})(\d{3})/, '$1-$2');
    }

    return cep;
  };

  const handleZipChange = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length === 8) {
      try {
        const { data } = await axios.get(
          `https://viacep.com.br/ws/${cep}/json/`
        );
        if (data.erro) {
          setErrorMessage('CEP não encontrado');
        } else {
          setValue('city', data.localidade);
          setValue('state', data.uf);
          setValue('address', data.logradouro);
          setValue('neighborhood', data.bairro);
          setErrorMessage(null);
        }
      } catch (error: unknown) {
        console.error(error);
        setErrorMessage('Erro ao buscar CEP');
      }
    }
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let formattedCpf = formatCpf(e.target.value);
    setValue('cpf', formattedCpf);

    if (formattedCpf.length > 14) {
      formattedCpf = formattedCpf.slice(0, 14);
      setValue('cpf', formattedCpf);
    }
  };

  const handleModalClose = () => {
    if (!modalError) {
      setOpenModal(false);
      navigate('/');
    }
    setOpenModal(false);
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="first-name" required>
              Nome
            </FormLabel>
            <OutlinedInput
              id="first-name"
              placeholder="Seu nome"
              {...register('firstName')}
              error={!!errors.firstName}
              size="small"
            />
            <FormHelperText error>{errors.firstName?.message}</FormHelperText>
          </FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="last-name" required>
              Sobrenome
            </FormLabel>
            <OutlinedInput
              id="last-name"
              placeholder="Seu sobrenome"
              {...register('lastName')}
              error={!!errors.lastName}
              size="small"
            />
            <FormHelperText error>{errors.lastName?.message}</FormHelperText>
          </FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="cpf" required>
              CPF
            </FormLabel>
            <OutlinedInput
              id="cpf"
              placeholder="Seu CPF"
              {...register('cpf')}
              onChange={handleCpfChange}
              error={!!errors.cpf}
              size="small"
            />
            <FormHelperText error>{errors.cpf?.message}</FormHelperText>
          </FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="sexo" required>
              Sexo
            </FormLabel>
            <FormControl fullWidth>
              <Controller
                name="sexo"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="sexo"
                    id="sexo"
                    error={!!errors.sexo}
                    size="small"
                  >
                    <MenuItem value="M">Masculino</MenuItem>
                    <MenuItem value="F">Feminino</MenuItem>
                    <MenuItem value="O">Outro</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
            <FormHelperText error>{errors.sexo?.message}</FormHelperText>
          </FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="email" required>
              Email
            </FormLabel>
            <OutlinedInput
              id="email"
              type="email"
              placeholder="seu@email.com"
              {...register('email')}
              error={!!errors.email}
              size="small"
            />
            <FormHelperText error>{errors.email?.message}</FormHelperText>
          </FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="password" required>
              Senha
            </FormLabel>
            <OutlinedInput
              id="password"
              type="password"
              placeholder="Sua senha"
              {...register('password')}
              error={!!errors.password}
              size="small"
            />
            <FormHelperText error>{errors.password?.message}</FormHelperText>
          </FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="birthDate" required>
              Data de Nascimento
            </FormLabel>
            <OutlinedInput
              id="birthDate"
              type="date"
              {...register('birthDate')}
              error={!!errors.birthDate}
              size="small"
            />
            <FormHelperText error>{errors.birthDate?.message}</FormHelperText>
          </FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="zip" required>
              CEP
            </FormLabel>
            <OutlinedInput
              id="zip"
              type="text"
              placeholder="55555-555"
              {...register('zip')}
              error={!!errors.zip}
              onBlur={handleZipChange}
              onChange={(e) => setValue('zip', formatCep(e.target.value))}
              size="small"
            />
            <FormHelperText error>
              {errors.zip?.message || errorMessage}
            </FormHelperText>
          </FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="address" required>
              Logradouro
            </FormLabel>
            <OutlinedInput
              id="address"
              {...register('address')}
              placeholder="Rua exemplo, n° 123"
              error={!!errors.address}
              size="small"
            />
            <FormHelperText error>
              {errors.address?.message || errorMessage}
            </FormHelperText>
          </FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="neighborhood" required>
              Bairro
            </FormLabel>
            <OutlinedInput
              id="neighborhood"
              {...register('neighborhood')}
              placeholder="Seu bairro"
              error={!!errors.neighborhood}
              size="small"
            />
            <FormHelperText error>
              {errors.neighborhood?.message || errorMessage}
            </FormHelperText>
          </FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="city" required>
              Cidade
            </FormLabel>
            <OutlinedInput
              id="city"
              {...register('city')}
              placeholder="Sua cidade"
              error={!!errors.city}
              size="small"
            />
            <FormHelperText error>
              {errors.city?.message || errorMessage}
            </FormHelperText>
          </FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="state" required>
              Estado
            </FormLabel>
            <OutlinedInput
              id="state"
              {...register('state')}
              placeholder="Seu estado"
              error={!!errors.state}
              size="small"
            />
            <FormHelperText error>
              {errors.state?.message || errorMessage}
            </FormHelperText>
          </FormGrid>

          <FormGrid size={12}>
            <FormLabel htmlFor="complement" required>
              Complemento
            </FormLabel>
            <OutlinedInput
              id="complement"
              {...register('complement')}
              placeholder="Informações complementares"
              error={!!errors.complement}
              size="small"
            />
            <FormHelperText error>
              {errors.complement?.message || errorMessage}
            </FormHelperText>
          </FormGrid>
        </Grid>
        <Box
          sx={[
            {
              display: 'flex',
              flexDirection: { xs: 'column-reverse', sm: 'row' },
              alignItems: 'end',
              flexGrow: 1,
              gap: 4,
              pb: { xs: 12, sm: 0 },
              mt: 10,
              mb: '60px',
              justifyContent: { xs: 'center', sm: 'space-between' },
            },
          ]}
        >
          <Button
            startIcon={<ChevronLeftRoundedIcon />}
            onClick={handleBack}
            type="button"
            variant="outlined"
            fullWidth
            sx={{ width: { xs: '100%', sm: 'fit-content' } }}
          >
            Login
          </Button>
          <Button
            variant="contained"
            type="submit"
            sx={{ width: { xs: '100%', sm: 'fit-content' } }}
            disabled={loading}
          >
            Cadastrar
          </Button>
        </Box>
      </form>

      {/* Modal */}
      <Modal open={openModal} onClose={handleModalClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            textAlign: 'center',
            borderRadius: 2,
          }}
        >
          {modalError ? (
            <ErrorIcon sx={{ fontSize: 50, mb: 2, color: 'error.main' }} />
          ) : (
            <CheckCircle sx={{ fontSize: 50, mb: 2, color: 'success.main' }} />
          )}
          <Typography variant="h6" color={modalError ? 'error' : 'success'}>
            {modalMessage}
          </Typography>
          <Button onClick={handleModalClose} sx={{ mt: 6 }} variant="contained">
            OK
          </Button>
        </Box>
      </Modal>
    </>
  );
}
