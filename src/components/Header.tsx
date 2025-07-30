import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../Stores/Store';
import UserIcon from '../assets/icons/user-icon.svg'
import CartIcon from '../assets/icons/cart-filled.svg'


function Header() {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const handleUserIconClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/auth');
    }
  };

  const handleCartIconClick = () => {
    if (isAuthenticated) {
      navigate('/cart')
    } else {
      navigate('/auth')
    }
  };

  return (
    <header className="bg-primary text-white p-3">
      <div className="container">
        <div className="d-flex justify-content-center align-items-center position-relative">
          <h1 className="m-0">Магазин товаров</h1>

          <button
            onClick={handleUserIconClick}
            className="bg-transparent border-0 p-0 position-absolute"
            aria-label={isAuthenticated ? "Профиль пользователя" : "Авторизация"}
            style={{
              right: 'calc(50% - 200px)',
              transform: 'translateX(50%) translateY(5px)'
            }}
          >
            <img
              src={UserIcon}
              alt="User icon"
              width="40"
              height="40"
              className="ms-2"
              style={{ verticalAlign: 'middle' }}
            />
          </button>

            <button
            onClick={handleCartIconClick}
            className="bg-transparent border-0 p-0 position-absolute"
            aria-label={isAuthenticated ? "Корзина" : "Авторизация"}
            style={{
              right: 'calc(50% - 260px)',
              transform: 'translateX(50%) translateY(5px)'
            }}
          >
            <img
              src={CartIcon}
              alt="Cart icon"
              width="40"
              height="40"
              className="ms-2"
              style={{ verticalAlign: 'middle' }}
            />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;