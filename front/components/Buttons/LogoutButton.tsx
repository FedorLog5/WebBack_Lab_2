import { useDispatch } from "react-redux";
import { logout } from "../../Stores/AuthSlice";
import { Button } from "react-bootstrap";

export default function LogoutButton() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
   
  };

  return (
    <Button variant="danger" onClick={handleLogout}>
      Выйти
    </Button>
  );
}
