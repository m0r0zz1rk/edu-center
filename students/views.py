import datetime

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from pandas._libs.tslibs.offsets import BDay
from rest_framework import viewsets, permissions
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated

from authen.models import Profiles
from centre.models import StudentGroups, Mos, Oos, PositionCategories, Positions, StGroupStatuses, OoTypes
from .models import Regions, EventsForms, Statuses, Apps, CoursesForms, EducationLevels, EducationCats, Docs, DocsTypes
from .serializers import (
    CoursesStGroupsSerializer,
    EventsStGroupsSerializer,
    RegionsSerializer,
    MosSerializer,
    OosSerializer,
    PositionCategoriesSerializer,
    PositionsSerializer,
    EventsFormsSerializer,
    ListAppsSerializer,
    CheckAppSerializer,
    AppsSerializer,
    EducationLevelsSerializer,
    EducationCatsSerializer,
    CheckSurnameSerializer,
    DocsSerializer,
    DocsTypesSerializer,
    UploadDocSerializer,
    CoursesFormsSerializer,
    FullCoursesFormsSerializer,
    FullEventsFormsSerializer, DetailSerializer, DetailAppSerializer, EventUrlSerializer, SurveyUrlSerializer,
    OoTypesSerializer, OoNewSerializer
)


class IsStudent(permissions.BasePermission):
    "Проверка на группу пользователя (Обучающиеся)"

    def has_permission(self, request, view):
        return request.user.groups.filter(name='Обучающиеся').exists()


class IsAjax(permissions.BasePermission):
    "Доступ только по AJAX запросу"

    def has_permission(self, request, view):
        return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


class IsStudentOfThisGroup(permissions.BasePermission):
    "Проверка на принадлежность обучающегося учебной группе"

    def has_object_permission(self, request, view, obj):
        return obj.students.filter(user_id=request.user.id).exists()


class IsPay(permissions.BasePermission):
    "Проверка на совершенную оплату"

    def has_object_permission(self, request, view, obj):
        return Apps.objects.filter(group_id=obj.id).\
            get(profile_id=Profiles.objects.get(user_id=request.user.id).id).status.name in ['Оплачено', 'Проходит обучение', 'Завершил обучение']


class CoursesStGroupsViewSet(viewsets.ReadOnlyModelViewSet):
    "Вывод списка всех учебных групп по курсам"
    permission_classes = [IsAuthenticated, IsStudent]
    queryset = StudentGroups.objects.all().order_by('-id')

    def get_serializer_class(self):
        return CoursesStGroupsSerializer


class ServiceDetail(viewsets.ReadOnlyModelViewSet):
    "Информация по курсу/мероприятию"
    permission_classes = [IsAuthenticated, IsStudent]

    def retrieve(self, request, pk=None):
        queryset = StudentGroups.objects.all()
        StGroup = get_object_or_404(queryset, pk=request.GET.get('pk'))
        serializer = DetailSerializer(StGroup)
        return JsonResponse({'data': serializer.data})

    def get_serializer_class(self):
        return DetailSerializer


class EventsStGroupsViewSet(viewsets.ReadOnlyModelViewSet):
    "Вывод списка всех учебных групп по мероприятиям"
    permission_classes = [IsAuthenticated, IsStudent]
    queryset = StudentGroups.objects.all().order_by('-id')

    def get_serializer_class(self):
        return EventsStGroupsSerializer

    def retrieve(self, request, pk=None):
        queryset = StudentGroups.objects.all()
        StGroup = get_object_or_404(queryset, pk=pk)
        serializer = CoursesStGroupsSerializer(StGroup)
        return JsonResponse({'data': serializer.data})


class RegionsViewSet(viewsets.ReadOnlyModelViewSet):
    "Вывод списка всех регионов"
    permission_classes = [IsAuthenticated, IsStudent]
    queryset = Regions.objects.all().order_by('name')

    def get_serializer_class(self):
        return RegionsSerializer


class MosViewSet(viewsets.ReadOnlyModelViewSet):
    "Вывод списка всех муниципальных образований"
    permission_classes = [IsAuthenticated, IsStudent]
    queryset = Mos.objects.all().order_by('name')

    def get_serializer_class(self):
        return MosSerializer


