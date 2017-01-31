from django.db import models

# Create your models here.


class Scraps(models.Model):
    class Meta:
        db_table = 'scraps'
    id = models.IntegerField
    title = models.CharField(max_length=300)
    link = models.CharField(max_length=300)
    cp = models.CharField(max_length=10)
    created_at = models.DateTimeField
    updated_at = models.DateTimeField
