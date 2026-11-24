const movies = [
  {
    id: 1,
    title: "Interstellar",
    genre: "Sci-Fi",
    year: 2014,
    rating: 8.7,
    desc: "A team travels through a wormhole to find humanity a new home.",
    img: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    title: "The Dark Knight",
    genre: "Action",
    year: 2008,
    rating: 9.0,
    desc: "Batman faces the Joker in a battle for Gotham's soul.",
    img: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    title: "La La Land",
    genre: "Romance",
    year: 2016,
    rating: 8.0,
    desc: "A jazz musician and actress fall in love while chasing dreams.",
    img: "https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    title: "Jumanji",
    genre: "Comedy",
    year: 2017,
    rating: 6.9,
    desc: "Friends enter a magical video game full of wild adventures.",
    img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    title: "A Quiet Place",
    genre: "Horror",
    year: 2018,
    rating: 7.5,
    desc: "A family survives in silence while monsters hunt by sound.",
    img: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    title: "Inception",
    genre: "Sci-Fi",
    year: 2010,
    rating: 8.8,
    desc: "A thief enters dreams to steal and plant ideas.",
    img: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=600&q=80"
  }
];

let currentGenre = "All";
let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
let selectedMovie = null;
let lightboxIndex = 0;

const $ = id => document.getElementById(id);

document.addEventListener("DOMContentLoaded", () => {
  $("loginForm").addEventListener("submit", loginUser);
  $("registerForm").addEventListener("submit", registerUser);
  $("contactForm").addEventListener("submit", validateContactForm);

  showMovies();
  showStatsTable();
  showWatchlist();
  showGallery();
  fetchWeather();

  window.addEventListener("scroll", () => {
    $("scrollTopBtn").classList.toggle("visible", window.scrollY > 400);
  });
});

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

function togglePass() {
  const pass = $("loginPassword");
  pass.type = pass.type === "password" ? "text" : "password";
}

function switchToRegister() {
  $("loginOverlay").style.display = "none";
  $("registerOverlay").style.display = "flex";
}

function switchToLogin() {
  $("registerOverlay").style.display = "none";
  $("loginOverlay").style.display = "flex";
}

function loginUser(e) {
  e.preventDefault();

  const email = $("loginEmail").value.trim();
  const password = $("loginPassword").value.trim();
  let valid = true;

  $("emailErr").textContent = "";
  $("passErr").textContent = "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    $("emailErr").textContent = "Enter a valid email.";
    valid = false;
  }

  if (password.length < 6) {
    $("passErr").textContent = "Password must be at least 6 characters.";
    valid = false;
  }

  if (!valid) return;

  $("loginOverlay").style.display = "none";
  $("mainApp").style.display = "block";
  $("userBadge").textContent = email.split("@")[0];
  showToast("Login successful!");
}

function registerUser(e) {
  e.preventDefault();

  const name = $("regName").value.trim();
  const email = $("regEmail").value.trim();
  const pass = $("regPassword").value.trim();
  const confirm = $("regConfirm").value.trim();

  $("regNameErr").textContent = "";
  $("regEmailErr").textContent = "";
  $("regPassErr").textContent = "";
  $("regConfErr").textContent = "";

  let valid = true;

  if (name.length < 3) {
    $("regNameErr").textContent = "Name must be at least 3 characters.";
    valid = false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    $("regEmailErr").textContent = "Enter a valid email.";
    valid = false;
  }

  if (pass.length < 6) {
    $("regPassErr").textContent = "Password must be at least 6 characters.";
    valid = false;
  }

  if (confirm !== pass) {
    $("regConfErr").textContent = "Passwords do not match.";
    valid = false;
  }

  if (!valid) return;

  showToast("Registration successful!");
  switchToLogin();
}

function logout() {
  $("mainApp").style.display = "none";
  $("loginOverlay").style.display = "flex";
  showToast("Logged out!");
}

function toggleTheme() {
  document.body.classList.toggle("light-mode");
  $("themeToggle").textContent = document.body.classList.contains("light-mode") ? "☀️" : "🌙";
}

