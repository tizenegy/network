from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API Routes
    path("posts", views.compose, name="compose"),
    path("posts/<str:feed_filter>", views.feed, name="feed"),
    path("users/<str:username>", views.user, name="user"),
    path("follow", views.follow, name="follow"),
    path("follow/<str:username>/<str:target_username>/", views.follow_status, name="follow_status")
]
