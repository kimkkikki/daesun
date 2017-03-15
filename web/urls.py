from django.conf.urls import url
from . import views


urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^.well-known/acme-challenge/([\w-]+)', views.lets_encrypt),
    url(r'^cheering$', views.cheering, name='cheering'),
    url(r'^rating$', views.rating, name='rating'),
    url(r'^pledge$', views.pledge, name='pledge'),
    url(r'^constellation$', views.constellation_chemistry, name='constellation'),
    url(r'^main$', views.main, name='main'),
]
