from django.db import models

from users.models import CustomUser
# Create your models here.


class Message(models.Model):
    # username = models.CharField(max_length=255)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    room = models.CharField(max_length=255)
    content = models.TextField()
    date_added = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('date_added',)

    def __str__(self):
        return f'Username {self.user.username}, Message "{self.content}"'
