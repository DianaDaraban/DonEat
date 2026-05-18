from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..models import Product, Cart, CartItems, Order, OrderItem
from ..serializers import CartSerializer


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
            if item.quantity + quantity > product.quantity:
                return Response({'error': 'Not enough stock available'}, status=400)
            item.quantity += quantity
        else:
            if quantity > product.quantity:
                return Response({'error': 'Not enough stock available'}, status=400)
            item.quantity = quantity

        item.save()

        return Response(CartSerializer(cart).data)


class UpdateCartItemView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, item_id):
        item = CartItems.objects.get(id=item_id, cart__user=request.user)
        new_quantity = int(request.data['quantity'])

        if new_quantity > item.product.quantity:
            return Response({'error': 'Not enough stock available'}, status=400)

        if new_quantity < 1:
            return Response({'error': 'Quantity must be at least 1'}, status=400)

        item.quantity = new_quantity
        item.save()
        return Response(status=204)


class RemoveCartItemView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, item_id):
        CartItems.objects.get(id=item_id, cart__user=request.user).delete()
        return Response(status=204)


class CheckOutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        
        payment_method = request.data.get("payment_method", "cash")

        if payment_method not in ["cash", "card"]:
            return Response({"error": "Metodă de plată invalidă"}, status=400)

        payment_status = "paid" if payment_method == "card" else "pending"

        with transaction.atomic():
            cart, _ = Cart.objects.select_for_update().get_or_create(user=user)
            cart_items = cart.items.select_related(
                'product').select_for_update()

            if not cart_items.exists():
                return Response({'error': 'Cart is empty'}, status=400)

            total = 0

            for item in cart_items:
                if item.quantity > item.product.quantity:
                    return Response({
                        'error': f'Not enough stock for {item.product.title}'
                    }, status=400)

                total += item.quantity * item.price_at_add

            order = Order.objects.create(
                user=user,
                total=total,
                status='PENDING',
                payment_method=payment_method,
                payment_status=payment_status
            )

            for item in cart_items:
                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    quantity=item.quantity,
                    price_at_purchase=item.price_at_add
                )

                item.product.quantity -= item.quantity
                item.product.save()

            cart.items.all().delete()

        return Response({'success': True, 'order_id': order.id})
