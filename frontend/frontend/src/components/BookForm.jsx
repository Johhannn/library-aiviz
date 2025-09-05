import React, { useState, useEffect } from 'react';
import api from '../api';

const BookForm = ({ book, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    publication_date: '',
    isbn: '',
    available: true
  });
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    fetchGenres();
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        genre: book.genre,
        publication_date: book.publication_date,
        isbn: book.isbn,
        available: book.available
      });
    }
  }, [book]);

const fetchGenres = async () => {
  try {
    const response = await api.get('/library/genres/');
    const data = Array.isArray(response.data) ? response.data : response.data.results || [];
    setGenres(data);
  } catch (error) {
    console.error('Error fetching genres:', error);
    setGenres([]); // fallback
  }
};

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (book) {
        await api.put(`/library/books/${book.id}/`, formData);
      } else {
        await api.post('/library/books/', formData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  return (
    <div className="book-form-container">
      <h2>{book ? 'Edit Book' : 'Add New Book'}</h2>
      <form onSubmit={handleSubmit} className="book-form">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Author</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Genre</label>
          <select name="genre" value={formData.genre} onChange={handleChange} required>
            <option value="">Select Genre</option>
              {Array.isArray(genres) && genres.map(genre => (
                <option key={genre.id} value={genre.id}>{genre.name}</option>
              ))}
          </select>
        </div>
        <div className="form-group">
          <label>Publication Date</label>
          <input
            type="date"
            name="publication_date"
            value={formData.publication_date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>ISBN</label>
          <input
            type="text"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={(e) => setFormData({...formData, available: e.target.checked})}
            />
            Available
          </label>
        </div>
        <div className="form-actions">
          <button type="submit">Save</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;