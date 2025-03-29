import { useParams } from 'react-router';

export default function Edit() {
  const { id } = useParams<Params>();

  return <h2>Editing Product {id}</h2>;
}
