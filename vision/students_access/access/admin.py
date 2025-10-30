from django.contrib import admin
from access.models import AccessRecord

# Register your models here.
@admin.register(AccessRecord)
class AccessRecordAdmin(admin.ModelAdmin):
    pass;
