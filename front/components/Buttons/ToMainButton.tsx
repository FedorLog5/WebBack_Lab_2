import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function ToMainPageButton() {
  const navigate = useNavigate();

  return (
    <Button variant="primary" onClick={() => navigate("/")}>
      На главную
    </Button>
  );
};
