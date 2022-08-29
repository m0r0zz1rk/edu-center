import os
from datetime import datetime

from django.contrib.auth.models import User
from django.core.mail import send_mail
from ruopenrefs.providers.mosru import OksmRef
from xlsxtpl.writerx import BookWriter

from authen.models import Profiles
from centre.models import StudentGroups, StGroupStatuses, Courses, Reports, StudentsCerts
from config.celery import app
from config.settings import STATIC_ROOT
from students.models import CoursesForms


@app.task
def EmailOfferPay(recipients, type, name, pay_deadline):
    subject = 'АИС "Учебный Центр": Изменен статус Вашей заявки'
    msg = 'Статус вашей заявки на участие в '+type+' "'+name+'" изменен на "Ждем оплату".\n'
    msg += 'Оплата должна быть произведена не позднее '+pay_deadline+' года.'
    msg += ' Для ознакомления с договором оферты и загрузки документа об олпате перейдите по ссылке:'
    if type in ['курсе повышения квалификации', 'курсе профессиональной переподготовки']:
        msg += ' https://edu-dev.coko38.ru/student/apps?type=course\n'
    else:
        msg += ' https://edu-dev.coko38.ru/student/apps?type=event\n'
    msg += 'С уважением,\nкоманда АИС "Учебный Центр"'
    send_mail(
        subject,
        msg,
        None,
        recipients,
        fail_silently=False,
    )


@app.task
def EmailAcceptPay(recipient, type, name):
    list_rec = []
    list_rec.append(recipient)
    subject = 'АИС "Учебный Центр": Оплата успешно подтверждена'
    msg = 'Статус вашей заявки на участие в '+type+' "'+name+'" изменен на "Оплачено".\n'
    msg += 'В детальном представлении вашей заявки отображается ссылка на обучение.\n'
    msg += 'Чтобы просмотреть ваши заявки перейдите по ссылке:'
    if type in ['курсе повышения квалификации', 'курсе профессиональной переподготовки']:
        msg += ' https://edu-dev.coko38.ru/student/apps?type=course\n'
    else:
        msg += ' https://edu-dev.coko38.ru/student/apps?type=event\n'
    msg += 'С уважением,\nкоманда АИС "Учебный Центр"'
    send_mail(
        subject,
        msg,
        None,
        list_rec,
        fail_silently=False,
    )


@app.task
def EmailDeniedPay(recipient, type, name, message):
    list_rec = []
    list_rec.append(recipient)
    subject = 'АИС "Учебный Центр": Оплата не подтверждена'
    msg = 'Статус вашей заявки на участие в '+type+' "'+name+'" изменен на "Ждем оплату".\n'
    msg += 'Комментарий от куратора группы: '+message+'\n'
    msg += 'Для получения доступа к обучению необходимо загрузить корректный документ об оплате.\n'
    msg += 'Для просмотра заявок и загрузки чека перейдите по ссылке:'
    if type in ['курсе повышения квалификации', 'курсе профессиональной переподготовки']:
        msg += ' https://edu-dev.coko38.ru/student/apps?type=course\n'
    else:
        msg += ' https://edu-dev.coko38.ru/student/apps?type=event\n'
    msg += 'С уважением,\nкоманда АИС "Учебный Центр"'
    send_mail(
        subject,
        msg,
        None,
        list_rec,
        fail_silently=False,
    )


@app.task
def CheckRegistrationEnd():
    groups = StudentGroups.objects.filter(status_id=StGroupStatuses.objects.get(name='Идет регистрация').id)
    for gr in groups:
        if gr.event is None:
            date_start = gr.course.date_start
        else:
            date_start = gr.event.date_start
        delta = date_start - datetime.now().date()
        if delta.days <= 10:
            gr.status_id = StGroupStatuses.objects.get(name='Ожидает утверждения состава').id
            gr.save()


@app.task
def ShowSurveyUrl():
    groups = StudentGroups.objects.filter(status_id=StGroupStatuses.objects.get(name='Идет обучение').id)
    for gr in groups:
        if gr.event is None:
            date_start = gr.course.date_start
        else:
            date_start = gr.event.date_start
        delta = date_start - datetime.now().date()
        if delta.days <= 1:
            gr.survey_show = True
            gr.save()


