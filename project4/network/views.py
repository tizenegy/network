from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from .models import User, Following, Post
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
import json
from django.http import JsonResponse
from django import forms

# forms
class NewPostForm(forms.Form):
    md_text = forms.CharField(label="", widget=forms.Textarea(attrs={
        'placeholder':'Enter your text here.',
        'class': 'form-control',
        'id': 'compose-body',
        'rows':5
        }))

# views

def index(request):
    return render(request, "network/index.html", {
        "new_post_form": NewPostForm()
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

@csrf_exempt
@login_required
def compose(request):
    if request.method != "POST":
        return JsonResponse(
            {"error": "POST request required."}, 
            status=400
            )
    data = json.loads(request.body)
    user = request.user
    post = Post(
        op = user,
        content = data.get("content", "")
    )
    post.save()
    return JsonResponse({"message": "Post successful."}, status=201)

@csrf_exempt
@login_required
def feed(request, feed_filter):
    if request.method != "GET":
        return JsonResponse(
            {"error": "GET request required."}, 
            status=400
            )

    if feed_filter == "all":
        data = Post.objects.all()
    elif (User.objects.get(username__contains=feed_filter)):
        user = User.objects.get(username__contains=feed_filter)
        data = Post.objects.filter(op = user)
    else:
        return JsonResponse(
            {"error": "Invalid filter parameter."}, 
            status=400
            )
    posts = data.order_by("-created").all()
    json_response = [post.serialize() for post in posts]
    return JsonResponse(json_response, safe=False)

@csrf_exempt
@login_required
def user(request, username):
    if request.method != "GET":
        return JsonResponse(
            {"error": "GET request required."}, 
            status=400
            )
# TODO: build different cases and check if username exists
    if username == "all":
        data = User.objects.all()
    elif username != "all":
        data = User.objects.filter(username = username)
    else:
        return JsonResponse(
            {"error": "Invalid filter parameter."}, 
            status=400
            )
    json_response = [user.serialize() for user in data]
    return JsonResponse(json_response, safe=False)