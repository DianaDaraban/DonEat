# The code defines Django API views for creating users, listing public products, managing products as
# an admin, and listing categories.
from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer,  ProductAdminSerializer, ProductPublicSerializer, CategorySerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Product, Category
from django.utils import timezone


# class NoteListCreate(generics.ListCreateAPIView):
#     serializer_class = NoteSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         user = self.request.user
#         return Note.objects.filter(author=user)

#     def perform_create(self, serializer):
#         if serializer.is_valid():
#             serializer.save(author=self.request.user)
#         else:
#             print(serializer.errors)


# class NoteDelete(generics.DestroyAPIView):
#     serializer_class = NoteSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         user = self.request.user
#         return Note.objects.filter(author=user)


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class ProductsPublicList(generics.ListAPIView):
    serializer_class = ProductPublicSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        now = timezone.now()
        filtered_product_list = Product.objects.filter(
            expires_at__gt=now, is_available=True)


        selected_categories = self.request.query_params.getlist('category')
        if selected_categories:
            selected_categories = [int(cat) for cat in selected_categories]
            filtered_product_list = filtered_product_list.filter(
                category__id__in=selected_categories
            )

        price_max = self.request.query_params.get('priceMax')
        if price_max:
            filtered_product_list = filtered_product_list.filter(
                price__lte=float(price_max))

        min_quantity = self.request.query_params.get('minQuantity')
        if min_quantity:
            filtered_product_list = filtered_product_list.filter(
                quantity__gte=int(min_quantity))

        available_until = self.request.query_params.get('availableUntil')
        if available_until:
            filtered_product_list = filtered_product_list.filter(
                expires_at__lte=available_until)

        location = self.request.query_params.get('location')
        if location:
            filtered_product_list = filtered_product_list.filter(
                location__icontains=location)

        return filtered_product_list


class ProductAdminListCreate(generics.ListCreateAPIView):
    serializer_class = ProductAdminSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        today = timezone.now().date()
        return Product.objects.filter(expires_at__gte=today)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user, is_available=True)


class CategoriesListView(generics.ListAPIView):
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    queryset = Category.objects.all()
