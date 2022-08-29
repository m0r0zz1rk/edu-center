from django.contrib import admin
from .models import States, Profiles
from import_export.admin import ImportExportModelAdmin


@admin.register(States)
class StatesAdmin(ImportExportModelAdmin):
    pass


@admin.register(Profiles)
class ProfilesAdmin(admin.ModelAdmin):
    exclude = ('user',)
# Register your models here.
