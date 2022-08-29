from django import template
from centre.models import *

register = template.Library()


@register.simple_tag
def get_mos():
    return Mos.objects.all()


@register.simple_tag
def get_types():
    return OoTypes.objects.all()


@register.simple_tag
def get_poscats():
    return PositionCategories.objects.all()


@register.simple_tag(takes_context=True)
def get_schedule(context):
    crs = context['courselessons']
    vnt = context['eventlessons']
    list_start = []
    for cr in crs:
        list_start.append(cr.lesson_time_start)
    list_lessons = []
    for i, item in enumerate(list_start):
        if i == 0:
            for vn in vnt:
                if vn.lesson_time_start < item:
                    lesson = []
                    lesson.append(vn.lesson_time_start)
                    lesson.append(vn.lesson_time_finish)
                    name = Events.objects.get(id=StudentGroups.objects.get(id=vn.group_id).event_id).name
                    lesson.append(name+'\n(Мероприятие (ИКУ))')
                    lesson.append(vn.theme)
                    lesson.append(vn.group.code)
                    list_lessons.append(lesson)
        else:
            for vn in vnt:
                if list_start[i-1] < vn.lesson_time_start < item:
                    lesson = []
                    lesson.append(vn.lesson_time_start)
                    lesson.append(vn.lesson_time_finish)
                    name = Events.objects.get(id=StudentGroups.objects.get(id=vn.group_id).event_id).name
                    lesson.append(name+'\n(Мероприятие (ИКУ))')
                    lesson.append(vn.theme)
                    lesson.append(vn.group.code)
                    list_lessons.append(lesson)
        cr = crs.get(lesson_time_start=item)
        lesson = []
        lesson.append(cr.lesson_time_start)
        lesson.append(cr.lesson_time_finish)
        name = Programs.objects.get(id=Courses.objects.get(id=StudentGroups.objects.get(id=cr.group_id).course_id).program_id).name
        lesson.append(name+'\n(Курс (ОУ))')
        lesson.append(cr.stschedule.name)
        lesson.append(cr.group.code)
        list_lessons.append(lesson)
        if i == len(list_start)-1:
            for vn in vnt:
                if vn.lesson_time_start > item:
                    lesson = []
                    lesson.append(vn.lesson_time_start)
                    lesson.append(vn.lesson_time_finish)
                    name = Events.objects.get(id=StudentGroups.objects.get(id=vn.group_id).event_id).name
                    lesson.append(name+'\n(Мероприятие (ИКУ))')
                    lesson.append(vn.theme)
                    lesson.append(vn.group.code)
                    list_lessons.append(lesson)
    return list_lessons

@register.simple_tag
def get_today():
    return datetime.datetime.now()