class OoTypesViewSet(viewsets.ReadOnlyModelViewSet):
    "Вывод списка всех типов оргаинзаций"
    permission_classes = [IsAuthenticated]
    queryset = OoTypes.objects.all()

    def get_serializer_class(self):
        return OoTypesSerializer


class OoCreateViewSet(viewsets.ModelViewSet):
    "Запись новой организации в базу"
    permissions = [IsAuthenticated, IsStudent]
    serializer_class = OoNewSerializer

    def create(self, request):
        data = {
            'mo': Mos.objects.get(name=request.GET.get('mo')).id,
            'short_name': request.GET.get('short_name'),
            'full_name': request.GET.get('full_name'),
            'type_oo': OoTypes.objects.get(name=request.GET.get('type_oo')).id,
            'form': request.GET.get('form'),
        }
        oo = OoNewSerializer(
            data=data
        )
        if oo.is_valid():
            res = oo.save()
            return JsonResponse({
                'id_oo': res.id,
                'name_oo': res.short_name
            })


class OosViewSet(viewsets.ReadOnlyModelViewSet):
    "Вывод списка организаций по определенному МО"
    permission_classes = [IsAuthenticated, IsStudent]

    def get_queryset(self):
        qs = Oos.objects.all()
        if is_ajax(request=self.request):
            if 'oo_id' in self.request.GET:
                qs = qs.filter(id=self.request.GET.get('oo_id'))
            else:
                qs = qs.filter(mo_id=self.request.GET.get('id'))
                if 'search' in self.request.GET:
                    qs = qs.filter(full_name__contains=self.request.GET.get('search'))
        return qs

    def get_serializer_class(self):
        return OosSerializer


class PositionCategoriesViewSet(viewsets.ReadOnlyModelViewSet):
    "Вывод списка категорий должностей"
    permission_classes = [IsAuthenticated, IsStudent]
    queryset = PositionCategories.objects.all()

    def get_serializer_class(self):
        return PositionCategoriesSerializer


class EducationLevelsViewSet(viewsets.ReadOnlyModelViewSet):
    "Вывод списка уровней образования"
    permission_classes = [IsAuthenticated, IsStudent]
    queryset = EducationLevels.objects.all()

    def get_serializer_class(self):
        return EducationLevelsSerializer


class EducationCatsViewSet(viewsets.ReadOnlyModelViewSet):
    "Вывод списка категорий получаемого образования"
    permission_classes = [IsAuthenticated, IsStudent]
    queryset = EducationCats.objects.all()

    def get_serializer_class(self):
        return EducationCatsSerializer


class PositionsViewSet(viewsets.ReadOnlyModelViewSet):
    "Вывод списка должностей по выбранной категории должности"
    permission_classes = [IsAuthenticated, IsStudent]
    def get_queryset(self):
        return Positions.objects.all()

    def get_serializer_class(self):
        return PositionsSerializer


class EventsFormCreate(viewsets.ModelViewSet):
    "Добавление анкеты регистрации на мероприятие"
    permission_classes = [IsAuthenticated, IsStudent, IsAjax]
    serializer_class = EventsFormsSerializer

    def perform_create(self, serializer):
        serializer.save(profile_id=Profiles.objects.get(user_id=self.request.user.id).id)

    def create(self, request, *args, **kwargs):
        stgroup = StudentGroups.objects.get(id=request.data.get('group'))
        if not stgroup.students.filter(id=Profiles.objects.get(user_id=request.user.id).id).exists():
            try:
                response = super(EventsFormCreate, self).create(request, *args, **kwargs)
                id_prof = Profiles.objects.get(user_id=request.user.id).id
                stgroup = StudentGroups.objects.get(id=request.data.get('group'))
                stgroup.students.add(Profiles.objects.get(id=id_prof))
                stgroup.save()
                CheckStudentsNumber(request.data.get('group'))
                status = Statuses.objects.get(name='В работе').id
                return JsonResponse({'check': 'ok', 'status': status})
            except BaseException:
                messages.error(request, 'Произошла ошибка при сохранении анкеты. Повторите попытку позже')
                return JsonResponse({'check': 'err'})
        else:
            messages.error(request, 'Вы уже подавали заявку на участие в этом мероприятии')
            return JsonResponse({'check': 'err'})


