from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from ..models import Category
from ..serializers import CategorySerializer


class CategoriesListView(ListAPIView):
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    queryset = Category.objects.all()
