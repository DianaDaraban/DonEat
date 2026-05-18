from django.urls import path
from .views import MeView, CreateUserView, CreateStoreView, MyStoreView, UpdateMeView, UpdateMyStoreView, ForgotPasswordView, ResetPasswordConfirmView, EmailOrUsernameTokenObtainPairView

urlpatterns = [
    path('register/', CreateUserView.as_view(), name='register'),
    path('me/', MeView.as_view(), name='me'),
    path('store/create/', CreateStoreView.as_view(), name='create-store'),
    path('store/me/', MyStoreView.as_view(),
         name='my-store'),
    path('me/update/', UpdateMeView.as_view()),
    path('store/me/update/', UpdateMyStoreView.as_view(), name='update-store'),
    path('password-reset/', ForgotPasswordView.as_view(), name='password-reset'),
    path('password-reset-confirm/<uidb64>/<token>/',
         ResetPasswordConfirmView.as_view(), name='password-reset-confirm'),
    path("token/", EmailOrUsernameTokenObtainPairView.as_view(),
         name="token_obtain_pair"),
]
