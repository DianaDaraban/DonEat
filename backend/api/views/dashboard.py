from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from ..models import OrderItem, Order
from django.db.models import Sum, Count
from rest_framework.response import Response
from accounts.serializers import StoreSerializer


class VendorDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        vendor = request.user

        items = OrderItem.objects.filter(product__owner=vendor)

        total_orders = items.values('order').distinct().count()
        total_sales = items.aggregate(
            total=Sum('price_at_purchase'))['total'] or 0

        status_counts = (
            Order.objects.filter(items__product__owner=vendor)
            .distinct()
            .values('status')
            .annotate(count=Count('id'))
        )
        recent_orders = (
            Order.objects.filter(items__product__owner=vendor)
            .order_by('-created_at')[:5]
            .values('id', 'user__username', 'total', 'status', 'created_at')
        )

        store_data = None
        if hasattr(vendor, "store"):
            store_data = StoreSerializer(vendor.store).data

        data = {
            'total_orders': total_orders,
            'total_sales': total_sales,
            'status_counts': list(status_counts),
            'recent_orders': list(recent_orders),
            'store': store_data,
        }

        return Response(data)
