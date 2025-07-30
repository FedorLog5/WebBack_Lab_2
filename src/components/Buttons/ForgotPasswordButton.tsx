import { useState } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import axios from "axios";

interface ForgotPasswordResponse {
  message: string;
  code: string;
}

interface ResetPasswordResponse {
  message: string;
}

const ForgotPasswordButton: React.FC = () => {
  const [show, setShow] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1); // 1: email, 2: code, 3: new password
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [canRequestNewCode, setCanRequestNewCode] = useState<boolean>(true);
  const [timer, setTimer] = useState<number>(120); // 2 minutes in seconds

  const handleClose = () => {
    setShow(false);
    setStep(1);
    setEmail("");
    setCode("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
    setCanRequestNewCode(true);
    setTimer(120);
  };

  const handleShow = () => setShow(true);

  const handleSendCode = async () => {
    try {
      const response = await axios.post<ForgotPasswordResponse>(
        "http://localhost:5283/api/user/forgot-password",
        { email }
      );
      console.log("Код для сброса пароля:", response.data.code); // Log code to DevTools
      setSuccess("Код сгенерирован и выведен в консоль браузера (F12)");
      setStep(2);
      setCanRequestNewCode(false);

      // Start 2-minute timer
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanRequestNewCode(true);
            return 120;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data || "Ошибка при генерации кода");
    }
  };

  const handleVerifyCode = () => {
    if (!code) {
      setError("Введите код");
      return;
    }
    setError("");
    setSuccess("");
    setStep(3); // Move to password input (code validation happens on backend)
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }
    if (newPassword.length < 8) {
      setError("Пароль должен содержать минимум 8 символов");
      return;
    }
    try {
      const response = await axios.post<ResetPasswordResponse>(
        "http://localhost:5283/api/user/reset-password",
        {
          email,
          code,
          newPassword,
        }
      );
      setSuccess(response.data.message);
      setTimeout(handleClose, 2000); // Close modal after 2 seconds
    } catch (err: any) {
      setError(err.response?.data || "Ошибка при смене пароля");
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Забыли пароль?
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Сброс пароля</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          {step === 1 && (
            <Form>
              <Form.Group controlId="formEmail">
                <Form.Label>Введите ваш email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                />
              </Form.Group>
              <Button variant="primary" onClick={handleSendCode} className="mt-3">
                Сгенерировать код
              </Button>
            </Form>
          )}

          {step === 2 && (
            <Form>
              <Form.Group controlId="formCode">
                <Form.Label>Введите код из консоли браузера (F12)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Код"
                  value={code}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCode(e.target.value)
                  }
                />
              </Form.Group>
              <Button
                variant="primary"
                onClick={handleVerifyCode}
                className="mt-3"
                disabled={!code}
              >
                Подтвердить код
              </Button>
              <Button
                variant="link"
                onClick={handleSendCode}
                disabled={!canRequestNewCode}
                className="mt-3"
              >
                {canRequestNewCode
                  ? "Запросить новый код"
                  : `Запросить новый код через ${timer} сек`}
              </Button>
            </Form>
          )}

          {step === 3 && (
            <Form>
              <Form.Group controlId="formNewPassword">
                <Form.Label>Новый пароль</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Новый пароль"
                  value={newPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewPassword(e.target.value)
                  }
                />
              </Form.Group>
              <Form.Group controlId="formConfirmPassword" className="mt-3">
                <Form.Label>Подтвердите пароль</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Подтвердите пароль"
                  value={confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setConfirmPassword(e.target.value)
                  }
                />
              </Form.Group>
              <Button
                variant="primary"
                onClick={handleResetPassword}
                className="mt-3"
                disabled={!newPassword || !confirmPassword}
              >
                Поменять пароль
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ForgotPasswordButton;