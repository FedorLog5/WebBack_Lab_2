import { useSelector } from 'react-redux';
import ProductCard from './ProductCard';
import { RootState } from '../Stores/Store';

interface ProductCardContainerProps {
  product: {
    id: number;
    name: string;
    price: number;
    description: string;
  };
}

export default function ProductCardContainer({ product }: ProductCardContainerProps) {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return <ProductCard product={product} isAuthenticated={isAuthenticated} />;
}
