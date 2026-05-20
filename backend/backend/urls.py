from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework_simplejwt.views import TokenRefreshView
from accounts.views import EmailOrUsernameTokenObtainPairView
from django.conf import settings
from django.views.static import serve

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', EmailOrUsernameTokenObtainPairView.as_view(), name='get_token'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('api-auth/', include('rest_framework.urls')),
    path('api/', include('api.urls')),
    path('api/accounts/', include('accounts.urls')),
    path('api/notifications/', include('notifications.urls')),

    re_path(
        r"^media/(?P<path>.*)$",
        serve,
        {"document_root": settings.MEDIA_ROOT}
    ),
]
