from django import template
from centre.models import *
from students.models import Apps, CoursesForms, EventsForms

register = template.Library()


@register.simple_tag
def get_programs():
    return Programs.objects.all().order_by('-id')


@register.simple_tag(takes_context=True)
def get_app(context, id_student):
    group = context['group']
    return Apps.objects.filter(profile_id=id_student).get(group_id=group.id)


@register.simple_tag
def get_study_doc_id(id_app):
    app = Apps.objects.get(id=id_app)
    return CoursesForms.objects.filter(group_id=app.group_id).get(profile_id=app.profile_id).edu_doc_id


@register.simple_tag
def get_certificate(id_app):
    return Apps.objects.get(id=id_app).certificate_id


@register.simple_tag(takes_context=True)
def CheckChooseOo(context, id_student):
    group = context['group']
    if group.course is None:
        form = EventsForms.objects.filter(group_id=group.id).get(profile_id=id_student)
    else:
        form = CoursesForms.objects.filter(group_id=group.id).get(profile_id=id_student)
    if form.mo is not None:
        if form.region.name == 'Иркутская область' and form.oo_new is not None:
            return False
    return True


@register.simple_tag(takes_context=True)
def NoCheckOo(context):
    group = context['group']
    if group.course is None:
        forms = EventsForms.objects.filter(group_id=group.id)
    else:
        forms = CoursesForms.objects.filter(group_id=group.id)
    for form in forms:
        if form.mo is not None:
            if form.region.name == 'Иркутская область' and form.oo_new is not None:
                return False
    return True


@register.simple_tag(takes_context=True)
def CheckPlanningCourse(context):
    if StudentGroups.objects.filter(course__in=Courses.objects.filter(program_id=context['id_prog'])).\
        filter(status_id=StGroupStatuses.objects.get(name='Идет обучение')).exists():
        return True
    else:
        return False
