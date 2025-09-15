import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Card, Spinner } from "react-bootstrap";
import { FaStar, FaPlay, FaHeart, FaEye } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Fetch featured movies (top rated)
        const featuredResponse = await fetch("http://localhost:5000/api/movies?sortBy=rating&limit=6");
        const featuredData = await featuredResponse.json();
        setFeaturedMovies(featuredData.movies || featuredData);

        // Fetch trending movies
        const trendingResponse = await fetch("http://localhost:5000/api/movies/trending");
        const trendingData = await trendingResponse.json();
        setTrendingMovies(trendingData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setLoading(false);
      }
    };

    fetchMovies();
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

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="hero-content">
              <h1 className="hero-title fade-in">
                🎬 Discover Amazing Movies
              </h1>
              <p className="hero-subtitle fade-in">
                Explore, review, and discover your next favorite movie. 
                Join thousands of movie enthusiasts sharing their thoughts.
              </p>
              <div className="fade-in">
                <Link to="/movies">
                  <Button className="btn-custom btn-primary-custom me-3 mb-2">
                    <FaEye className="me-2" />
                    Browse Movies
                  </Button>
                </Link>
                <Link to="/trending">
                  <Button className="btn-custom btn-secondary-custom me-3 mb-2">
                    <FaPlay className="me-2" />
                    Trending Now
                  </Button>
                </Link>
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <div className="slide-in-right">
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  borderRadius: '20px', 
                  padding: '2rem',
                  backdropFilter: 'blur(10px)'
                }}>
                  <h3 className="text-white mb-3">Join the Community</h3>
                  <p className="text-white mb-4">Share your movie reviews and discover new favorites</p>
                  {!user ? (
                    <div>
                      <Link to="/login">
                        <Button variant="light" className="me-2 mb-2">Login</Button>
                      </Link>
                      <Link to="/register">
                        <Button variant="outline-light" className="mb-2">Sign Up</Button>
                      </Link>
                    </div>
                  ) : (
                    <div>
                      <p className="text-white">Welcome back, {user.username}!</p>
                      <Link to="/profile">
                        <Button variant="light">View Profile</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Featured Movies Section */}
      <Container className="py-5">
        <div className="section-header">
          <h2 className="section-title">⭐ Featured Movies</h2>
          <p className="section-subtitle">
            Handpicked movies that are trending and highly rated by our community
          </p>
        </div>

        <Row>
          {featuredMovies.map((movie, index) => (
            <Col key={movie._id} lg={4} md={6} className="mb-4">
              <Card className={`movie-card slide-in-left`} style={{ animationDelay: `${index * 0.1}s` }}>
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
                  
                  <div className="star-rating mb-3">
                    {renderStars(movie.avgRating || 0)}
                    <span className="ms-2 text-muted">
                      ({movie.reviewCount || 0} reviews)
                    </span>
                  </div>

                  <div className="d-flex">
                    <Link to={`/movies/${movie._id}`} className="flex-grow-1 me-2">
                      <Button variant="primary" className="btn-custom btn-primary-custom w-100">
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

        <div className="text-center mt-4">
          <Link to="/movies">
            <Button className="btn-custom btn-primary-custom">
              View All Movies
            </Button>
          </Link>
        </div>
      </Container>

      {/* Trending Movies Section */}
      <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '4rem 0' }}>
        <Container>
          <div className="section-header">
            <h2 className="section-title">🔥 Trending Now</h2>
            <p className="section-subtitle">
              The most popular movies this week based on reviews and ratings
            </p>
          </div>

          <Row>
            {trendingMovies.slice(0, 6).map((movie, index) => (
              <Col key={movie._id} lg={4} md={6} className="mb-4">
                <Card className={`movie-card slide-in-right`} style={{ animationDelay: `${index * 0.1}s` }}>
                  <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <Card.Img
                      variant="top"
                      src={movie.posterUrl || `https://via.placeholder.com/300x400/764ba2/ffffff?text=${encodeURIComponent(movie.title)}`}
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
                      fontWeight: 'bold'
                    }}>
                      #{index + 1} Trending
                    </div>
                  </div>
                  <Card.Body className="movie-info">
                    <Card.Title className="movie-title">{movie.title}</Card.Title>
                    <div className="movie-genre">{movie.genre}</div>
                    <div className="movie-year">{movie.releaseYear}</div>
                    
                    <div className="star-rating mb-3">
                      {renderStars(movie.avgRating || 0)}
                      <span className="ms-2 text-muted">
                        ({movie.reviewCount || 0} reviews)
                      </span>
                    </div>

                    <div className="d-flex">
                      <Link to={`/movies/${movie._id}`} className="flex-grow-1 me-2">
                        <Button variant="primary" className="btn-custom btn-primary-custom w-100">
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

          <div className="text-center mt-4">
            <Link to="/trending">
              <Button className="btn-custom btn-secondary-custom">
                View All Trending
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Home;
