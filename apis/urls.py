from django.conf.urls import url
from django.conf import settings
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^cp/group$', views.cp_group, name='cp_group'),
    url(r'^cp/daily', views.cp_daily, name='cp_daily'),
    url(r'^shop$', views.shop, name='shop'),
    url(r'^admin/', admin.site.urls),
]


# This enables static files to be served from the Gunicorn server
# In Production, serve static files from Google Cloud Storage or an alternative
# CDN
if settings.DEBUG:
    urlpatterns += staticfiles_urlpatterns()
