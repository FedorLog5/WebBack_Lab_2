import { useState } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import LoginForm from './Auth/LoginForm';
import RegisterForm from './Auth/RegisterForm';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <ButtonGroup className="w-100 mb-4">
            <Button
              variant={isLogin ? "primary" : "outline-primary"}
              onClick={() => setIsLogin(true)}
            >
              Вход
            </Button>
            <Button
              variant={!isLogin ? "primary" : "outline-primary"}
              onClick={() => setIsLogin(false)}
            >
              Регистрация
            </Button>
          </ButtonGroup>

          {isLogin ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  );
}