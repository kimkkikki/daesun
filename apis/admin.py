from django.contrib import admin
from . import models


admin.site.register(models.Scraps, models.ScrapsAdmin)
admin.site.register(models.Pledge, models.PledgeAdmin)
admin.site.register(models.Keywords, models.KeywordsAdmin)
admin.site.register(models.ApprovalRating, models.ApprovalRatingAdmin)
admin.site.register(models.LoveOrHate, models.LoveOrHateAdmin)
admin.site.register(models.IssueKeyword, models.IssueKeywordAdmin)
admin.site.register(models.CheeringMessage, models.CheeringMessageAdmin)
admin.site.register(models.LuckyRating, models.LuckyRatingAdmin)
admin.site.register(models.Calendar, models.CalendarAdmin)
admin.site.register(models.Honor, models.HonorAdmin)
admin.site.register(models.Candidate, models.CandidateAdmin)
