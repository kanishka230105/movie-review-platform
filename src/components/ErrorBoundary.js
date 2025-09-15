import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container className="error-boundary">
          <Row className="justify-content-center">
            <Col md={8} className="text-center">
              <div className="error-content">
                <FaExclamationTriangle className="error-icon" />
                <h2 className="error-title">Oops! Something went wrong</h2>
                <p className="error-message">
                  We're sorry, but something unexpected happened. Please try refreshing the page.
                </p>
                
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="error-details">
                    <summary>Error Details (Development Mode)</summary>
                    <pre className="error-stack">
                      {this.state.error.toString()}
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
                
                <div className="error-actions">
                  <Button 
                    variant="primary" 
                    onClick={this.handleRetry}
                    className="btn-custom me-3"
                  >
                    <FaRedo className="me-2" />
                    Try Again
                  </Button>
                  <Button 
                    variant="outline-primary" 
                    onClick={() => window.location.reload()}
                    className="btn-outline-custom"
                  >
                    Refresh Page
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
