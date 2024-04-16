from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
import json
from rest_framework import status
from .models import Message
from rest_framework.exceptions import PermissionDenied
from users.models import CustomUser
from rest_framework import viewsets, authentication
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from .serializers import MessageSerializer, OnlineUsersSerializer
from django.http import HttpResponse


def get_online_users(request, refresh_token):
    refresh_token_obj = RefreshToken(refresh_token)
    user_id = refresh_token_obj['user_id']
    user = CustomUser.objects.get(id=user_id)
    content = {'is_superuser': user.is_superuser}
    return HttpResponse(json.dumps(content, indent=4, sort_keys=True, default=str),
                        content_type="application/json",
                        status=status.HTTP_200_OK)


class OnlineUsersViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = OnlineUsersSerializer

    def get_queryset(self):  # this method is called inside of get
        if self.request.user.is_superuser:
            queryset = self.queryset.filter(is_online=True)
            return queryset
        else:
            raise PermissionDenied("Access restricted. Only admins can see online users!")
        # queryset = self.queryset.filter(is_online=True)
        # return queryset


class MessageViewSet(viewsets.ModelViewSet):
    # queryset=Message.objects.all()
    serializer_class = MessageSerializer

    def get_queryset(self):
        room = self.request.query_params.get('room')
        if room is None:
            queryset = Message.objects.all()
        else:
            queryset = Message.objects.all().filter(room=room)
        return queryset
