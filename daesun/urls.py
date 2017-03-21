"""daesun URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import include, url
from django.contrib import admin
from django.conf import settings
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from web import views
from django.conf.urls.static import static


urlpatterns = [
    url(r'^', include('web.urls')),
    url(r'^apis/', include('apis.urls')),
    url(r'^admin/', admin.site.urls),
    url(r'^_ah/health', views.google_app_engine_health_check),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


# This enables static files to be served from the Gunicorn server
# In Production, serve static files from Google Cloud Storage or an alternative
# CDN
if settings.DEBUG:
    urlpatterns += staticfiles_urlpatterns()
