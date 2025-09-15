import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Tab, Tabs, Badge, Alert, Spinner, Modal } from "react-bootstrap";
import { FaStar, FaHeart, FaEdit, FaTrash, FaUser, FaCalendarAlt, FaFilm, FaThumbsUp, FaCog } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [userReviews, setUserReviews] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("reviews");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchUserData();
  }, [user, navigate]);

  useEffect(() => {
    // Listen for tab switch events from navbar
    const handleTabSwitch = (event) => {
      setActiveTab(event.detail);
    };

    window.addEventListener('switchTab', handleTabSwitch);
    return () => window.removeEventListener('switchTab', handleTabSwitch);
  }, []);

  const fetchUserData = async () => {
    try {
      // Fetch user's reviews
      const reviewsResponse = await fetch(`http://localhost:5000/api/reviews/user/${user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const reviewsData = await reviewsResponse.json();
      setUserReviews(reviewsData.reviews || reviewsData);

      // Fetch user's watchlist
      const watchlistResponse = await fetch(`http://localhost:5000/api/users/${user._id}/watchlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (watchlistResponse.ok) {
        const watchlistData = await watchlistResponse.json();
        setWatchlist(watchlistData.watchlist || watchlistData);
      } else {
        setWatchlist([]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditComment(review.comment || "");
    setShowEditModal(true);
  };

  const handleUpdateReview = async () => {
    if (!editingReview) return;

    try {
      const response = await fetch(`http://localhost:5000/api/reviews/${editingReview._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: editRating,
          comment: editComment,
        }),
      });

      if (response.ok) {
        const updatedReview = await response.json();
        setUserReviews(userReviews.map(review => 
          review._id === editingReview._id ? updatedReview : review
        ));
        setShowEditModal(false);
        setEditingReview(null);
        alert("Review updated successfully!");
      } else {
        alert("Error updating review");
      }
    } catch (error) {
      console.error("Error updating review:", error);
      alert("Error updating review");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setUserReviews(userReviews.filter(review => review._id !== reviewId));
          alert("Review deleted successfully!");
        } else {
          alert("Error deleting review");
        }
      } catch (error) {
        console.error("Error deleting review:", error);
        alert("Error deleting review");
      }
    }
  };

  const removeFromWatchlist = (movieId) => {
    setWatchlist(watchlist.filter(movie => movie._id !== movieId));
    // TODO: Implement actual watchlist removal API call
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className="star"
          style={{
            color: i <= rating ? "#ffd700" : "#ddd"
          }}
        />
      );
    }
    return stars;
  };

  const renderInteractiveStars = (rating, onStarClick) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className="star"
          style={{
            color: i <= rating ? "#ffd700" : "#ddd",
            cursor: "pointer"
          }}
          onClick={() => onStarClick(i)}
        />
      );
    }
    return stars;
  };

  const getStats = () => {
    const totalReviews = userReviews.length;
    const avgRating = totalReviews > 0 
      ? (userReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
      : 0;
    const totalMovies = watchlist.length;
    
    return { totalReviews, avgRating, totalMovies };
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  const stats = getStats();

  return (
    <Container className="py-4">
      {/* Profile Header */}
      <Row className="mb-5">
        <Col lg={4} className="text-center mb-4">
          <div className="profile-card">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=667eea&color=fff&size=200`}
              alt="Profile"
              className="profile-avatar mb-3"
            />
            <h2 className="mb-2">{user.username}</h2>
            <p className="text-muted mb-3">{user.email}</p>
            <div className="d-flex justify-content-center">
              <Button variant="outline-primary" className="btn-custom me-2">
                <FaCog className="me-2" />
                Settings
              </Button>
              <Button variant="outline-danger" className="btn-custom" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </Col>
        
        <Col lg={8}>
          <div className="profile-card">
            <h3 className="mb-4">Your Activity</h3>
            <Row>
              <Col md={4} className="text-center mb-3">
                <div className="p-3 bg-primary bg-opacity-10 rounded">
                  <FaStar className="text-primary fs-1 mb-2" />
                  <h4 className="mb-1">{stats.totalReviews}</h4>
                  <p className="text-muted mb-0">Reviews Written</p>
                </div>
              </Col>
              <Col md={4} className="text-center mb-3">
                <div className="p-3 bg-warning bg-opacity-10 rounded">
                  <FaThumbsUp className="text-warning fs-1 mb-2" />
                  <h4 className="mb-1">{stats.avgRating}</h4>
                  <p className="text-muted mb-0">Average Rating</p>
                </div>
              </Col>
              <Col md={4} className="text-center mb-3">
                <div className="p-3 bg-danger bg-opacity-10 rounded">
                  <FaHeart className="text-danger fs-1 mb-2" />
                  <h4 className="mb-1">{stats.totalMovies}</h4>
                  <p className="text-muted mb-0">Watchlist Items</p>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      {/* Tabs Section */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
        fill
      >
        <Tab eventKey="reviews" title={
          <span>
            <FaStar className="me-2" />
            My Reviews ({userReviews.length})
          </span>
        }>
          <div className="mt-4">
            {userReviews.length > 0 ? (
              <Row>
                {userReviews.map((review) => (
                  <Col key={review._id} lg={6} className="mb-4">
                    <Card className="review-card">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <h5 className="mb-1">{review.movie?.title || "Unknown Movie"}</h5>
                            <div className="star-rating mb-2">
                              {renderStars(review.rating)}
                            </div>
                            <small className="text-muted">
                              <FaCalendarAlt className="me-1" />
                              {new Date(review.createdAt).toLocaleDateString()}
                            </small>
                          </div>
                          <div className="d-flex gap-1">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleEditReview(review)}
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteReview(review._id)}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </div>
                        
                        {review.comment && (
                          <p className="mb-3">{review.comment}</p>
                        )}
                        
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => navigate(`/movies/${review.movie?._id}`)}
                        >
                          View Movie
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Alert variant="info" className="text-center py-5">
                <FaStar className="fs-1 mb-3 text-muted" />
                <h4>No reviews yet</h4>
                <p>Start reviewing movies to see them here!</p>
                <Button variant="primary" onClick={() => navigate("/movies")}>
                  Browse Movies
                </Button>
              </Alert>
            )}
          </div>
        </Tab>

        <Tab eventKey="watchlist" title={
          <span>
            <FaHeart className="me-2" />
            Watchlist ({watchlist.length})
          </span>
        }>
          <div className="mt-4">
            {watchlist.length > 0 ? (
              <Row>
                {watchlist.map((movie) => (
                  <Col key={movie._id} lg={6} className="mb-4">
                    <div className="watchlist-item">
                      <img
                        src={movie.posterUrl || `https://via.placeholder.com/80x120/667eea/ffffff?text=${encodeURIComponent(movie.title)}`}
                        alt={movie.title}
                        className="watchlist-poster"
                      />
                      <div className="flex-grow-1">
                        <h5 className="mb-1">{movie.title}</h5>
                        <p className="text-muted small mb-2">{movie.genre} • {movie.releaseYear}</p>
                        <div className="d-flex">
                          <Button
                            variant="primary"
                            size="sm"
                            className="me-2"
                            onClick={() => navigate(`/movies/${movie._id}`)}
                          >
                            View Details
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeFromWatchlist(movie._id)}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            ) : (
              <Alert variant="info" className="text-center py-5">
                <FaHeart className="fs-1 mb-3 text-muted" />
                <h4>Your watchlist is empty</h4>
                <p>Add movies to your watchlist to see them here!</p>
                <Button variant="primary" onClick={() => navigate("/movies")}>
                  Browse Movies
                </Button>
              </Alert>
            )}
          </div>
        </Tab>
      </Tabs>

      {/* Edit Review Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Rating</label>
            <div className="star-rating">
              {renderInteractiveStars(editRating, setEditRating)}
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Comment</label>
            <textarea
              className="form-control"
              rows={4}
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              placeholder="Share your thoughts about this movie..."
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateReview}>
            Update Review
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Profile;
