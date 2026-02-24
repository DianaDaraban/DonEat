from django.urls import path
from . import views

urlpatterns = [
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
    path('checkout/', views.CheckOutView.as_view(), name='checkout'),
    path('orders/', views.UserOrdersView.as_view(), name='orders'),
    path('orders/<int:pk>/', views.OrderDetailView.as_view(), name='order_item'),
    path('wishlist/', views.WishlistView.as_view(), name='wishlist'),
    path('vendor/orders/', views.VendorOrdersView.as_view()),
    path('vendor/orders/<int:pk>/', views.UpdateOrdersStatusView.as_view()),
    path('vendor/dashboard/', views.VendorDashboardView.as_view()),
]
