import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Reviews = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: "", comment: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Fetch movies (to pick one for review)
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/movies", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setMovies(data);
        else setError(data.message || "Failed to fetch movies");
      } catch {
        setError("Error fetching movies");
      }
    };

    if (token) fetchMovies();
  }, [token]);

  // Fetch reviews for a movie
  const fetchReviews = async (movieId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/reviews/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setReviews(data);
      else setError(data.message || "Failed to fetch reviews");
    } catch {
      setError("Error fetching reviews");
    }
  };

  // Add new review
  const handleAddReview = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          movieId: selectedMovie,
          rating: newReview.rating,
          comment: newReview.comment,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setReviews([...reviews, data]);
        setNewReview({ rating: "", comment: "" });
      } else {
        setError(data.message || "Failed to add review");
      }
    } catch {
      setError("Error adding review");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Movie Reviews</h2>
      {error && <p style={styles.error}>{error}</p>}

      {/* Select movie */}
      <select
        value={selectedMovie}
        onChange={(e) => {
          setSelectedMovie(e.target.value);
          fetchReviews(e.target.value);
        }}
        style={styles.select}
      >
        <option value="">-- Select a movie --</option>
        {movies.map((movie) => (
          <option key={movie._id} value={movie._id}>
            {movie.title}
          </option>
        ))}
      </select>

      {/* Add review form */}
      {selectedMovie && (
        <form onSubmit={handleAddReview} style={styles.form}>
          <input
            type="number"
            placeholder="Rating (1-5)"
            value={newReview.rating}
            onChange={(e) =>
              setNewReview({ ...newReview, rating: e.target.value })
            }
            min="1"
            max="5"
            required
            style={styles.input}
          />
          <textarea
            placeholder="Comment"
            value={newReview.comment}
            onChange={(e) =>
              setNewReview({ ...newReview, comment: e.target.value })
            }
            required
            style={styles.textarea}
          />
          <button type="submit" style={styles.button}>Add Review</button>
        </form>
      )}

      {/* Show reviews */}
      <ul style={styles.list}>
        {reviews.map((review) => (
          <li key={review._id} style={styles.reviewCard}>
            <p><strong>Rating:</strong> {review.rating} ⭐</p>
            <p>{review.comment}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: { maxWidth: "600px", margin: "50px auto", textAlign: "center" },
  select: { margin: "10px", padding: "10px", fontSize: "16px" },
  form: { display: "flex", flexDirection: "column", marginTop: "20px" },
  input: { margin: "8px 0", padding: "10px", fontSize: "16px" },
  textarea: { margin: "8px 0", padding: "10px", fontSize: "16px", minHeight: "80px" },
  button: {
    padding: "10px",
    fontSize: "16px",
    background: "#222",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  list: { listStyle: "none", padding: 0, marginTop: "20px" },
  reviewCard: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "15px",
    margin: "10px 0",
    textAlign: "left",
  },
  error: { color: "red" },
};

export default Reviews;
