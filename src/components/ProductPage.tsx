import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../Stores/useAuth";
import DeleteProductButton from "./DeleteProductButton";
import { Button } from "react-bootstrap";
import { FaHeart, FaRegHeart } from "react-icons/fa";


interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
}




const ProductPage: React.FC = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const navigate = useNavigate();
    const { isAuthenticated, token, roles } = useAuth();
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!token) return;

            try {
                const res = await fetch("http://localhost:5283/api/favorites/ids", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data: number[] = await res.json();
                setIsFavorite(data.includes(Number(id)));
            } catch (err) {
                console.error("Ошибка при загрузке избранного:", err);
            }
        };

        fetchFavorites();
    }, [id, token]);

    const toggleFavorite = async () => {
        try {
            await fetch(`http://localhost:5283/api/favorites/${product?.id}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setIsFavorite(!isFavorite);
        } catch (err) {
            console.error("Ошибка при добавлении в избранное:", err);
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`http://localhost:5283/api/products/${id}`);
                if (!res.ok) throw new Error("Ошибка загрузки товара");

                const data = await res.json();
                setProduct(data);
            } catch (error) {
                console.error("Ошибка:", error);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            navigate("/auth");
            return;
        }

        if (!roles.includes("User")) {
            alert("Недостаточно прав");
            return;
        }

        try {
            const res = await fetch("http://localhost:5283/api/cart/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ productId: product?.id, quantity: 1 }),
            });

            if (!res.ok) throw new Error("Ошибка при добавлении в корзину");

            alert("Товар добавлен в корзину!");
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

    if (!product) return <p>Загрузка...</p>;

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <h2>{product.name}</h2>
            <img
                src={`http://localhost:5283${product.imageUrl}`}
                alt={product.name}
                style={{ width: "300px", borderRadius: "10px", marginBottom: "20px" }}
            />
            <p>{product.description}</p>
            <strong style={{ fontSize: "20px" }}>{product.price} ₽</strong>
            <div style={{ marginTop: "20px" }}>
                <Button variant="primary" onClick={handleAddToCart}>
                    Добавить в корзину
                </Button>
                <Button
                    variant="light"
                    onClick={toggleFavorite}
                    style={{ marginLeft: "10px", color: isFavorite ? "red" : "gray" }}
                >
                    {isFavorite ? <FaHeart /> : <FaRegHeart />}
                </Button>
            </div>
            {roles.includes("Admin") && (
                <DeleteProductButton
                    productId={product.id}
                    onDelete={() => {
                        navigate("/");
                        window.location.reload();
                    }}
                />
            )}
        </div>
    );
};

export default ProductPage;
