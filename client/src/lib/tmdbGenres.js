export const TMDB_GENRE_MAP = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

export const getGenreNames = (movie) => {
  // If full genre objects already exist
  if (movie?.genres?.length) {
    return movie.genres.map((genre) => genre.name);
  }

  // If only genre_ids exist
  if (movie?.genre_ids?.length) {
    return movie.genre_ids
      .map((id) => TMDB_GENRE_MAP[id])
      .filter(Boolean);
  }

  return [];
};