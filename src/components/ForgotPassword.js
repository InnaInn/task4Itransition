import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import backgroundImage from '../images/background.png';
import logoImage from '../images/logo.png';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({
      text: `If an account exists for ${email}, you will receive a password reset link.`,
      variant: 'success',
    });
    setTimeout(() => setMessage(null), 5000);
  };

  return (
    <Container fluid className="vh-100">
      <Row className="h-100">
        <Col md={6} className="d-flex flex-column p-5" style={{ minHeight: '100vh' }}>
          <div>
            <img
              src={logoImage}
              alt="App Logo"
              style={{ height: '60px', width: 'auto' }}
            />
          </div>
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ width: '100%', maxWidth: '400px' }}>
              <h4 className="mb-3">Forgot Password?</h4>
              <p className="text-muted mb-4">
                Enter your email and we'll send you a link to reset your password.
              </p>

              {message && <Alert variant={message.variant}>{message.text}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mb-3">
                  Send Reset Link
                </Button>

                <div className="text-center">
                  <Link to="/login">Back to Sign In</Link>
                </div>
              </Form>
            </div>
          </div>
          <div style={{ height: 'auto' }}></div>
        </Col>
        <Col md={6} className="d-flex align-items-center">
          <img
            src={backgroundImage}
            alt="Background"
            style={{
              width: '50vw',
              height: '100vh',
              objectFit: 'cover',
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              left: 'auto',
            }}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;