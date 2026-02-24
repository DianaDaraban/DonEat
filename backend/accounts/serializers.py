from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile, Store


class UserSerializer(serializers.ModelSerializer):
    role_input = serializers.ChoiceField(
        choices=['vendor', 'buyer'],
        write_only=True
    )

    role = serializers.SerializerMethodField(read_only=True)
    avatar =serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'password',
            'email',
            'first_name',
            'last_name',
            'role_input',
            'role',
            'avatar'
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def get_role(self, obj):
        return obj.profile.role if hasattr(obj, 'profile') else None

    def create(self, validated_data):
        role = validated_data.pop('role_input')

        user = User.objects.create_user(
            username=validated_data.get('username'),
            password=validated_data.get('password'),
            email=validated_data.get('email'),
            first_name=validated_data.get('first_name'),
            last_name=validated_data.get('last_name'),
        )

        UserProfile.objects.create(user=user, role=role)

        return user


class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = "__all__"
        read_only_fields = ["owner"]
