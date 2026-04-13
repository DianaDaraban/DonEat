from django.urls import path
from .views import NotificationSettingsView, NotificationListView, NotificationMarkReadView

urlpatterns = [

    path('settings/', NotificationSettingsView.as_view(),
         name='notification-settings'),
    path('', NotificationListView.as_view(), name='notification-list'),
    path('<int:pk>/mark-read/', NotificationMarkReadView.as_view(),
         name='notification-mark-read'),
]
