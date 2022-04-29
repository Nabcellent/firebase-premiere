import { Link } from 'react-router-dom';
import { Card, Container } from 'react-bootstrap';
import { auth } from '../firebase';

const Home = () => {
    return (
        <Container>
            <Card>
                <Card.Body>
                    <p>User: {auth.currentUser?.displayName}</p>

                    <p>Welcome to this page protected by firebase auth</p>
                    Change your password <Link to={'/password'}>here</Link>

                    <Link to={'/logout'}>Sign Out</Link>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Home;
