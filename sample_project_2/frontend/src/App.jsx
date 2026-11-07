import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowDownUp, BookOpen, Check, ChevronDown, CirclePlus, Command, LoaderCircle,
  LogOut, Search, SlidersHorizontal, Sparkles, Star, Trash2, X,
} from "lucide-react";
import { apiRequest } from "./api.js";

const genres = [
  "Fiction", "Fantasy", "Science fiction", "Mystery", "Romance", "Thriller",
  "Historical fiction", "Literary fiction", "Non-fiction", "Biography", "Poetry", "Other",
];
const emptyBook = { title: "", author: "", genre: "", rating: 5, review: "" };

function AuthScreen({ onAuthenticated }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const result = await apiRequest(`/api/auth/${isRegister ? "register" : "login"}`, {
        method: "POST",
        body: JSON.stringify(form),
      });
      onAuthenticated(result);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <a className="wordmark auth-wordmark" href="#"><span className="brand-icon"><BookOpen size={17} /></span> margin</a>
      <div className="auth-layout">
        <section className="auth-intro">
          <div className="eyebrow"><span className="eyebrow-dot" /> A HOME FOR YOUR READING LIFE</div>
          <h1>Books leave a little<br />of themselves <em>with us.</em></h1>
          <p>Keep the stories you’ve loved, the ones you’re still thinking about, and every note in between.</p>
          <div className="auth-note"><span className="note-line" /> A catalogue that’s entirely yours.</div>
          <div className="auth-cover" aria-hidden="true">
            <div className="cover-orbit orbit-one" /><div className="cover-orbit orbit-two" />
            <div className="cover-book"><span className="cover-label">YOUR READING LIFE</span><BookOpen size={38} strokeWidth={1.1} /><span className="cover-title">The stories<br />we keep</span><span className="cover-author">A PERSONAL ARCHIVE</span></div>
            <div className="cover-caption">VOL. 01 &nbsp;·&nbsp; EST. TODAY</div>
          </div>
        </section>
        <section className="auth-card">
          <div className="auth-card-top"><span className="tiny-mark"><Sparkles size={16} /></span><span>YOUR LITTLE CORNER OF THE INTERNET</span></div>
          <h2>{isRegister ? "Start your story." : "Welcome back."}</h2>
          <p className="form-subtitle">{isRegister ? "Create an account to begin your personal book catalogue." : "Sign in to pick up right where you left off."}</p>
          <form onSubmit={submit} className="auth-form">
            {isRegister && <label>Your name<input autoComplete="name" required maxLength={100} placeholder="What should we call you?" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>}
            <label>Email address<input type="email" autoComplete="email" required placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
            <label>Password<input type="password" autoComplete={isRegister ? "new-password" : "current-password"} required minLength={isRegister ? 8 : 1} placeholder={isRegister ? "At least 8 characters" : "Your password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
            {error && <div className="form-error" role="alert">{error}</div>}
            <button className="button button-dark full-button" type="submit" disabled={busy}>{busy ? <LoaderCircle className="spin" size={17} /> : null}{isRegister ? "Create your account" : "Sign in"} <span className="button-arrow">↗</span></button>
          </form>
          <div className="auth-toggle">{isRegister ? "Already have an account?" : "New around here?"} <button type="button" onClick={() => { setIsRegister(!isRegister); setError(""); }}> {isRegister ? "Sign in" : "Create an account"}</button></div>
          <div className="privacy-note"><Check size={14} /> Your catalogue is private, always.</div>
        </section>
      </div>
      <footer className="auth-footer"><span>© 2025 MARGIN READING CLUB</span><span>MADE FOR THE LOVE OF A GOOD BOOK</span></footer>
    </main>
  );
}

