from django.conf.urls import url
from . import views


urlpatterns = [
    url(r'^$', views.main, name='main'),
    url(r'^terms$', views.terms, name='terms'),
    url(r'^policy$', views.policy, name='policy'),
    url(r'^labs$', views.labs, name='labs'),
    url(r'^.well-known/acme-challenge/([\w-]+)', views.lets_encrypt),
    url(r'^cheering$', views.cheering, name='cheering'),
    url(r'^rating$', views.rating, name='rating'),
    url(r'^pledge$', views.pledge, name='pledge'),
    url(r'^constellation$', views.constellation_chemistry, name='constellation'),
    url(r'^blood$', views.blood_chemistry, name='blood'),
    url(r'^zodiac$', views.zodiac_chemistry, name='zodiac'),
    url(r'^total$', views.total_chemistry, name='total'),
    url(r'^slot$', views.slot, name='slot'),
    url(r'^luckyname$', views.luckyname, name='luckyname'),
    url(r'^keyword$', views.keyword, name='keyword'),
    url(r'^news$', views.news, name='news'),
    url(r'^slot/honor$', views.slot_honor, name='slot_honor'),
    url(r'^solor$', views.solor, name='solor'),
]
