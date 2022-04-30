import { Link, useNavigate } from 'react-router-dom';
import { Card, Container } from 'react-bootstrap';
import { auth } from '../firebase';
import { Button } from '@mui/material';

const Home = () => {
    const navigate = useNavigate()

    const signOut = async () => {
        await auth.signOut()

        navigate('/login')
    }

    return (
        <Container>
            <Card>
                <Card.Body>
                    <p>User: {auth.currentUser?.displayName}</p>

                    <p>Welcome to this page protected by firebase auth</p>
                    <p>Change your password <Link to={'/password'}>here</Link></p>

                    <div className={'mt-3'}>
                        <Button onClick={signOut} variant={'outlined'} size={'small'}>Sign Out</Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Home;