function BookForm({ initialBook, onSave, onClose, busy, error }) {
  const [form, setForm] = useState(initialBook || emptyBook);
  const [customGenre, setCustomGenre] = useState(initialBook && !genres.includes(initialBook.genre));
  const selectedGenre = customGenre ? "Other" : form.genre;

  function setField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function submit(event) {
    event.preventDefault();
    onSave({ ...form, genre: selectedGenre === "Other" && customGenre ? form.genre : selectedGenre });
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="book-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-heading"><div><div className="eyebrow"><span className="eyebrow-dot" /> YOUR PERSONAL ARCHIVE</div><h2 id="modal-title">{initialBook ? "Edit this entry" : "Add a new book"}</h2></div><button className="icon-button close-button" aria-label="Close dialog" onClick={onClose}><X size={19} /></button></div>
        <p className="form-subtitle">A few details, and a thought or two to remember it by.</p>
        <form className="book-form" onSubmit={submit}>
          <label>Book title<input autoFocus required maxLength={200} placeholder="The book’s name" value={form.title} onChange={(e) => setField("title", e.target.value)} /></label>
          <div className="form-row">
            <label>Author<input required maxLength={160} placeholder="Who wrote it?" value={form.author} onChange={(e) => setField("author", e.target.value)} /></label>
            <label>Genre<select required value={selectedGenre} onChange={(e) => { setCustomGenre(e.target.value === "Other"); setField("genre", e.target.value === "Other" ? "" : e.target.value); }}><option value="" disabled>Choose a genre</option>{genres.map((genre) => <option key={genre}>{genre}</option>)}</select></label>
          </div>
          {customGenre && <label>Your genre<input required maxLength={80} placeholder="Add a genre" value={form.genre} onChange={(e) => setField("genre", e.target.value)} /></label>}
          <fieldset className="rating-field"><legend>Your rating</legend><div className="star-picker" role="radiogroup" aria-label="Rating out of five">{[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" role="radio" aria-checked={form.rating === value} aria-label={`${value} star${value === 1 ? "" : "s"}`} className={value <= form.rating ? "star active" : "star"} onClick={() => setField("rating", value)}><Star size={23} fill="currentColor" /></button>)}<span>{["", "Didn’t click", "It was okay", "A good read", "Loved it", "One to keep"][form.rating]}</span></div></fieldset>
          <label>Your notes <span className="optional">OPTIONAL</span><textarea rows="4" maxLength={5000} placeholder="What stayed with you after the last page?" value={form.review} onChange={(e) => setField("review", e.target.value)} /></label>
          {error && <div className="form-error" role="alert">{error}</div>}
          <div className="modal-actions"><button type="button" className="button button-light" onClick={onClose}>Cancel</button><button type="submit" className="button button-dark" disabled={busy}>{busy ? <LoaderCircle className="spin" size={16} /> : <Check size={16} />}{initialBook ? "Save changes" : "Add to my shelf"}</button></div>
        </form>
      </section>
    </div>
  );
}

function BookCard({ book, index, onEdit, onDelete }) {
  const palette = ["#ffe36e", "#ffa6ca", "#95e6d3", "#ffae91", "#a9b5ff", "#c5ec8e"];
  return (
    <article className="book-card" style={{ "--card-accent": palette[index % palette.length], "--card-index": index }}>
      <div className="book-art">
        <div className="art-top"><span>{String(index + 1).padStart(2, "0")} &nbsp; / &nbsp; SHELF</span><span className="art-spark">✳</span></div>
        <div className="book-spine"><span className="spine-mark">M.</span><span className="spine-title">{book.title}</span><span className="spine-author">{book.author}</span></div>
        <div className="art-bottom"><span>{book.genre.toUpperCase()}</span><span className="art-small-mark">MARGIN&nbsp; · &nbsp;READING CLUB</span></div>
      </div>
      <div className="book-info">
        <div className="book-info-heading"><div><span className="genre-pill">{book.genre}</span><h3>{book.title}</h3><p className="author-line">by {book.author}</p></div><div className="book-menu"><button className="icon-button" aria-label={`Edit ${book.title}`} onClick={() => onEdit(book)}><SlidersHorizontal size={15} /></button><button className="icon-button delete-button" aria-label={`Delete ${book.title}`} onClick={() => onDelete(book)}><Trash2 size={15} /></button></div></div>
        <div className="book-rating">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={12} fill={star <= book.rating ? "currentColor" : "none"} />)}<span>{book.rating}.0</span></div>
        {book.review ? <p className="book-review">“{book.review}”</p> : <p className="empty-review">No notes yet. Edit to add a thought.</p>}
      </div>
    </article>
  );
}

