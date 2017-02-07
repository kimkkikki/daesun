from django.contrib import admin
from . import models


admin.site.register(models.Scraps, models.ScrapsAdmin)
admin.site.register(models.Pledge, models.PledgeAdmin)