@app.task
def generate_pk1(year, profile_id, report_id):
    info = {
        'year': year,
    }
    crses = Courses.objects.filter(date_start__year=year).select_related('program')
    d_vls = {}
    d_health = {}
    if StudentGroups.objects.filter(course__in=crses).exists():
        st_grs = StudentGroups.objects.filter(course__in=crses).select_related('course').prefetch_related('students')
        for st_gr in st_grs:
            forms = CoursesForms.objects.filter(group_id=st_gr.id). \
                select_related('profile', 'position_cat', 'position', 'edu_level', 'edu_cat')
            if st_gr.students.filter(health=True).exists():
                if 'health_total' in d_health.keys():
                    d_health['health_total'] += st_gr.students.filter(health=True).count()
                else:
                    d_health['health_total'] = st_gr.students.filter(health=True).count()
                if st_gr.students.filter(health=True).filter(sex=False).exists():
                    if 'health_women' in d_health.keys():
                        d_health['health_women'] += st_gr.students.filter(health=True).count()
                    else:
                        d_health['health_women'] = st_gr.students.filter(health=True).count()
                if st_gr.course.program.type_dpp == 'Повышение квалификации':
                    if 'health_upper' in d_health.keys():
                        d_health['health_upper'] += st_gr.students.filter(health=True).count()
                    else:
                        d_health['health_upper'] = st_gr.students.filter(health=True).count()
                else:
                    if 'health_prof' in d_health.keys():
                        d_health['health_prof'] += st_gr.students.filter(health=True).count()
                    else:
                        d_health['health_prof'] = st_gr.students.filter(health=True).count()
            if st_gr.course.program.type_dpp == 'Повышение квалификации':
                if 'dpp_upper' in d_vls.keys():
                    d_vls['dpp_upper'] += 1
                else:
                    d_vls['dpp_upper'] = 1
                if 'count_upper' in d_vls.keys():
                    d_vls['count_upper'] += st_gr.students.count()
                else:
                    d_vls['count_upper'] = st_gr.students.count()
                if 'women_upper' in d_vls.keys():
                    d_vls['women_upper'] += st_gr.students.filter(sex=False).count()
                else:
                    d_vls['women_upper'] = st_gr.students.filter(sex=False).count()
                if st_gr.study_form != 'Без использования ДОТ':
                    if 'upper_dot' in d_vls.keys():
                        d_vls['upper_dot'] += 1
                    else:
                        d_vls['upper_dot'] = 1
                    if 'upper_cntdot' in d_vls.keys():
                        d_vls['upper_cntdot'] += st_gr.students.count()
                    else:
                        d_vls['upper_cntdot'] = st_gr.students.count()
                    if st_gr.study_form == 'Исключительно ДОТ':
                        if 'upper_onlydot' in d_vls.keys():
                            d_vls['upper_onlydot'] += st_gr.students.count()
                        else:
                            d_vls['upper_onlydot'] = st_gr.students.count()
            else:
                if 'dpp_prof' in d_vls.keys():
                    d_vls['dpp_prof'] += 1
                else:
                    d_vls['dpp_prof'] = 1
                if 'count_prof' in d_vls.keys():
                    d_vls['count_prof'] += st_gr.students.count()
                else:
                    d_vls['count_prof'] = st_gr.students.count()
                if 'women_prof' in d_vls.keys():
                    d_vls['women_prof'] += st_gr.students.filter(sex=False).count()
                else:
                    d_vls['women_prof'] = st_gr.students.filter(sex=False).count()
                if st_gr.study_form != 'Без использования ДОТ':
                    if 'prof_dot' in d_vls.keys():
                        d_vls['prof_dot'] += 1
                    else:
                        d_vls['prof_dot'] = 1
                    if 'prof_cntdot' in d_vls.keys():
                        d_vls['prof_cntdot'] += st_gr.students.count()
                    else:
                        d_vls['prof_cntdot'] = st_gr.students.count()
                    if st_gr.study_form == 'Исключительно ДОТ':
                        if 'prof_cntdot' in d_vls.keys():
                            d_vls['prof_onlydot'] += st_gr.students.count()
                        else:
                            d_vls['prof_onlydot'] = st_gr.students.count()
            for student in st_gr.students.all():
                if student.sex is False:
                    if 'women_total' in d_vls.keys():
                        d_vls['women_total'] += 1
                    else:
                        d_vls['women_total'] = 1
            for form in forms:
                d_chk = {}
                age = datetime.today().year - form.profile.birthday.year
                if age < 25:
                    if 'total_25' in d_vls.keys():
                        d_vls['total_25'] += 1
                    else:
                        d_vls['total_25'] = 1
                    if form.profile.sex is False:
                        if 'total_w_25' in d_vls.keys():
                            d_vls['total_w_25'] += 1
                        else:
                            d_vls['total_w_25'] = 1
                    if form.group.course.program.type_dpp == 'Повышение квалификации':
                        if 'upper_25' in d_vls.keys():
                            d_vls['upper_25'] += 1
                        else:
                            d_vls['upper_25'] = 1
                        if form.profile.sex is False:
                            if 'upper_w_25' in d_vls.keys():
                                d_vls['upper_w_25'] += 1
                            else:
                                d_vls['upper_w_25'] = 1
                    else:
                        if 'prof_25' in d_vls.keys():
                            d_vls['prof_25'] += 1
                        else:
                            d_vls['prof_25'] = 1
                        if form.profile.sex is False:
                            if 'prof_w_25' in d_vls.keys():
                                d_vls['prof_w_25'] += 1
                            else:
                                d_vls['prof_w_25'] = 1
                elif 25 <= age <= 29:
                    if 'total_25_29' in d_vls.keys():
                        d_vls['total_25_29'] += 1
                    else:
                        d_vls['total_25_29'] = 1
                    if form.profile.sex is False:
                        if 'total_w_25_29' in d_vls.keys():
                            d_vls['total_w_25_29'] += 1
                        else:
                            d_vls['total_w_25_29'] = 1
                    if form.group.course.program.type_dpp == 'Повышение квалификации':
                        if 'upper_25_29' in d_vls.keys():
                            d_vls['upper_25_29'] += 1
                        else:
                            d_vls['upper_25_29'] = 1
                        if form.profile.sex is False:
                            if 'upper_w_25_29' in d_vls.keys():
                                d_vls['upper_w_25_29'] += 1
                            else:
                                d_vls['upper_w_25_29'] = 1
                    else:
                        if 'prof_25_29' in d_vls.keys():
                            d_vls['prof_25_29'] += 1
                        else:
                            d_vls['prof_25_29'] = 1
                        if form.profile.sex is False:
                            if 'prof_w_25_29' in d_vls.keys():
                                d_vls['prof_w_25_29'] += 1
                            else:
                                d_vls['prof_w_25_29'] = 1
                elif 30 <= age <= 34:
                    if 'total_30_34' in d_vls.keys():
                        d_vls['total_30_34'] += 1
                    else:
                        d_vls['total_30_34'] = 1
                    if form.profile.sex is False:
                        if 'total_w_30_34' in d_vls.keys():
                            d_vls['total_w_30_34'] += 1
                        else:
                            d_vls['total_w_30_34'] = 1
                    if form.group.course.program.type_dpp == 'Повышение квалификации':
                        if 'upper_30_34' in d_vls.keys():
                            d_vls['upper_30_34'] += 1
                        else:
                            d_vls['upper_30_34'] = 1
                        if form.profile.sex is False:
                            if 'upper_w_30_34' in d_vls.keys():
                                d_vls['upper_w_30_34'] += 1
                            else:
                                d_vls['upper_w_30_34'] = 1
                    else:
                        if 'prof_30_34' in d_vls.keys():
                            d_vls['prof_30_34'] += 1
                        else:
                            d_vls['prof_30_34'] = 1
                        if form.profile.sex is False:
                            if 'prof_w_30_34' in d_vls.keys():
                                d_vls['prof_w_30_34'] += 1
                            else:
                                d_vls['prof_w_30_34'] = 1
                elif 35 <= age <= 39:
                    if 'total_35_39' in d_vls.keys():
                        d_vls['total_35_39'] += 1
                    else:
                        d_vls['total_35_39'] = 1
                    if form.profile.sex is False:
                        if 'total_w_35_39' in d_vls.keys():
                            d_vls['total_w_35_39'] += 1
                        else:
                            d_vls['total_w_35_39'] = 1
                    if form.group.course.program.type_dpp == 'Повышение квалификации':
                        if 'upper_35_39' in d_vls.keys():
                            d_vls['upper_35_39'] += 1
                        else:
                            d_vls['upper_35_39'] = 1
                        if form.profile.sex is False:
                            if 'upper_w_35_39' in d_vls.keys():
                                d_vls['upper_w_35_39'] += 1
                            else:
                                d_vls['upper_w_35_39'] = 1
                    else:
                        if 'prof_35_39' in d_vls.keys():
                            d_vls['prof_35_39'] += 1
                        else:
                            d_vls['prof_35_39'] = 1
                        if form.profile.sex is False:
                            if 'prof_w_35_39' in d_vls.keys():
                                d_vls['prof_w_35_39'] += 1
                            else:
                                d_vls['prof_w_35_39'] = 1
                elif 40 <= age <= 44:
                    if 'total_40_44' in d_vls.keys():
                        d_vls['total_40_44'] += 1
                    else:
                        d_vls['total_40_44'] = 1
                    if form.profile.sex is False:
                        if 'total_w_40_44' in d_vls.keys():
                            d_vls['total_w_40_44'] += 1
                        else:
                            d_vls['total_w_40_44'] = 1
                    if form.group.course.program.type_dpp == 'Повышение квалификации':
                        if 'upper_40_44' in d_vls.keys():
                            d_vls['upper_40_44'] += 1
                        else:
                            d_vls['upper_40_44'] = 1
                        if form.profile.sex is False:
                            if 'upper_w_40_44' in d_vls.keys():
                                d_vls['upper_w_40_44'] += 1
                            else:
                                d_vls['upper_w_40_44'] = 1
                    else:
                        if 'prof_40_44' in d_vls.keys():
                            d_vls['prof_40_44'] += 1
                        else:
                            d_vls['prof_40_44'] = 1
                        if form.profile.sex is False:
                            if 'prof_w_40_44' in d_vls.keys():
                                d_vls['prof_w_40_44'] += 1
                            else:
                                d_vls['prof_w_40_44'] = 1
                elif 45 <= age <= 49:
                    if 'total_45_49' in d_vls.keys():
                        d_vls['total_45_49'] += 1
                    else:
                        d_vls['total_45_49'] = 1
                    if form.profile.sex is False:
                        if 'total_w_45_49' in d_vls.keys():
                            d_vls['total_w_45_49'] += 1
                        else:
                            d_vls['total_w_45_49'] = 1
                    if form.group.course.program.type_dpp == 'Повышение квалификации':
                        if 'upper_45_49' in d_vls.keys():
                            d_vls['upper_45_49'] += 1
                        else:
                            d_vls['upper_45_49'] = 1
                        if form.profile.sex is False:
                            if 'upper_w_45_49' in d_vls.keys():
                                d_vls['upper_w_45_49'] += 1
                            else:
                                d_vls['upper_w_45_49'] = 1
                    else:
                        if 'prof_45_49' in d_vls.keys():
                            d_vls['prof_45_49'] += 1
                        else:
                            d_vls['prof_45_49'] = 1
                        if form.profile.sex is False:
                            if 'prof_w_45_49' in d_vls.keys():
                                d_vls['prof_w_45_49'] += 1
                            else:
                                d_vls['prof_w_45_49'] = 1
                elif 50 <= age <= 54:
                    if 'total_50_54' in d_vls.keys():
                        d_vls['total_50_54'] += 1
                    else:
                        d_vls['total_50_54'] = 1
                    if form.profile.sex is False:
                        if 'total_w_50_54' in d_vls.keys():
                            d_vls['total_w_50_54'] += 1
                        else:
                            d_vls['total_w_50_54'] = 1
                    if form.group.course.program.type_dpp == 'Повышение квалификации':
                        if 'upper_50_54' in d_vls.keys():
                            d_vls['upper_50_54'] += 1
                        else:
                            d_vls['upper_50_54'] = 1
                        if form.profile.sex is False:
                            if 'upper_w_50_54' in d_vls.keys():
                                d_vls['upper_w_50_54'] += 1
                            else:
                                d_vls['upper_w_50_54'] = 1
                    else:
                        if 'prof_50_54' in d_vls.keys():
                            d_vls['prof_50_54'] += 1
                        else:
                            d_vls['prof_50_54'] = 1
                        if form.profile.sex is False:
                            if 'prof_w_50_54' in d_vls.keys():
                                d_vls['prof_w_50_54'] += 1
                            else:
                                d_vls['prof_w_50_54'] = 1
                elif 55 <= age <= 59:
                    if 'total_55_59' in d_vls.keys():
                        d_vls['total_55_59'] += 1
                    else:
                        d_vls['total_55_59'] = 1
                    if form.profile.sex is False:
                        if 'total_w_55_59' in d_vls.keys():
                            d_vls['total_w_55_59'] += 1
                        else:
                            d_vls['total_w_55_59'] = 1
                    if form.group.course.program.type_dpp == 'Повышение квалификации':
                        if 'upper_55_59' in d_vls.keys():
                            d_vls['upper_55_59'] += 1
                        else:
                            d_vls['upper_55_59'] = 1
                        if form.profile.sex is False:
                            if 'upper_w_55_59' in d_vls.keys():
                                d_vls['upper_w_55_59'] += 1
                            else:
                                d_vls['upper_w_55_59'] = 1
                    else:
                        if 'prof_55_59' in d_vls.keys():
                            d_vls['prof_55_59'] += 1
                        else:
                            d_vls['prof_55_59'] = 1
                        if form.profile.sex is False:
                            if 'prof_w_55_59' in d_vls.keys():
                                d_vls['prof_w_55_59'] += 1
                            else:
                                d_vls['prof_w_55_59'] = 1
                elif 60 <= age <= 64:
                    if 'total_60_64' in d_vls.keys():
                        d_vls['total_60_64'] += 1
                    else:
                        d_vls['total_60_64'] = 1
                    if form.profile.sex is False:
                        if 'total_w_60_64' in d_vls.keys():
                            d_vls['total_w_60_64'] += 1
                        else:
                            d_vls['total_w_60_64'] = 1
                    if form.group.course.program.type_dpp == 'Повышение квалификации':
                        if 'upper_60_64' in d_vls.keys():
                            d_vls['upper_60_64'] += 1
                        else:
                            d_vls['upper_60_64'] = 1
                        if form.profile.sex is False:
                            if 'upper_w_60_64' in d_vls.keys():
                                d_vls['upper_w_60_64'] += 1
                            else:
                                d_vls['upper_w_60_64'] = 1
                    else:
                        if 'prof_60_64' in d_vls.keys():
                            d_vls['prof_60_64'] += 1
                        else:
                            d_vls['prof_60_64'] = 1
                        if form.profile.sex is False:
                            if 'prof_w_60_64' in d_vls.keys():
                                d_vls['prof_w_60_64'] += 1
                            else:
                                d_vls['prof_w_60_64'] = 1
                else:
                    if 'total_65' in d_vls.keys():
                        d_vls['total_65'] += 1
                    else:
                        d_vls['total_65'] = 1
                    if form.profile.sex is False:
                        if 'total_w_65' in d_vls.keys():
                            d_vls['total_w_65'] += 1
                        else:
                            d_vls['total_w_65'] = 1
                    if form.group.course.program.type_dpp == 'Повышение квалификации':
                        if 'upper_65' in d_vls.keys():
                            d_vls['upper_65'] += 1
                        else:
                            d_vls['upper_65'] = 1
                        if form.profile.sex is False:
                            if 'upper_w_65' in d_vls.keys():
                                d_vls['upper_w_65'] += 1
                            else:
                                d_vls['upper_w_65'] = 1
                    else:
                        if 'prof_65' in d_vls.keys():
                            d_vls['prof_65'] += 1
                        else:
                            d_vls['prof_65'] = 1
                        if form.profile.sex is False:
                            if 'prof_w_65' in d_vls.keys():
                                d_vls['prof_w_65'] += 1
                            else:
                                d_vls['prof_w_65'] = 1
                if form.type is True:
                    if 'ind' in d_vls.keys():
                        d_vls['ind'] += 1
                    else:
                        d_vls['ind'] = 1
                else:
                    if 'leg' in d_vls.keys():
                        d_vls['leg'] += 1
                    else:
                        d_vls['leg'] = 1
                if form.workless is True:
                    d_chk['empl_total'] = True
                    if form.type is True:
                        if 'empl_ind' in d_vls.keys():
                            d_vls['empl_ind'] += 1
                        else:
                            d_vls['empl_ind'] = 1
                    else:
                        if 'empl_leg' in d_vls.keys():
                            d_vls['empl_leg'] += 1
                        else:
                            d_vls['empl_leg'] = 1
                    if form.profile.sex is False:
                        d_chk['empl_women'] = True
                    if st_gr.course.program.type_dpp == 'Повышение квалификации':
                        d_chk['empl_upper'] = True
                    else:
                        d_chk['empl_prof'] = True
                    if form.profile.sex is False:
                        d_chk['workl_women'] = True
                    if st_gr.course.program.type_dpp == 'Повышение квалификации':
                        d_chk['workl_upper'] = True
                    else:
                        d_chk['workl_prof'] = True
                    d_chk['workl_total'] = True
                    if form.type is True:
                        if 'workl_ind' in d_vls.keys():
                            d_vls['workl_ind'] += 1
                        else:
                            d_vls['workl_ind'] = 1
                    else:
                        if 'workl_leg' in d_vls.keys():
                            d_vls['workl_leg'] += 1
                        else:
                            d_vls['workl_leg'] = 1
                else:
                    if 'руководители' in form.position_cat.name and 'службы' not in form.position_cat.name \
                            and form.edu_level.name != 'Студент':
                        d_chk['ruk_total'] = True
                        if form.type is True:
                            if 'ruk_ind' in d_vls.keys():
                                d_vls['ruk_ind'] += 1
                            else:
                                d_vls['ruk_ind'] = 1
                        else:
                            if 'ruk_leg' in d_vls.keys():
                                d_vls['ruk_leg'] += 1
                            else:
                                d_vls['ruk_leg'] = 1
                        if st_gr.course.program.type_dpp == 'Повышение квалификации':
                            d_chk['ruk_upper'] = True
                        else:
                            d_chk['ruk_prof'] = True
                        if form.profile.sex is False:
                            d_chk['ruk_women'] = True
                        if 'дошкольных образовательных' in form.position_cat.name:
                            d_chk['ruk_doo_total'] = True
                            if form.type is True:
                                if 'ruk_doo_ind' in d_vls.keys():
                                    d_vls['ruk_doo_ind'] += 1
                                else:
                                    d_vls['ruk_doo_ind'] = 1
                            else:
                                if 'ruk_doo_leg' in d_vls.keys():
                                    d_vls['ruk_doo_leg'] += 1
                                else:
                                    d_vls['ruk_doo_leg'] = 1
                            if st_gr.course.program.type_dpp == 'Повышение квалификации':
                                d_chk['ruk_doo_upper'] = True
                            else:
                                d_chk['ruk_doo_prof'] = True
                            if form.profile.sex is False:
                                d_chk['ruk_doo_women'] = True
                        if 'общеобразовательных' in form.position_cat.name:
                            d_chk['ruk_oo_total'] = True
                            if form.type is True:
                                if 'ruk_oo_ind' in d_vls.keys():
                                    d_vls['ruk_oo_ind'] += 1
                                else:
                                    d_vls['ruk_oo_ind'] = 1
                            else:
                                if 'ruk_oo_leg' in d_vls.keys():
                                    d_vls['ruk_oo_leg'] += 1
                                else:
                                    d_vls['ruk_oo_leg'] = 1
                            if st_gr.course.program.type_dpp == 'Повышение квалификации':
                                d_chk['ruk_oo_upper'] = True
                            else:
                                d_chk['ruk_oo_prof'] = True
                            if form.profile.sex is False:
                                d_chk['ruk_oo_women'] = True
                        if 'профессиональных образовательных' in form.position_cat.name:
                            d_chk['ruk_spo_total'] = True
                            if form.type is True:
                                if 'ruk_spo_ind' in d_vls.keys():
                                    d_vls['ruk_spo_ind'] += 1
                                else:
                                    d_vls['ruk_spo_ind'] = 1
                            else:
                                if 'ruk_spo_leg' in d_vls.keys():
                                    d_vls['ruk_spo_leg'] += 1
                                else:
                                    d_vls['ruk_spo_leg'] = 1
                            if st_gr.course.program.type_dpp == 'Повышение квалификации':
                                d_chk['ruk_spo_upper'] = True
                            else:
                                d_chk['ruk_spo_prof'] = True
                            if form.profile.sex is False:
                                d_chk['ruk_spo_women'] = True
                        if 'высшего образования' in form.position_cat.name:
                            d_chk['ruk_vo_total'] = True
                            if form.type is True:
                                if 'ruk_vo_ind' in d_vls.keys():
                                    d_vls['ruk_vo_ind'] += 1
                                else:
                                    d_vls['ruk_vo_ind'] = 1
                            else:
                                if 'ruk_vo_leg' in d_vls.keys():
                                    d_vls['ruk_vo_leg'] += 1
                                else:
                                    d_vls['ruk_vo_leg'] = 1
                            if st_gr.course.program.type_dpp == 'Повышение квалификации':
                                d_chk['ruk_vo_upper'] = True
                            else:
                                d_chk['ruk_vo_prof'] = True
                            if form.profile.sex is False:
                                d_chk['ruk_vo_women'] = True
                        if 'дополнительного профессионального' in form.position_cat.name:
                            d_chk['ruk_dpo_total'] = True
                            if form.type is True:
                                if 'ruk_dpo_ind' in d_vls.keys():
                                    d_vls['ruk_dpo_ind'] += 1
                                else:
                                    d_vls['ruk_dpo_ind'] = 1
                            else:
                                if 'ruk_dpo_leg' in d_vls.keys():
                                    d_vls['ruk_dpo_leg'] += 1
                                else:
                                    d_vls['ruk_dpo_leg'] = 1
                            if st_gr.course.program.type_dpp == 'Повышение квалификации':
                                d_chk['ruk_dpo_upper'] = True
                            else:
                                d_chk['ruk_dpo_prof'] = True
                            if form.profile.sex is False:
                                d_chk['ruk_dpo_women'] = True
                        if 'дополнительного образования' in form.position_cat.name:
                            d_chk['ruk_odo_total'] = True
                            if form.type is True:
                                if 'ruk_odo_ind' in d_vls.keys():
                                    d_vls['ruk_odo_ind'] += 1
                                else:
                                    d_vls['ruk_odo_ind'] = 1
                            else:
                                if 'ruk_odo_leg' in d_vls.keys():
                                    d_vls['ruk_odo_leg'] += 1
                                else:
                                    d_vls['ruk_odo_leg'] = 1
                            if st_gr.course.program.type_dpp == 'Повышение квалификации':
                                d_chk['ruk_odo_upper'] = True
                            else:
                                d_chk['ruk_odo_prof'] = True
                            if form.profile.sex is False:
                                d_chk['ruk_odo_women'] = True
                    if 'пед. работники' in form.position_cat.name \
                            and form.edu_level.name != 'Студент':
                        d_chk['ped_total'] = True
                        if form.type is True:
                            if 'ped_ind' in d_vls.keys():
                                d_vls['ped_ind'] += 1
                            else:
                                d_vls['ped_ind'] = 1
                        else:
                            if 'ped_leg' in d_vls.keys():
                                d_vls['ped_leg'] += 1
                            else:
                                d_vls['ped_leg'] = 1
                        if st_gr.course.program.type_dpp == 'Повышение квалификации':
                            d_chk['ped_upper'] = True
                        else:
                            d_chk['ped_prof'] = True
                        if form.profile.sex is False:
                            d_chk['ped_women'] = True
                        if 'дошкольных образовательных' in form.position_cat.name:
                            d_chk['ped_doo_total'] = True
                            if form.type is True:
                                if 'ped_doo_ind' in d_vls.keys():
                                    d_vls['ped_doo_ind'] += 1
                                else:
                                    d_vls['ped_doo_ind'] = 1
                            else:
                                if 'ped_doo_leg' in d_vls.keys():
                                    d_vls['ped_doo_leg'] += 1
                                else:
                                    d_vls['ped_doo_leg'] = 1
                            if st_gr.course.program.type_dpp == 'Повышение квалификации':
                                d_chk['ped_doo_upper'] = True
                            else:
                                d_chk['ped_doo_prof'] = True
                            if form.profile.sex is False:
                                d_chk['ped_doo_women'] = True
                        if 'общеобразовательных' in form.position_cat.name:
                            d_chk['ped_oo_total'] = True
                            if form.type is True:
                                if 'ped_oo_ind' in d_vls.keys():
                                    d_vls['ped_oo_ind'] += 1
                                else:
                                    d_vls['ped_oo_ind'] = 1
                            else:
                                if 'ped_oo_leg' in d_vls.keys():
                                    d_vls['ped_oo_leg'] += 1
                                else:
                                    d_vls['ped_oo_leg'] = 1
                            if st_gr.course.program.type_dpp == 'Повышение квалификации':
                                d_chk['ped_oo_upper'] = True
                            else:
                                d_chk['ped_oo_prof'] = True
                            if form.profile.sex is False:
                                d_chk['ped_oo_women'] = True
                        if 'профессиональных образовательных' in form.position_cat.name:
                            d_chk['ped_spo_total'] = True
                            if form.type is True:
                                if 'ped_spo_ind' in d_vls.keys():
                                    d_vls['ped_spo_ind'] += 1
                                else:
                                    d_vls['ped_spo_ind'] = 1
                            else:
                                if 'ped_spo_leg' in d_vls.keys():
                                    d_vls['ped_spo_leg'] += 1
                                else:
                                    d_vls['ped_spo_leg'] = 1
                            if st_gr.course.program.type_dpp == 'Повышение квалификации':
                                d_chk['ped_spo_upper'] = True
                            else:
                                d_chk['ped_spo_prof'] = True
                            if form.profile.sex is False:
                                d_chk['ped_spo_women'] = True
                        if 'высшего образования' in form.position_cat.name:
                            d_chk['ped_vo_total'] = True
                            if form.type is True:
                                if 'ped_vo_ind' in d_vls.keys():
                                    d_vls['ped_vo_ind'] += 1
                                else:
                                    d_vls['ped_vo_ind'] = 1
                            else:
                                if 'ped_vo_leg' in d_vls.keys():
                                    d_vls['ped_vo_leg'] += 1
                                else:
                                    d_vls['ped_vo_leg'] = 1
                            if st_gr.course.program.type_dpp == 'Повышение квалификации':
                                d_chk['ped_vo_upper'] = True
                            else:
                                d_chk['ped_vo_prof'] = True
                            if form.profile.sex is False:
                                d_chk['ped_vo_women'] = True
                        if 'дополнительного профессионального' in form.position_cat.name:
                            d_chk['ped_dpo_total'] = True
                            if form.type is True:
                                if 'ped_dpo_ind' in d_vls.keys():
                                    d_vls['ped_dpo_ind'] += 1
                                else:
                                    d_vls['ped_dpo_ind'] = 1
                            else:
                                if 'ped_dpo_leg' in d_vls.keys():
                                    d_vls['ped_dpo_leg'] += 1
                                else:
                                    d_vls['ped_dpo_leg'] = 1
                            if st_gr.course.program.type_dpp == 'Повышение квалификации':
                                d_chk['ped_dpo_upper'] = True
                            else:
                                d_chk['ped_dpo_prof'] = True
                            if form.profile.sex is False:
                                d_chk['ped_dpo_women'] = True
                        if 'дополнительного образования' in form.position_cat.name:
                            d_chk['ped_odo_total'] = True
                            if form.type is True:
                                if 'ped_odo_ind' in d_vls.keys():
                                    d_vls['ped_odo_ind'] += 1
                                else:
                                    d_vls['ped_odo_ind'] = 1
                            else:
                                if 'ped_odo_leg' in d_vls.keys():
                                    d_vls['ped_odo_leg'] += 1
                                else:
                                    d_vls['ped_odo_leg'] = 1
                            if st_gr.course.program.type_dpp == 'Повышение квалификации':
                                d_chk['ped_odo_upper'] = True
                            else:
                                d_chk['ped_odo_prof'] = True
                            if form.profile.sex is False:
                                d_chk['ped_odo_women'] = True
                    if 'гос. гражд. службы' in form.position_cat.name \
                            and form.edu_level.name != 'Студент':
                        d_chk['gos_total'] = True
                        if form.type is True:
                            if 'gos_ind' in d_vls.keys():
                                d_vls['gos_ind'] += 1
                            else:
                                d_vls['gos_ind'] = 1
                        else:
                            if 'gos_leg' in d_vls.keys():
                                d_vls['gos_leg'] += 1
                            else:
                                d_vls['gos_leg'] = 1
                        if form.profile.sex is False:
                            d_chk['gos_women'] = True
                        if st_gr.course.program.type_dpp == 'Повышение квалификации':
                            d_chk['gos_upper'] = True
                        else:
                            d_chk['gos_prof'] = True
                        if 'руководители' in form.position_cat.name:
                            d_chk['ruk_gos_total'] = True
                            if form.profile.sex is False:
                                d_chk['ruk_gos_women'] = True
                            if st_gr.course.program.type_dpp == 'Повышение квалификации':
                                d_chk['ruk_gos_upper'] = True
                            else:
                                d_chk['ruk_gos_prof'] = True
                    if 'муниципальной службы' in form.position_cat.name \
                            and form.edu_level.name != 'Студент':
                        d_chk['mun_total'] = True
                        if form.type is True:
                            if 'mun_ind' in d_vls.keys():
                                d_vls['mun_ind'] += 1
                            else:
                                d_vls['mun_ind'] = 1
                        else:
                            if 'mun_leg' in d_vls.keys():
                                d_vls['mun_leg'] += 1
                            else:
                                d_vls['mun_leg'] = 1
                        if form.profile.sex is False:
                            d_chk['mun_women'] = True
                        if st_gr.course.program.type_dpp == 'Повышение квалификации':
                            d_chk['mun_upper'] = True
                        else:
                            d_chk['mun_prof'] = True
                    if 'военной службы' in form.position_cat.name \
                            and form.edu_level.name != 'Студент':
                        d_chk['mil_total'] = True
                        if form.type is True:
                            if 'mil_ind' in d_vls.keys():
                                d_vls['mil_ind'] += 1
                            else:
                                d_vls['mil_ind'] = 1
                        else:
                            if 'mil_leg' in d_vls.keys():
                                d_vls['mil_leg'] += 1
                            else:
                                d_vls['mil_leg'] = 1
                        if form.profile.sex is False:
                            d_chk['mil_women'] = True
                        if st_gr.course.program.type_dpp == 'Повышение квалификации':
                            d_chk['mil_upper'] = True
                        else:
                            d_chk['mil_prof'] = True
                    if 'службы занятости' in form.position_cat.name \
                            and form.edu_level.name != 'Студент':
                        d_chk['empl_total'] = True
                        if form.type is True:
                            if 'empl_ind' in d_vls.keys():
                                d_vls['empl_ind'] += 1
                            else:
                                d_vls['empl_ind'] = 1
                        else:
                            if 'empl_leg' in d_vls.keys():
                                d_vls['empl_leg'] += 1
                            else:
                                d_vls['empl_leg'] = 1
                        if form.profile.sex is False:
                            d_chk['empl_women'] = True
                        if st_gr.course.program.type_dpp == 'Повышение квалификации':
                            d_chk['empl_upper'] = True
                        else:
                            d_chk['empl_prof'] = True
                        if form.profile.sex is False:
                            d_chk['workl_women'] = True
                        if st_gr.course.program.type_dpp == 'Повышение квалификации':
                            d_chk['workl_upper'] = True
                        else:
                            d_chk['workl_prof'] = True
                    if 'другие' in form.position_cat.name \
                            and form.edu_level.name != 'Студент':
                        d_chk['oth_total'] = True
                        if form.type is True:
                            if 'oth_ind' in d_vls.keys():
                                d_vls['oth_ind'] += 1
                            else:
                                d_vls['oth_ind'] = 1
                        else:
                            if 'oth_leg' in d_vls.keys():
                                d_vls['oth_leg'] += 1
                            else:
                                d_vls['oth_leg'] = 1
                        if form.profile.sex is False:
                            d_chk['oth_women'] = True
                        if st_gr.course.program.type_dpp == 'Повышение квалификации':
                            d_chk['oth_upper'] = True
                        else:
                            d_chk['oth_prof'] = True
                if form.edu_level.name == 'Студент':
                    if form.edu_cat.name == 'Высшее образование':
                        d_chk['st_v_total'] = True
                        if form.type is True:
                            if 'st_v_ind' in d_vls.keys():
                                d_vls['st_v_ind'] += 1
                            else:
                                d_vls['st_v_ind'] = 1
                        else:
                            if 'st_v_leg' in d_vls.keys():
                                d_vls['st_v_leg'] += 1
                            else:
                                d_vls['st_v_leg'] = 1
                        if form.profile.sex is False:
                            d_chk['st_v_women'] = True
                        if st_gr.course.program.type_dpp == 'Повышение квалификации':
                            d_chk['st_v_upper'] = True
                        else:
                            d_chk['st_v_prof'] = True
                    else:
                        d_chk['st_m_total'] = True
                        if form.type is True:
                            if 'st_m_ind' in d_vls.keys():
                                d_vls['st_m_ind'] += 1
                            else:
                                d_vls['st_m_ind'] = 1
                        else:
                            if 'st_m_leg' in d_vls.keys():
                                d_vls['st_m_leg'] += 1
                            else:
                                d_vls['st_m_leg'] = 1
                        if form.profile.sex is False:
                            d_chk['st_m_women'] = True
                        if st_gr.course.program.type_dpp == 'Повышение квалификации':
                            d_chk['st_m_upper'] = True
                        else:
                            d_chk['st_m_prof'] = True
                if form.edu_level.name == 'Среднее профессиональное образование':
                    d_chk['edmid_total'] = True
                    if form.type is True:
                        if 'edmid_ind' in d_vls.keys():
                            d_vls['edmid_ind'] += 1
                        else:
                            d_vls['edmid_ind'] = 1
                    else:
                        if 'edmid_leg' in d_vls.keys():
                            d_vls['edmid_leg'] += 1
                        else:
                            d_vls['edmid_leg'] = 1
                    if form.profile.sex is False:
                        d_chk['edmid_women'] = True
                    if st_gr.course.program.type_dpp == 'Повышение квалификации':
                        d_chk['edmid_upper'] = True
                    else:
                        d_chk['edmid_prof'] = True
                if form.edu_level.name == 'Высшее образование':
                    d_chk['edhigh_total'] = True
                    if form.type is True:
                        if 'edhigh_ind' in d_vls.keys():
                            d_vls['edhigh_ind'] += 1
                        else:
                            d_vls['edhigh_ind'] = 1
                    else:
                        if 'edhigh_leg' in d_vls.keys():
                            d_vls['edhigh_leg'] += 1
                        else:
                            d_vls['edhigh_leg'] = 1
                    if form.profile.sex is False:
                        d_chk['edhigh_women'] = True
                    if st_gr.course.program.type_dpp == 'Повышение квалификации':
                        d_chk['edhigh_upper'] = True
                    else:
                        d_chk['edhigh_prof'] = True
                for key, value in d_chk.items():
                    if key in d_vls.keys():
                        d_vls[key] += 1
                    else:
                        d_vls[key] = 1
    info2 = {
        'dpp_upper': d_vls['dpp_upper'],
        'dpp_prof': d_vls['dpp_prof'],
        'count_upper': d_vls['count_upper'],
        'count_prof': d_vls['count_prof']
    }
    if 'upper_dot' in d_vls:
        info2['upper_dot'] = d_vls['upper_dot']
    if 'upper_cntdot' in d_vls:
        info2['upper_cntdot'] = d_vls['upper_cntdot']
    if 'upper_onlydot' in d_vls:
        info2['upper_onlydot'] = d_vls['upper_onlydot']
    if 'prof_dot' in d_vls:
        info2['prof_dot'] = d_vls['prof_dot']
    if 'prof_cntdot' in d_vls:
        info2['prof_cntdot'] = d_vls['prof_cntdot']
    if 'prof_onlydot' in d_vls:
        info2['prof_onlydot'] = d_vls['prof_onlydot']
    if 'count_prof' in d_vls.keys() and 'count_upper' in d_vls.keys():
        d_vls['total'] = d_vls['count_prof'] + d_vls['count_upper']
    elif 'count_prof' in d_vls.keys():
        d_vls['total'] = d_vls['count_prof']
    elif 'count_upper' in d_vls.keys():
        d_vls['total'] = d_vls['count_upper']
    else:
        d_vls['total'] = 0
    if 'ruk_total' in d_vls.keys() and 'ped_total' in d_vls.keys():
        d_vls['edu_total'] = d_vls['ruk_total'] + d_vls['ped_total']
    elif 'ruk_total' in d_vls.keys():
        d_vls['edu_total'] = d_vls['ruk_total']
    elif 'ped_total' in d_vls.keys():
        d_vls['edu_total'] = d_vls['ped_total']
    else:
        d_vls['edu_total'] = 0
    if 'ruk_ind' in d_vls.keys() and 'ped_ind' in d_vls.keys():
        d_vls['edu_ind'] = d_vls['ruk_ind'] + d_vls['ped_ind']
    elif 'ruk_ind' in d_vls.keys():
        d_vls['edu_ind'] = d_vls['ruk_ind']
    elif 'ped_ind' in d_vls.keys():
        d_vls['edu_ind'] = d_vls['ped_ind']
    else:
        d_vls['edu_ind'] = 0
    if 'ruk_leg' in d_vls.keys() and 'ped_leg' in d_vls.keys():
        d_vls['edu_leg'] = d_vls['ruk_leg'] + d_vls['ped_leg']
    elif 'ruk_leg' in d_vls.keys():
        d_vls['edu_leg'] = d_vls['ruk_leg']
    elif 'ped_leg' in d_vls.keys():
        d_vls['edu_leg'] = d_vls['ped_leg']
    else:
        d_vls['edu_leg'] = 0
    if 'ruk_upper' in d_vls.keys() and 'ped_upper' in d_vls.keys():
        d_vls['edu_upper'] = d_vls['ruk_upper'] + d_vls['ped_upper']
    elif 'ruk_upper' in d_vls.keys():
        d_vls['edu_upper'] = d_vls['ruk_upper']
    elif 'ped_upper' in d_vls.keys():
        d_vls['edu_upper'] = d_vls['ped_upper']
    else:
        d_vls['edu_upper'] = 0
    if 'ruk_prof' in d_vls.keys() and 'ped_prof' in d_vls.keys():
        d_vls['edu_prof'] = d_vls['ruk_prof'] + d_vls['ped_prof']
    elif 'ruk_prof' in d_vls.keys():
        d_vls['edu_prof'] = d_vls['ruk_prof']
    elif 'ped_prof' in d_vls.keys():
        d_vls['edu_prof'] = d_vls['ped_prof']
    else:
        d_vls['edu_prof'] = 0
    if 'ruk_women' in d_vls.keys() and 'ped_women' in d_vls.keys():
        d_vls['edu_women'] = d_vls['ruk_women'] + d_vls['ped_women']
    elif 'ruk_women' in d_vls.keys():
        d_vls['edu_women'] = d_vls['ruk_women']
    elif 'ped_women' in d_vls.keys():
        d_vls['edu_women'] = d_vls['ped_women']
    else:
        d_vls['edu_women'] = 0
    info3 = {}
    info3['dpp_upper'] = info2['dpp_upper']
    info3['dpp_prof'] = info2['dpp_prof']
    for key, value in d_vls.items():
        info3[key] = value
    info4 = {}
    for key, value in d_health.items():
        info4[key] = value
    info_empty = {}
    path = STATIC_ROOT + '\\doc_templates\\xlsx\\reports\\pk-1.xlsx'
    writer = BookWriter(path)
    writer.render_sheet(info, 'Титульный лист', 0)
    writer.render_sheet(info, 'Раздел 1.1', 1)
    writer.render_sheet(info, 'Раздел 1.2', 2)
    writer.render_sheet(info2, 'Раздел 1.3', 3)
    writer.render_sheet(info, 'Раздел 1.4', 4)
    writer.render_sheet(info, 'Раздел 1.5', 5)
    writer.render_sheet(info3, 'Раздел 2.1', 6)
    writer.render_sheet(info3, 'Раздел 2.2', 7)
    writer.render_sheet(info3, 'Раздел 2.3.1', 8)
    writer.render_sheet(info3, 'Раздел 2.3.2', 9)
    writer.render_sheet(info3, 'Раздел 2.4', 10)
    writer.render_sheet(info4, 'Раздел 2.5', 11)
    writer.render_sheet(info_empty, 'Раздел 3.1', 12)
    writer.render_sheet(info_empty, 'Раздел 3.2', 13)
    writer.render_sheet(info_empty, 'Раздел 3.3.1', 14)
    writer.render_sheet(info_empty, 'Раздел 3.3.2', 15)
    info5 = {
        'teachers_count': Profiles.objects.filter(teacher=True).filter(
            user__in=User.objects.filter(email__contains="coko38.ru")).count()
    }
    writer.render_sheet(info5, 'Раздел 3.4', 16)
    writer.render_sheet(info_empty, 'Раздел 3.5', 17)
    writer.render_sheet(info_empty, 'Раздел 3.6', 18)
    writer.render_sheet(info_empty, 'Раздел 3.7', 19)
    writer.render_sheet(info_empty, 'Раздел 3.8.1', 20)
    writer.render_sheet(info_empty, 'Раздел 3.8.2', 21)
    writer.render_sheet(info_empty, 'Раздел 4.1', 22)
    writer.render_sheet(info_empty, 'Раздел 4.2', 23)
    writer.render_sheet(info_empty, 'Раздел 4.3', 24)
    writer.render_sheet(info_empty, 'Раздел 5.1', 25)
    writer.render_sheet(info_empty, 'Раздел 5.2', 26)
    writer.render_sheet(info_empty, 'Раздел 5.3', 27)
    writer.render_sheet(info_empty, 'Раздел 5.4', 28)
    writer.render_sheet(info_empty, 'Раздел 5.5', 29)
    writer.render_sheet(info_empty, 'Раздел 6.1', 30)
    writer.render_sheet(info_empty, 'Раздел 6.2', 31)
    writer.render_sheet(info_empty, 'Раздел 6.3', 32)
    writer.render_sheet(info_empty, 'Раздел 6.4', 33)
    writer.render_sheet(info_empty, 'Раздел 6.5', 34)
    prof = Profiles.objects.get(id=profile_id)
    fio = prof.surname + ' ' + prof.name[:1] + '.' + prof.patronymic[:1]
    newpath = STATIC_ROOT + "\\Отчеты\\ПК-1\\" + fio + "\\"
    writer.save(newpath + "Отчет_" + datetime.today().strftime('%d.%m.%Y') + ".xlsx")
    rep = Reports.objects.get(id=report_id)
    rep.date_finish = datetime.now()
    rep.report.name = newpath + "Отчет_" + datetime.today().strftime('%d.%m.%Y') + ".xlsx"
    rep.save()
    rep = Reports.objects.get(id=report_id)
    list_rec = []
    list_rec.append(Profiles.objects.get(id=profile_id).user.email)
    subject = 'АИС "Учебный Центр": Отчет '+rep.type_report+' успешно сформирован'
    msg = 'Отчет ' + rep.type_report +', запрос на формирование которого поступил '
    msg += rep.date_start.strftime('%d.%m.%Y') + ' в ' + rep.date_start.strftime('%H:%M')
    msg += ' успешно сформирован.\nДля просмотра отчета перейдите в свой личный кабинет, '
    msg += 'в раздел "Отчеты", либо воспользуйтесь ссылкой ниже:\n'
    msg += 'https://edu-dev.coko38.ru/centre/reports\n'
    msg += 'С уважением,\nкоманда АИС "Учебный Центр"'
    send_mail(
        subject,
        msg,
        None,
        list_rec,
        fail_silently=False,
    )


