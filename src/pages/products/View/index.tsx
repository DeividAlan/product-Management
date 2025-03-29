import { useParams } from 'react-router';

interface Params {
  id?: string;
}

export default function View() {
  const { id } = useParams<Params>();

  return <h2>Viewing Product {id}</h2>;
}
