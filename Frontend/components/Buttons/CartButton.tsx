import { Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

export default function CartButton() {
  const navigate = useNavigate();

  return (
    <Button variant="primary" onClick={() => navigate("/cart")}>
      Корзина
    </Button>
  );
}



