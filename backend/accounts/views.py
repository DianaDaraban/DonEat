from django.contrib.auth.models import User
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.conf import settings
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from .serializers import UserSerializer, StoreSerializer
from .models import Store, UserProfile
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import EmailOrUsernameTokenObtainPairSerializer
from notifications.utils import send_html_email
from django.conf import settings


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()

        try:
            send_html_email(
                subject="Bine ai venit pe DonEat!",
                template="emails/account_created.html",
                context={
                    "title": "Cont creat",
                    "subtitle": "Bine ai venit în comunitatea DoneAt",
                    "user_name": user.first_name or user.username,
                    "site_url": settings.FRONTEND_URL,
                    "text_content": "Contul tău DonEat a fost creat cu succes.",
                },
                to=[user.email],
            )
        except Exception as e:
            print("Account confirmation email error:", e)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)

        return Response({
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
            'first_name': request.user.first_name,
            'last_name': request.user.last_name,
            'role': request.user.profile.role,
            'avatar': profile.avatar.url if profile.avatar else None,
        })


class UpdateMeView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user
        data = request.data.copy()

        password = data.pop('password', None)
        avatar = request.FILES.get('avatar', None)

        profile, _ = UserProfile.objects.get_or_create(user=user)

        if avatar:
            profile.avatar = avatar
            profile.save()

        serializer = UserSerializer(
            user,
            data={k: v for k, v in request.data.items() if k != 'avatar'}, partial=True)

        if serializer.is_valid():
            serializer.save()
            if password:
                user.set_password(password)
                user.save()

            response_data = serializer.data

            response_data['avatar'] = profile.avatar.url if profile.avatar else None
            response_data['role'] = profile.role
            return Response(response_data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CreateStoreView(generics.CreateAPIView):
    queryset = Store.objects.all()
    serializer_class = StoreSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        if hasattr(request.user, "store"):
            return Response(
                {"detail": "User already has a store."},
                status=status.HTTP_400_BAD_REQUEST
            )

        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class MyStoreView(generics.RetrieveAPIView):
    serializer_class = StoreSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            store = request.user.store
            serializer = StoreSerializer(store)
            return Response(serializer.data)
        except:
            return Response(None, status=204)


class UpdateMyStoreView(generics.UpdateAPIView):
    serializer_class = StoreSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.store

    def put(self, request, *args, **kwargs):
        store = self.get_object()
        serializer = self.get_serializer(
            store, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')

        if not email:
            return Response(
                {'error': 'Email este obligatoriu.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.filter(email=email).first()

        if not user:
            return Response(
                {'message': 'Dacă emailul există, vei primi un link de resetare.'}
            )

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = PasswordResetTokenGenerator().make_token(user)

        reset_link = f'{settings.FRONTEND_URL}/reset-password/{uid}/{token}'

        send_mail(
            subject='Resetare parolă cont DonEat',
            message=f'''
            Salut {user.first_name or user.username},

            Ai cerut resetarea parolei pentru contul tău DonEat.

            Accesează linkul de mai jos pentru a seta o parolă nouă:

            {reset_link}

            Dacă nu ai cerut această resetare, poți ignora acest email.

            Echipa DonEat
            ''',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False
        )

        return Response({
            'message': "Dacă emailul există, vei primi un link de resetare."
        })


class ResetPasswordConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, uidb64, token):
        password = request.data.get('password')

        if not password:
            return Response(

                {'error': "Parola este obligatorie."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(password) < 6:
            return Response(
                {'error': 'Parola trebuie să aibă minimum 6 caractere.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except Exception:
            return Response(
                {'error': "Link invalid."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not PasswordResetTokenGenerator().check_token(user, token):
            return Response(
                {'error': "Link invalid sau expirat."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(password)
        user.save()

        return Response({'message': 'Parola a fost resetată cu succes.'})


class EmailOrUsernameTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailOrUsernameTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        print("CUSTOM LOGIN VIEW:", request.data)
        return super().post(request, *args, **kwargs)
