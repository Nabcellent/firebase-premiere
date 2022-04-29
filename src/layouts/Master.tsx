import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';

const Master: React.FunctionComponent = () => {
    return (
        <Container>
            <Row>
                <Col
                    xs={10}
                    sm={8}
                    md={6}
                    lg={4}
                >
                    <Card className="mt-5">
                        <Card.Body>
                            {children}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Master;