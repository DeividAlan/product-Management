import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import RegisterForm from './components/RegisterForm';
import AppTheme from 'src/components/AppTheme';

export default function Register() {
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Grid
        container
        sx={{
          height: {
            xs: '100%',
            sm: 'calc(100dvh - var(--template-frame-height, 0px))',
          },
          mt: {
            xs: 4,
            sm: 0,
          },
        }}
      >
        <Grid
          size={{ xs: 12, sm: 5, lg: 4 }}
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            backgroundColor: 'background.paper',
            borderRight: { sm: 'none', md: '1px solid' },
            borderColor: { sm: 'none', md: 'divider' },
            alignItems: 'start',
            pt: 16,
            px: 10,
            gap: 4,
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              textAlign: 'left',
              lineHeight: 1.2,
              letterSpacing: '0.5px',
            }}
          >
            Cadastro de novo usuário
          </Typography>
        </Grid>
        <Grid
          size={{ sm: 12, md: 7, lg: 8 }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '100%',
            width: '100%',
            backgroundColor: { xs: 'transparent', sm: 'background.default' },
            alignItems: 'start',
            pt: { xs: 0, sm: 16 },
            px: { xs: 2, sm: 10 },
            gap: { xs: 4, md: 8 },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: { sm: 'space-between', md: 'flex-end' },
              alignItems: 'center',
              width: '100%',
              maxWidth: { sm: '100%', md: 600 },
            }}
          >
            <Box
              sx={{
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: { xs: 'center', md: 'flex-start' },
                flexGrow: 1,
              }}
            >
              <Typography
                variant="h3"
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  color: 'primary.main',
                  textAlign: { xs: 'center', md: 'left' },
                  lineHeight: 1.2,
                  letterSpacing: '0.5px',
                }}
              >
                Informe seus dados
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              width: '100%',
              maxWidth: { sm: '100%', md: 600 },
              maxHeight: '720px',
            }}
          >
            <RegisterForm />
          </Box>
        </Grid>
      </Grid>
    </AppTheme>
  );
}
