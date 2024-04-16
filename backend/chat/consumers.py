from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async

from .models import Message
from channels.generic.websocket import AsyncWebsocketConsumer
from users.models import CustomUser
from channels.generic.websocket import AsyncWebsocketConsumer
import json


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
        user = self.scope['user']
        print(user.email)
        await self.update_user_status(user, True)

        # Join room
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()


    async def disconnect(self, close_code):
        # Leave room
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        user = self.scope['user']
        await self.update_user_status(user, False)

    async def send_notification(self, event):
        await self.send(text_data=json.dumps(event))

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        username = data['username']
        user_id = data['user_id']
        room = data['room']

        await self.save_message(user_id, username, room, message)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'username': username,
                'user_id': user_id
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        username = event['username']
        user_id = event['user_id']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'username': username
        }))

    @sync_to_async
    def save_message(self, user_id, username, room, message):
        user = CustomUser.objects.get(id=user_id)

        # Message.objects.create(username=username, room=room, content=message)
        Message.objects.create(user=user, room=room, content=message)

    @database_sync_to_async
    def update_user_status(self, user, status):
        return CustomUser.objects.filter(pk=user.pk).update(is_online=status)


class GetJokeConsumer(AsyncWebsocketConsumer):
     async def connect(self):
       self.room_group_name = 'joke'
       await self.channel_layer.group_add(
       self.room_group_name,
       self.channel_name
       )
       await self.accept()

     async def disconnect(self, code):
       await self.channel_layer.group_discard(
       self.room_group_name,
       self.channel_name
       )

     async def send_joke(self, event):
        await self.send(text_data=json.dumps(event))
