from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    # followers
    # posts
    def __str__(self):
        return f"{self.username}"

class Post(models.Model):
    content = models.TextField(
        max_length=1024,
        null=False
    )
    created = models.DateTimeField(
        auto_now_add=True
    )
    likes = models.IntegerField(
        default=0,
        null=False
    )
    # user
    def __str__(self):
        return f"Posted by someone on {self.created}"
