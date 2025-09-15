import React from 'react';
import { Spinner, Container } from 'react-bootstrap';

const LoadingSpinner = ({ size = 'lg', text = 'Loading...', centered = true }) => {
  const spinner = (
    <div className="d-flex flex-column align-items-center">
      <Spinner animation="border" size={size} role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      {text && <span className="mt-2">{text}</span>}
    </div>
  );

  if (centered) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        {spinner}
      </Container>
    );
  }

  return spinner;
};

export default LoadingSpinner;
