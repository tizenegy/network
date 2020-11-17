from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass
    username = models.CharField(
        max_length=64,
        null=False
    )
    # followers
    # following
    # posts)

# class Post(models.Model):
#     pass
    # user
    # content
    # creation_datetime
    # likes

    # def __str__(self):
    #     return f"Listing: {self.listing} | User: {self.user}"

    # def serialize(self):
    # return {
    #     "id": self.id,
    #     "sender": self.sender.email,
    # }