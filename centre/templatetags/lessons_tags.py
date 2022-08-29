from datetime import timedelta

from django import template
from centre.models import *
from authen.middleware import GetDepsFromAD

register = template.Library()


@register.simple_tag(takes_context=True)
def get_themes(context):
    group = context['group']
    elems = StSchedule.objects.filter(program_id=Programs.objects.get(id=Courses.objects.get(id=group.course_id).program_id))
    dict = {}
    for elem in elems:
        if elem.parent_id == None:
            if elem.control_form != '' and not StSchedule.objects.filter(parent_id=elem.id).exists():
                dict[elem.id] = elem.name
        else:
            dict[elem.id] = elem.name
    return dict


@register.simple_tag
def get_teachers():
    teachs = Profiles.objects.filter(teacher=True).order_by('surname')
    dict_teachs = {}
    for teach in teachs:
        dict_teachs[teach.id] = teach.surname+' '+teach.name+' '+teach.patronymic
    return dict_teachs


@register.simple_tag
def get_types():
    return EventTypes.objects.all().order_by('-id')


@register.simple_tag(takes_context=True)
def get_days(context):
    dict_days = {}
    group = context['group']
    if group.course is None:
        date_start = group.event.date_start
        date_finish = group.event.date_finish
    else:
        date_start = group.course.date_start
        date_finish = group.course.date_finish
    index = 1
    while date_start <= date_finish:
        list_d = []
        list_d.append(date_start.strftime('%d.%m.%Y'))
        list_d.append(date_start.strftime('%A'))
        list_d.append(date_start.strftime('%Y-%m-%d'))
        dict_days[index] = list_d
        date_start += timedelta(days=1)
        index += 1
    return dict_days