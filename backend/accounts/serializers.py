from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile


class UserSerializer(serializers.ModelSerializer):
    role_input = serializers.ChoiceField(
        choices=['vendor', 'buyer'],
        write_only=True
    )
    role = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'role_input', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def get_role(self, obj):
        return obj.profile.role if hasattr(obj, 'profile') else None

    def create(self, validated_data):
        role = validated_data.pop('role_input')
        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(user=user, role=role)
        return user
