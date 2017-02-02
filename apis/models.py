from django.db import models

# Create your models here.


class Scraps(models.Model):
    class Meta:
        db_table = 'scraps'
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=300)
    link = models.CharField(max_length=300)
    cp = models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
