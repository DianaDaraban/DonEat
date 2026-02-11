from django.urls import path
from .views import MeView, CreateUserView

urlpatterns = [
    path('register/', CreateUserView.as_view(), name='register'),
    path('me/', MeView.as_view(), name='me'),
]