class Doc_frdo():
    def __init__(self, view, serial, number, date_give,
                 reg, type_dpp, name_dpp, edu_level,
                 surn_diploma, edu_ser, edu_numb,
                 year_study, duration, surname,
                 name, patronymic, birthday,
                 sex, snils, country):
        self.view = view
        self.serial = serial
        self.number = number
        self.date_give = date_give
        self.reg = reg
        self.type_dpp = type_dpp
        self.name_dpp = name_dpp
        self.edu_level = edu_level
        self.surn_diploma = surn_diploma
        self.edu_ser = edu_ser
        self.edu_numb = edu_numb
        self.year_study = year_study
        self.duration = duration
        self.surname = surname
        self.name = name
        self.patronymic = patronymic
        self.birthday = birthday
        self.sex = sex
        self.snils = snils
        self.country = country


def get_countrycode(country):
    UpperCountry = country.upper()
    for item in OksmRef().iter_items():
       if item[4] == UpperCountry:
            return item[0]


def get_docs(list):
    docs = []
    for el in list:
        stgr = StudentGroups.objects.select_related('course').prefetch_related('students').get(id=el)
        program = stgr.course.program
        type_dpp = program.type_dpp
        if type_dpp == 'Повышение квалификации':
            view = "Удостоверение о повышении квалификации"
        else:
            view = "Диплом о профессиональной переподготовке"
        name_dpp = program.name
        date_give = stgr.course.date_finish.strftime('%d.%m.%Y')
        year_study = stgr.course.date_start.strftime('%Y')
        duration = program.duration
        for student in stgr.students.all().order_by('surname'):
            if StudentsCerts.objects.filter(group_id=el).filter(student_id=student.id).exists():
                cert = StudentsCerts.objects.filter(group_id=el).get(student_id=student.id)
                serial = cert.blank_serial
                number = cert.blank_number
                reg = cert.reg_number
            else:
                serial = number = reg = ''
            form = CoursesForms.objects.filter(group_id=el).get(profile_id=student.id)
            if form.edu_level.name != 'Студент':
                edu_level = form.edu_level
                surn_diploma = form.check_surname
                edu_ser = form.edu_serial
                edu_numb = form.edu_number
            else:
                edu_level = 'Справка'
                surn_diploma = edu_ser = edu_numb = ''
            if student.sex is True:
                sex = 'Муж'
            else:
                sex = 'Жен'
            doc = Doc_frdo(
                view, serial, number, date_give,
                reg, type_dpp, name_dpp, edu_level,
                surn_diploma, edu_ser, edu_numb,
                year_study, duration, student.surname,
                student.name, student.patronymic, student.birthday.strftime('%d.%m.%Y'),
                sex, student.snils, get_countrycode(student.state.name)
            )
            docs.append(doc)
    return docs


