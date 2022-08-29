from django.contrib import admin
from import_export.admin import ImportExportModelAdmin

from .models import *


@admin.register(DocsTypes)
class DocsTypesAdmin(admin.ModelAdmin):
    pass


@admin.register(Docs)
class DocsAdmin(admin.ModelAdmin):
    pass


@admin.register(Statuses)
class StatusesAdmin(admin.ModelAdmin):
    pass


@admin.register(EducationLevels)
class EducationLevelsAdmin(admin.ModelAdmin):
    pass


@admin.register(EducationCats)
class EducationCatsAdmin(admin.ModelAdmin):
    pass


@admin.register(Regions)
class RegionsAdmin(ImportExportModelAdmin):
    pass

# Register your models here.
