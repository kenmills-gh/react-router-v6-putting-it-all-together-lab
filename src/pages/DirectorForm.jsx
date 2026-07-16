import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

function DirectorForm() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  const navigate = useNavigate();
  const { directors, setDirectors } = useOutletContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newDirector = { name, bio, movies: [] };
    fetch("http://localhost:4000/directors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newDirector),
    })
      .then((r) => {
        if (!r.ok) {
          throw new Error("failed to add director");
        }
        return r.json();
      })
      .then((data) => {
        // Update state and navigate to the new director's page
        setDirectors([...directors, data]);
        navigate(`/directors/${data.id}`);
      })
      .catch(console.log);
  };

  return (
    <div>
      <h2>Add New Director</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Director's Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Director's Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          required
        />
        <button type="submit">Add Director</button>
      </form>
    </div>
  );
}

export default DirectorForm;
