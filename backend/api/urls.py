from django.urls import path
from . import views

urlpatterns = [
    # path('notes/', views.NoteListCreate.as_view(), name='note-list'),
    # path('note/delete/<int:pk>/', views.NoteDelete.as_view(), name='delete-note'),
    path('products/', views.ProductsPublicList.as_view(), name='products-list'),
    path('admin/products/', views.ProductAdminListCreate.as_view(),
         name='admin-products-list'),
    path('categories/', views.CategoriesListView.as_view(), name='categories-list'),
    path('admin/products/<int:pk>/', views.ProductAdminDetail.as_view()),
    path('cart/', views.CartView.as_view(), name='cart'),
    path('cart/add/', views.AddToCartView.as_view(), name='cart-add'),
    path('cart/item/<int:item_id>/',
         views.UpdateCartItemView.as_view(), name='cart-item-update'),
    path('cart/item/<int:item_id>/delete/',
         views.RemoveCartItemView.as_view(), name='cart-item-delete'),
]
