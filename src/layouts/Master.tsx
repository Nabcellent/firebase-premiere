import React, { Suspense } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import { PageLoader } from '../components/PageLoader';

const Master: React.FunctionComponent = () => {
    return (
        <Container>
            <Row>
                <Col xs={10} sm={8} md={6} lg={5}>
                    <Card className="mt-5">
                        <Card.Body>
                            <Suspense fallback={<PageLoader/>}>
                                <Outlet/>
                            </Suspense>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Master;