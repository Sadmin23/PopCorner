import { useEffect, useState } from "react";
import Navbar from "./Navbar"
import Loader from "./Loader";
import Logo from "./Logo";
import Result from "./Result";
import Search from "./Search";
import Main from "./Main";
import ErrorMessage from "./ErrorMessage"
import Box from "./Box";
import MovieList from "./MovieList";
import MovieDetails from "./MovieDetails"
import WatchedList from "./WatchedList";
import WatchedSummary from "./WatchedSummary";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const KEY = "a3214b72"

export default function App() {

  const [movies, setMovies] = useState(tempMovieData);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null)

  function handleSelectMovie(id){
    setSelectedId((selectedId) => id===selectedId? null : id )
  }

  function handleCloseMovie(){
    setSelectedId(null)
  }

  function handleAddWatched(movie){
    setWatched((watched)=>[...watched, movie])
  }

  function handleDeleteWatched(id){

    console.log(id);

    setWatched(watched => watched.filter((movie) => movie.imdbID!==id));

    console.log(watched);
  }

  useEffect(function () {
    async function fetchMovies() {

      try {
        setIsLoading(true)
        setError("");

        const res = await fetch(`https://www.omdbapi.com/?apikey=${KEY}&s=${query}`);
        
        if (!res.ok)
          throw new Error("Something went wrong with fetching movies");
        
        const data = await res.json();

        if (data.Response === 'False')
          throw new Error("Movie not found");

        setMovies(data.Search);
        setIsLoading(false);
      } catch(err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    if (query.length < 3){
      setMovies([]);
      setError("");
      return;
    }

    fetchMovies();

  }, [query])

  return (
    <>
      <Navbar>
        <Logo/>
        <Search query={query} setQuery={setQuery}/>
        <Result movies={movies}/>
      </Navbar>
      <Main>
        <Box>
          {isLoading ? 
            <Loader/> 
            : 
            error!==''? 
            <ErrorMessage message={error}/> 
            : 
            <MovieList 
              movies={movies} 
              onSelectMovie={handleSelectMovie}
            />
          }
        </Box>
        <Box>{selectedId ? 
          <MovieDetails 
            selectedId={selectedId}
            watched={watched}
            onCloseMovie={handleCloseMovie}
            onAddWatched={handleAddWatched}
          /> 
          :
          <>
            <WatchedSummary watched={watched}/>
            <WatchedList 
              watched={watched}
              onDeleteWatched={handleDeleteWatched}
            />
          </>
          }
        </Box>
      </Main>
    </>
  );
}