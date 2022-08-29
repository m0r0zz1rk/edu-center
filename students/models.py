import datetime
import os

from django.db import models
from authen.models import Profiles
from centre.models import Courses, Mos, Oos, PositionCategories, Positions, Events, StudentGroups
from config import settings


def get_path(instance, filename):
    fio = instance.profile.surname+" "+instance.profile.name[:1]+"."+instance.profile.patronymic[:1]
    return settings.MEDIA_ROOT+'\Документы пользователей\\{0}\\{1}\\{2}'.\
        format(instance.doc_type.name, fio, filename)


class Statuses(models.Model):
    name = models.CharField(max_length=50, unique=True, verbose_name='Статус')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Статус'
        verbose_name_plural = 'Статусы'


class EducationLevels(models.Model):
    name = models.CharField(max_length=50, unique=True, verbose_name='Уровень образования')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Уровень образования'
        verbose_name_plural = 'Уровени образования'


class EducationCats(models.Model):
    name = models.CharField(max_length=50, unique=True, verbose_name='Категория получаемого образования')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Категория получаемого образования'
        verbose_name_plural = 'Категории получаемого образования'


class DocsTypes(models.Model):
    name = models.CharField(max_length=100, verbose_name='Наименование типа файла')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Тип документа'
        verbose_name_plural = 'Типы документов'


class Docs(models.Model):
    profile = models.ForeignKey(
        Profiles,
        on_delete=models.CASCADE,
        default=1,
        verbose_name='Владелец',
        related_name='profiledocs'
    )
    doc_type = models.ForeignKey(
        DocsTypes,
        on_delete=models.PROTECT,
        default=1,
        verbose_name='Тип документа'
    )
    upload_date = models.DateField(auto_now_add=True, verbose_name='Дата загрузки файла')
    file = models.FileField(upload_to=get_path, verbose_name='Документ', max_length=1000)

    def filename(self):
        return os.path.basename(self.file.name)

    def __str__(self):
        return str(self.id)

    class Meta:
        verbose_name = 'Документ'
        verbose_name_plural = 'Документы'


class Regions(models.Model):
    name = models.CharField(max_length=150, unique=True, verbose_name="Регион")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Регион'
        verbose_name_plural = 'Регионы'


class EventsForms(models.Model):
    profile = models.ForeignKey(
        Profiles,
        on_delete=models.CASCADE,
        default=1,
        null=False,
        verbose_name='Обучающийся',
        related_name='profileeventforms'
    )
    group = models.ForeignKey(
        StudentGroups,
        on_delete=models.CASCADE,
        default=1,
        null=False,
        verbose_name='Учебная группа'
    )
    workless = models.BooleanField(default=False, verbose_name='Безработный')
    region = models.ForeignKey(
        Regions,
        on_delete=models.PROTECT,
        default=1,
        null=False,
        verbose_name='Регион'
    )
    mo = models.ForeignKey(
        Mos,
        on_delete=models.PROTECT,
        default=1,
        null=True,
        verbose_name='Муниципальное образование'
    )
    oo = models.ForeignKey(
        Oos,
        on_delete=models.PROTECT,
        default=1,
        null=True,
        verbose_name='Организация'
    )
    oo_new = models.CharField(max_length=500, null=True, verbose_name='Организация не из списка')
    position_cat = models.ForeignKey(
        PositionCategories,
        on_delete=models.PROTECT,
        default=None,
        null=True,
        verbose_name='Категория должности'
    )
    position = models.ForeignKey(
        Positions,
        on_delete=models.PROTECT,
        default=None,
        null=True,
        verbose_name='Должность'
    )
    type = models.BooleanField(default=True, verbose_name='Оплата')

    def __str__(self):
        fio = self.profile.surname+' '+self.profile.name+' '+self.profile.patronymic
        return fio+": "+self.group.event.name+" (Анкета)"

    class Meta:
        verbose_name = 'Анкета регистрации на мероприятие'
        verbose_name_plural = 'Анкеты регистрации на мероприятия'


