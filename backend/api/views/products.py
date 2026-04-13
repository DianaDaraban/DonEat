# The above class contains API views for listing and managing products with different permissions and
# filtering options.
# The above class contains API views for listing and managing products with different permissions and
# filtering options.
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from django.db.models import Q
from rest_framework.generics import ListAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from ..models import Product
from ..serializers import ProductAdminSerializer, ProductPublicSerializer
from decimal import Decimal


class ProductsPublicList(ListAPIView):
    serializer_class = ProductPublicSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        now = timezone.now()
        filtered_product_list = Product.objects.filter(
            expires_at__gt=now, is_available=True)

        search = self.request.query_params.get('search')
        if search and len(search) >= 2:
            direct_matches = filtered_product_list.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(location__icontains=search)
            )

            category_matches = Product.objects.filter(
                category__name__icontains=search
            )

            filtered_product_list = direct_matches | category_matches
            filtered_product_list = filtered_product_list.distinct()

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
        print("Final queryset:", list(
            filtered_product_list.values_list("title", flat=True)))
        return filtered_product_list


class ProductAdminListCreate(ListCreateAPIView):
    serializer_class = ProductAdminSerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user, is_available=True)


class ProductAdminDetail(RetrieveUpdateDestroyAPIView):
    serializer_class = ProductAdminSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(owner=self.request.user)


class ProductDetail(RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductPublicSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
