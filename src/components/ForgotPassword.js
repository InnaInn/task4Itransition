import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../images/background.png';
import logoImage from '../images/logo.png';
import { config } from "../config.js";

const beURL = config.beURL;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage(null);
    setLoading(true);

    try {
      const response = await fetch(`${beURL}/api/users/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage({
          text: `If an account exists for ${email}, you will receive a password reset link.`,
          variant: 'success',
        });
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
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

              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}

              {message && (
                <Alert variant={message.variant} className="mb-3">
                  {message.text}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mb-3" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
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
              display: 'block'
            }}
            className="d-none d-md-block"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;