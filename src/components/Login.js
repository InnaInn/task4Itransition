import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  FloatingLabel,
  Alert,
} from 'react-bootstrap';
import backgroundImage from '../images/background.png';
import logoImage from '../images/logo.png';
import eyeImage from '../images/eye.png';
import envelopeImage from '../images/envelope.png';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        navigate('/admin-panel');
      } else {
        setError('Please check your email or password');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      setError('Ошибка подключения к серверу');
    }
  };

  return (
    <Container fluid className="vh-100">
      <Row className="h-100">
        <Col
          md={6}
          className="d-flex flex-column p-5"
          style={{ minHeight: '100vh' }}
        >
          <div>
            <img
              src={logoImage}
              alt="App Logo"
              className="mb-3"
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
              <p className="text-muted mb-2">Start your journey</p>
              <h4 className="mb-4">Sign In to The App</h4>

              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <div style={{ position: 'relative' }} className="mb-3">
                  <FloatingLabel label="E-mail">
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="E-mail"
                    />
                  </FloatingLabel>
                  <div
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                    }}
                  >
                    <img
                      src={envelopeImage}
                      alt="envelope"
                      width="20"
                      height="20"
                    />
                  </div>
                </div>

                <div style={{ position: 'relative' }} className="mb-3">
                  <FloatingLabel label="Password">
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                    />
                  </FloatingLabel>
                  <div
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',  
                    }}
                    onClick={() => setShowPassword(!showPassword)} 
                  >
                    <img src={eyeImage} alt="password" width="20" height="20" />
                  </div>
                </div>

                <Form.Check
                  label="Remember me"
                  type="checkbox"
                  className="mb-3"
                />

                <Button variant="primary" type="submit" className="w-100">
                  Sign In
                </Button>
              </Form>
            </div>
          </div>
          <div
            className="d-flex justify-content-between"
            style={{ width: '100%' }}
          >
            <div>
              Don't have an account?{' '}
              <Link to="/register" className="text-primary">Sign up</Link>
            </div>
            <div>
              <Link to="/forgot-password" className="text-primary">Forgot password?</Link>
              <Link to="/admin-panel" className="text-primary">Админ панель</Link>
            </div>
          </div>
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

export default Login;