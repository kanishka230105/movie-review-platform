import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form, Alert, Spinner, Badge, Modal } from "react-bootstrap";
import { FaStar, FaHeart, FaPlay, FaArrowLeft, FaCalendarAlt, FaTag, FaUsers, FaThumbsUp, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import ReviewForm from "../components/ReviewForm";
import MovieSearch from "../components/MovieSearch";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [showMovieSearch, setShowMovieSearch] = useState(false);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        // Fetch movie details
        const movieRes = await fetch(`http://localhost:5000/api/movies/${id}`);
        const movieData = await movieRes.json();
        setMovie(movieData);

        // Fetch reviews
        const reviewsRes = await fetch(`http://localhost:5000/api/reviews/movie/${id}`);
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData.reviews || reviewsData);

        // Check if user has already reviewed this movie
        if (user) {
          const userReviewData = reviewsData.find(review => review.user?._id === user._id);
          setUserReview(userReviewData);
          if (userReviewData) {
            setRating(userReviewData.rating);
            setComment(userReviewData.comment || "");
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching movie data:", error);
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id, user]);

  const handleReviewSubmit = async (reviewData) => {
    if (!token) {
      alert("Please login to leave a review");
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          movie: id, 
          ...reviewData 
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setReviews([data, ...reviews]);
        setUserReview(data);
        alert("Review submitted successfully!");
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Error submitting review");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Error submitting review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleReviewUpdate = async (reviewId, reviewData) => {
    setSubmittingReview(true);
    try {
      const res = await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reviewData),
      });

      if (res.ok) {
        const data = await res.json();
        setReviews(reviews.map(review => 
          review._id === reviewId ? data : review
        ));
        setUserReview(data);
        alert("Review updated successfully!");
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Error updating review");
      }
    } catch (err) {
      console.error("Error updating review:", err);
      alert("Error updating review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setReviews(reviews.filter(review => review._id !== reviewId));
        setUserReview(null);
        alert("Review deleted successfully!");
      } else {
        alert("Error deleting review");
      }
    } catch (err) {
      console.error("Error deleting review:", err);
      alert("Error deleting review");
    }
  };

  const handleMovieImport = (importedMovie) => {
    alert(`Movie "${importedMovie.title}" imported successfully!`);
    // Optionally refresh the page or navigate to the imported movie
    window.location.reload();
  };

  const toggleWatchlist = () => {
    setInWatchlist(!inWatchlist);
    // TODO: Implement actual watchlist functionality
  };

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`star ${interactive ? 'interactive' : ''}`}
          style={{
            color: i <= rating ? "#ffd700" : "#ddd",
            cursor: interactive ? "pointer" : "default"
          }}
          onClick={interactive && onStarClick ? () => onStarClick(i) : undefined}
        />
      );
    }
    return stars;
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <h4>Movie not found</h4>
          <p>The movie you're looking for doesn't exist.</p>
          <Button variant="primary" onClick={() => navigate("/movies")}>
            <FaArrowLeft className="me-2" />
            Back to Movies
          </Button>
        </Alert>
      </Container>
    );
  }

  const ratingDistribution = getRatingDistribution();
  const totalReviews = reviews.length;

  return (
    <div>
      {/* Back Button */}
      <Container className="py-3">
        <Button variant="outline-light" onClick={() => navigate(-1)} className="btn-custom">
          <FaArrowLeft className="me-2" />
          Back
        </Button>
      </Container>

      {/* Movie Hero Section */}
      <div style={{ 
        background: `linear-gradient(135deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9)), 
                    url(${movie.posterUrl || `https://via.placeholder.com/1920x600/667eea/ffffff?text=${encodeURIComponent(movie.title)}`})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '60vh',
        color: 'white',
        position: 'relative'
      }}>
        <Container className="py-5">
          <Row className="align-items-center">
            <Col lg={4} className="text-center mb-4">
              <img
                src={movie.posterUrl || `https://via.placeholder.com/400x600/667eea/ffffff?text=${encodeURIComponent(movie.title)}`}
                alt={movie.title}
                className="img-fluid rounded shadow-lg"
                style={{ maxHeight: '500px' }}
              />
            </Col>
            <Col lg={8}>
              <div className="fade-in">
                <h1 className="display-4 fw-bold mb-3">{movie.title}</h1>
                
                <div className="d-flex flex-wrap gap-3 mb-3">
                  <Badge bg="primary" className="fs-6 px-3 py-2">
                    <FaTag className="me-1" />
                    {movie.genre}
                  </Badge>
                  <Badge bg="secondary" className="fs-6 px-3 py-2">
                    <FaCalendarAlt className="me-1" />
                    {movie.releaseYear}
                  </Badge>
                  <Badge bg="warning" className="fs-6 px-3 py-2">
                    <FaStar className="me-1" />
                    {movie.avgRating ? movie.avgRating.toFixed(1) : 'N/A'}
                  </Badge>
                  <Badge bg="info" className="fs-6 px-3 py-2">
                    <FaUsers className="me-1" />
                    {movie.reviewCount || 0} reviews
                  </Badge>
                </div>

                <div className="star-rating mb-4">
                  {renderStars(Math.floor(movie.avgRating || 0))}
                  <span className="ms-2 fs-5">
                    {movie.avgRating ? movie.avgRating.toFixed(1) : 'N/A'} 
                    <span className="text-light opacity-75">({totalReviews} reviews)</span>
                  </span>
                </div>

                {movie.director && (
                  <div className="mb-3">
                    <h5 className="text-light">Director</h5>
                    <p className="text-light opacity-75">{movie.director}</p>
                  </div>
                )}

                <p className="lead mb-4">{movie.description}</p>

                {movie.synopsis && movie.synopsis !== movie.description && (
                  <div className="mb-4">
                    <h5 className="text-light">Synopsis</h5>
                    <p className="text-light opacity-75">{movie.synopsis}</p>
                  </div>
                )}

                <div className="d-flex gap-3 flex-wrap">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="btn-custom btn-primary-custom"
                    onClick={() => setShowTrailer(true)}
                  >
                    <FaPlay className="me-2" />
                    Watch Trailer
                  </Button>
                  
                  {user && (
                    <Button 
                      variant={inWatchlist ? "danger" : "outline-light"} 
                      size="lg" 
                      className="btn-custom"
                      onClick={toggleWatchlist}
                    >
                      <FaHeart className="me-2" />
                      {inWatchlist ? 'Remove from' : 'Add to'} Watchlist
                    </Button>
                  )}

                  <Button 
                    variant="outline-light" 
                    size="lg" 
                    className="btn-custom"
                    onClick={() => setShowMovieSearch(true)}
                  >
                    <FaSearch className="me-2" />
                    Search More Movies
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-5">
        <Row>
          {/* Cast Section */}
          {movie.cast && movie.cast.length > 0 && (
            <Col lg={12} className="mb-5">
              <Card className="profile-card">
                <Card.Header className="bg-transparent border-0">
                  <h3 className="mb-0">🎭 Cast</h3>
                </Card.Header>
                <Card.Body>
                  <Row>
                    {movie.cast.map((actor, index) => (
                      <Col key={index} md={6} lg={4} className="mb-3">
                        <div className="d-flex align-items-center p-3 bg-light rounded">
                          <div className="me-3">
                            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" 
                                 style={{ width: '50px', height: '50px' }}>
                              <span className="text-white fw-bold">
                                {actor.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          </div>
                          <div>
                            <h6 className="mb-1">{actor.name}</h6>
                            {actor.character && (
                              <small className="text-muted">{actor.character}</small>
                            )}
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          )}

          {/* Reviews Section */}
          <Col lg={8}>
            <Card className="profile-card mb-4">
              <Card.Header className="bg-transparent border-0">
                <h3 className="mb-0">⭐ Reviews & Ratings</h3>
              </Card.Header>
              <Card.Body>
                {/* Rating Distribution */}
                <div className="mb-4">
                  <h5>Rating Distribution</h5>
                  {[5, 4, 3, 2, 1].map(star => (
                    <div key={star} className="d-flex align-items-center mb-2">
                      <span className="me-2">{star}★</span>
                      <div className="flex-grow-1 mx-2">
                        <div 
                          className="bg-light rounded" 
                          style={{ height: '8px' }}
                        >
                          <div 
                            className="bg-warning rounded" 
                            style={{ 
                              width: `${totalReviews > 0 ? (ratingDistribution[star] / totalReviews) * 100 : 0}%`,
                              height: '100%'
                            }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-muted small">
                        {ratingDistribution[star]} ({totalReviews > 0 ? Math.round((ratingDistribution[star] / totalReviews) * 100) : 0}%)
                      </span>
                    </div>
                  ))}
                </div>

                {/* Individual Reviews */}
                <div>
                  <h5>User Reviews</h5>
                  {reviews.length > 0 ? (
                    <div>
                      {reviews.map((review) => (
                        <div key={review._id} className="review-card">
                          <div className="review-header">
                            <div>
                              <span className="reviewer-name">{review.user?.username || "Anonymous"}</span>
                              <div className="star-rating">
                                {renderStars(review.rating)}
                              </div>
                            </div>
                            <div className="text-end">
                              <small className="review-date">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </small>
                              {user && review.user?._id === user._id && (
                                <div className="mt-1">
                                  <Button variant="outline-primary" size="sm" className="me-1">
                                    <FaEdit />
                                  </Button>
                                  <Button variant="outline-danger" size="sm" onClick={handleDeleteReview}>
                                    <FaTrash />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                          {review.comment && (
                            <p className="mb-0">{review.comment}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Alert variant="info">
                      No reviews yet. Be the first to review this movie!
                    </Alert>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Review Form */}
          <Col lg={4}>
            {user ? (
              <ReviewForm
                movieId={id}
                user={user}
                userReview={userReview}
                onSubmit={handleReviewSubmit}
                onUpdate={handleReviewUpdate}
                onDelete={handleDeleteReview}
                submitting={submittingReview}
              />
            ) : (
              <Card className="profile-card">
                <Card.Body className="text-center">
                  <h5>Want to review this movie?</h5>
                  <p>Please login to share your thoughts and rate this movie.</p>
                  <Button 
                    variant="primary" 
                    className="btn-custom btn-primary-custom"
                    onClick={() => navigate('/login')}
                  >
                    Login to Review
                  </Button>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>

      {/* Trailer Modal */}
      <Modal show={showTrailer} onHide={() => setShowTrailer(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{movie.title} - Trailer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <p className="text-muted">Trailer functionality would be implemented here</p>
            <p>This could integrate with YouTube API or other video services</p>
          </div>
        </Modal.Body>
      </Modal>

      {/* Movie Search Modal */}
      <MovieSearch
        show={showMovieSearch}
        onHide={() => setShowMovieSearch(false)}
        onMovieSelect={(movie) => {
          // Handle movie selection if needed
          console.log('Selected movie:', movie);
        }}
        onImportMovie={handleMovieImport}
      />
    </div>
  );
}

export default MovieDetails;
