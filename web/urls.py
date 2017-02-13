from django.conf.urls import url
from . import views


urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^graphs$', views.graphs, name='graphs'),
    url(r'^lovetest$', views.love_test, name='love_test'),

]
