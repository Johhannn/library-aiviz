from rest_framework import generics, filters, permissions, status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Book, Genre, BookIssuance
from .serializers import BookSerializer, GenreSerializer, BookIssuanceSerializer
from accounts.permissions import IsAdmin, IsLibrarian, IsMember

class IsAdminOrLibrarian(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['admin', 'librarian']

class BookListView(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['genre', 'available']
    search_fields = ['title', 'author']

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.IsAuthenticated()]
        return [IsAdminOrLibrarian()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("❌ Validation errors:", serializer.errors)  # show in Django console
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)    

class BookDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsAdminOrLibrarian]

class GenreListView(generics.ListCreateAPIView):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.IsAuthenticated()]   # anyone logged in can view
        return [IsAdminOrLibrarian()]   # only librarians can create

class BookIssuanceListView(generics.ListCreateAPIView):
    serializer_class = BookIssuanceSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role in ['admin', 'librarian']:
            return BookIssuance.objects.all()
        # members can only see their own
        return BookIssuance.objects.filter(user=user)

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.IsAuthenticated()]
        # both librarian and member can POST
        return [permissions.IsAuthenticated()]



class BookIssuanceDetailView(generics.RetrieveUpdateAPIView):
    queryset = BookIssuance.objects.all()
    serializer_class = BookIssuanceSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role in ['admin', 'librarian']:
            return BookIssuance.objects.all()
        # members can only update their own issuances (return books)
        return BookIssuance.objects.filter(user=user)