function App() {
  const [session, setSession] = useState(() => {
    try { return JSON.parse(localStorage.getItem("margin-session") || "null"); } catch { return null; }
  });
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(Boolean(session));
  const [pageError, setPageError] = useState("");
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("All books");
  const [sortOrder, setSortOrder] = useState("recent");

  function signIn(data) {
    localStorage.setItem("margin-session", JSON.stringify(data));
    setSession(data);
  }

  function signOut() {
    localStorage.removeItem("margin-session");
    setSession(null);
    setBooks([]);
  }

  async function loadBooks() {
    if (!session?.access_token) return;
    setLoading(true);
    setPageError("");
    try {
      setBooks(await apiRequest("/api/books", { token: session.access_token }));
    } catch (error) {
      if (error.message.includes("session") || error.message.includes("account")) signOut();
      else setPageError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadBooks(); }, [session?.access_token]);

  const visibleBooks = useMemo(() => {
    const term = search.trim().toLowerCase();
    return books.filter((book) => {
      const matchesGenre = genreFilter === "All books" || book.genre === genreFilter;
      const matchesTerm = !term || `${book.title} ${book.author} ${book.genre} ${book.review}`.toLowerCase().includes(term);
      return matchesGenre && matchesTerm;
    }).sort((a, b) => sortOrder === "rating" ? b.rating - a.rating : sortOrder === "title" ? a.title.localeCompare(b.title) : new Date(b.created_at) - new Date(a.created_at));
  }, [books, genreFilter, search, sortOrder]);

  async function saveBook(payload) {
    setSaving(true);
    setModalError("");
    try {
      const isEditing = Boolean(modal.book);
      const saved = await apiRequest(isEditing ? `/api/books/${modal.book.id}` : "/api/books", {
        method: isEditing ? "PUT" : "POST",
        token: session.access_token,
        body: JSON.stringify(payload),
      });
      setBooks((current) => isEditing ? current.map((book) => book.id === saved.id ? saved : book) : [saved, ...current]);
      setModal(null);
    } catch (error) {
      setModalError(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteBook(book) {
    if (!window.confirm(`Remove “${book.title}” from your catalogue?`)) return;
    try {
      await apiRequest(`/api/books/${book.id}`, { method: "DELETE", token: session.access_token });
      setBooks((current) => current.filter((entry) => entry.id !== book.id));
    } catch (error) {
      setPageError(error.message);
    }
  }

  if (!session) return <AuthScreen onAuthenticated={signIn} />;

  const firstName = session.user?.name?.trim().split(/\s+/)[0] || "Reader";
  const shelfGenres = [...new Set(books.map((book) => book.genre))].sort();
  const averageRating = books.length ? (books.reduce((sum, book) => sum + book.rating, 0) / books.length).toFixed(1) : "—";

  return (
    <div className="app-shell reading-app">
      <header className="site-header">
        <a className="wordmark" href="#"><span className="brand-icon"><BookOpen size={17} /></span> margin</a>
        <nav className="header-links" aria-label="Main navigation">
          <a className="header-link active" href="#my-shelf">My shelf</a>
          <a className="header-link" href="#my-shelf">My reviews</a>
        </nav>
        <div className="header-account">
          <span className="private-label"><span /> PRIVATE CLUB</span>
          <div className="avatar">{firstName.slice(0, 1).toUpperCase()}</div>
          <span className="account-name">{firstName}</span>
          <button className="icon-button signout" title="Sign out" aria-label="Sign out" onClick={signOut}><LogOut size={16} /></button>
          <button className="button button-dark header-add" onClick={() => { setModal({ book: null }); setModalError(""); }}><CirclePlus size={16} /> Add a book</button>
        </div>
      </header>
      <main className="main-content">
        <section className="welcome-section">
          <div className="welcome-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> YOUR PERSONAL LIBRARY</div>
            <h1>Hey {firstName},<br />what are we <em>reading?</em></h1>
            <p>A growing record of the books you have read and the thoughts worth keeping.</p>
            <button className="button button-dark hero-add" onClick={() => { setModal({ book: null }); setModalError(""); }}><CirclePlus size={17} /> Add to my shelf <span className="button-arrow">↗</span></button>
          </div>
          <div className="welcome-illustration" aria-hidden="true"><div className="sun-disc" /><div className="illustration-book book-back" /><div className="illustration-book book-middle" /><div className="illustration-book book-front"><span>M.</span></div><div className="illustration-spark">✳</div><div className="illustration-caption">YOUR NEXT<br />FAVOURITE READ?</div></div>
          <div className="hero-sticker" aria-hidden="true"><Sparkles size={19} /><span>READ<br />YOUR<br />WAY</span></div>
        </section>
        <section className="stats-row" aria-label="Reading stats">
          <div className="stat"><span>BOOKS COLLECTED</span><strong>{String(books.length).padStart(2, "0")}</strong></div>
          <div className="stat"><span>GENRES TRIED</span><strong>{String(shelfGenres.length).padStart(2, "0")}</strong></div>
          <div className="stat"><span>AVERAGE RATING</span><strong>{averageRating}<small>{books.length ? " / 5" : ""}</small></strong></div>
          <div className="stats-decoration">GOOD BOOKS.<br />GREAT YOU. <span>✳</span></div>
        </section>
        <section className="catalogue-section" id="my-shelf">
          <div className="section-heading">
            <div><div className="eyebrow"><span className="eyebrow-dot" /> YOUR PERSONAL COLLECTION</div><h2>Your bookshelf <span>{books.length} books</span></h2></div>
            <button className="mobile-add button button-dark" onClick={() => { setModal({ book: null }); setModalError(""); }}><CirclePlus size={16} /> Add a book</button>
          </div>
          <div className="genre-chips" aria-label="Filter by genre">
            <button className={`genre-chip ${genreFilter === "All books" ? "selected" : ""}`} onClick={() => setGenreFilter("All books")}>All books <span>{books.length}</span></button>
            {shelfGenres.map((genre, index) => <button key={genre} className={`genre-chip ${genreFilter === genre ? "selected" : ""}`} onClick={() => setGenreFilter(genre)}><span className={`genre-dot dot-${index % 5}`} />{genre}</button>)}
          </div>
          <div className="catalogue-toolbar">
            <div className="filter-tabs"><button className="filter-tab muted-tab" onClick={() => setSortOrder((current) => current === "recent" ? "rating" : current === "rating" ? "title" : "recent")}><ArrowDownUp size={13} /> Sort: {sortOrder === "recent" ? "Recently added" : sortOrder === "rating" ? "Top rated" : "A to Z"}</button><span className="result-count">{visibleBooks.length} books</span></div>
            <label className="search-box"><Search size={16} /><input placeholder="Search titles, authors, notes..." value={search} onChange={(e) => setSearch(e.target.value)} /><span><Command size={10} /> K</span></label>
          </div>
          {pageError && <div className="page-error" role="alert">{pageError}<button onClick={() => setPageError("")} aria-label="Dismiss error"><X size={15} /></button></div>}
          {loading ? <div className="loading-state"><LoaderCircle className="spin" size={23} /><span>Opening your shelf…</span></div> : visibleBooks.length ? <div className="book-grid">{visibleBooks.map((book, index) => <BookCard key={book.id} book={book} index={index} onEdit={(selected) => { setModal({ book: selected }); setModalError(""); }} onDelete={deleteBook} />)}</div> : books.length ? <div className="empty-state"><Search size={22} /><h3>No books found</h3><p>Try a different search or shelf.</p><button className="text-button" onClick={() => { setSearch(""); setGenreFilter("All books"); }}>Clear filters <ChevronDown size={14} /></button></div> : <div className="empty-state"><div className="empty-book-icon"><BookOpen size={24} /></div><h3>Your shelf is waiting.</h3><p>Add the first book you’d like to remember. This space is yours.</p><button className="button button-dark" onClick={() => { setModal({ book: null }); setModalError(""); }}><CirclePlus size={16} /> Add your first book</button></div>}
          <div className="shelf-footer"><span>SHOWING {visibleBooks.length} OF {books.length} BOOKS</span><span>KEEP TURNING PAGES. &nbsp; ✳</span></div>
        </section>
        <footer className="main-footer"><span>© 2025 MARGIN READING CLUB</span><span>MADE FOR THE LOVE OF A GOOD BOOK <BookOpen size={13} /></span></footer>
      </main>
      {modal && <BookForm key={modal.book?.id || "new"} initialBook={modal.book} onSave={saveBook} onClose={() => setModal(null)} busy={saving} error={modalError} />}
    </div>
  );
}

export default App;
