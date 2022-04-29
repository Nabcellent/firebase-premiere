import React, { ReactNode } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';

export interface IAuthContainerProps {
    header: any;
    children: ReactNode;
}

const AuthContainer: React.FunctionComponent<IAuthContainerProps> = props => {
    const {children, header} = props;

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
                        <Card.Header className="bg-primary text-white">
                            {header}
                        </Card.Header>
                        <Card.Body>
                            {children}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AuthContainer;