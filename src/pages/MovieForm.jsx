import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";

function MovieForm() {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [genres, setGenres] = useState("");

  const { id } = useParams();
  const { director, directors, setDirectors } = useOutletContext();
  const navigate = useNavigate();

  if (!director) {
    return <h2>Director not found.</h2>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMovie = {
      id: uuidv4(),
      title,
      time: parseInt(time),
      genres: genres.split(",").map((genre) => genre.trim()),
    };

    const updatedMovies = [...director.movies, newMovie];

    fetch(`http://localhost:4000/directors/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ movies: updatedMovies }),
    })
      .then((r) => {
        if (!r.ok) {
          throw new Error("failed to add movie");
        }
        return r.json();
      })
      .then((data) => {
        // Update global context state so the new movie appears immediately
        const updatedDirectors = directors.map((d) =>
          d.id === director.id ? data : d,
        );
        setDirectors(updatedDirectors);

        navigate(`/directors/${id}/movies/${newMovie.id}`);
      })
      .catch(console.log);
  };

  return (
    <div>
      <h2>Add New Movie</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Movie Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Duration (minutes)"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Genres (comma-separated)"
          value={genres}
          onChange={(e) => setGenres(e.target.value)}
          required
        />
        <button type="submit">Add Movie</button>
      </form>
    </div>
  );
}

export default MovieForm;
