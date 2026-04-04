from django.urls import path
from attgsaudit import views


app_name = 'attgsaudit'
urlpatterns = [
    path('GSAudit', views.att_gsaudit, name="att_gsaudit"),
    path('GSAuditList', views.att_gsauditlist, name="att_gsauditlist"),
]
