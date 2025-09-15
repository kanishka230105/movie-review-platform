# 🎬 Movie Review Platform

A comprehensive full-stack movie review platform built with React, Node.js, Express, and MongoDB. Features advanced UI/UX, state management with Redux, and integration with The Movie Database (TMDB) API.

## ✨ Features

### 🎯 Core Features
- **Movie Discovery**: Browse, search, and filter movies by genre, year, rating, and more
- **User Reviews**: Rate and review movies with detailed feedback
- **User Profiles**: Comprehensive user profiles with review history and watchlists
- **Watchlist Management**: Save movies to watch later
- **Trending Movies**: Discover popular and trending films
- **Advanced Search**: Powerful search with multiple filters and sorting options

### 🚀 Advanced Features
- **Redux State Management**: Centralized state management with Redux Toolkit
- **Real-time Notifications**: Toast notifications for user actions
- **Error Handling**: Comprehensive error boundaries and error handling
- **Performance Optimization**: Lazy loading, caching, and performance monitoring
- **Responsive Design**: Mobile-first responsive design with modern UI
- **TMDB Integration**: Rich movie data from The Movie Database
- **Authentication**: Secure JWT-based authentication
- **Admin Panel**: Admin-only movie management features

### 🎨 UI/UX Features
- **Modern Design**: Beautiful gradient backgrounds and smooth animations
- **Interactive Components**: Hover effects, transitions, and micro-interactions
- **Loading States**: Skeleton loaders and loading spinners
- **Dark Mode Support**: Automatic dark mode detection
- **Accessibility**: WCAG compliant with keyboard navigation
- **Mobile Optimized**: Touch-friendly interface for mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Redux Toolkit** - State management
- **React Router DOM** - Client-side routing
- **React Bootstrap** - UI components
- **React Icons** - Icon library
- **Axios** - HTTP client
- **Redux Persist** - State persistence

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### External APIs
- **The Movie Database (TMDB)** - Movie data and images

## 📁 Project Structure

```
movie-review-platform/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── movieController.js
│   │   ├── reviewController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── movie.js
│   │   ├── Review.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── movie.js
│   │   ├── review.js
│   │   └── user.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ErrorBoundary.js
│   │   │   ├── LoadingSpinner.js
│   │   │   ├── Navbar.js
│   │   │   ├── NotificationContainer.js
│   │   │   └── PrivateRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Movies.js
│   │   │   ├── MovieDetails.js
│   │   │   ├── Profile.js
│   │   │   ├── Register.js
│   │   │   └── Trending.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── performance.js
│   │   │   └── tmdb.js
│   │   ├── store/
│   │   │   ├── index.js
│   │   │   ├── hooks.js
│   │   │   └── slices/
│   │   │       ├── authSlice.js
│   │   │       ├── movieSlice.js
│   │   │       ├── reviewSlice.js
│   │   │       ├── uiSlice.js
│   │   │       └── userSlice.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- TMDB API key (optional, for enhanced movie data)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd movie-review-platform
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**
   
   Create a `.env` file in the backend directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/movie-review-platform
   JWT_SECRET=your-super-secret-jwt-key
   FRONTEND_URL=http://localhost:3000
   ```

   Create a `.env` file in the frontend directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_TMDB_API_KEY=your-tmdb-api-key
   ```

5. **Start MongoDB**
   ```bash
   mongod
   ```

6. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```

7. **Start the frontend development server**
   ```bash
   cd frontend
   npm start
   ```

8. **Open your browser**
   Navigate to `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Movie Endpoints
- `GET /api/movies` - Get all movies (with pagination and filtering)
- `GET /api/movies/:id` - Get movie by ID
- `POST /api/movies` - Create new movie (admin only)
- `PUT /api/movies/:id` - Update movie (admin only)
- `DELETE /api/movies/:id` - Delete movie (admin only)
- `GET /api/movies/trending` - Get trending movies
- `GET /api/movies/featured` - Get featured movies
- `GET /api/movies/genres` - Get available genres
- `GET /api/movies/years` - Get available years

### Review Endpoints
- `GET /api/reviews/movie/:id` - Get reviews for a movie
- `GET /api/reviews/user/:id` - Get reviews by user
- `GET /api/reviews/stats/:id` - Get review statistics
- `POST /api/reviews` - Create new review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### User Endpoints
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/:id/watchlist` - Get user watchlist
- `POST /api/users/:id/watchlist` - Add to watchlist
- `DELETE /api/users/:id/watchlist/:movieId` - Remove from watchlist
- `GET /api/users/:id/stats` - Get user statistics
- `GET /api/users/search` - Search users

## 🎨 UI Components

### Custom Components
- **ErrorBoundary**: Catches and displays JavaScript errors
- **LoadingSpinner**: Reusable loading component
- **NotificationContainer**: Toast notification system
- **PrivateRoute**: Protected route component

### Styled Components
- **Card Custom**: Enhanced card components with hover effects
- **Button Custom**: Gradient buttons with animations
- **Form Controls**: Styled form inputs and controls
- **Modal Custom**: Enhanced modal dialogs

## 🔧 Configuration

### Redux Store
The application uses Redux Toolkit for state management with the following slices:
- **authSlice**: User authentication and profile
- **movieSlice**: Movie data and filtering
- **reviewSlice**: Review data and statistics
- **userSlice**: User profiles and watchlists
- **uiSlice**: UI state and notifications

### Performance Optimization
- **Lazy Loading**: Images and components loaded on demand
- **Caching**: API response caching with TTL
- **Debouncing**: Search input debouncing
- **Memoization**: Expensive calculations memoized
- **Virtual Scrolling**: Large lists optimized

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Test Coverage
- Unit tests for Redux slices
- Component testing with React Testing Library
- API endpoint testing
- Integration tests

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Deploy to Heroku, Vercel, or AWS

### Frontend Deployment
1. Build the production bundle
2. Deploy to Netlify, Vercel, or AWS S3

### Environment Variables
Ensure all required environment variables are set in production:
- `MONGODB_URI`
- `JWT_SECRET`
- `NODE_ENV`
- `REACT_APP_API_URL`
- `REACT_APP_TMDB_API_KEY`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- The Movie Database (TMDB) for movie data
- React and Redux communities
- Bootstrap for UI components
- All contributors and users

## 📞 Support

For support, email support@moviereviewplatform.com or create an issue in the repository.

---

**Built with ❤️ by the Movie Review Platform Team**
#   m o v i e - r e v i e w - p l a t f o r m  
 