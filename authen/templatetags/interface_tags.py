from django import template
from authen.models import *
from authen.middleware import GetDataFromAD

register = template.Library()


@register.simple_tag(takes_context=True)
def get_fio(context):
    request = context['request']
    if Profiles.objects.filter(user_id=request.user.id).exists():
        prof = Profiles.objects.get(user_id=request.user.id)
        fio = prof.surname+" "+prof.name+" "+prof.patronymic
        return fio
    else:
        from_ad = GetDataFromAD(request)
        username = from_ad[0][0]
        return username


@register.simple_tag(takes_context=True)
def get_group(context):
    request = context['request']
    groups = request.user.groups.values_list('name', flat=True)
    return groups[0]


@register.simple_tag(takes_context=True)
def check_teacher(context):
    request = context['request']
    return Profiles.objects.get(user_id=request.user.id).teacher