class CoursesFormCreate(viewsets.ModelViewSet):
    "Добавление анкеты регистрации на курс"
    permission_classes = [IsAuthenticated, IsStudent, IsAjax]
    serializer_class = CoursesFormsSerializer

    def perform_create(self, serializer):
        serializer.save(profile_id=Profiles.objects.get(user_id=self.request.user.id).id)

    def create(self, request, *args, **kwargs):
        stgroup = StudentGroups.objects.get(id=request.data.get('group'))
        if not stgroup.students.filter(id=Profiles.objects.get(user_id=request.user.id).id).exists():
            try:
                response = super(CoursesFormCreate, self).create(request, *args, **kwargs)
                id_prof = Profiles.objects.get(user_id=request.user.id).id
                stgroup = StudentGroups.objects.get(id=request.data.get('group'))
                stgroup.students.add(Profiles.objects.get(id=id_prof))
                stgroup.save()
                status = Statuses.objects.get(name='В работе').id
                return JsonResponse({'check': 'ok', 'status': status})
            except BaseException:
                messages.error(request, 'Произошла ошибка при сохранении анкеты. Повторите попытку позже')
                return JsonResponse({'check': 'err'})
        else:
            messages.error(request, 'Вы уже подавали заявку на участие в этом курсе')
            return JsonResponse({'check': 'err'})


class GetLastEventForm(viewsets.ReadOnlyModelViewSet):
    "Получение крайней анкеты пользователя для регистрации в мероприятии"
    permission_classes = [IsAuthenticated, IsStudent]

    def get_queryset(self):
        if EventsForms.objects.filter(profile_id=Profiles.objects.get(user_id=self.request.user.id).id).exists():
            qs = EventsForms.objects.filter(profile_id=Profiles.objects.get(user_id=self.request.user.id).id).order_by('-id')
            return qs[:1]
        else:
           return None

    def get_serializer_class(self):
        return FullEventsFormsSerializer


class GetLastCourseForm(viewsets.ReadOnlyModelViewSet):
    "Получение крайней анкеты пользователя для регистрации на курс"
    permission_classes = [IsAuthenticated, IsStudent]

    def get_queryset(self):
        if CoursesForms.objects.filter(profile_id=Profiles.objects.get(user_id=self.request.user.id).id).exists():
            qs = CoursesForms.objects.filter(profile_id=Profiles.objects.get(user_id=self.request.user.id).id).order_by('-id')
            return qs[:1]
        else:
           return None

    def get_serializer_class(self):
        return FullCoursesFormsSerializer


class AppCreate(viewsets.ModelViewSet):
    "Добавление заявки на участие в мероприятии/курсе"
    permission_classes = [IsAuthenticated, IsStudent, IsAjax]
    serializer_class = AppsSerializer

    def perform_create(self, serializer):
        serializer.save(profile_id=Profiles.objects.get(user_id=self.request.user.id).id)

    def create(self, request, *args, **kwargs):
        response = super(AppCreate, self).create(request, *args, **kwargs)
        gr = StudentGroups.objects.get(id=request.POST.get('group'))
        type = ''
        if gr.event is None:
            type = 'course'
        else:
            type = 'event'
        messages.success(request, 'Заявка успешно сохранена')
        return JsonResponse({
            'check': 'ok',
            'type': type
        })


class NewEventRegistration(viewsets.ViewSet):
    "Переход на форму заполнения анкеты для регистрации на мероприятие"
    permission_classes = [IsAuthenticated, IsStudent]
    model = EventsForms
    template_name = 'students/events/registration.html'

    def post(self, request, *args, **kwargs):
        messages.error(request, 'Произошла ошибка, повторите попытку позже')
        return HttpResponseRedirect('/')

    def new(self, request, *args, **kwargs):
        try:
            id_group = request.GET.get('group')
            id_user = request.user.id
            check = False
            if Profiles.objects.filter(id=id_user).exists():
                if EventsForms.objects.filter(profile=Profiles.objects.get(id=id_user)).exists():
                    check = True
            return render(request, 'students/events/registration.html', {
                'id_group': id_group,
                'id_user': id_user,
                'check': check
            })
        except BaseException:
            messages.error(self.request, 'Произошла ошибка, повторите попытку позже')
        return HttpResponseRedirect('/')


