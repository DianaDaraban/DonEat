from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Category, Product, Cart, CartItems, OrderItem, Order, Wishlist


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class ProductPublicSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    store_name = serializers.CharField(
        source='owner.store.name', read_only=True)
    slug_field = 'title'

    class Meta:
        model = Product
        exclude = ['is_available']


class ProductAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
        extra_kwargs = {
            'id': {'read_only': True},
            'owner': {'read_only': True},
            'is_available': {'read_only': True},
            'created_at': {'read_only': True},
        }


class CartItemSerializer(serializers.ModelSerializer):
    product_title = serializers.CharField(
        source='product.title', read_only=True)
    product_image = serializers.ImageField(
        source='product.image', read_only=True)
    product_stock = serializers.IntegerField(
        source='product.quantity', read_only=True)
    updated_at = serializers.DateTimeField(
        source='cart.updated_at', read_only=True)

    class Meta:
        model = CartItems
        fields = [
            'id',
            'product',
            'product_title',
            'product_image',
            'product_stock',
            'quantity',
            'price_at_add',
            'updated_at',
        ]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True)

    class Meta:
        model = Cart
        fields = ['id', 'items', 'updated_at']


class OrderItemSerializer(serializers.ModelSerializer):
    product_title = serializers.CharField(
        source='product.title', read_only=True)
    product_image = serializers.ImageField(
        source='product.image', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_title',
                  'quantity', 'price_at_purchase', 'product_image']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    buyer_first_name = serializers.CharField(
        source='user.first_name', read_only=True)
    buyer_last_name = serializers.CharField(
        source='user.last_name', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'created_at', 'total',  'user',
                  'status', 'items', 'buyer_first_name', 'buyer_last_name']