function goToMovies() {
  $("movies").scrollIntoView({ behavior: "smooth" });
}

function goToWatchlist() {
  $("watchlist").scrollIntoView({ behavior: "smooth" });
}

function setGenre(genre, btn) {
  currentGenre = genre;
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  showMovies();
}

function showMovies() {
  const grid = $("movieGrid");
  const search = $("searchInput")?.value.toLowerCase() || "";
  const sort = $("sortSelect")?.value || "default";

  let filtered = movies.filter(movie => {
    const matchSearch = movie.title.toLowerCase().includes(search);
    const matchGenre = currentGenre === "All" || movie.genre === currentGenre;
    return matchSearch && matchGenre;
  });

  if (sort === "rating-desc") filtered.sort((a, b) => b.rating - a.rating);
  if (sort === "rating-asc") filtered.sort((a, b) => a.rating - b.rating);
  if (sort === "year-desc") filtered.sort((a, b) => b.year - a.year);
  if (sort === "year-asc") filtered.sort((a, b) => a.year - b.year);
  if (sort === "title-asc") filtered.sort((a, b) => a.title.localeCompare(b.title));

  $("resultsCount").textContent = `${filtered.length} movie(s) found`;

  grid.innerHTML = filtered.map(movie => `
    <article class="movie-card" role="listitem">
      <div class="poster" style="background-image:url('${movie.img}')">
        <span class="rating">⭐ ${movie.rating}</span>
        <div class="poster-hover-overlay">
          <p>${movie.desc}</p>
        </div>
      </div>
      <div class="movie-info">
        <h3>${movie.title}</h3>
        <p>${movie.genre} • ${movie.year}</p>
        <div class="card-buttons">
          <button class="small-btn details-btn" onclick="openModal(${movie.id})">Details</button>
          <button class="small-btn fav-btn ${isInWatchlist(movie.id) ? "added" : ""}" onclick="addToWatchlist(${movie.id})">
            ${isInWatchlist(movie.id) ? "✓ Added" : "+ Add"}
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

function openModal(id) {
  selectedMovie = movies.find(movie => movie.id === id);

  $("modalImage").style.backgroundImage = `url('${selectedMovie.img}')`;
  $("modalTitle").textContent = selectedMovie.title;
  $("modalMeta").textContent = `${selectedMovie.genre} • ${selectedMovie.year} • ⭐ ${selectedMovie.rating}`;
  $("modalDescription").textContent = selectedMovie.desc;
  $("modalWatchlistBtn").textContent = isInWatchlist(id) ? "✓ Already Added" : "+ Add to Watchlist";

  $("movieModal").classList.add("open");
}

function closeModal() {
  $("movieModal").classList.remove("open");
}

function addFromModal() {
  if (selectedMovie) addToWatchlist(selectedMovie.id);
}

function isInWatchlist(id) {
  return watchlist.some(movie => movie.id === id);
}

function addToWatchlist(id) {
  const movie = movies.find(m => m.id === id);

  if (isInWatchlist(id)) {
    showToast("Already in watchlist!");
    return;
  }

  watchlist.push(movie);
  localStorage.setItem("watchlist", JSON.stringify(watchlist));

  showToast(`${movie.title} added!`);
  showMovies();
  showStatsTable();
  showWatchlist();

  if (selectedMovie?.id === id) {
    $("modalWatchlistBtn").textContent = "✓ Already Added";
  }
}

function removeFromWatchlist(id) {
  watchlist = watchlist.filter(movie => movie.id !== id);
  localStorage.setItem("watchlist", JSON.stringify(watchlist));

  showToast("Removed from watchlist");
  showMovies();
  showStatsTable();
  showWatchlist();
}

function showWatchlist() {
  $("totalMovies").textContent = movies.length;
  $("totalGenres").textContent = new Set(movies.map(m => m.genre)).size;
  $("totalWatchlist").textContent = watchlist.length;

  if (watchlist.length === 0) {
    $("watchlistItems").innerHTML = `<p>Your watchlist is empty.</p>`;
    return;
  }

  $("watchlistItems").innerHTML = watchlist.map(movie => `
    <div class="watch-item" role="listitem">
      <button class="remove-btn" onclick="removeFromWatchlist(${movie.id})">×</button>
      <h3>${movie.title}</h3>
      <p>${movie.genre} • ${movie.year} • ⭐ ${movie.rating}</p>
    </div>
  `).join("");
}

function showStatsTable() {
  $("statsTableBody").innerHTML = movies.map((movie, index) => {
    const badgeClass = movie.rating >= 8 ? "badge-high" : movie.rating >= 7 ? "badge-mid" : "badge-low";

    return `
      <tr>
        <td>${index + 1}</td>
        <td>${movie.title}</td>
        <td>${movie.genre}</td>
        <td>${movie.year}</td>
        <td class="${badgeClass}">${movie.rating}</td>
        <td><button class="tbl-btn" onclick="openModal(${movie.id})">View</button></td>
      </tr>
    `;
  }).join("");
}

function showGallery() {
  $("galleryGrid").innerHTML = movies.map((movie, index) => `
    <div class="gallery-item" onclick="openLightbox(${index})">
      <img src="${movie.img}" alt="${movie.title}">
      <div class="gallery-caption">${movie.title}</div>
    </div>
  `).join("");
}

function openLightbox(index) {
  lightboxIndex = index;
  updateLightbox();
  $("lightbox").classList.add("open");
}

function updateLightbox() {
  $("lbImage").src = movies[lightboxIndex].img;
  $("lbCaption").textContent = movies[lightboxIndex].title;
}

function closeLightbox() {
  $("lightbox").classList.remove("open");
}

function lbNext() {
  lightboxIndex = (lightboxIndex + 1) % movies.length;
  updateLightbox();
}

function lbPrev() {
  lightboxIndex = (lightboxIndex - 1 + movies.length) % movies.length;
  updateLightbox();
}

function validateContactForm(e) {
  e.preventDefault();

  const name = $("cName").value.trim();
  const email = $("cEmail").value.trim();
  const subject = $("cSubject").value;
  const message = $("cMessage").value.trim();
  const agree = $("cAgree").checked;

  $("cNameErr").textContent = "";
  $("cEmailErr").textContent = "";
  $("cSubjectErr").textContent = "";
  $("cMsgErr").textContent = "";
  $("cAgreeErr").textContent = "";

  let valid = true;

  if (name.length < 3) {
    $("cNameErr").textContent = "Name must be at least 3 characters.";
    valid = false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    $("cEmailErr").textContent = "Enter a valid email.";
    valid = false;
  }

  if (!subject) {
    $("cSubjectErr").textContent = "Please choose a subject.";
    valid = false;
  }

  if (message.length < 10) {
    $("cMsgErr").textContent = "Message must be at least 10 characters.";
    valid = false;
  }

  if (!agree) {
    $("cAgreeErr").textContent = "You must agree before sending.";
    valid = false;
  }

  if (!valid) return;

  $("contactForm").style.display = "none";
  $("contactSuccess").style.display = "flex";
  showToast("Message sent successfully!");
}

async function fetchWeather() {
  try {
    const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=32.57&longitude=74.08&current_weather=true");
    const data = await res.json();

    const temp = data.current_weather.temperature;
    const wind = data.current_weather.windspeed;

    $("weatherIcon").textContent = "🌤️";
    $("weatherText").textContent = `Gujrat Weather: ${temp}°C`;
    $("weatherExtra").textContent = `Wind speed: ${wind} km/h`;
  } catch {
    $("weatherIcon").textContent = "⚠️";
    $("weatherText").textContent = "Weather API unavailable";
    $("weatherExtra").textContent = "Please check your internet connection.";
  }
}

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    closeModal();
    closeLightbox();
  }

  if ($("lightbox").classList.contains("open")) {
    if (e.key === "ArrowRight") lbNext();
    if (e.key === "ArrowLeft") lbPrev();
  }
});