import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Stores/useAuth";
import { Button, Spinner } from "react-bootstrap";

type CartItem = {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
};

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false); 
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();

  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    const fetchCart = async () => {
      try {
        const res = await fetch("http://localhost:5283/api/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Ошибка при получении корзины");
        }

        const data = await res.json();
        setCartItems(data.cartItems || []);
      } catch (error) {
        console.error("Ошибка:", error);
      }
    };

    fetchCart();
  }, [isAuthenticated, token, navigate]);

  
  const updateQuantity = async (productId: number, quantity: number) => {
    try {
      const res = await fetch("http://localhost:5283/api/cart/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!res.ok) throw new Error("Ошибка при обновлении количества");

      setCartItems((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error("Ошибка обновления:", error);
    }
  };

  
  const removeItem = async (productId: number) => {
    try {
      const res = await fetch(
        `http://localhost:5283/api/cart/remove/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Ошибка при удалении товара");

      setCartItems((prev) =>
        prev.filter((item) => item.productId !== productId)
      );
    } catch (error) {
      console.error("Ошибка удаления:", error);
    }
  };

  
 const handlePayment = async () => {
  if (cartItems.length === 0) {
    alert("Корзина пуста");
    return;
  }

  setIsProcessing(true);

  try {
    const res = await fetch("http://localhost:5283/api/payment/process", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        products: cartItems.map((item) => ({
          id: item.productId,
          name: item.productName,
          price: item.price,
          quantity: item.quantity,
        })),
      }),
    });

    if (!res.ok) {
      throw new Error("Ошибка при обработке платежа");
    }

    
    const clearRes = await fetch("http://localhost:5283/api/payment/clear", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!clearRes.ok) {
      console.warn("Не удалось очистить корзину:", clearRes.statusText);
      
    } else {
      setCartItems([]); 
    }

    
    setTimeout(() => {
      setIsProcessing(false);
      navigate("/payment-success");
    }, 3000); 
  } catch (error) {
    console.error("Ошибка оплаты:", error);
    setIsProcessing(false);
    alert("Ошибка при оплате");
  }
};

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Корзина</h2>

      {cartItems.length === 0 ? (
        <p>Корзина пуста</p>
      ) : (
        <>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {cartItems.map((item) => (
              <li key={item.productId} style={{ marginBottom: "15px" }}>
                <div>
                  <strong>{item.productName}</strong> — {item.price} ₽ ×{" "}
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.productId, parseInt(e.target.value))
                    }
                    style={{ width: "50px" }}
                  />{" "}
                  <Button
                    variant="danger"
                    onClick={() => removeItem(item.productId)}
                    style={{ marginLeft: "10px" }}
                  >
                    Удалить
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          <h3>Итого: {total.toFixed(2)} ₽</h3>

          <Button
            variant="success"
            onClick={handlePayment}
            disabled={isProcessing || cartItems.length === 0}
            className="w-100 mt-3"
          >
            {isProcessing ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Обработка платежа...
              </>
            ) : (
              "Оплатить"
            )}
          </Button>
        </>
      )}
    </div>
  );
};

export default CartPage;