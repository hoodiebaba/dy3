
from django.contrib.auth.models import User, Group

def user_existance_check(username):
    
    try:
        user = User.objects.get(username=username)
        # User exists
        print("User already exists:", user.username)
        return user
    except User.DoesNotExist:
        # User doesn't exist, create a new one
        user = User.objects.create_user(username=username, email="user@datayog.com", password="password123")
        print("User created:", user.username)
        
        user.save()
        return user
    return ""