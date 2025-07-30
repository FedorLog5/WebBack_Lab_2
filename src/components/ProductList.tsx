import ProductCardContainer from "./ProductCardContainer"; 

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

interface ProductListProps {
  products: Product[];
}

function ProductList({ products }: ProductListProps) {
  return (
    <div className="row mt-4 g-4">
      {products.map((product) => (
        <ProductCardContainer key={product.id} product={product} /> 
      ))}
    </div>
  );
}

export default ProductList;
