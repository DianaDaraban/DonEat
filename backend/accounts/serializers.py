from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile, Store
from django.db.models import Q
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserSerializer(serializers.ModelSerializer):
    role_input = serializers.ChoiceField(
        choices=['vendor', 'buyer'],
        write_only=True
    )

    role = serializers.SerializerMethodField(read_only=True)
    avatar = serializers.ImageField(required=False, allow_null=True)

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

    def validate_email(self, value):
        user_id = self.instance.id if self.instance else None

        if User.objects.filter(email__iexact=value).exclude(id=user_id).exists():
            raise serializers.ValidationError(
                "Există deja un cont cu acest email."
            )

        return value

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


class EmailOrUsernameTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        login_value = attrs.get("username", "").strip()

        user = User.objects.filter(
            Q(username__iexact=login_value) |
            Q(email__iexact=login_value)
        ).first()

        if user:
            attrs["username"] = user.username

        return super().validate(attrs)


class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = "__all__"
        read_only_fields = ["owner"]
