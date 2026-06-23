
import React from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';

const VerificationModal = ({ show, onHide, onVerify, userId, loading, error }) => {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Verify Your Email</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && (
                    <Alert variant="danger" className="mb-3">
                        {error}
                    </Alert>
                )}
                <p>Click the button below to verify your email address immediately.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button 
                    variant="primary" 
                    onClick={() => onVerify(userId)}
                    disabled={loading}
                >
                    {loading ? 'Verifying...' : 'Click Here to Verify'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default VerificationModal;