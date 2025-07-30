import { useEffect, useState } from 'react';
import { Container, Card, Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from '../Stores/Store';
import HistoryButton from './Buttons/HistoryButton';
import LogoutButton from './Buttons/LogoutButton';
import CartButton from './Buttons/CartButton';
import ToMainPageButton from './Buttons/ToMainButton';
import FavoritesButton from './Buttons/FavoritesButton'



const UserProfile = () => {
    const [greeting, setGreeting] = useState<string>('Здравствуйте, Пользователь!');
    const [error, setError] = useState<string | null>(null);



    const token = useSelector((state: RootState) => state.auth.token);

    useEffect(() => {
        const getUsernameFromToken = () => {
            try {
                if (!token) {
                    throw new Error('Вы не авторизованы');
                }


                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const decodedToken = JSON.parse(atob(base64));


                const username = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 'Пользователь';

                setGreeting(`Здравствуйте, ${username}!`);
            } catch (error) {
                console.error('Ошибка получения имени:', error);
                setError(error instanceof Error ? error.message : 'Произошла ошибка');
            }
        };

        getUsernameFromToken();
    }, [token]);
    return (
        <Container className="py-5">
            <Card className="shadow-sm">
                <Card.Body className="text-center py-4">
                    {error ? (
                        <Alert variant="warning">
                            {error}
                        </Alert>
                    ) : (
                        <h2 className="mb-4">{greeting}</h2>
                    )}
                    <div className="d-flex justify-content-center gap-2 flex-wrap">
                        <LogoutButton />
                        <HistoryButton />
                        <CartButton />
                        <ToMainPageButton />
                        <FavoritesButton/>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default UserProfile;