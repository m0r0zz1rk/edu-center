from django.contrib import admin
from import_export import resources
from import_export.admin import ImportExportModelAdmin
from import_export.fields import Field
from import_export.widgets import ForeignKeyWidget

from .models import *


@admin.register(Mos)
class MosAdmin(ImportExportModelAdmin):
    list_display = ('name', 'tpl_name')


@admin.register(PositionCategories)
class PositionCategoriesAdmin(ImportExportModelAdmin):
    pass


@admin.register(AudienceCategories)
class AudienceCategoriesAdmin(ImportExportModelAdmin):
    pass


@admin.register(Positions)
class PositionsAdmin(ImportExportModelAdmin):
    pass


@admin.register(OoTypes)
class OoTypesAdmin(ImportExportModelAdmin):
    pass


class OoResources(resources.ModelResource):
    mo = Field(attribute="mo", column_name="МО",
                         widget=ForeignKeyWidget(Mos, "name"))
    type_oo = Field(attribute="type_oo", column_name="Тип ОО",
               widget=ForeignKeyWidget(OoTypes, "name"))

    class Meta:
        model = Oos
        fields = ('mo', 'short_name', 'full_name', 'type_oo', 'form')


@admin.register(Oos)
class OosAdmin(ImportExportModelAdmin):
    list_display = ('mo', 'short_name', 'full_name', 'type_oo', 'form')
    resource_class = OoResources


@admin.register(StGroupStatuses)
class StGroupStatusesAdmin(admin.ModelAdmin):
    pass


@admin.register(PlanningParameters)
class PlanningParametersAdmin(admin.ModelAdmin):
    pass

# Register your models here.
