from django.urls import path
from . import views

urlpatterns = [
    path('books/', views.BookListView.as_view(), name='book-list'),
    path('books/<int:pk>/', views.BookDetailView.as_view(), name='book-detail'),
    path('genres/', views.GenreListView.as_view(), name='genre-list'),
    path('issuances/', views.BookIssuanceListView.as_view(), name='issuance-list'),
    path('issuances/<int:pk>/', views.BookIssuanceDetailView.as_view(), name='issuance-detail'),
]