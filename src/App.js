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

const KEY = process.env.REACT_APP_API_KEY

export default function App() {

  const [movies, setMovies] = useState([]);
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
    setWatched(watched => watched.filter((movie) => movie.imdbID!==id));
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