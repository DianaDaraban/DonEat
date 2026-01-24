from django.urls import path
from .import views

urlpatterns = [
    # path('notes/', views.NoteListCreate.as_view(), name='note-list'),
    # path('note/delete/<int:pk>/', views.NoteDelete.as_view(), name='delete-note'),
    path('products/', views.ProductsPublicList.as_view(), name='products-list'),
    path('admin/products/', views.ProductAdminListCreate.as_view(),
         name='admin-products-list'),
    path('categories/', views.CategoriesListView.as_view(), name='categories-list')
]
