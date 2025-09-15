import React, { useState } from 'react';
import { Card, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { FaStar, FaThumbsUp, FaEdit, FaTrash } from 'react-icons/fa';

const ReviewForm = ({ 
  movieId, 
  user, 
  userReview, 
  onSubmit, 
  onUpdate, 
  onDelete, 
  submitting = false 
}) => {
  const [rating, setRating] = useState(userReview?.rating || 5);
  const [comment, setComment] = useState(userReview?.comment || '');
  const [title, setTitle] = useState(userReview?.title || '');
  const [tags, setTags] = useState(userReview?.tags?.join(', ') || '');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      alert('Please write a comment for your review');
      return;
    }

    const reviewData = {
      rating,
      comment: comment.trim(),
      title: title.trim() || null,
      tags: tags.trim() ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
    };

    if (userReview) {
      onUpdate(userReview._id, reviewData);
    } else {
      onSubmit(reviewData);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete your review?')) {
      onDelete(userReview._id);
    }
  };

  const renderStars = (currentRating, interactive = true) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`star ${interactive ? 'interactive' : ''}`}
          style={{
            color: i <= currentRating ? "#ffd700" : "#ddd",
            cursor: interactive ? "pointer" : "default",
            fontSize: "1.5rem",
            marginRight: "0.25rem"
          }}
          onClick={interactive ? () => setRating(i) : undefined}
        />
      );
    }
    return stars;
  };

  const getRatingText = (rating) => {
    const texts = {
      1: "Terrible",
      2: "Poor", 
      3: "Average",
      4: "Good",
      5: "Excellent"
    };
    return texts[rating] || "";
  };

  return (
    <Card className="review-form-card">
      <Card.Header className="bg-transparent border-0">
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">
            {userReview ? 'Edit Your Review' : 'Write a Review'}
          </h4>
          {userReview && (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleDelete}
              className="d-flex align-items-center"
            >
              <FaTrash className="me-1" />
              Delete
            </Button>
          )}
        </div>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          {/* Rating Section */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">Your Rating</Form.Label>
            <div className="rating-section">
              <div className="star-rating mb-2">
                {renderStars(rating)}
              </div>
              <div className="rating-text">
                <span className="fw-bold text-primary">{rating}/5</span>
                <span className="text-muted ms-2">- {getRatingText(rating)}</span>
              </div>
            </div>
          </Form.Group>

          {/* Review Title */}
          <Form.Group className="mb-3">
            <Form.Label>Review Title (Optional)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Give your review a catchy title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />
            <Form.Text className="text-muted">
              {title.length}/100 characters
            </Form.Text>
          </Form.Group>

          {/* Review Comment */}
          <Form.Group className="mb-3">
            <Form.Label>Your Review</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Share your detailed thoughts about this movie..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={1000}
              required
            />
            <Form.Text className="text-muted">
              {comment.length}/1000 characters
            </Form.Text>
          </Form.Group>

          {/* Advanced Options */}
          <div className="mb-3">
            <Button
              variant="link"
              className="p-0 text-decoration-none"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced Options
            </Button>
          </div>

          {showAdvanced && (
            <Form.Group className="mb-3">
              <Form.Label>Tags (Optional)</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., Great Acting, Amazing Visuals, Thought Provoking"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <Form.Text className="text-muted">
                Separate tags with commas
              </Form.Text>
            </Form.Group>
          )}

          {/* Submit Buttons */}
          <div className="d-grid gap-2">
            <Button 
              type="submit" 
              variant="primary" 
              size="lg"
              disabled={submitting || !comment.trim()}
              className="btn-custom btn-primary-custom"
            >
              {submitting ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  {userReview ? 'Updating...' : 'Submitting...'}
                </>
              ) : (
                <>
                  {userReview ? (
                    <>
                      <FaEdit className="me-2" />
                      Update Review
                    </>
                  ) : (
                    <>
                      <FaThumbsUp className="me-2" />
                      Submit Review
                    </>
                  )}
                </>
              )}
            </Button>
          </div>
        </Form>

        {/* Review Guidelines */}
        <div className="mt-4 p-3 bg-light rounded">
          <h6 className="mb-2">Review Guidelines:</h6>
          <ul className="mb-0 small text-muted">
            <li>Be respectful and constructive in your feedback</li>
            <li>Share specific details about what you liked or disliked</li>
            <li>Avoid spoilers or use spoiler tags if necessary</li>
            <li>Your review helps other movie lovers make informed decisions</li>
          </ul>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ReviewForm;