@app.task
def frdo_report(groups, user_id, report_id):
    path = STATIC_ROOT + '\\doc_templates\\xlsx\\reports\\frdo.xlsx'
    writer = BookWriter(path)
    info = {}
    info['docs'] = get_docs(groups)
    writer.render_sheet(info, 'Шаблон', 0)
    prof = Profiles.objects.get(id=user_id)
    fio = prof.surname + ' ' + prof.name[:1] + '.' + prof.patronymic[:1]
    newpath = STATIC_ROOT + '\\Отчеты\\ФИС ФРДО\\' + fio + "\\"
    writer.save(newpath + "Отчет_" + datetime.today().strftime('%d.%m.%Y') + ".xlsx")
    rep = Reports.objects.get(id=report_id)
    rep.date_finish = datetime.now()
    rep.report.name = newpath + "Отчет_" + datetime.today().strftime('%d.%m.%Y') + ".xlsx"
    rep.save()
    rep = Reports.objects.get(id=report_id)
    list_rec = []
    list_rec.append(prof.user.email)
    subject = 'АИС "Учебный Центр": Отчет ' + rep.type_report + ' успешно сформирован'
    msg = 'Отчет ' + rep.type_report + ', запрос на формирование которого поступил '
    msg += rep.date_start.strftime('%d.%m.%Y') + ' в ' + rep.date_start.strftime('%H:%M')
    msg += ' успешно сформирован.\nДля просмотра отчета перейдите в свой личный кабинет, '
    msg += 'в раздел "Отчеты", либо воспользуйтесь ссылкой ниже:\n'
    msg += 'https://edu-dev.coko38.ru/centre/reports\n'
    msg += 'С уважением,\nкоманда АИС "Учебный Центр"'
    send_mail(
        subject,
        msg,
        None,
        list_rec,
        fail_silently=False,
    )