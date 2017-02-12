from django.conf.urls import url
from django.contrib import admin
from . import views


urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^cp/group$', views.cp_group, name='cp_group'),
    url(r'^cp/daily', views.cp_daily, name='cp_daily'),
    url(r'^shop$', views.shop, name='shop'),
    url(r'^timeline$', views.timeline, name='timeline'),
    url(r'^name$', views.name_chemistry, name='name_chemistry'),
    url(r'^pledge$', views.pledge, name='pledge'),
    url(r'^pledge/rank$', views.pledge_rank, name='pledge_rank'),
    url(r'^rating$', views.approval_rating, name='approval_rating'),
    url(r'^lovetest$', views.love_test, name='love_test'),
    url(r'^admin/', admin.site.urls),
]
