from django.db import models


class Scraps(models.Model):
    class Meta:
        db_table = 'scraps'
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=300)
    link = models.CharField(max_length=300)
    cp = models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Pledge(models.Model):
    class Meta:
        db_table = 'pledge'
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200)
    contents = models.TextField(null=True)
    category = models.IntegerField(default=0)
    candidate = models.CharField(max_length=10)
    created = models.DateTimeField(auto_now_add=True)
