from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class UserProfile(models.Model):
    USER_ROLES = (
        ('vendor', 'Vendor'),
        ('buyer', 'Buyer'),
    )

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile'
    )

    role = models.CharField(max_length=10, choices=USER_ROLES)
    avatar=models.ImageField(upload_to='avatars/', blank=True, null=True)

    def __str__(self):
        return f'{self.user.username} ({self.role})'


class Store(models.Model):
    owner = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='store')
    name = models.CharField(max_length=100)
    logo = models.ImageField(upload_to='store_logos/', blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
