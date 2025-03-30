import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from '@mui/material';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router';
import { formatCurrencyBRL } from 'src/help/currencyHelp';
import { useSelector } from 'react-redux';
import { selectAuth } from 'src/store/authSlice';

interface Product {
  id: string;
  nome: string;
  image: string;
  preco: string;
  qt_estoque: number;
  qt_vendas: number;
  marca: string;
  createdAt: string;
}

export default function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { token } = useSelector(selectAuth);

  const initialPage = parseInt(searchParams.get('page') || '0', 10);
  const rowsPerPage = 15;

  const [page, setPage] = useState(initialPage);

  useEffect(() => {
    axios
      .get('https://67ddc6fd471aaaa7428282c2.mockapi.io/api/v1/product', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setProducts(response.data);
        setFilteredProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, []);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
    setSearchParams({ page: newPage.toString() });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    const filtered = products.filter((product) =>
      product.nome.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  return (
    <Box
      sx={{ padding: 3, flex: 1, display: 'flex', flexDirection: 'column' }}
      height={{
        sm: 'calc(100dvh - var(--template-frame-height, 100px))',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 4,
        }}
      >
        <Typography variant="h4">Listagem de Produtos</Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/products/create"
        >
          Criar Novo Produto
        </Button>
      </Box>

      <TextField
        label="Pesquisar Produto"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearchChange}
        sx={{ marginBottom: 2 }}
      />

      {loading ? (
        <Typography variant="h6">Carregando...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 800 }} stickyHeader aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Produto</TableCell>
                <TableCell>Preço</TableCell>
                <TableCell>Qt. Estoque</TableCell>
                <TableCell>Qt. Vendas</TableCell>
                <TableCell>Marca</TableCell>
                <TableCell>Data de Criação</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Grid container alignItems="center">
                        <Avatar
                          src={product.image}
                          alt={product.nome}
                          sx={{ marginRight: 2 }}
                        />
                        {product.nome}
                      </Grid>
                    </TableCell>
                    <TableCell>{formatCurrencyBRL(product.preco)}</TableCell>
                    <TableCell>{product.qt_estoque}</TableCell>
                    <TableCell>{product.qt_vendas}</TableCell>
                    <TableCell>{product.marca}</TableCell>
                    <TableCell>
                      {new Date(product.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        component={Link}
                        to={`/products/${product.id}`}
                      >
                        Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <TablePagination
        rowsPerPageOptions={[rowsPerPage]}
        component="div"
        count={filteredProducts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
      />
    </Box>
  );
}
