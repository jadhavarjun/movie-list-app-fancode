import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import "./App.css";
import { setGenres, setMoviesByYear, setSelectedGenres } from "./movieSlice";

const API_KEY = "2dca580c2a14b55200e784d157207b4d";

const App = () => {
  const dispatch = useDispatch();
  const { moviesByYear, genres, selectedGenres } = useSelector(
    (state) => state.movies
  );

  useEffect(() => {
    // Fetch genres
    axios
      .get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`)
      .then((response) => dispatch(setGenres(response.data.genres)))
      .catch((error) => console.error("Error fetching genres:", error));
  }, [dispatch]);

  useEffect(() => {
    // Fetch movies for each year based on selected genres
    const fetchMovies = async (year) => {
      const genreParams =
        selectedGenres.length > 0
          ? `&with_genres=${selectedGenres.join(",")}`
          : "";
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&primary_release_year=${year}${genreParams}&page=1&vote_count.gte=100`
        );
        dispatch(setMoviesByYear({ year, movies: response.data.results }));
      } catch (error) {
        console.error(`Error fetching movies for ${year}:`, error);
      }
    };

    // Fetch movies for each year from 2012 to the current year
    const currentYear = new Date().getFullYear();
    for (let year = 2012; year <= currentYear; year++) {
      fetchMovies(year);
    }
  }, [selectedGenres, dispatch]);

  const handleGenreClick = (genreId) => {
    // Toggle selected genres
    const updatedGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter((id) => id !== genreId)
      : [...selectedGenres, genreId];
    dispatch(setSelectedGenres(updatedGenres));
  };

  const isGenreSelected = (genreId) => selectedGenres.includes(genreId);

  return (
    <div className="parent-element">
      {" "}
      <div className="movie-logo">
        <h1 className="logo">Movies</h1>

        {/* Genre Filter */}
        <div>
          {genres.map((genre) => (
            <button
              key={genre.id}
              className={isGenreSelected(genre.id) ? "selected" : ""}
              onClick={() => handleGenreClick(genre.id)}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>
      {/* Movie List by Year */}
      {Object.entries(moviesByYear).map(([year, movies]) => (
        <div className="movie-wrap" key={year}>
          <h2 className="movie-year">{year}</h2>
          <div className="movie-list">
            {movies.map((movie) => (
              <div key={movie.id} className="movie-card">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />
                <div className="movie-info">
                  <h3>{movie.title}</h3>
                  <p>Genre: {movie.genre_ids.join(", ")}</p>
                  <p>Release Date: {movie.release_date}</p>{" "}
                  <p>Language: {movie.original_language}</p>{" "}
                  <p>{movie.overview}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
