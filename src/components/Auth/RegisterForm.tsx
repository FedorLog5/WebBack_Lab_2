import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const response = await fetch(' http://localhost:5283/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("Вы успешно зарегистрировались!")
      } else {
        const error = await response.json();
        alert(error.message || 'Ошибка регистрации');
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Имя пользователя</Form.Label>
        <Form.Control
          type="text"
          placeholder="Введите имя"
          value={formData.username}
          onChange={(e) => setFormData({...formData, username: e.target.value})}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Введите email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Пароль</Form.Label>
        <Form.Control
          type="password"
          placeholder="Введите пароль"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
      </Form.Group>

      <Button variant="primary" type="submit" className="w-100">
        Зарегистрироваться
      </Button>
    </Form>
  );
}