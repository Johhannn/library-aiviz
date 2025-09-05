from django.db import models
from django.conf import settings
from django.utils import timezone

class Genre(models.Model):
    name = models.CharField(max_length=100, unique=True)
    
    def __str__(self):
        return self.name

class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=100)
    genre = models.ForeignKey(Genre, on_delete=models.SET_NULL, null=True)
    publication_date = models.DateField()
    isbn = models.CharField(max_length=13, unique=True)
    available = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.title} by {self.author}"

class BookIssuance(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    issue_date = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField()
    return_date = models.DateTimeField(null=True, blank=True)
    
    def is_overdue(self):
        if self.return_date:
            return self.return_date > self.due_date
        return timezone.now() > self.due_date
    
    def __str__(self):
        return f"{self.book.title} issued to {self.user.username}"