class NewCourseRegistration(viewsets.ViewSet):
    "Переход на форму заполнения анкеты для регистрации на мероприятие"
    permission_classes = [IsAuthenticated, IsStudent]
    model = CoursesForms
    template_name = 'students/events/registration.html'

    def post(self, request, *args, **kwargs):
        messages.error(request, 'Произошла ошибка, повторите попытку позже')
        return HttpResponseRedirect('/')

    def new(self, request, *args, **kwargs):
        try:
            id_group = request.GET.get('group')
            id_user = request.user.id
            check = False
            if Profiles.objects.filter(id=id_user).exists():
                if CoursesForms.objects.filter(profile=Profiles.objects.get(id=id_user)).exists():
                    check = True
            return render(request, 'students/courses/registration.html', {
                'id_group': id_group,
                'id_user': id_user,
                'check': check
            })
        except BaseException:
            messages.error(self.request, 'Произошла ошибка, повторите попытку позже')
        return HttpResponseRedirect('/')


class CheckSurname(viewsets.ReadOnlyModelViewSet):
    "Вывод фамилии пользователя из профиля"
    permission_classes = [IsAuthenticated, IsStudent]
    model = Profiles
    template_name = 'students/events/registration.html'

    def post(self, request):
        messages.error(request, 'Произошла ошибка, повторите попытку позже')
        return HttpResponseRedirect('/')

    def get_queryset(self):
        qs = Profiles.objects.filter(user_id=self.request.user.id)
        return qs

    def get_serializer_class(self):
        return CheckSurnameSerializer


class ListApps(viewsets.ReadOnlyModelViewSet):
    'Вывод активных заявок на участие в мероприятиях'
    permission_classes = [IsAuthenticated, IsStudent]

    def get_queryset(self):
        qs = Apps.objects.filter(profile_id=Profiles.objects.get(user_id=self.request.user.id).id)\
            .exclude(status_id=Statuses.objects.get(name='Архив').id).order_by('-date_create')
        if is_ajax(request=self.request):
            if 'id_app' in self.request.GET:
                qs = qs.get(id=self.request.GET.get('id_app'))
        return qs

    def get_serializer_class(self):
        return ListAppsSerializer


class DetailAppViewSet(viewsets.ReadOnlyModelViewSet):
    "Детальное описание заявки"
    permission_classes = [IsAuthenticated, IsStudent]

    def retrieve(self, request, pk=None):
        queryset = Apps.objects.all()
        app = get_object_or_404(queryset, pk=request.GET.get('pk'))
        if app.group.course is None:
            date_offer = app.group.event.date_start - BDay(10)
        else:
            date_offer = app.group.course.date_start - BDay(10)
        serializer = DetailAppSerializer(app)
        check_survey = StudentGroups.objects.get(id=app.group_id).survey_show
        return JsonResponse({
            'data': serializer.data,
            'survey': check_survey,
            'date_offer': date_offer.strftime('%d.%m.%Y')
        })


class ArchiveApps(viewsets.ReadOnlyModelViewSet):
    'Вывод архивных заявок на участие в мероприятиях'
    permission_classes = [IsAuthenticated, IsStudent]

    def get_queryset(self):
        qs = Apps.objects.filter(profile_id=Profiles.objects.get(user_id=self.request.user.id).id)\
            .filter(status_id=Statuses.objects.get(name='Архив').id).order_by('-date_create')
        if is_ajax(request=self.request):
            if 'id_app' in self.request.GET:
                qs = qs.get(id=self.request.GET.get('id_app'))
        return qs

    def get_serializer_class(self):
        return ListAppsSerializer


class CheckExistApp(viewsets.ReadOnlyModelViewSet):
    "Проверка на подачу заявки для прохождения курса"
    permission_classes = [IsAuthenticated, IsStudent]

    def get_queryset(self):
        qs = Apps.objects.filter(profile_id=Profiles.objects.get(user_id=self.request.user.id).id)
        if 'id_group' in self.request.GET:
            if qs.filter(group_id=self.request.GET.get('id_group')).exists():
                qs = qs.filter(group_id=self.request.GET.get('id_group'))
            else:
                qs = None
        return qs

    def get_serializer_class(self):
        return CheckAppSerializer


