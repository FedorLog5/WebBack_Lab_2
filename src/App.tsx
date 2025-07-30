import { useState, useEffect } from "react";
import Header from "./components/Header";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProductList from "./components/ProductList";
import AuthPage from "./components/AuthPage";
import { login } from "./Stores/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./Stores/Store";
import AddProductButton from "./components/Buttons/AddProductButton";
import UserProfile from "./components/UserProfile";
import CartPage from "./components/CartPage";
import ProductPage from "./components/ProductPage";
import PurchaseHistoryPage from "./components/PurchasedHistoryPage";
import PaymentSuccess from "./components/PaymentSucces";
import FavoritesPage from "./components/FavoritesPage";



interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const { isAuthenticated, roles } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(login(token));
    }
  }, [dispatch]);

  const fetchProducts = async () => {
    const response = await fetch("http://localhost:5283/api/products");
    const data = await response.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  console.log('Auth status:', isAuthenticated, 'Roles:', roles);

  return (
    <>
      <BrowserRouter>
        <Header />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<ProductList products={products} />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/purchase-history" element={<PurchaseHistoryPage />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Routes>
          {isAuthenticated && roles.includes("Admin") && (
          <AddProductButton onProductAdded={fetchProducts} />
        )}
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;