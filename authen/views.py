import datetime
import os
import random

from django.views import View
from pytils import translit

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import DetailView
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User, Group
from django.http import HttpResponse, FileResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, get_object_or_404

from authen.middleware import GetDataFromAD
from authen.models import Profiles, States
from centre.models import StudentGroups
from centre.views import is_ajax
from students.models import Docs


class ProfileDetailView(LoginRequiredMixin, DetailView):
    login_url = '/'
    model = Profiles
    context_object_name = 'profile'
    template_name = 'profile/info.html'

    def get_object(self):
        return get_object_or_404(Profiles, pk=Profiles.objects.get(user_id=self.request.user.id).id)


class CheckUniqueData(View):

    def get(self, request, *args, **kwargs):
        if is_ajax(request=request):
            if 'check_email' in request.GET:
                if User.objects.filter(email=request.GET.get('check_email')).exists():
                    return JsonResponse({
                        'email_exists': 'yes'
                    })
                else:
                    return JsonResponse({
                        'email_exists': 'no'
                    })
            if 'check_phone' in request.GET:
                if Profiles.objects.filter(phone=request.GET.get('check_phone')).exists():
                    return JsonResponse({
                        'phone_exists': 'yes'
                    })
                else:
                    return JsonResponse({
                        'phone_exists': 'no'
                    })
            if 'check_snils' in request.GET:
                if Profiles.objects.filter(snils=request.GET.get('check_snils')).exists():
                    return JsonResponse({
                        'snils_exists': 'yes'
                    })
                else:
                    return JsonResponse({
                        'snils_exists': 'no'
                    })
        else:
            return HttpResponseRedirect('/access_denied/')


def create_username(surname, name, patronymic):
    usname = translit.slugify(surname)+'.'+translit.slugify(name[:1])+'.'+translit.slugify(patronymic[:1])
    if User.objects.filter(username=usname).exists():
        while User.objects.filter(username=usname).exists():
            usname += random.randint(0, 10)
    return usname


def main(request):
    if request.user.is_authenticated:
        groups = request.user.groups.values_list('name', flat=True)
        if groups[0] == 'Обучающиеся':
            return render(request, 'students/main.html')
        elif groups[0] == 'Преподаватели':
            return render(request, 'teachers/main.html')
        elif groups[0] == 'Работники центра':
            return render(request, 'dep/main.html')
        else:
            return render(request, 'centre/main.html')
    else:
        if 'next' in request.GET:
            return render(request, 'authen/login.html', {'next': request.GET['next']})
        else:
            return render(request, 'authen/login.html')


def login_user(request):
    try:
        info = request.POST.get('login')
    except BaseException:
        return render(request, 'authen/login.html')
    if Profiles.objects.filter(phone=info).exists():
        username = User.objects.get(id=Profiles.objects.get(phone=info).user_id).username
    elif Profiles.objects.filter(snils=info).exists():
        username = User.objects.get(id=Profiles.objects.get(snils=info).user_id).username
    elif User.objects.filter(email=info).exists():
        username = User.objects.get(email=info).username
    elif User.objects.filter(username=info).exists():
        username = User.objects.get(username=info).username
    else:
        try:
            user = authenticate(request, username=info, password=request.POST.get('pass'))
            login(request, user, backend='django.contrib.auth.backends.ModelBackend')
            if request.POST.get('next') is not None:
                return HttpResponseRedirect(request.POST.get('next'))
            if Profiles.objects.filter(user_id=request.user.id).exists():
                return HttpResponseRedirect('/')
            else:
                fromad = GetDataFromAD(request)
                list = fromad[0][0].split(' ')
                new = Profiles()
                new.user_id = request.user.id
                new.state_id = States.objects.get(name='Россия').id
                new.phone = '+7 3952 500-287 (вн. ' + list[3] +')'
                new.surname = list[0]
                new.name = list[1]
                new.patronymic = list[2]
                new.sex = True
                new.birthday = datetime.datetime.fromisoformat('2020-05-12')
                new.snils = 'snils-' + str(request.user.id)
                new.teacher = True
                new.save()
                new.refresh_from_db()
                try:
                    if request.user.is_superuser:
                        gr = Group.objects.get(name='Администраторы')
                    elif request.user.is_staff:
                        gr = Group.objects.get(name='Работники центра')
                    else:
                        gr = Group.objects.get(name='Преподаватели')
                    gr.user_set.add(request.user)
                    return HttpResponseRedirect('/')
                except BaseException:
                    return HttpResponse('Произошла абоба')
        except BaseException:
            messages.error(request, 'Пользователь не найден!')
            if request.POST.get('next') is not None:
                messages.info(request, request.POST.get('next'))
            return HttpResponseRedirect('/')
    user = authenticate(request, username=username, password=request.POST.get('pass'))
    if user is not None:
        request.method = 'GET'
        login(request, user, backend='django.contrib.auth.backends.ModelBackend')
        if request.POST.get('next') is not None:
            return HttpResponseRedirect(request.POST.get('next'))
        request.method = 'GET'
        return HttpResponseRedirect('/')
    else:
        messages.error(request, 'Неверное имя пользователя или пароль!')
        if request.POST.get('next') is not None:
            messages.info(request, request.POST.get('next'))
        return HttpResponseRedirect('/')


