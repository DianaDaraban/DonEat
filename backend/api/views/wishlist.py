
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..models import Product, Wishlist
from ..serializers import ProductPublicSerializer


class WishlistView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)

        products = wishlist.products.filter(
            quantity__gt=0,
            is_available=True,
            expires_at__gt=timezone.now()
        )
        serializer = ProductPublicSerializer(
            products, many=True)
        return Response(serializer.data)

    def post(self, request):
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        product_id = request.data.get('product_id')
        product = Product.objects.get(id=product_id)
        wishlist.products.add(product)
        return Response({'message':  "Produs adăugat"})

    def delete(self, request):
        wishlist = Wishlist.objects.get(user=request.user)
        product_id = request.data.get('product_id')
        product = Product.objects.get(id=product_id)
        wishlist.products.remove(product)
        return Response({'message': 'Produs șters'})
