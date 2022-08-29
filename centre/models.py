import datetime

from django.db import models
from authen.models import Profiles
from mptt.models import MPTTModel, TreeForeignKey
from config import settings


def get_path(instance, filename):
    return settings.MEDIA_ROOT+'\\Приказы\\ДПП\\{0}\\{1}'.\
        format(instance.name, filename)


def get_path_offer(instance, filename):
    return settings.MEDIA_ROOT+'\\Договора\\ОУ\\{0}\\СканДоговораОфферты.pdf'.\
        format(instance.code)


class StGroupStatuses(models.Model):
    name = models.CharField(max_length=50, unique=True, null=False, verbose_name='Статус учебной группы')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Статус учебной группы'
        verbose_name_plural = 'Статусы учебных групп'


class Mos(models.Model):
    name = models.CharField(max_length=100, unique=True, null=False, verbose_name='Название МО')
    tpl_name = models.CharField(max_length=10, null=True, verbose_name='Краткое название (для xlsx)')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Муниципальное образование'
        verbose_name_plural = 'Муниципальные образования'


class PositionCategories(models.Model):
    name = models.CharField(max_length=200, unique=True, null=False, verbose_name='Название категории')
    tpl_name = models.CharField(max_length=10, null=True, verbose_name='Краткое название (для xlsx)')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Категория должностей'
        verbose_name_plural = 'Категории должностей'


class AudienceCategories(models.Model):
    name = models.CharField(max_length=200, unique=True, null=False, verbose_name='Название категории')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Категория слушателей'
        verbose_name_plural = 'Категории слушателей'


class Positions(models.Model):
    name = models.CharField(max_length=100, null=False, verbose_name='Название должности')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Должность'
        verbose_name_plural = 'Должности'


class OoTypes(models.Model):
    name = models.CharField(max_length=100, unique=True, null=False, verbose_name='Наименование типа ОО')
    tpl_name = models.CharField(max_length=10, null=True, verbose_name='Краткое название (для xlsx)')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Тип ОО'
        verbose_name_plural = 'Типы ОО'


class EventTypes(models.Model):
    name = models.CharField(max_length=100, unique=True, null=False, verbose_name='Тип мероприятия (ИКУ)')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Тип мероприятия'
        verbose_name_plural = 'Типы мероприятий'


class Oos(models.Model):
    mo = models.ForeignKey(
        Mos,
        on_delete=models.PROTECT,
        default=1,
        verbose_name='МО'
    )
    short_name = models.CharField(max_length=150, blank=True, null=True, verbose_name='Краткое название ОО')
    full_name = models.CharField(max_length=300, blank=True, null=True, verbose_name='Полное название ОО')
    type_oo = models.ForeignKey(
        OoTypes,
        on_delete=models.PROTECT,
        default=1,
        verbose_name='Тип ОО'
    )
    form = models.CharField(max_length=150, blank=True, null=True, verbose_name='Форма ОО')

    def __str__(self):
        return str(self.id)

    class Meta:
        verbose_name = 'Образовательная организация'
        verbose_name_plural = 'Образовательные организации'


class Programs(models.Model):
    department = models.CharField(max_length=300,
                                  default='Учебный центр',
                                  null=False,
                                  verbose_name='Структурное подразделение')
    name = models.CharField(max_length=500,
                            default='',
                            null=False,
                            verbose_name='Наименование программы')
    type_dpp = models.CharField(max_length=100, default='Повышение квалификации', null=False, verbose_name='Тип программы')
    duration = models.PositiveIntegerField(verbose_name='Объем программы (часов)')
    categories = models.ManyToManyField(
        AudienceCategories,
        verbose_name='Категории слушателей'
    )
    kug_on_edit = models.CharField(max_length=250, default='', null=True, verbose_name='На редактировании')
    annotation = models.TextField(max_length=1500, verbose_name='Аннотация')
    order_id = models.CharField(max_length=50, verbose_name='Номер приказа')
    order_date = models.DateField(default=None, null=True, verbose_name='Дата приказа')
    order_file = models.FileField(upload_to=get_path, null=True, max_length=1000, verbose_name='Скан приказа')
    price = models.PositiveIntegerField(default=0, verbose_name='Стоимость')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Программа'
        verbose_name_plural = 'Программы'


class StSchedule(MPTTModel):
    program = models.ForeignKey(
        Programs,
        on_delete=models.CASCADE,
        verbose_name='Программа',
        related_name='SchProgram',
    )
    parent = TreeForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children',
        verbose_name='Родитель'
    )
    name = models.CharField(max_length=500,
                            default='Наименование',
                            null=False,
                            verbose_name='Наименование модуля (раздела)')
    total_hours = models.PositiveIntegerField(verbose_name='Общее количество часов')
    lecture_hours = models.PositiveIntegerField(verbose_name='Количество лекционных часов')
    practice_hours = models.PositiveIntegerField(verbose_name='Количество часов практики')
    trainee_hours = models.PositiveIntegerField(verbose_name='Количество часов стажировок')
    individual_hours = models.PositiveIntegerField(verbose_name='Количество часов самостоятельной работы')
    control_form = models.CharField(max_length=100, default='', verbose_name='Форма контроля')

    def __str__(self):
        return self.program.name+':'+self.name

    class Meta:
        verbose_name = 'Раздел (модуль) КУГ'
        verbose_name_plural = 'Разделы (модули) КУГ'
        unique_together = ('program', 'name')


