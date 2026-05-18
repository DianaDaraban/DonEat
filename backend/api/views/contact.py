from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.permissions import AllowAny
import uuid


class ContactView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        name = request.data.get('name')
        email = request.data.get('email')
        subject = request.data.get('subject')
        message = request.data.get('message')

        if not all([name, email, subject, message]):
            return Response(
                {'error': 'Toate câmpurile sunt obligatorii'},
                status=status.HTTP_400_BAD_REQUEST
            )

        ticket_id = str(uuid.uuid4())[:8].upper()

        full_message = f'''
        Mesaj #{ticket_id}
        
        Mesaj de la: {name}
        Email: {email}
        
        {message}
        '''

        send_mail(
            subject=f"[Contact Doneat] {subject}",
            message=full_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.DEFAULT_FROM_EMAIL],  # sau alt email
            fail_silently=False,
        )

        send_mail(
            subject=f"Mesajul tău a fost primit! (#{ticket_id})",
            message=f"""
            Salut {name},

            Am primit mesajul tău și îl vom analiza în cel mai scurt timp.

            Număr de înregistrare: {ticket_id}

            Mulțumim,
            Echipa DonEat
            """,

            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
        )

        return Response({
            "success": True,
            "ticket_id": ticket_id
        })
