from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from ..models import OrderItem, Order, Product
from accounts.models import User
from django.db.models import Sum, Count, F, DecimalField, ExpressionWrapper, Value
from django.db.models.functions import Coalesce
from rest_framework.response import Response
from accounts.serializers import StoreSerializer


class VendorDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        vendor = request.user

        items = OrderItem.objects.filter(product__owner=vendor)

        total_orders = items.values('order').distinct().count()

        total_expression = ExpressionWrapper(
            F('quantity') * F('price_at_purchase'),
            output_field=DecimalField(max_digits=10, decimal_places=2)
        )

        total_sales = items.aggregate(
            total=Coalesce(
                Sum(total_expression),
                Value(0, output_field=DecimalField(
                    max_digits=10, decimal_places=2))
            )
        )['total']

        products_count = Product.objects.filter(owner=vendor).count()

        status_counts = (
            Order.objects.filter(items__product__owner=vendor)
            .distinct()
            .values('status')
            .annotate(count=Count('id'))
        )
        recent_orders = (
            Order.objects.filter(items__product__owner=vendor)
            .order_by('-created_at')[:5]
            .values('id', 'user__username', 'total', 'status', 'created_at', 'user__first_name', 'user__last_name',)
        )

        store_data = None
        if hasattr(vendor, "store"):
            store_data = StoreSerializer(vendor.store).data

        data = {
            'total_orders': total_orders,
            'total_sales': total_sales,
            'products_count': products_count,
            'status_counts': list(status_counts),
            'recent_orders': list(recent_orders),
            'store': store_data,
        }

        return Response(data)
