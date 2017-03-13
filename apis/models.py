from django.db import models
from django.contrib import admin
from rest_framework import serializers
from datetime import datetime


class Scraps(models.Model):
    class Meta:
        db_table = 'scraps'
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=300)
    link = models.CharField(max_length=300)
    cp = models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class ScrapsAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'cp', 'created_at')
    list_filter = ('cp', 'created_at')
    search_fields = ['title']


class Pledge(models.Model):
    class Meta:
        db_table = 'pledge'
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200)
    contents = models.TextField(null=True)
    category = models.IntegerField(default=0)
    candidate = models.CharField(max_length=10)
    like = models.IntegerField(default=0)
    unlike = models.IntegerField(default=0)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)


class PledgeAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'contents', 'candidate', 'category', 'like', 'unlike', 'created', 'updated')
    list_filter = ('candidate', 'category')


class Keywords(models.Model):
    class Meta:
        db_table = 'keywords'
    id = models.AutoField(primary_key=True)
    candidate = models.CharField(max_length=10)
    keyword = models.CharField(max_length=20)
    count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)


class KeywordsAdmin(admin.ModelAdmin):
    list_display = ('id', 'candidate', 'keyword', 'count', 'created_at')
    list_filter = ['candidate']
    search_fields = ['candidate', 'keyword']


class TimeLimitBoard(models.Model):
    class Meta:
        db_table = 'time_limit_board'
    id = models.AutoField(primary_key=True)
    contents = models.TextField()
    created = models.DateTimeField(auto_now_add=True)


class TimeLimitBoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeLimitBoard
        fields = '__all__'


class ApprovalRating(models.Model):
    class Meta:
        db_table = 'approval_rating'
    id = models.AutoField(primary_key=True)
    candidate = models.CharField(max_length=10, db_index=True)
    rating = models.FloatField(default=0)
    cp = models.CharField(max_length=20, db_index=True)
    type = models.IntegerField(default=0, db_index=True)
    date = models.DateField(default=datetime.now, db_index=True)
    created = models.DateTimeField(auto_now_add=True)


class ApprovalRatingAdmin(admin.ModelAdmin):
    list_display = ('id', 'candidate', 'rating', 'cp', 'type', 'date', 'created')
    list_filter = ['cp']


class LoveOrHate(models.Model):
    class Meta:
        db_table = 'love_or_hate'
    id = models.AutoField(primary_key=True)
    speaker = models.CharField(max_length=10)
    target = models.CharField(max_length=10)
    scraps = models.ForeignKey(Scraps, to_field='id', db_column='related_to')
    created = models.DateTimeField(auto_now_add=True)


class LoveOrHateAdmin(admin.ModelAdmin):
    list_display = ('id', 'speaker', 'target', 'scraps')
    list_filter = ['speaker', 'target']


class IssueKeyword(models.Model):
    class Meta:
        db_table = 'issue_keyword'
    id = models.AutoField(primary_key=True)
    candidate = models.CharField(max_length=10, db_index=True)
    keywords = models.TextField(max_length=200)
    date = models.DateField(default=datetime.now, db_index=True)


class IssueKeywordAdmin(admin.ModelAdmin):
    list_display = ('id', 'candidate', 'keywords', 'date')


class CheeringMessage(models.Model):
    class Meta:
        db_table = 'cheering_message'
    id = models.AutoField(primary_key=True)
    candidate = models.CharField(max_length=10, db_index=True)
    message = models.TextField(max_length=200)
    ip = models.CharField(max_length=15)
    created = models.DateTimeField(auto_now_add=True, db_index=True)


class CheeringMessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'candidate', 'message', 'ip', 'created')


class LuckyRating(models.Model):
    class Meta:
        db_table = 'lucky_rating'
    id = models.AutoField(primary_key=True)
    candidate = models.CharField(max_length=10, db_index=True)
    type = models.CharField(max_length=10, db_index=True)
    created = models.DateTimeField(auto_now_add=True, db_index=True)


class LuckyRatingAdmin(admin.ModelAdmin):
    list_display = ('id', 'candidate', 'type', 'created')
