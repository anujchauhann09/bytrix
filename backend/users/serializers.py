from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from users.models import User, Phone

from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from users.models import User, Phone 


class UserSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(write_only=True, required=False, allow_blank=True)
    whatsapp = serializers.BooleanField(write_only=True, required=False)
    dnd = serializers.BooleanField(write_only=True, required=False)

    whatsapp_output = serializers.SerializerMethodField()
    dnd_output = serializers.SerializerMethodField()
    phone_output = serializers.SerializerMethodField()

    current_password = serializers.CharField(write_only=True, required=False)
    new_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            'uuid', 'username', 'email', 'is_subscribed',
            'phone', 'whatsapp', 'dnd',
            'phone_output', 'whatsapp_output', 'dnd_output', 'current_password', 'new_password'
        ]
        read_only_fields = ['uuid', 'is_subscribed']

    def get_phone_output(self, obj):
        phone = obj.phones.filter(is_deleted=False).order_by('-created_at').first()
        return phone.phone if phone else None
    
    def get_whatsapp_output(self, obj):
        phone = obj.phones.filter(is_deleted=False).order_by('-created_at').first()
        return phone.whatsapp if phone else None

    def get_dnd_output(self, obj):
        phone = obj.phones.filter(is_deleted=False).order_by('-created_at').first()
        return phone.dnd if phone else None

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['phone'] = data.pop('phone_output', None)
        data['whatsapp'] = data.pop('whatsapp_output', None)
        data['dnd'] = data.pop('dnd_output', None)
        return data

    def validate(self, attrs):
        if 'new_password' in attrs:
            if 'current_password' not in attrs:
                raise serializers.ValidationError("Current password is required to change password.")
            request = self.context.get('request')
            if not request:
                raise serializers.ValidationError("Request context is required.")
            user = request.user
            if not user.check_password(attrs['current_password']):
                raise serializers.ValidationError("Current password is incorrect.")
            validate_password(attrs['new_password'], user)
        return attrs

    def update(self, instance, validated_data):
        if 'new_password' in validated_data:
            new_password = validated_data.pop('new_password')
            validated_data.pop('current_password', None)
            instance.set_password(new_password)

        phone_number = validated_data.pop('phone', None)
        whatsapp = validated_data.pop('whatsapp', None)
        dnd = validated_data.pop('dnd', None)

        user = super().update(instance, validated_data)

        phone_obj = user.phones.filter(is_deleted=False).order_by('-created_at').first()
        if phone_number or whatsapp is not None or dnd is not None:
            if phone_obj:
                if phone_number and phone_number.strip():
                    phone_obj.phone = phone_number
                if whatsapp is not None:
                    phone_obj.whatsapp = whatsapp
                if dnd is not None:
                    phone_obj.dnd = dnd
                phone_obj.save()
            else:
                Phone.objects.create(
                    user=user,
                    phone=phone_number or "",
                    whatsapp=whatsapp if whatsapp is not None else False,
                    dnd=dnd if dnd is not None else False
                )

        return user