class StudyCertViewSet(viewsets.ReadOnlyModelViewSet):
    "Получение справок об образовании пользователя"
    permission_classes = [IsAuthenticated, IsStudent]

    def get_queryset(self):
        qs = Docs.objects.filter(profile_id=Profiles.objects.get(user_id=self.request.user.id).id).\
            filter(doc_type_id=DocsTypes.objects.get(name='Справка об обучении').id).order_by('-id')
        if 'id_studycert' in self.request.GET:
            qs = qs.filter(id=self.request.GET.get('id_studycert'))
        return qs

    def get_serializer_class(self):
        return DocsSerializer


class DiplomaViewSet(viewsets.ReadOnlyModelViewSet):
    "Получение диплома пользователя"
    permission_classes = [IsAuthenticated, IsStudent]

    def get_queryset(self):
        qs = Docs.objects.filter(profile_id=Profiles.objects.get(user_id=self.request.user.id).id).\
            filter(doc_type_id=DocsTypes.objects.get(name='Диплом').id).order_by('-id')
        if 'id_diploma' in self.request.GET:
            qs = qs.filter(id=self.request.GET.get('id_diploma'))
        return qs

    def get_serializer_class(self):
        return DocsSerializer


class ChangeSurnameViewSet(viewsets.ReadOnlyModelViewSet):
    "Получение документов о смене фамилии пользователя"
    permission_classes = [IsAuthenticated, IsStudent]

    def get_queryset(self):
        qs = Docs.objects.filter(profile_id=Profiles.objects.get(user_id=self.request.user.id).id).\
            filter(doc_type_id=DocsTypes.objects.get(name='Документ о смене фамилии').id).order_by('-id')
        if 'id_changesurname' in self.request.GET:
            qs = qs.filter(id=self.request.GET.get('id_changesurname'))
        return qs

    def get_serializer_class(self):
        return DocsSerializer


class DocsTypesViewSet(viewsets.ReadOnlyModelViewSet):
    "Поулчение списка типов файлов"
    permission_classes = [IsAuthenticated, IsStudent]

    def get_queryset(self):
        qs = DocsTypes.objects.all()
        if 'id_doctype' in self.request.GET:
            qs = qs.filter(id=self.request.GET.get('id_doctype'))
        return qs

    def get_serializer_class(self):
        return DocsTypesSerializer


class UploadDocViewSet(viewsets.ModelViewSet):
    "Загрузка нового файла"
    permission_classes = [IsAuthenticated, IsStudent]
    serializer_class = UploadDocSerializer

    def perform_create(self, serializer):
        new = serializer.save(profile_id=Profiles.objects.get(user_id=self.request.user.id).id,
                        file=self.request.FILES.get('file'),
                        doc_type=DocsTypes.objects.get(id=self.request.POST.get('doc_type')))
        if DocsTypes.objects.get(id=self.request.POST.get('doc_type')).name == 'Документ об оплате':
            app = Apps.objects.filter(group_id=self.request.POST.get('group')).\
                get(profile_id=Profiles.objects.get(user_id=self.request.user.id).id)
            gr = StudentGroups.objects.get(id=self.request.POST.get('group'))
            type = ''
            if gr.event is None:
                type = 'course'
            else:
                type = 'event'
            app.pay_doc_id = new.id
            app.status_id = Statuses.objects.get(name='На проверке').id
            app.save()
            messages.success(self.request, 'Документ об оплате успешно загружен и передан на проверку')
            return JsonResponse({'type': type})
        else:
            return JsonResponse({'check': 'ok'})


class GetUrlStudyViewSet(viewsets.ReadOnlyModelViewSet):
    "Получение ссылки на прохождение обучения"
    permission_classes = [IsAuthenticated, IsStudentOfThisGroup, IsPay, IsStudent]
    serializer_class = EventUrlSerializer

    def retrieve(self, request, pk=None):
        if is_ajax(request=request):
            queryset = StudentGroups.objects.all()
            gr = get_object_or_404(queryset, pk=request.GET.get('pk'))
            self.check_object_permissions(request, gr)
            serializer = EventUrlSerializer(gr)
            return JsonResponse({'data': serializer.data})
        else:
            return HttpResponseRedirect('/access_denied/')