class Courses(models.Model):
    program = models.ForeignKey(
        Programs,
        on_delete=models.CASCADE,
        default=1,
        verbose_name='ДПП',
        related_name='CourseDPP'
    )
    place = models.CharField(max_length=500, default='ГАУ ИО ЦОПМКиМКО', verbose_name='Место проведения')
    date_start = models.DateField(default=datetime.datetime.now, verbose_name='Дата начала обучения')
    date_finish = models.DateField(default=datetime.datetime.now, verbose_name='Дата окончания обучения')

    def get_program_name(self):
        return self.CourseDPP.name

    def __str__(self):
        return self.program.name

    class Meta:
        verbose_name = 'Курс'
        verbose_name_plural = 'Курсы'


class Events(models.Model):
    department = models.CharField(max_length=300,
                                  default='Учебный центр',
                                  null=False,
                                  verbose_name='Структурное подразделение')
    type = models.ForeignKey(
        EventTypes,
        on_delete=models.PROTECT,
        default=1,
        null=False,
        verbose_name='Тип мероприятия'
    )
    name = models.CharField(max_length=300, default='', verbose_name='Наименование')
    duration = models.PositiveIntegerField(default=0, verbose_name='Объем (количество часов)')
    categories = models.ManyToManyField(
        AudienceCategories,
        verbose_name='Категории слушателей'
    )
    place = models.CharField(max_length=500, default='ГАУ ИО ЦОПМКиМКО', verbose_name='Место проведения')
    date_start = models.DateField(default=datetime.datetime.now, verbose_name='Дата начала проведения')
    date_finish = models.DateField(default=datetime.datetime.now, verbose_name='Дата окончания проведения')
    price = models.PositiveIntegerField(default=0, verbose_name='Стоимость')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Мероприятие'
        verbose_name_plural = 'Мероприятия'


class StudentGroups(models.Model):
    code = models.CharField(max_length=50, default='', unique=True, verbose_name='Шифр')
    course = models.ForeignKey(
        Courses,
        on_delete=models.CASCADE,
        null=True,
        default=None,
        verbose_name='Курс'
    )
    event = models.ForeignKey(
        Events,
        on_delete=models.CASCADE,
        null=True,
        default=None,
        verbose_name='Мероприятие'
    )
    curator = models.ForeignKey(
        Profiles,
        on_delete=models.PROTECT,
        null=True,
        default=None,
        verbose_name='Куратор',
        related_name='curator'
    )
    students = models.ManyToManyField(
        Profiles,
        verbose_name='Обучающиеся',
    )
    students_number = models.PositiveIntegerField(blank=True,
                                                  null=True,
                                                  verbose_name='Плановое количество мест')
    status = models.ForeignKey(
        StGroupStatuses,
        on_delete=models.PROTECT,
        default=1,
        null=False,
        verbose_name='Статус учебной группы'
    )
    offer = models.FileField(default=None,
                             upload_to=get_path_offer,
                             verbose_name='Скан договора оферты',
                             max_length=1000)
    event_url = models.URLField(default='https://coko38.ru', verbose_name='Ссылка на мероприятие')
    survey_show = models.BooleanField(default=False, verbose_name='Показ ссылки на опрос')
    survey_url = models.URLField(
        default='https://docs.google.com/forms/d/e/1FAIpQLSeIdFOzzH8jDe64hlofqvAkE5639E1VLGQnP7aCKOKnjnAS8g/viewform',
        verbose_name='Ссылка на опрос')
    study_form = models.CharField(max_length=100, default='Без использования ДОТ', verbose_name='Форма обучения группы')
    date_enroll = models.DateField(default=None, null=True, verbose_name='Дата приказа о зачислении')
    date_exp = models.DateField(default=None, null=True, verbose_name='Дата приказа об отчислении')
    enroll_number = models.CharField(max_length=50, default='', verbose_name='Номер приказа о зачислении')
    exp_number = models.CharField(max_length=50, default='', verbose_name='Номер приказа об отчислении')

    def __str__(self):
        return self.code

    class Meta:
        verbose_name = 'Учебная группа'
        verbose_name_plural = 'Учебные группы'


