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
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import backgroundImage from '../images/background.png';
import logoImage from '../images/logo.png';
import eyeImage from '../images/eye.png';
import envelopeImage from '../images/envelope.png';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage(null);

    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: name,
          email: email,
          password: password
        }),
      });

      if (response.ok) {
        setMessage({
          text: 'Registration successful! Please check your email to verify.',
          variant: 'success'
        });
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else if (response.status === 409) {
        setError('User already exists');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      setError('Connection error. Please try again.');
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
              <h4 className="mb-4">Create an Account</h4>

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
                <FloatingLabel label="Name" className="mb-3">
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    required
                  />
                </FloatingLabel>

                <div style={{ position: 'relative' }} className="mb-3">
                  <FloatingLabel label="Email">
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      required
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
                    <img src={envelopeImage} alt="email" width="20" height="20" />
                  </div>
                </div>

                <div style={{ position: 'relative' }} className="mb-3">
                  <FloatingLabel label="Password">
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      required
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

                <Button variant="primary" type="submit" className="w-100">
                  Sign Up
                </Button>
              </Form>

              <div className="text-center mt-3">
                Already have an account? <Link to="/login">Sign In</Link>
              </div>
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

export default Register;