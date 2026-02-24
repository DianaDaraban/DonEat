from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from .serializers import UserSerializer, StoreSerializer
from .models import Store, UserProfile


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


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
