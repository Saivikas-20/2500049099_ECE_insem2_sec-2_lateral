const API = "/api/movies";

const form = document.getElementById("movieForm");
const body = document.getElementById("movieBody");
const message = document.getElementById("message");
const searchInput = document.getElementById("search");
const emptyMsg = document.getElementById("empty");
const countEl = document.getElementById("count");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");

const fields = ["title", "genre", "releaseYear", "rating", "director"];
let movies = [];

function showMessage(text, ok = true) {
  message.textContent = text;
  message.className = ok ? "ok" : "err";
}

function resetForm() {
  form.reset();
  document.getElementById("movieId").value = "";
  formTitle.textContent = "Add a New Movie";
  submitBtn.textContent = "Add Movie";
  cancelBtn.hidden = true;
}

async function loadMovies() {
  const q = searchInput.value.trim();
  try {
    const res = await fetch(`${API}?q=${encodeURIComponent(q)}`);
    if (!res.ok) throw new Error("Failed to load movies");
    movies = await res.json();
    render();
  } catch (err) {
    showMessage(err.message, false);
  }
}

function render() {
  body.innerHTML = "";
  countEl.textContent = `(${movies.length})`;
  emptyMsg.hidden = movies.length > 0;

  movies.forEach((m) => {
    const tr = document.createElement("tr");
    [m.title, m.genre, m.releaseYear, m.rating, m.director].forEach((val) => {
      const td = document.createElement("td");
      td.textContent = val; // textContent prevents HTML injection
      tr.appendChild(td);
    });

    const actions = document.createElement("td");
    actions.className = "actions-cell";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "small";
    editBtn.onclick = () => startEdit(m);

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.className = "small danger";
    delBtn.onclick = () => deleteMovie(m);

    actions.append(editBtn, delBtn);
    tr.appendChild(actions);
    body.appendChild(tr);
  });
}

function startEdit(m) {
  document.getElementById("movieId").value = m._id;
  fields.forEach((f) => (document.getElementById(f).value = m[f]));
  formTitle.textContent = "Update Movie";
  submitBtn.textContent = "Save Changes";
  cancelBtn.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deleteMovie(m) {
  if (!confirm(`Delete "${m.title}"?`)) return;
  try {
    const res = await fetch(`${API}/${m._id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    showMessage("Movie deleted.");
    loadMovies();
  } catch (err) {
    showMessage(err.message, false);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("movieId").value;
  const payload = {};
  fields.forEach((f) => (payload[f] = document.getElementById(f).value));

  try {
    const res = await fetch(id ? `${API}/${id}` : API, {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    showMessage(id ? "Movie updated." : "Movie added.");
    resetForm();
    loadMovies();
  } catch (err) {
    showMessage(err.message, false);
  }
});

cancelBtn.addEventListener("click", () => {
  resetForm();
  showMessage("");
});

let timer;
searchInput.addEventListener("input", () => {
  clearTimeout(timer);
  timer = setTimeout(loadMovies, 250); // debounce
});

loadMovies();
