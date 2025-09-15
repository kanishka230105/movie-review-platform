import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner } from "react-bootstrap";
import { FaStar, FaHeart, FaFire, FaChartLine, FaEye, FaCalendarAlt, FaTag } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

function Trending() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("rating");
  const { user } = useAuth();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/movies/trending");
        const data = await res.json();
        setTrendingMovies(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trending movies:", error);
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

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

  const sortedMovies = [...trendingMovies].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return (b.avgRating || 0) - (a.avgRating || 0);
      case "reviews":
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

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
        <h1 className="section-title">
          <FaFire className="me-3" />
          Trending Movies
        </h1>
        <p className="section-subtitle">
          The most popular and highly-rated movies based on community reviews
        </p>
      </div>

      {/* Sort Options */}
      <div className="search-container mb-4">
        <Row className="align-items-center">
          <Col md={6}>
            <h5 className="mb-0">Sort by:</h5>
          </Col>
          <Col md={6}>
            <div className="d-flex gap-2">
              <Button
                variant={sortBy === "rating" ? "primary" : "outline-primary"}
                size="sm"
                onClick={() => setSortBy("rating")}
                className="btn-custom"
              >
                <FaStar className="me-1" />
                Rating
              </Button>
              <Button
                variant={sortBy === "reviews" ? "primary" : "outline-primary"}
                size="sm"
                onClick={() => setSortBy("reviews")}
                className="btn-custom"
              >
                <FaChartLine className="me-1" />
                Most Reviews
              </Button>
              <Button
                variant={sortBy === "title" ? "primary" : "outline-primary"}
                size="sm"
                onClick={() => setSortBy("title")}
                className="btn-custom"
              >
                A-Z
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      {/* Movies Grid */}
      {trendingMovies.length === 0 ? (
        <Alert variant="info" className="text-center py-5">
          <FaFire className="fs-1 mb-3 text-muted" />
          <h4>No trending movies yet</h4>
          <p>Check back later for trending content!</p>
        </Alert>
      ) : (
        <Row>
          {sortedMovies.map((movie, index) => (
            <Col key={movie._id} lg={4} md={6} className="mb-4">
              <Card className={`movie-card fade-in`} style={{ animationDelay: `${index * 0.1}s` }}>
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <Card.Img
                    variant="top"
                    src={movie.posterUrl || `https://via.placeholder.com/300x400/ff6b6b/ffffff?text=${encodeURIComponent(movie.title)}`}
                    alt={movie.title}
                    className="movie-poster"
                  />
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                    color: 'white',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '15px',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}>
                    <FaFire />
                    #{index + 1} Trending
                  </div>
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
                  
                  <div className="d-flex flex-wrap mb-2">
                    <Badge bg="primary" className="d-flex align-items-center me-2 mb-1">
                      <FaTag className="me-1" />
                      {movie.genre}
                    </Badge>
                    <Badge bg="secondary" className="d-flex align-items-center mb-1">
                      <FaCalendarAlt className="me-1" />
                      {movie.releaseYear}
                    </Badge>
                  </div>
                  
                  {movie.description && (
                    <Card.Text className="text-muted small mb-3" style={{
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
                    <Link to={`/movies/${movie._id}`} className="flex-grow-1 me-2">
                      <Button variant="primary" className="btn-custom btn-primary-custom w-100">
                        <FaEye className="me-2" />
                        View Details
                      </Button>
                    </Link>
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

      {/* Call to Action */}
      <div className="text-center mt-5">
        <Card className="profile-card">
          <Card.Body>
            <h4>Want to see more movies?</h4>
            <p className="text-muted mb-4">
              Explore our full collection of movies and discover your next favorite!
            </p>
            <div className="d-flex justify-content-center">
              <Link to="/movies" className="me-3">
                <Button className="btn-custom btn-primary-custom">
                  <FaEye className="me-2" />
                  Browse All Movies
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline-primary" className="btn-custom">
                  <FaFire className="me-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default Trending;
