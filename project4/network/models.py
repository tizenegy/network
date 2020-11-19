from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    following = models.ManyToManyField(
        'self',
        through='Following',
        symmetrical=False,
        related_name='followers'
    )

    def __str__(self):
        return f"{self.username}"

class Following(models.Model):
    from_User_id = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        null=True,
        related_name="follower"
        )
    to_User_id = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        null=True,
        related_name="followed_by"
        )

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
    op = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        null=True,
        related_name="posts"
        )
    def __str__(self):
        return f"Posted by someone on {self.created}"
    def serialize(self):
        return {
            "id": self.id,
            "op": self.op.username,
            "content": self.content,
            "likes": self.likes,
            "created": self.created.strftime("%c")
        }