def logout_user(request):
    logout(request)
    request.method = 'GET'
    return HttpResponse('<meta http-equiv="refresh" content="0; URL=/">')


def user_reg(request):
    if Profiles.objects.filter(phone=request.POST.get('phone')).exists():
        messages.error(request, 'Пользователь с указанным телефоном уже зарегистрирован!')
    elif Profiles.objects.filter(snils=request.POST.get('snils')).exists():
        messages.error(request, 'Пользователь с указанным СНИЛС уже зарегистрирован!')
    elif User.objects.filter(email=request.POST.get('email')).exists():
        messages.error(request, 'Пользователь с указанной почтой уже зарегистрирован!')
    else:
        username = create_username(request.POST.get('surname'),
                                   request.POST.get('name'),
                                   request.POST.get('patronymic'))
        new_user = User()
        new_user.username = username
        new_user.email = request.POST.get('email')
        new_user.is_active = True
        new_user.is_staff = False
        new_user.is_superuser = False
        new_user.set_password(request.POST.get('reg_pass'))
        new_user.save()
        new_user.refresh_from_db()
        new_profile = Profiles()
        new_profile.user_id = new_user.id
        new_profile.phone = request.POST.get('phone')
        new_profile.state_id = request.POST.get('state')
        new_profile.surname = request.POST.get('surname')
        new_profile.name = request.POST.get('name')
        new_profile.patronymic = request.POST.get('patronymic')
        new_profile.sex = request.POST.get('sex')
        new_profile.birthday = request.POST.get('birthday')
        new_profile.snils = request.POST.get('snils')
        new_profile.health = request.POST.get('health')
        new_profile.save()
        gr = Group.objects.get(name='Обучающиеся')
        gr.user_set.add(new_user)
        messages.success(request, 'Регистрация успешно завершена! Войдите в личный кабинет')
    if 'next' in request.POST:
        return HttpResponseRedirect(request.POST.get('next'))
    else:
        return HttpResponseRedirect('/')


@login_required(login_url='/')
def change_pass(request):
    if request.POST.get('pass') != request.POST.get('pass_confirm'):
        messages.error(request, 'Введенные пароли не совпадают!')
    else:
        user = User.objects.get(id=request.user.id)
        user.set_password(request.POST.get('pass'))
        user.save()
        logout(request)
        messages.success(request, 'Пароль успешно изменен!')
    return HttpResponseRedirect('/')


@login_required(login_url='/')
def change_info(request):
    prof = Profiles.objects.get(user_id=request.user.id)
    prof.state_id = request.POST.get('state')
    prof.phone = request.POST.get('phone')
    prof.surname = str(request.POST.get('surname')).strip(" ")
    prof.name = str(request.POST.get('name')).strip(" ")
    prof.patronymic = str(request.POST.get('patronymic')).strip(" ")
    prof.sex = request.POST.get('sex')
    prof.birthday = request.POST.get('birthday')
    prof.snils = request.POST.get('snils')
    prof.health = request.POST.get('health')
    prof.save()
    messages.success(request, 'Профиль успешно изменен!')
    return HttpResponseRedirect('/')


@login_required(login_url='/')
def upload_doc(request):
    file = request.FILES.get('new_doc')
    if file.size > 10485760:
        messages.error(request, 'Размер файла превышает 10 мб!')
    elif file.name[-3:] not in ('pdf', 'jpg', 'png'):
        messages.error(request, 'Некорректный формат файла')
    else:
        doc = Docs()
        doc.profile_id = Profiles.objects.get(user_id=request.user.id).id
        doc.doc_type_id = request.POST.get('type_doc')
        doc.file = file
        doc.save()
        messages.success(request, 'Файл успешно загружен!')
    return HttpResponseRedirect('/profile/')


@login_required(login_url='/')
def doc_view(request):
    rec = Docs.objects.get(id=request.GET.get('doc_id'))
    if request.user.is_superuser or request.user.is_staff:
        pass
    else:
        user_id = Profiles.objects.get(id=rec.profile_id).user.id
        if user_id != request.user.id:
            return HttpResponseRedirect('/access_denied/')
    file = rec.file
    if file.path[-3:] == 'pdf':
        return FileResponse(open(file.path, 'rb'), content_type='application/pdf')
    else:
        return FileResponse(open(file.path, 'rb'))


@login_required(login_url='/')
def offer_view(request):
    stgroup = StudentGroups.objects.get(id=request.GET.get('group'))
    if request.user.is_superuser or request.user.is_staff:
        pass
    else:
        profiles = stgroup.students.all()
        me = Profiles.objects.get(user_id=request.user.id)
        if me not in profiles:
            return HttpResponseRedirect('/access_denied/')
    file = stgroup.offer
    if file.path[-3:] == 'pdf':
        return FileResponse(open(file.path, 'rb'), content_type='application/pdf')
    else:
        return FileResponse(open(file.path, 'rb'))


@login_required(login_url='/')
def delete_doc(request):
    doc = Docs.objects.get(id=request.POST.get('doc_id'))
    doc.delete()
    messages.success(request, 'Файл успешно удален!')
    return HttpResponseRedirect('/profile/')


@login_required(login_url='/')
def access_denied(request):
    return render(request, 'authen/access_denied.html')

# Create your views here.
