import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import Loader from "./Loader";

const KEY = "a3214b72"

export default function MovieDetails({selectedId, watched, onCloseMovie, onAddWatched}){

    const [movie, setMovie] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [userRating, setUserRating] = useState("")
  
    const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);

    const watchedUserRating = watched.find(
      (movie) => movie.imdbID === selectedId
    )?.userRating

    const {
      Title: title,
      Year: year,
      Poster: poster,
      Runtime: runtime,
      imdbRating,
      Plot: plot,
      Released: released,
      Actors: actors,
      Director: director,
      Genre: genre 
    } = movie
  
    function handleAdd(){
      const newWatchedMovie = {
        imdbID: selectedId,
        title,
        year,
        poster,
        imdbRating: Number(imdbRating),
        runtime: Number(runtime.split(" ").at(0)),
        userRating
      }
  
      onAddWatched(newWatchedMovie)
      onCloseMovie()
  
    }
  
    useEffect(function(){
      async function getMoviedetails(){
  
        setIsLoading(true)
        const res = await fetch(`https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`)
      
        const data = await res.json()
        setMovie(data)
  
        setIsLoading(false)
      }
  
      getMoviedetails()
    }, [selectedId])
  
    return (
      <>
      {isLoading ? <Loader/> : 
        <div className="details">
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;    
            </button>
            <img src={poster} alt={`poster of ${movie} movie`}/>
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDB rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
            {isWatched ? 
                <p>You rated this movie {watchedUserRating}<span>⭐</span></p>
                :          
                <>
                  <StarRating maxRating={10} size={24} onSetRating={setUserRating}/>
                  <button className="btn-add" onClick={handleAdd}>+ Add to list</button>
                </> 
              }
            </div>  
            <p><em>{plot}</em></p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </div>
        }
      </>
    );
  }
  /*
                {userRating ? 
                <p>You rated this movie {userRating}⭐s</p>
                :          
                <>
                  <StarRating maxRating={10} size={24} onSetRating={setUserRating}/>
                  <button className="btn-add" onClick={handleAdd}>+ Add to list</button>
                </> 
              }
  */