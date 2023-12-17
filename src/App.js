import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // Make sure to import the CSS file

const API_KEY = "2dca580c2a14b55200e784d157207b4d";

const App = () => {
  const [moviesByYear, setMoviesByYear] = useState({});
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);

  useEffect(() => {
    // Fetch genres
    axios
      .get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`)
      .then((response) => setGenres(response.data.genres))
      .catch((error) => console.error("Error fetching genres:", error));
  }, []);

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
        setMoviesByYear((prevMovies) => ({
          ...prevMovies,
          [year]: response.data.results,
        }));
      } catch (error) {
        console.error(`Error fetching movies for ${year}:`, error);
      }
    };

    // Fetch movies for each year from 2012 to the current year
    const currentYear = new Date().getFullYear();
    for (let year = 2012; year <= currentYear; year++) {
      fetchMovies(year);
    }
  }, [selectedGenres]);

  const handleGenreClick = (genreId) => {
    // Toggle selected genres
    const updatedGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter((id) => id !== genreId)
      : [...selectedGenres, genreId];
    setSelectedGenres(updatedGenres);
  };

  const isGenreSelected = (genreId) => selectedGenres.includes(genreId);

  return (
    <div className="parent-element">
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
                  {/* Replace with actual cast data */}
                  <p>Language: {movie.original_language}</p>{" "}
                  {/* Replace with actual director data */}
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
