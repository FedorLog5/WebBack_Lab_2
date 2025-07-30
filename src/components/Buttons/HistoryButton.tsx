import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

const HistoryButton: React.FC = () => {
  const navigate = useNavigate();

  const handleViewHistory = () => {
    navigate("/purchase-history");
  };

  return (
    <Button variant="primary" onClick={handleViewHistory}>
      История покупок
    </Button>
  );
};

export default HistoryButton;