class Apps(models.Model):
    date_create = models.DateField(default=datetime.datetime.now, verbose_name='Дата подачи заявки')
    profile = models.ForeignKey(
        Profiles,
        on_delete=models.CASCADE,
        default=1,
        null=False,
        verbose_name='Обучающийся',
        related_name='profileeventapps'
    )
    group = models.ForeignKey(
        StudentGroups,
        on_delete=models.CASCADE,
        default=1,
        null=False,
        verbose_name='Учебная группа'
    )
    pay_doc = models.ForeignKey(
        Docs,
        on_delete=models.PROTECT,
        null=True,
        default=None,
        verbose_name='Документ об оплате',
        related_name='apppaydoc'
    )
    certificate = models.ForeignKey(
        Docs,
        on_delete=models.PROTECT,
        null=True,
        default=None,
        verbose_name='Скан удостоверения',
        related_name='appcertdoc'
    )
    status = models.ForeignKey(
        Statuses,
        on_delete=models.PROTECT,
        default=1,
        null=False,
        verbose_name='Статус'
    )
    check_diploma_info = models.BooleanField(default=False, verbose_name='Проверка информации о дипломе')
    check_pay = models.BooleanField(default=False, verbose_name='Проверка оплаты')
    check_survey = models.BooleanField(default=False, verbose_name='Проверка прохождения опроса')

    def __str__(self):
        fio = self.profile.surname+' '+self.profile.name+' '+self.profile.patronymic
        if self.group.event is not None:
            return fio+': '+self.group.event.name+' (Заявка)'
        else:
            return fio + ': ' + self.group.course.program.name + ' (Заявка)'

    class Meta:
        verbose_name = 'Заявка на участие в мероприятии'
        verbose_name_plural = 'Заявки на участие в мероприятиях'


class CoursesForms(models.Model):
    profile = models.ForeignKey(
        Profiles,
        on_delete=models.CASCADE,
        default=1,
        null=False,
        verbose_name='Обучающийся',
        related_name='profilecoursesforms'
    )
    group = models.ForeignKey(
        StudentGroups,
        on_delete=models.CASCADE,
        default=1,
        null=False,
        verbose_name='Учебная группа'
    )
    workless = models.BooleanField(default=False, verbose_name='Безработный')
    region = models.ForeignKey(
        Regions,
        on_delete=models.PROTECT,
        default=1,
        null=False,
        verbose_name='Регион'
    )
    mo = models.ForeignKey(
        Mos,
        on_delete=models.PROTECT,
        default=1,
        null=True,
        verbose_name='Муниципальное образование'
    )
    oo = models.ForeignKey(
        Oos,
        on_delete=models.PROTECT,
        default=1,
        null=True,
        verbose_name='Организация'
    )
    oo_new = models.CharField(max_length=500, null=True, verbose_name='Организация не из списка')
    position_cat = models.ForeignKey(
        PositionCategories,
        on_delete=models.PROTECT,
        default=None,
        null=True,
        verbose_name='Категория должности'
    )
    position = models.ForeignKey(
        Positions,
        on_delete=models.PROTECT,
        default=None,
        null=True,
        verbose_name='Должность'
    )
    edu_level = models.ForeignKey(
        EducationLevels,
        on_delete=models.PROTECT,
        null=False,
        default=1,
        verbose_name='Уровень образования'
    )
    edu_cat = models.ForeignKey(
        EducationCats,
        on_delete=models.PROTECT,
        null=True,
        default=None,
        verbose_name='Категория получаемого образования'
    )
    edu_doc = models.ForeignKey(
        Docs,
        on_delete=models.PROTECT,
        null=False,
        default=1,
        verbose_name='Документ об образовании',
        related_name='edudoc'
    )
    check_surname = models.CharField(max_length=100, default='', verbose_name='Фамилия в дипломе')
    change_surname = models.ForeignKey(
        Docs,
        on_delete=models.PROTECT,
        null=True,
        default=None,
        verbose_name='Документ о смене фамилии',
        related_name='changesurnamedoc'
    )
    edu_serial = models.CharField(max_length=30, default='', verbose_name='Cерия документа об образовании')
    edu_number = models.CharField(max_length=30, default='', verbose_name='Номер документа об образовании')
    edu_date = models.DateField(default=None, null=True, verbose_name='Дата выдачи документа об образовании')
    type = models.BooleanField(default=True, verbose_name='Оплата')
    cert_mail = models.BooleanField(default=False, verbose_name='Получение удостоверения почтой')
    address = models.TextField(max_length=1000, default='', verbose_name='Физический адрес доставки удостоверения')

    def __str__(self):
        fio = self.profile.surname+' '+self.profile.name+' '+self.profile.patronymic
        return fio+": "+self.group.course.name+" (Анкета)"

    class Meta:
        verbose_name = 'Анкета регистрации на курс'
        verbose_name_plural = 'Анкеты регистрации на курсы'




# Create your models here.