class CourseLessons(models.Model):
    group = models.ForeignKey(
        StudentGroups,
        on_delete=models.CASCADE,
        default=1,
        null=False,
        verbose_name='Курс'
    )
    stschedule = models.ForeignKey(
        StSchedule,
        on_delete=models.CASCADE,
        default=None,
        null=True,
        verbose_name='Раздел/тема'
    )
    lecture_hours = models.PositiveIntegerField(verbose_name='Количество лекционных часов')
    practice_hours = models.PositiveIntegerField(verbose_name='Количество часов практики')
    trainee_hours = models.PositiveIntegerField(verbose_name='Количество часов стажировок')
    individual_hours = models.PositiveIntegerField(verbose_name='Количество часов самостоятельной работы')
    lesson_time_start = models.DateTimeField(
        default=datetime.datetime.now,
        null=True,
        verbose_name='Время начала занятия',
    )
    lesson_time_finish = models.DateTimeField(
        default=datetime.datetime.now,
        null=True,
        verbose_name='Время окончания занятия',
    )
    teacher = models.ForeignKey(
        Profiles,
        on_delete=models.PROTECT,
        blank=True,
        null=True,
        verbose_name='Преподаватель'
    )
    distance = models.BooleanField(default=False, verbose_name='Дистанционное занятие')
    control = models.CharField(max_length=50, default='', verbose_name='Контрольное занятие')

    def __str__(self):
        return self.stschedule.name

    class Meta:
        verbose_name = 'Занятие (курсы)'
        verbose_name_plural = 'Занятия (курсы)'


class EventsLessons(models.Model):
    group = models.ForeignKey(
        StudentGroups,
        on_delete=models.CASCADE,
        default=1,
        null=False,
        verbose_name='Мероприятие'
    )
    theme = models.TextField(max_length=500, null=False, blank=False, verbose_name='Тема')
    lecture_hours = models.PositiveIntegerField(verbose_name='Количество лекционных часов')
    practice_hours = models.PositiveIntegerField(verbose_name='Количество часов практики')
    lesson_time_start = models.DateTimeField(
        default=datetime.datetime.now,
        verbose_name='Время начала занятия',
    )
    lesson_time_finish = models.DateTimeField(
        default=datetime.datetime.now,
        verbose_name='Время окончания занятия',
    )
    teacher = models.ForeignKey(
        Profiles,
        on_delete=models.PROTECT,
        blank=True,
        null=True,
        verbose_name='Преподаватель'
    )

    def __str__(self):
        return self.theme

    class Meta:
        verbose_name = 'Занятие (мероприятия)'
        verbose_name_plural = 'Занятия (мероприятия)'


def upload_reports(instance, filename):
    return 'Отчеты\\ПК-1\\{0}\\1'.\
        format(instance.admin.surname+' '+instance.admin.name[:1]+'.'+instance.admin.patronymic[:1],
               filename)


class Reports(models.Model):
    admin = models.ForeignKey(
        Profiles,
        on_delete=models.CASCADE,
        null=False,
        default=1,
        verbose_name='Пользователь'
    )
    date_start = models.DateTimeField(null=True, default=None, verbose_name='Дата запуска процесса')
    date_finish = models.DateTimeField(null=True, default=None, verbose_name='Дата окончания процесса')
    type_report = models.CharField(max_length=50, default='', verbose_name='Тип отчета')
    report = models.FileField(null=True, default=None, verbose_name='Файл отчета')

    def __str__(self):
        return self.type_report+' - '+self.admin.surname+'.'+self.admin.name[:1]+'.'+self.admin.patronymic[:1]

    class Meta:
        verbose_name = 'Отчет'
        verbose_name_plural = 'Отчеты'


class PlanningParameters(models.Model):
    name = models.CharField(max_length=150, default='', unique=True, verbose_name='Наименование параметра')
    value = models.PositiveIntegerField(default=0, verbose_name='Значение')
    alias = models.CharField(max_length=50, default='', unique=True, verbose_name='Алиас')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Параметр планирования'
        verbose_name_plural = 'Параметры планирования'


class StudentsCerts(models.Model):
    group = models.ForeignKey(
        StudentGroups,
        on_delete=models.PROTECT,
        default=None,
        null=True,
        verbose_name='Учебная группа'
    )
    student = models.ForeignKey(
        Profiles,
        on_delete=models.PROTECT,
        default=None,
        null=True,
        verbose_name='Обучающийся'
    )
    reg_number = models.CharField(max_length=50, null=False, default='', verbose_name='Порядковый регистрационный номер')
    blank_serial = models.CharField(max_length=50, null=False, default='', verbose_name='Серия бланка удостоверения')
    blank_number = models.CharField(max_length=50, null=False, default='', verbose_name='Номер бланка удостоверения')

    def __str__(self):
        return self.student.surname+' '+self.student.name[:1]+'.'+self.student.patronymic[:1]+' ('+self.group.code+')'

    class Meta:
        verbose_name = 'Удостоверение о ПК'
        verbose_name_plural = 'Удостоверения о ПК'
        unique_together = ('reg_number', 'blank_serial', 'blank_number')

# Create your models here.
