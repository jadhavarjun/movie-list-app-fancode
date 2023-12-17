import { createSlice } from "@reduxjs/toolkit";

const movieSlice = createSlice({
  name: "movies",
  initialState: {
    moviesByYear: {},
    genres: [],
    selectedGenres: [],
  },
  reducers: {
    setGenres: (state, action) => {
      state.genres = action.payload;
    },
    setMoviesByYear: (state, action) => {
      const { year, movies } = action.payload;
      state.moviesByYear[year] = movies;
    },
    setSelectedGenres: (state, action) => {
      state.selectedGenres = action.payload;
    },
  },
});

export const { setGenres, setMoviesByYear, setSelectedGenres } =
  movieSlice.actions;

export default movieSlice.reducer;
