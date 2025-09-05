### 📚 Library Management System

A web application for managing a library, allowing users to browse, search, filter, issue, and return books, with role-based access for members, librarians, and admins.

### 🛠 Features
## Member

Browse and search books by title, author, or genre.

Filter books by genre and availability.


## Librarian

Manage books (add, edit, delete).

Manage book issuances.

View all users and their book issuances.

### Admin

All librarian permissions.

Manage users and roles.

### 💻 Tech Stack

Backend: Django, Django REST Framework, Django Filter

Frontend: ReactJS, Axios

Database: SQLite

Authentication: JWT (JSON Web Token)


### 📦 Setup Instructions
## 1. Backend Setup
# Clone the repo
git clone https://github.com/Johhannn/library-aiviz.git
cd backend

# Create a virtual environment
python -m venv aiviz
aiviz\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Apply migrations
python manage.py makemigrations
python manage.py migrate

# Create a superuser
python manage.py createsuperuser

# Run server
python manage.py runserver

2. Frontend Setup
cd frontend
npm install
npm start

### 🔑 API Endpoints
Endpoint	Method	Description	Permissions
/api/library/books/	GET	List all books	Authenticated users
/api/library/books/	POST	Add a new book	Librarian/Admin
/api/library/books/<id>/	PUT	Update book details	Librarian/Admin
/api/library/books/<id>/	DELETE	Delete a book	Librarian/Admin
/api/library/genres/	GET	List all genres	Authenticated users
/api/library/issuances/	GET	List book issuances	Authenticated users
/api/library/issuances/	POST	Issue a book	Members/Librarian/Admin
/api/library/issuances/<id>/	PATCH	Return a book (update return_date)	Members/Librarian/Admin
/api/accounts/users/	GET	List all users	Admin only

### ⚙ Validation Rules

ISBN: Maximum 13 characters.
Book can only be issued if it is available.


### ✅ Notes

Ensure the backend server is running before starting the frontend.
Use JWT authentication tokens to authorize API requests from React.


