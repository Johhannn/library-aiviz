import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

const IssueBook = () => {
  const [issuances, setIssuances] = useState([]);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    book: '',
    user: '',
    due_date: ''
  });

  const { currentUser } = useAuth();

  useEffect(() => {
    fetchIssuances();
    fetchBooks();
    fetchUsers();
  }, []);

  const fetchIssuances = async () => {
    try {
      const response = await api.get('/library/issuances/');
      const data = Array.isArray(response.data) ? response.data : response.data.results;
      setIssuances(data || []);
    } catch (error) {
      console.error('Error fetching issuances:', error);
      setIssuances([]); // fallback
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await api.get('/library/books/');
      const data = Array.isArray(response.data) ? response.data : response.data.results || [];
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/accounts/users/');
      const data = Array.isArray(response.data) ? response.data : response.data.results || [];
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
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
      let payload = {
        book: formData.book,
        due_date: formData.due_date
      };

      // only librarians/admins can set user
      if (currentUser?.role !== 'member') {
        payload.user = formData.user;
      }

      await api.post('/library/issuances/', payload);
      setFormData({ book: '', user: '', due_date: '' });
      fetchIssuances();
      alert('Book issued successfully!');
    } catch (error) {
      console.error('Error issuing book:', error);
      alert('Failed to issue book');
    }
  };

  const handleReturn = async (issuanceId) => {
    try {
      await api.patch(`/library/issuances/${issuanceId}/`, {
        return_date: new Date().toISOString()
      });
      fetchIssuances();
      alert('Book returned successfully!');
    } catch (error) {
      console.error('Error returning book:', error);
      alert('Failed to return book');
    }
  };

  return (
    <div className="issue-book-container">
      <h2>Issue Book</h2>
      
      <form onSubmit={handleSubmit} className="issue-form">
        <div className="form-group">
          <label>Book</label>
          <select name="book" value={formData.book} onChange={handleChange} required>
            <option value="">Select Book</option>
            {books.filter(book => book.available).map(book => (
              <option key={book.id} value={book.id}>{book.title}</option>
            ))}
          </select>
        </div>
        {currentUser?.role !== 'member' && (
          <div className="form-group">
            <label>User</label>
            <select name="user" value={formData.user} onChange={handleChange} required>
              <option value="">Select User</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.username}</option>
              ))}
            </select>
          </div>
        )}
        <div className="form-group">
          <label>Due Date</label>
          <input
            type="date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Issue Book</button>
      </form>
      
      <h3>Current Issuances</h3>
      <div className="issuances-list">
      {Array.isArray(issuances) && issuances.filter(issuance => !issuance.return_date).map(issuance => (
            <div key={issuance.id} className="issuance-item">
            <p><strong>Book:</strong> {issuance.book_title}</p>
            <p><strong>User:</strong> {issuance.user_name}</p>
            <p><strong>Due Date:</strong> {new Date(issuance.due_date).toLocaleDateString()}</p>
            <button onClick={() => handleReturn(issuance.id)}>Return Book</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IssueBook;