class GetUrlSurveyViewSet(viewsets.ReadOnlyModelViewSet):
    "Получение ссылки на прохождение опроса"
    permission_classes = [IsAuthenticated, IsStudentOfThisGroup, IsPay, IsStudent]
    serializer_class = EventUrlSerializer

    def retrieve(self, request, pk=None):
        if is_ajax(request=request):
            queryset = StudentGroups.objects.all()
            gr = get_object_or_404(queryset, pk=request.GET.get('pk'))
            self.check_object_permissions(request, gr)
            serializer = SurveyUrlSerializer(gr)
            return JsonResponse({'data': serializer.data})
        else:
            return HttpResponseRedirect('/access_denied/')


class ChangeAppToOnStudyViewSet(viewsets.ModelViewSet):
    "Изменение статуса заявки на 'Проходит обучение'"
    permission_classes = [IsAuthenticated, IsStudent, IsAjax]
    serializer_class = DetailAppSerializer

    def retrieve(self, request, *args, **kwargs):
        if is_ajax(request=request):
            queryset = StudentGroups.objects.all()
            gr = get_object_or_404(queryset, pk=request.GET.get('pk'))
            self.check_object_permissions(request, gr)
            app = Apps.objects.filter(group_id=gr.id).\
                get(profile_id=Profiles.objects.get(user_id=request.user.id).id)
            app.status_id = Statuses.objects.get(name='Проходит обучение').id
            app.save()
            return JsonResponse({})
        else:
            return HttpResponseRedirect('/access_denied/')


class ChangeAppToEndViewSet(viewsets.ModelViewSet):
    "Изменение статуса заявки на 'Обучение завершено'"
    permission_classes = [IsAuthenticated, IsStudent, IsAjax]
    serializer_class = DetailAppSerializer

    def retrieve(self, request, *args, **kwargs):
        if is_ajax(request=request):
            queryset = StudentGroups.objects.all()
            gr = get_object_or_404(queryset, pk=request.GET.get('pk'))
            self.check_object_permissions(request, gr)
            app = Apps.objects.filter(group_id=gr.id).\
                get(profile_id=Profiles.objects.get(user_id=request.user.id).id)
            type = ''
            if gr.event is None:
                app.status_id = Statuses.objects.get(name='Обучение завершено').id
                type = 'course'
            else:
                app.status_id = Statuses.objects.get(name='Архив').id
                type = 'event'
            app.check_survey = True
            app.save()
            return JsonResponse({'type': type})
        else:
            return HttpResponseRedirect('/access_denied/')


def check_access(request):
    "Проверка на присутствие пользователя в группе Обучающиеся"
    return request.user.groups.filter(name='Обучающиеся').exists()


def is_ajax(request):
    "Проверка на AJAX запрос"
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


def CheckStudentsNumber(id_group):
    "Проверка на полноту учебной группы мероприятия"
    group = StudentGroups.objects.get(id=id_group)
    if group.students_number == group.students.count():
        group.status = StGroupStatuses.objects.get(name='Ожидает утверждения состава')
        group.save()
    return None


@login_required(login_url='/')
def CoursesList(request):
    "Переход на страницу со списком курсов"
    if check_access(request) is False:
        return render(request, 'authen/access_denied.html')
    return render(request, 'students/courses/list.html')


@login_required(login_url='/')
def Detail(request, id):
    "Переход на страницу с информацией о ОУ/ИКУ"
    if check_access(request) is False:
        return render(request, 'authen/access_denied.html')
    return render(request, 'students/detail.html', {
        'id': id
    })


@login_required(login_url='/')
def EventsList(request):
    "Переход на страницу со списком мероприятий"
    if check_access(request) is False:
        return render(request, 'authen/access_denied.html')
    return render(request, 'students/events/list.html')


@login_required(login_url='/')
def AppsList(request):
    "Переход на страницу со списком активных заявок"
    if check_access(request) is False:
        return render(request, 'authen/access_denied.html')
    return render(request, 'students/apps/actual.html')


@login_required(login_url='/')
def ArchiveList(request):
    "Переход на страницу со списком архивных заявок"
    if check_access(request) is False:
        return render(request, 'authen/access_denied.html')
    return render(request, 'students/apps/archive.html')

# Create your views here.
