import React, { Suspense } from 'react';
import { Card } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import { PageLoader } from '../components/PageLoader';

const Master: React.FunctionComponent = () => {
    return (
        <Card.Body>
            <Suspense fallback={<PageLoader/>}>
                <Outlet/>
            </Suspense>
        </Card.Body>
    );
};

export default Master;