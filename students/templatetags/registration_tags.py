from django import template
from centre.models import Events, StudentGroups, Courses

register = template.Library()


@register.simple_tag(takes_context=True)
def get_event(context):
    return Events.objects.get(id=StudentGroups.objects.get(id=context['id_group']).event_id)


@register.simple_tag(takes_context=True)
def get_course(context):
    return Courses.objects.get(id=StudentGroups.objects.get(id=context['id_group']).course_id)