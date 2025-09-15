import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Container, Row, Col, Form, InputGroup, Spinner, Alert } from "react-bootstrap";
import { FaSearch, FaStar, FaHeart, FaFilter, FaSort } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

function Movies() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Get unique genres and years for filter options
  const genres = [...new Set(movies.map(movie => movie.genre).filter(Boolean))];
  const years = [...new Set(movies.map(movie => movie.releaseYear).filter(Boolean))].sort((a, b) => b - a);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/movies");
        const data = await response.json();
        const movieList = data.movies || data;
        setMovies(movieList);
        setFilteredMovies(movieList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    let filtered = movies;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.genre?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by genre
    if (selectedGenre) {
      filtered = filtered.filter(movie => movie.genre === selectedGenre);
    }

    // Filter by year
    if (selectedYear) {
      filtered = filtered.filter(movie => movie.releaseYear === parseInt(selectedYear));
    }

    // Sort movies
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "year":
          return (b.releaseYear || 0) - (a.releaseYear || 0);
        case "rating":
          return (b.avgRating || 0) - (a.avgRating || 0);
        case "reviews":
          return (b.reviewCount || 0) - (a.reviewCount || 0);
        default:
          return 0;
      }
    });

    setFilteredMovies(filtered);
  }, [movies, searchTerm, selectedGenre, selectedYear, sortBy]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="star" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="star" style={{ opacity: 0.5 }} />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="star" style={{ color: "#ddd" }} />);
    }

    return stars;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedGenre("");
    setSelectedYear("");
    setSortBy("title");
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Container className="py-4">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="section-title">🎬 Browse Movies</h1>
        <p className="section-subtitle">
          Discover your next favorite movie from our extensive collection
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="search-container">
        <Row className="align-items-end">
          <Col md={6}>
            <Form.Label className="fw-bold text-dark">Search Movies</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search by title, description, or genre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </InputGroup>
          </Col>
          <Col md={3}>
            <Form.Label className="fw-bold text-dark">Genre</Form.Label>
            <Form.Select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="filter-select"
            >
              <option value="">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Label className="fw-bold text-dark">Year</Form.Label>
            <Form.Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="filter-select"
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col md={6}>
            <Form.Label className="fw-bold text-dark">Sort By</Form.Label>
            <Form.Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="title">Title A-Z</option>
              <option value="year">Year (Newest First)</option>
              <option value="rating">Rating (Highest First)</option>
              <option value="reviews">Most Reviews</option>
            </Form.Select>
          </Col>
          <Col md={6} className="text-end">
            <Button
              variant="outline-secondary"
              onClick={clearFilters}
              className="btn-custom me-2"
            >
              Clear Filters
            </Button>
            <Button
              variant="outline-primary"
              onClick={() => setShowFilters(!showFilters)}
              className="btn-custom"
            >
              <FaFilter className="me-2" />
              {showFilters ? 'Hide' : 'Show'} Advanced Filters
            </Button>
          </Col>
        </Row>

        {/* Results Count */}
        <div className="mt-3">
          <p className="text-muted mb-0">
            Showing {filteredMovies.length} of {movies.length} movies
            {(searchTerm || selectedGenre || selectedYear) && (
              <span className="text-primary"> (filtered)</span>
            )}
          </p>
        </div>
      </div>

      {/* Movies Grid */}
      {filteredMovies.length === 0 ? (
        <Alert variant="info" className="text-center py-5">
          <h4>No movies found</h4>
          <p>Try adjusting your search criteria or filters</p>
          <Button variant="primary" onClick={clearFilters}>
            Clear All Filters
          </Button>
        </Alert>
      ) : (
        <Row>
          {filteredMovies.map((movie, index) => (
            <Col key={movie._id} lg={4} md={6} className="mb-4">
              <Card className={`movie-card fade-in`} style={{ animationDelay: `${index * 0.05}s` }}>
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <Card.Img
                    variant="top"
                    src={movie.posterUrl || `https://via.placeholder.com/300x400/667eea/ffffff?text=${encodeURIComponent(movie.title)}`}
                    alt={movie.title}
                    className="movie-poster"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/300x400/667eea/ffffff?text=${encodeURIComponent(movie.title)}`;
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '15px',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}>
                    {movie.avgRating ? movie.avgRating.toFixed(1) : 'N/A'}
                  </div>
                </div>
                <Card.Body className="movie-info">
                  <Card.Title className="movie-title">{movie.title}</Card.Title>
                  <div className="movie-genre">{movie.genre}</div>
                  <div className="movie-year">{movie.releaseYear}</div>
                  {movie.director && (
                    <div className="movie-director text-muted small">
                      Director: {movie.director}
                    </div>
                  )}
                  
                  {movie.description && (
                    <Card.Text className="text-muted small mt-2" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {movie.description}
                    </Card.Text>
                  )}
                  
                  <div className="star-rating mb-3">
                    {renderStars(movie.avgRating || 0)}
                    <span className="ms-2 text-muted">
                      ({movie.reviewCount || 0} reviews)
                    </span>
                  </div>

                  <div className="d-flex">
                    <Button
                      variant="primary"
                      className="btn-custom btn-primary-custom flex-grow-1 me-2"
                      onClick={() => navigate(`/movies/${movie._id}`)}
                    >
                      View Details
                    </Button>
                    {user && (
                      <Button variant="outline-danger" className="btn-custom">
                        <FaHeart />
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default Movies;
