import React, { useEffect, useState } from "react";
import { useAuth } from "../Stores/useAuth";
import ProductCard from "./ProductCard";

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState([]);
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:5283/api/favorites", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setFavorites(data))
      .catch(err => console.error("Ошибка при загрузке избранного:", err));
  }, [token]);

  if (!isAuthenticated) return <p>Пожалуйста, войдите в систему.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Избранные товары</h2>
      <div className="d-flex flex-wrap gap-3">
        {favorites.length === 0 ? (
          <p>У вас пока нет избранных товаров.</p>
        ) : (
          favorites.map((product: any) => (
            <ProductCard
              key={product.id}
              product={product}
              isAuthenticated={true}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
