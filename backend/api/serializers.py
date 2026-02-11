from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Category, Product, Cart, CartItems


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class ProductPublicSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Product
        exclude = ['is_available', 'owner']


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
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.ImageField(source='product.image', read_only=True)
    class Meta:
        model=CartItems
        fields=[
            'id',
            'product',
            'product_name',
            'product_image',
            'quantity',
            'price_at_add',
        ]
        
class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True)
    
    class Meta:
        model=Cart
        fields=['id', 'items', 'updated_at']
