import { Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

export default function FavoritesButton() {
  const navigate = useNavigate();

  return (
    <Button variant="primary" onClick={() => navigate("/favorites")}>
      Избранное
    </Button>
  );
}



