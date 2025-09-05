from django.contrib import admin
from .models import Genre, Book, BookIssuance


# Unregister if already registered
try:
    admin.site.unregister(Book)
except admin.sites.NotRegistered:
    pass

# Register your models here.

admin.site.register(Genre)
admin.site.register(Book)
admin.site.register(BookIssuance)