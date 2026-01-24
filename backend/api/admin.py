from django.contrib import admin
from .models import Category, Product


class ProductAdmin(admin.ModelAdmin):
    list_display = ['title', 'category',
                    'quantity', 'unit', 'price', 'owner', ]
    prepopulated_fields = {'slug': ['title']}



admin.site.register(Category)
admin.site.register(Product, ProductAdmin)
