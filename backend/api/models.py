from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify


# class Note(models.Model):
#     title = models.CharField(max_length=100)
#     content = models.TextField()
#     created_at = models.DateTimeField(auto_now_add=True)
#     author = models.ForeignKey(
#         User, on_delete=models.CASCADE, related_name='notes')

#     def __str__(self):
#         return self.title


class Category(models.Model):
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Product(models.Model):
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='products')
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True)
    quantity = models.IntegerField()
    unit = models.CharField(max_length=20, default="porții")
    price = models.DecimalField(
        max_digits=8, decimal_places=2, null=True, blank=True)
    is_donation = models.BooleanField(default=False)
    expires_at = models.DateTimeField()
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    location = models.CharField(max_length=255, default="Bucuresti")
    slug = models.SlugField(unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.title} {self.quantity} {self.price} {self.owner}'
