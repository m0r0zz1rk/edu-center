from django import template
from centre.models import *
from authen.middleware import GetDepsFromAD

register = template.Library()


@register.simple_tag(takes_context=True)
def get_elements(context):
    dpp = context['dpp']
    return StSchedule.objects.filter(program_id=dpp.id).order_by('tree_id', 'lft')


@register.simple_tag
def get_children(id):
    return StSchedule.objects.filter(parent_id=id)


@register.simple_tag
def get_number_module(str):
    dotpos = str.find('.')
    return [str[:dotpos], str[dotpos+1:]]


@register.simple_tag
def get_number_theme(str):
    dotpos = str.find('.', str.find('.')+1)
    return [str[:dotpos], str[dotpos+1:]]


@register.simple_tag
def get_deps():
    return GetDepsFromAD()


@register.simple_tag
def get_cats():
    return AudienceCategories.objects.all()


@register.simple_tag
def check_total(id):
    if StSchedule.objects.filter(parent_id=id).exists():
        sts = StSchedule.objects.get(id=id)
        total = sts.total_hours
        total_ch = 0
        for child in StSchedule.objects.filter(parent_id=id):
            total_ch += child.total_hours
        if total > total_ch:
            cnt = total - total_ch
            return cnt
        else:
            return 'OK'
    else:
        return None


@register.simple_tag
def check_lecture(id):
    if StSchedule.objects.filter(parent_id=id).exists():
        sts = StSchedule.objects.get(id=id)
        lect = sts.lecture_hours
        lect_ch = 0
        for child in StSchedule.objects.filter(parent_id=id):
            lect_ch += child.lecture_hours
        if lect > lect_ch:
            cnt = lect - lect_ch
            return cnt
        else:
            return 'OK'
    else:
        return None


@register.simple_tag
def check_practice(id):
    if StSchedule.objects.filter(parent_id=id).exists():
        sts = StSchedule.objects.get(id=id)
        prac = sts.practice_hours
        prac_ch = 0
        for child in StSchedule.objects.filter(parent_id=id):
            prac_ch += child.practice_hours
        if prac > prac_ch:
            cnt = prac - prac_ch
            return cnt
        else:
            return 'OK'
    else:
        return None


@register.simple_tag
def check_trainee(id):
    if StSchedule.objects.filter(parent_id=id).exists():
        sts = StSchedule.objects.get(id=id)
        trai = sts.trainee_hours
        trai_ch = 0
        for child in StSchedule.objects.filter(parent_id=id):
            trai_ch += child.trainee_hours
        if trai > trai_ch:
            cnt = trai - trai_ch
            return cnt
        else:
            return 'OK'
    else:
        return None


@register.simple_tag
def check_individual(id):
    if StSchedule.objects.filter(parent_id=id).exists():
        sts = StSchedule.objects.get(id=id)
        indi = sts.individual_hours
        indi_ch = 0
        for child in StSchedule.objects.filter(parent_id=id):
            indi_ch += child.individual_hours
        if indi > indi_ch:
            cnt = indi - indi_ch
            return cnt
        else:
            return 'OK'
    else:
        return None


@register.simple_tag
def check_allkug(program_id):
    if StSchedule.objects.filter(program_id=program_id).exists():
        for parent in StSchedule.objects.filter(program_id=program_id).filter(parent_id=None):
            if StSchedule.objects.filter(parent_id=parent.id).exists():
                total = parent.total_hours
                total_ch = 0
                for child in StSchedule.objects.filter(parent_id=parent.id):
                    total_ch += child.total_hours
                if total > total_ch:
                    return 'FAIL'
                lect = parent.lecture_hours
                lect_ch = 0
                for child in StSchedule.objects.filter(parent_id=parent.id):
                    lect_ch += child.lecture_hours
                if lect > lect_ch:
                    return 'FAIL'
                prac = parent.practice_hours
                prac_ch = 0
                for child in StSchedule.objects.filter(parent_id=parent.id):
                    prac_ch += child.practice_hours
                if prac > prac_ch:
                    return 'FAIL'
                trai = parent.trainee_hours
                trai_ch = 0
                for child in StSchedule.objects.filter(parent_id=parent.id):
                    trai_ch += child.trainee_hours
                if trai > trai_ch:
                    return 'FAIL'
                indi = parent.individual_hours
                indi_ch = 0
                for child in StSchedule.objects.filter(parent_id=parent.id):
                    indi_ch += child.individual_hours
                if indi > indi_ch:
                    return 'FAIL'
    return None


@register.simple_tag
def get_statuses():
    return StGroupStatuses.objects.all().order_by('id')
