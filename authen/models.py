import datetime

from django.db import models
from django.contrib.auth.models import User


class States(models.Model):
    name = models.CharField(max_length=100, verbose_name='Название государства')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Государство'
        verbose_name_plural = 'Государства'


class Profiles(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        verbose_name='Пользователь'
    )
    state = models.ForeignKey(
        States,
        on_delete=models.PROTECT,
        default=1,
        verbose_name='Государство'
    )
    phone = models.CharField(max_length=20, unique=True, default='', verbose_name='Телефон')
    surname = models.CharField(max_length=100, default='', verbose_name='Фамилия')
    name = models.CharField(max_length=100, default='', verbose_name='Имя')
    patronymic = models.CharField(max_length=100, default='', verbose_name='Отчество')
    sex = models.BooleanField(default=True, verbose_name='Пол')
    birthday = models.DateField(default=datetime.datetime.now, verbose_name='Дата рождения')
    snils = models.CharField(max_length=15, unique=True, default='', verbose_name='СНИЛС')
    date_reg = models.DateField(auto_now_add=True, verbose_name='Дата регистрации')
    teacher = models.BooleanField(default=False, verbose_name='Преподаватель')
    health = models.BooleanField(default=False, verbose_name='Ограничения по здоровью')

    def __str__(self):
        return self.user.email

    class Meta:
        verbose_name = 'Профиль пользователя'
        verbose_name_plural = 'Профили пользователей'
