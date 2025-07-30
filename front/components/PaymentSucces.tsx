import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-5 text-center">
      <h2>Платёж успешно прошёл!</h2>
      <p>Спасибо за покупку. Вы можете посмотреть историю покупок в своём профиле.</p>
      <Button
        variant="primary"
        onClick={() => navigate("/")}
      >
        На главную
      </Button>
    </div>
  );
};

export default PaymentSuccess;