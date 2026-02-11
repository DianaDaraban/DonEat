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
    
    def __str__(self):
        return f'{self.user.username} ({self.role})'
