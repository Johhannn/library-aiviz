from rest_framework import serializers
from .models import Book, Genre, BookIssuance

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = '__all__'

class BookSerializer(serializers.ModelSerializer):
    genre_name = serializers.CharField(source='genre.name', read_only=True)
    
    class Meta:
        model = Book
        fields = '__all__'
    
    def validate_isbn(self, value):
        if len(value) > 13 or not value.isdigit():
            raise serializers.ValidationError("ISBN must be a numeric string with at most 13 digits.")
        return value

class BookIssuanceSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source='book.title', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = BookIssuance
        fields = ['id', 'book', 'user', 'due_date', 'return_date', 'book_title', 'user_name']
        # Removed user from read_only_fields completely

    def validate(self, data):
        """
        Custom validation to ensure user is set correctly
        """
        request = self.context.get('request')
        if request and request.user.role == 'member':
            # For members, automatically set the user to themselves
            data['user'] = request.user
        elif 'user' not in data:
            # For librarians/admins, user must be provided
            raise serializers.ValidationError({"user": "This field is required."})
        
        return data

    def create(self, validated_data):
        return super().create(validated_data)

