import React, { useState, useEffect } from 'react';
import api from '../api';
import BookForm from './BookForm';
import { useAuth } from '../AuthContext';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [genres, setGenres] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { currentUser } = useAuth();

  // Fetch books and genres on mount
  useEffect(() => {
    fetchBooks();
    fetchGenres();
  }, []);

  // Re-filter books whenever filters or books change
  useEffect(() => {
    filterBooks();
  }, [books, searchTerm, genreFilter, availabilityFilter]);

  const fetchBooks = async () => {
    try {
      const response = await api.get('/library/books/');
      const data = Array.isArray(response.data) ? response.data : response.data.results || [];
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
      setBooks([]);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await api.get('/library/genres/');
      const data = Array.isArray(response.data) ? response.data : response.data.results || [];
      setGenres(data);
    } catch (error) {
      console.error('Error fetching genres:', error);
      setGenres([]);
    }
  };

  const filterBooks = () => {
    let filtered = books;

    if (searchTerm) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (genreFilter) {
      filtered = filtered.filter(book => book.genre === parseInt(genreFilter));
    }

    if (availabilityFilter) {
      const available = availabilityFilter === 'available';
      filtered = filtered.filter(book => book.available === available);
    }

    setFilteredBooks(filtered);
  };

const handleIssueBook = async (bookId) => {
  try {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 2 weeks from now
    
    // For members, we don't need to send user ID - backend will handle it
    const payload = {
      book: bookId,
      due_date: dueDate.toISOString()
    };
    
    await api.post('/library/issuances/', payload);
    
    alert('Book issued successfully!');
    fetchBooks(); // Refresh the book list
    } catch (error) {
      console.error('Error issuing book:', error);
      const errorMessage = error.response?.data?.user?.[0] || 
                          error.response?.data?.detail || 
                          'Failed to issue book. Please try again.';
      alert(errorMessage);
    }
  };



  const handleDelete = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await api.delete(`/library/books/${bookId}/`);
      alert('Book deleted successfully');
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Failed to delete book');
    }
  };

  const handleEdit = (book) => {
    console.log("Editing book:", book);
    setEditingBook(book);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingBook(null);
    setShowForm(true);
  };

  const handleSave = () => {
    setShowForm(false);
    setEditingBook(null);
    fetchBooks();
  };

  return (
    <div className="book-list-container">
      <h2>Book Catalog</h2>

      {/* Filters and Add button */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by title or author"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)}>
          <option value="">All Genres</option>
          {genres.map(genre => (
            <option key={genre.id} value={genre.id}>{genre.name}</option>
          ))}
        </select>
        <select value={availabilityFilter} onChange={(e) => setAvailabilityFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="issued">Issued</option>
        </select>

        {(currentUser?.role === 'librarian' || currentUser?.role === 'admin') && (
          <button onClick={handleAddNew} className="add-btn">Add New Book</button>
        )}
      </div>

      {/* Book Grid */}
      <div className="books-grid">
        {filteredBooks.map(book => (
          <div key={book.id} className="book-card">
            <h3>{book.title}</h3>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Genre:</strong> {book.genre_name}</p>
            <p><strong>Publication Date:</strong> {new Date(book.publication_date).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {book.available ? 'Available' : 'Issued'}</p>

            {currentUser?.role === 'member' && book.available && (
              <button onClick={() => handleIssueBook(book.id)} className="issue-btn">
                Issue Book
              </button>
            )}

            {(currentUser?.role === 'librarian' || currentUser?.role === 'admin') && (
              <div className="admin-actions">
                <button className="edit-btn" onClick={() => handleEdit(book)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(book.id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <BookForm
              book={editingBook}
              onSave={handleSave}
              onCancel={() => { setShowForm(false); setEditingBook(null); }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BookList;
