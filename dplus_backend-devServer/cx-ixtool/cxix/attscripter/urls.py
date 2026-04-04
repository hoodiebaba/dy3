from django.urls import path
from attscripter import views


app_name = 'attscripter'
urlpatterns = [
    path('script', views.script_att, name="script_att"),
    path('scriptlist', views.scriptlist_att, name="scriptlist_att"),
]
