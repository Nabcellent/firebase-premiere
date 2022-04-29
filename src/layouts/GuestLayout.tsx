import React, { Suspense } from 'react';
import { Card, Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import { PageLoader } from '../components/PageLoader';

const GuestLayout: React.FunctionComponent = () => {
    return (
        <Container>
            <Card.Body>
                <Suspense fallback={<PageLoader/>}><Outlet/></Suspense>
            </Card.Body>
        </Container>
    );
};

export default GuestLayout;