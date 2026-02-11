# The code defines Django API views for creating users, listing public products, managing products as
# an admin, and listing categories.
from django.shortcuts import render
from django.contrib.auth.models import User
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from .models import Product, Category, Cart, CartItems
from .serializers import ProductAdminSerializer, ProductPublicSerializer, CategorySerializer, CartSerializer
from decimal import Decimal





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
        if price_max is not None:
            filtered_product_list = filtered_product_list.filter(
                price__lte=Decimal(price_max))

        min_quantity = self.request.query_params.get('minQuantity')
        if min_quantity:
            filtered_product_list = filtered_product_list.filter(
                quantity__gte=int(min_quantity))

        available_until = self.request.query_params.get('availableUntil')
        if available_until:
            dt = parse_datetime(available_until)
            if dt:
                filtered_product_list = filtered_product_list.filter(
                    expires_at__lte=dt)

        location = self.request.query_params.get('location')
        if location:
            filtered_product_list = filtered_product_list.filter(
                location__icontains=location)

        return filtered_product_list


class ProductAdminListCreate(generics.ListCreateAPIView):
    serializer_class = ProductAdminSerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user, is_available=True)


class ProductAdminDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProductAdminSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(owner=self.request.user)


class CategoriesListView(generics.ListAPIView):
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    queryset = Category.objects.all()


class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        return Response(CartSerializer(cart).data)


class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_id = request.data['product_id']
        quantity = int(request.data.get('quantity', 1))

        product = Product.objects.get(id=product_id)
        cart, _ = Cart.objects.get_or_create(user=request.user)

        item, created = CartItems.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'price_at_add': product.price}
        )

        if not created:
            item.quantity += quantity

        item.save()

        return Response(CartSerializer(cart).data)


class UpdateCartItemView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, item_id):
        item = CartItems.objects.get(id=item_id, cart__user=request.user)
        item.quantity = request.data['quantity']
        item.save()
        return Response(status=204)


class RemoveCartItemView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, item_id):
        CartItems.objects.get(id=item_id, cart__user=request.user).delete()
        return Response(status=204)
