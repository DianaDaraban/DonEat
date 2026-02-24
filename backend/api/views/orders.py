from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..models import Order, OrderItem
from ..serializers import OrderSerializer


class UserOrdersView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')


class OrderDetailView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class VendorOrdersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        vendor = request.user

        order_items = OrderItem.objects.select_related(
            'order',
            'product',
            'order__user'
        ).filter(product__owner=vendor).order_by('-order__created_at')

        data = []

        for item in order_items:
            data.append({
                'order_id': item.order.id,
                'order_date': item.order.created_at,
                'order_status': item.order.status,
                'buyer': item.order.user.username,
                'product_title': item.product.title,
                'quantity': item.quantity,
                'price': item.price_at_purchase,
                'total': item.quantity * item.price_at_purchase,
            })

        return Response(data)


class UpdateOrdersStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        vendor = request.user
        new_status = request.data.get('status')

        order = Order.objects.get(id=pk)

        if not OrderItem.objects.filter(order=order, product__owner=vendor).exists():
            return Response({'error': 'Unauthorized'}, status=403)

        order.status = new_status
        order.save()

        return Response({'success': True})
