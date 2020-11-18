from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API Routes
    path("posts", views.compose, name="compose"),
    # path("posts/<int:post_id>", views.email, name="post"),
    # path("posts/<str:mailbox>", views.mailbox, name="mailbox"),
]
