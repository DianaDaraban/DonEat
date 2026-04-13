from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.conf import settings as django_settings
from .models import UserNotificationSettings, Notification
from api.models import Wishlist, Product, Order


@receiver(post_save, sender=Product)
def wishlist_expiring_notification(sender, instance, **kwargs):
    users_wishlist = Wishlist.objects.filter(products=instance)
    for item in users_wishlist:
        try:
            user_settings = UserNotificationSettings.objects.get(
                user=item.user)
        except UserNotificationSettings.DoesNotExist:
            continue

        if user_settings.wishlist_expiring_soon:
            Notification.objects.create(
                user=item.user,
                type='WISHLIST_EXPIRING',
                message=f'Produsul {instance.title} din wishlist expiră în curând!',
                related_product=instance
            )

            if user_settings.send_mail:
                try:
                    send_mail(
                        subject='Produs în wishlist expiră!',
                        message=f'Produsul {instance.title} din wishlist expiră în curând!',
                        from_email=django_settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[item.user.email]
                    )
                except Exception as e:
                    print('Email error:', e)


@receiver(post_save, sender=Order)
def order_notification(sender, instance, created, **kwargs):
    try:
        user_settings = UserNotificationSettings.objects.get(
            user=instance.user)
    except UserNotificationSettings.DoesNotExist:
        return

    if created and user_settings.order_confirmed:
        Notification.objects.create(
            user=instance.user,
            type='ORDER_CONFIRMED',
            message=f'Comanda ta nr. {instance.id} a fost confirmată.',
            related_order=instance
        )
        if user_settings.send_mail:
            try:
                send_mail(
                    subject='Comanda confirmată!',
                    message=f'Comanda ta nr. {instance.id} a fost confirmată.',
                    from_email=django_settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[instance.user.email]
                )
            except Exception as e:
                print('Email error:', e)

    # elif instance.status == 'DELIVERED' and user_settings.order_delivered:
    #     Notification.objects.create(
    #         user=instance.user,
    #         type='ORDER_DELIVERED',
    #         message=f'Comanda ta nr. {instance.id} a fost livrată.',
    #         related_order=instance
    #     )
    #     if user_settings.send_mail:
    #         try:
    #             send_mail(
    #                 subject='Comanda livrată!',
    #                 message=f'Comanda ta nr. {instance.id} a fost livrată.',
    #                 from_email=django_settings.DEFAULT_FROM_EMAIL,
    #                 recipient_list=[instance.user.email]
    #             )
    #         except Exception as e:
    #             print('Email error:', e)

    elif instance.status == 'DELIVERED' and user_settings.order_delivered:
        Notification.objects.create(
            user=instance.user,
            type='ORDER_DELIVERED',
            message=f'Comanda ta nr. {instance.id} a fost livrată.',
            related_order=instance
        )

        if user_settings.send_mail:
            try:
                subject = 'Comanda livrată!'
                from_email = django_settings.DEFAULT_FROM_EMAIL
                to = [instance.user.email]

                context = {
                    'user_name': instance.user.first_name or instance.user.username,
                    'order_id': instance.id,
                    'site_url': 'http://localhost:3000/orders'
                }

                text_content = f'Salut, {context["user_name"]}! Comanda ta #{instance.id} a fost livrată.'
                html_content = render_to_string(
                    'emails/order_delivered.html', context)

                email = EmailMultiAlternatives(
                    subject=subject,
                    body=text_content,
                    from_email=from_email,
                    to=to
                )
                email.attach_alternative(html_content, "text/html")
                email.send(fail_silently=False)

            except Exception as e:
                print('Email error:', e)
