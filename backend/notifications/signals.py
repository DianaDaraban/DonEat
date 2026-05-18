from django.dispatch import receiver
from django.db.models.signals import post_save
from django.conf import settings as django_settings

from .models import UserNotificationSettings, Notification
from .utils import send_html_email
from api.models import Wishlist, Product, Order


@receiver(post_save, sender=Product)
def wishlist_expiring_notification(sender, instance, **kwargs):
    users_wishlist = Wishlist.objects.filter(products=instance)

    for item in users_wishlist:

        user_settings, _ = UserNotificationSettings.objects.get_or_create(
            user=item.user
        )

        if not user_settings.wishlist_expiring_soon:
            continue

        Notification.objects.create(
            user=item.user,
            type="WISHLIST_EXPIRING",
            message=f'Produsul "{instance.title}" din wishlist expiră în curând!',
            related_product=instance
        )

        if user_settings.send_mail:
            try:
                send_html_email(
                    subject="Produsul din wishlist expiră în curând!",
                    template="emails/wishlist_expiring.html",
                    context={
                        "title": "Produs wishlist",
                        "subtitle": "Un produs salvat expiră în curând",
                        "user_name": item.user.first_name or item.user.username,
                        "product_title": instance.title,
                        "product_url": f"{django_settings.FRONTEND_URL}/products/{instance.slug}",
                        "text_content": f'Produsul "{instance.title}" din wishlist expiră în curând.',
                    },
                    to=[item.user.email],
                )
            except Exception as e:
                print("Email error:", e)


@receiver(post_save, sender=Order)
def order_notification(sender, instance, created, **kwargs):

    user_settings, _ = UserNotificationSettings.objects.get_or_create(
        user=instance.user
    )

    user_name = instance.user.first_name or instance.user.username

    if created and user_settings.order_confirmed:
        Notification.objects.create(
            user=instance.user,
            type="ORDER_CONFIRMED",
            message=f"Comanda ta nr. {instance.id} a fost înregistrată.",
            related_order=instance
        )

        print("ORDER SIGNAL HIT", instance.id, created, instance.status)

        if user_settings.send_mail:
            try:
                send_html_email(
                    subject="Comanda a fost înregistrată!",
                    template="emails/order_created.html",
                    context={
                        "title": "Comandă înregistrată",
                        "subtitle": "Comanda ta a fost plasată cu succes",
                        "user_name": user_name,
                        "order_id": instance.id,
                        "site_url": f"{django_settings.FRONTEND_URL}/orders/{instance.id}",
                        "text_content": f"Comanda ta #{instance.id} a fost înregistrată.",
                    },
                    to=[instance.user.email],
                )
            except Exception as e:
                print("Email error:", e)

    elif instance.status == "DELIVERED" and user_settings.order_delivered:
        Notification.objects.create(
            user=instance.user,
            type="ORDER_DELIVERED",
            message=f"Comanda ta nr. {instance.id} a fost livrată.",
            related_order=instance
        )

        if user_settings.send_mail:
            try:
                send_html_email(
                    subject="Comanda livrată!",
                    template="emails/order_delivered.html",
                    context={
                        "title": "Comandă livrată",
                        "subtitle": "Comanda ta a fost livrată cu succes",
                        "user_name": user_name,
                        "order_id": instance.id,
                        "site_url": f"{django_settings.FRONTEND_URL}/orders/{instance.id}",
                        "text_content": f"Comanda ta #{instance.id} a fost livrată.",
                    },
                    to=[instance.user.email],
                )
            except Exception as e:
                print("Email error:", e)
