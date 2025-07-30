// components/AddProductButton.tsx
import { useState } from "react";

interface AddProductButtonProps {
  onProductAdded: () => void;
}

function AddProductButton({ onProductAdded }: AddProductButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    description: "",
  });
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Вы не авторизованы!");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price.toString());
    data.append("description", formData.description);
    if (image) {
      data.append("image", image);
    }

    try {
      const response = await fetch("http://localhost:5283/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Не указывай Content-Type вручную!
        },
        body: data,
      });

      if (response.ok) {
        setFormData({ name: "", price: 0, description: "" });
        setImage(null);
        setIsOpen(false);
        onProductAdded();
      } else {
        alert("Ошибка добавления товара");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#0d6efd",
          color: "white",
          fontSize: "32px",
          border: "none",
          cursor: "pointer",
          transition: "0.3s",
        }}
        title="Добавить товар"
      >
        +
      </button>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            zIndex: 999,
          }}
        >
          <h3>Добавить товар</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Название"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-control mb-2"
              required
            />
            <input
              type="number"
              placeholder="Цена"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="form-control mb-2"
              required
            />
            <textarea
              placeholder="Описание"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-control mb-2"
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setImage(e.target.files[0]);
                }
              }}
              className="form-control mb-2"
            />

            <button type="submit" className="btn btn-success w-100">Добавить</button>
          </form>
          <button className="btn btn-secondary w-100 mt-2" onClick={() => setIsOpen(false)}>Отмена</button>
        </div>
      )}
    </>
  );
}

export default AddProductButton;
