import { useState, useEffect, Component, ReactNode } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Product {
  Id: number;
  name?: string;
  price?: number;
  Name?: string;
  Price?: number;
  ImageUrl?: string;
  Description?: string;
}

interface Purchase {
  id: string;
  userId: string;
  products: string;
  purchaseDate?: string; 
}


const parseCustomDate = (dateString?: string): string => {
  if (!dateString) {
    return "Дата неизвестна";
  }

  try {
    const date = new Date(dateString); 
    if (isNaN(date.getTime())) {
      throw new Error("Некорректная дата");
    }
    return date.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch (error) {
    console.error("Ошибка парсинга даты:", error, dateString);
    return "Некорректная дата";
  }
};


class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Ошибка в компоненте:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h3>Произошла ошибка при отображении истории покупок.</h3>;
    }
    return this.props.children;
  }
}

const PurchaseHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<Purchase[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get("http://localhost:5283/api/payment/history", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("Данные из API:", response.data); 
        setHistory(response.data);
      } catch (error) {
        console.error("Error fetching history:", error);
        alert("Ошибка при получении истории покупок");
      }
    };

    fetchHistory();
  }, []);

  return (
    <ErrorBoundary>
      <div className="container mt-5">
        <h2>История покупок</h2>
        {history.length === 0 ? (
          <p>У вас пока нет покупок.</p>
        ) : (
          <ul className="list-group">
            {history.map((purchase) => {
              let products: Product[] = [];
              try {
                products = JSON.parse(purchase.products);
                console.log("Продукты покупки:", products);
              } catch (error) {
                console.error("Ошибка парсинга продуктов:", error, purchase.products);
                return (
                  <li key={purchase.id} className="list-group-item mb-3">
                    <p>Ошибка отображения покупки</p>
                  </li>
                );
              }

              if (!Array.isArray(products) || products.length === 0) {
                return (
                  <li key={purchase.id} className="list-group-item mb-3">
                    <p><strong>Дата покупки:</strong> {parseCustomDate(purchase.purchaseDate)}</p>
                    <p>Товары отсутствуют</p>
                  </li>
                );
              }

              return (
                <li key={purchase.id} className="list-group-item mb-3">
                  <p>
                    <strong>Дата покупки:</strong> {parseCustomDate(purchase.purchaseDate)}
                  </p>
                  <ul>
                    {products.map((product) => {
                      const productName = product.Name || product.name || "Неизвестный товар";
                      const productPrice = product.Price || product.price || 0;
                      return (
                        <li key={product.Id}>
                          {productName} - {productPrice.toLocaleString("ru-RU")} ₽
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        )}
        <Button variant="primary" onClick={() => navigate("/profile")} className="mt-3">
          Назад в профиль
        </Button>
      </div>
    </ErrorBoundary>
  );
};

export default PurchaseHistoryPage;