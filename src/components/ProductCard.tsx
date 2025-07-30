import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    description: string;
  };
  isAuthenticated: boolean;
}

function ProductCard({ product, isAuthenticated }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    if (!isAuthenticated) {
      navigate("/auth"); 
      return;
    }
      navigate(`/product/${product.id}`);
  };

  return (
    <div
      className="product-card"
      style={{
        padding: "15px",
        borderRadius: "10px",
        transition: "0.3s",
        backgroundColor: isHovered ? "#f0f0f0" : "#fff",
        boxShadow: isHovered
          ? "0px 4px 10px rgba(0, 0, 0, 0.2)"
          : "0px 2px 5px rgba(0, 0, 0, 0.1)",
        transform: isHovered ? "scale(1.05)" : "scale(1)",
        cursor: "pointer",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <h3>{product.name}</h3>
      <strong>{product.price} ₽</strong>
    </div>
  );
}

export default ProductCard;
