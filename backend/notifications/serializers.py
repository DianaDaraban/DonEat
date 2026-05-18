from rest_framework import serializers
from .models import Notification, UserNotificationSettings


class NotificationSerializer(serializers.ModelSerializer):
    related_product_slug = serializers.CharField(
        source='related_product.slug',
        read_only=True
    )

    class Meta:
        model = Notification
        fields = [
            'id',
            'type',
            'message',
            'read',
            'created_at',
            'related_order',
            'related_product',
            'related_product_slug',
        ]


class NotificationSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserNotificationSettings
        fields = '__all__'
