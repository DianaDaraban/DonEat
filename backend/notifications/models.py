from django.db import models
from django.conf import settings
from api.models import Order, Product


class UserNotificationSettings(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    order_confirmed = models.BooleanField(default=True)
    order_shipped = models.BooleanField(default=True)
    order_delivered = models.BooleanField(default=True)
    wishlist_low_stock = models.BooleanField(default=True)
    wishlist_expiring_hours = models.IntegerField(default=6)
    wishlist_expiring_soon = models.BooleanField(default=True)
    product_back_in_stock = models.BooleanField(default=True)
    new_order = models.BooleanField(default=True)
    order_cancelled = models.BooleanField(default=True)
    send_mail = models.BooleanField(default=True)
    sms_enabled = models.BooleanField(default=False)

    def __str__(self):
        return f'Notifications settings for {self.user}'


class Notification(models.Model):
    NOTIFICATION_TYPE_CHOICES = [
        # Buyer
        ('ORDER_CONFIRMED', 'Order Confirmed'),
        ('ORDER_SHIPPED', 'Order Shipped'),
        ('ORDER_DELIVERED', 'Order Delivered'),
        ('WISHLIST_LOW_STOCK', 'Wishlist Low Stock'),
        ('WISHLIST_EXPIRING', 'Wishlist Expiring'),
        ('PRODUCT_BACK_IN_STOCK', 'Product Back In Stock'),

        # Vendor
        ('NEW_ORDER', 'New Order'),
        ('ORDER_CANCELLED', 'Order Cancelled'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=50, choices=NOTIFICATION_TYPE_CHOICES)
    message = models.TextField()
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    related_order = models.ForeignKey(
        Order, null=True, blank=True, on_delete=models.SET_NULL)
    related_product = models.ForeignKey(
        Product, null=True, blank=True,  on_delete=models.SET_NULL)
    
    class Meta:
        ordering=['-created_at']

    def __str__(self):
        return f"{self.type} for {self.user} - {'Read' if self.read else 'Unread'}"
