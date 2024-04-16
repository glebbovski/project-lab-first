from rest_framework import serializers
from .models import OperationResult


class OperationResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = OperationResult
        fields = '__all__'
