from django.conf.urls import url
from . import views


urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^.well-known/acme-challenge/([\w-]+)', views.lets_encrypt),
    url(r'^cheering$', views.cheering, name='cheering'),
    url(r'^main$', views.main, name='main'),
]
