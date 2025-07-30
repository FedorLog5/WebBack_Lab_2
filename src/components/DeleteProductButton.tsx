import React from "react";
import { Button } from "react-bootstrap";

interface Props {
  productId: number;
  onDelete: () => void;
}

const DeleteProductButton: React.FC<Props> = ({ productId, onDelete }) => {
  const token = localStorage.getItem("token");

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5283/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        onDelete(); 
      } else {
        alert("Ошибка при удалении товара");
      }
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };
  return (
    <Button variant="danger mt-3" onClick={handleDelete}>
      Удалить товар
    </Button>
  );
};

export default DeleteProductButton;
