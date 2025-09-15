import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Spinner, Alert, Modal } from 'react-bootstrap';
import { FaSearch, FaPlus, FaStar, FaCalendarAlt, FaEye } from 'react-icons/fa';

const MovieSearch = ({ onMovieSelect, onImportMovie, show = false, onHide }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [importing, setImporting] = useState({});

  useEffect(() => {
    if (searchQuery.trim()) {
      const timeoutId = setTimeout(() => {
        searchMovies();
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, currentPage]);

  const searchMovies = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:5000/api/tmdb/search?query=${encodeURIComponent(searchQuery)}&page=${currentPage}`
      );
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.movies);
        setTotalPages(data.totalPages);
      } else {
        setError(data.message || 'Failed to search movies');
      }
    } catch (err) {
      setError('Failed to connect to movie database');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImportMovie = async (tmdbId, movie) => {
    setImporting(prev => ({ ...prev, [tmdbId]: true }));

    try {
      const response = await fetch(`http://localhost:5000/api/tmdb/import/${tmdbId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authData') ? JSON.parse(localStorage.getItem('authData')).token : ''}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        alert('Movie imported successfully!');
        onImportMovie && onImportMovie(data.movie);
        onHide && onHide();
      } else {
        alert(data.message || 'Failed to import movie');
      }
    } catch (err) {
      alert('Failed to import movie');
      console.error('Import error:', err);
    } finally {
      setImporting(prev => ({ ...prev, [tmdbId]: false }));
    }
  };

  const handleMovieSelect = (movie) => {
    onMovieSelect && onMovieSelect(movie);
    onHide && onHide();
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating / 2); // TMDB uses 10-point scale
    const hasHalfStar = (rating / 2) % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-warning" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="text-warning" style={{ opacity: 0.5 }} />);
    }

    const emptyStars = 5 - Math.ceil(rating / 2);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-muted" />);
    }

    return stars;
  };

  const MovieCard = ({ movie }) => (
    <Col md={6} lg={4} className="mb-3">
      <Card className="h-100 movie-search-card">
        <div className="position-relative">
          <Card.Img
            variant="top"
            src={movie.posterUrl || `https://via.placeholder.com/300x450?text=${encodeURIComponent(movie.title)}`}
            alt={movie.title}
            style={{ height: '300px', objectFit: 'cover' }}
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/300x450?text=${encodeURIComponent(movie.title)}`;
            }}
          />
          <div className="position-absolute top-0 end-0 m-2">
            <div className="bg-dark text-white px-2 py-1 rounded">
              {movie.voteAverage ? movie.voteAverage.toFixed(1) : 'N/A'}
            </div>
          </div>
        </div>
        <Card.Body className="d-flex flex-column">
          <Card.Title className="h6 mb-2">{movie.title}</Card.Title>
          <div className="mb-2">
            <small className="text-muted">
              <FaCalendarAlt className="me-1" />
              {movie.releaseYear}
            </small>
          </div>
          <div className="star-rating mb-2">
            {renderStars(movie.voteAverage || 0)}
            <small className="text-muted ms-2">
              ({movie.voteCount || 0} votes)
            </small>
          </div>
          <Card.Text className="text-muted small flex-grow-1">
            {movie.description?.substring(0, 100)}...
          </Card.Text>
          <div className="mt-auto">
            <div className="d-grid gap-2">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => handleMovieSelect(movie)}
                className="d-flex align-items-center justify-content-center"
              >
                <FaEye className="me-1" />
                View Details
              </Button>
              <Button
                variant="success"
                size="sm"
                onClick={() => handleImportMovie(movie.tmdbId, movie)}
                disabled={importing[movie.tmdbId]}
                className="d-flex align-items-center justify-content-center"
              >
                {importing[movie.tmdbId] ? (
                  <>
                    <Spinner size="sm" className="me-1" />
                    Importing...
                  </>
                ) : (
                  <>
                    <FaPlus className="me-1" />
                    Import Movie
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaSearch className="me-2" />
          Search Movies from Database
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container fluid>
          <Row>
            <Col>
              <Form.Group className="mb-4">
                <InputGroup>
                  <InputGroup.Text>
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search for movies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </InputGroup>
              </Form.Group>

              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}

              {loading && (
                <div className="text-center py-4">
                  <Spinner animation="border" />
                  <p className="mt-2 text-muted">Searching movies...</p>
                </div>
              )}

              {searchResults.length > 0 && (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5>Search Results</h5>
                    <small className="text-muted">
                      Page {currentPage} of {totalPages}
                    </small>
                  </div>
                  <Row>
                    {searchResults.map((movie) => (
                      <MovieCard key={movie.tmdbId} movie={movie} />
                    ))}
                  </Row>
                </>
              )}

              {searchQuery && !loading && searchResults.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-muted">No movies found for "{searchQuery}"</p>
                  <p className="text-muted small">Try a different search term</p>
                </div>
              )}

              {!searchQuery && (
                <div className="text-center py-4">
                  <p className="text-muted">Enter a movie title to search</p>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default MovieSearch;
