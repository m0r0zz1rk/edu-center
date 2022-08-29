from rest_framework import serializers
from authen.models import Profiles
from centre.models import Courses, StudentGroups, Programs, \
    Events, Mos, Oos, PositionCategories, \
    Positions, StGroupStatuses, OoTypes
from students.models import Regions, EventsForms, Apps, \
    CoursesForms, EducationLevels, EducationCats, Docs, \
    DocsTypes


class CoursesListSerializer(serializers.ListSerializer):
    "Фильтрация учебных групп только по курсам"
    def to_representation(self, data):
        data = data.filter(event_id=None).filter(status=StGroupStatuses.objects.get(name='Идет регистрация'))
        return super().to_representation(data)


class EventsListSerializer(serializers.ListSerializer):
    "Фильтрация учебных групп только по мероприятиям"
    def to_representation(self, data):
        data = data.filter(course_id=None).filter(status=StGroupStatuses.objects.get(name='Идет регистрация'))
        return super().to_representation(data)


class ProgramsSerializer(serializers.ModelSerializer):
    "Получение всех программ"
    class Meta:
        model = Programs
        fields = ('department', 'name', 'duration', 'type_dpp')


class ShortCoursesSerializer(serializers.ModelSerializer):
    "Краткий список всех курсов"
    program = ProgramsSerializer(read_only=True)

    class Meta:
        model = Courses
        fields = ('id', 'program', 'date_start', 'date_finish')


class CoursesSerializer(serializers.ModelSerializer):
    "Получение всех курсов"
    program = ProgramsSerializer(read_only=True)

    class Meta:
        model = Courses
        fields = '__all__'


class ShortEventsSerializer(serializers.ModelSerializer):
    "Краткий список всех мероприятий"
    type = serializers.SlugRelatedField(slug_field='name', read_only=True)

    class Meta:
        model = Events
        fields = ('id', 'name', 'type', 'duration', 'date_start', 'date_finish')


class EventsSerializer(serializers.ModelSerializer):
    "Получение всех мероприятий"
    type = serializers.SlugRelatedField(slug_field='name', read_only=True)

    class Meta:
        model = Events
        exclude = ('categories', 'price')


class CuratorField(serializers.RelatedField):
    "Получение ФИО и телефона куратора группы"
    def to_representation(self, value):
        fio = value.surname+' '+value.name+' '+value.patronymic+':'+value.phone+'&'+value.user.email
        return fio


class DetailSerializer(serializers.ModelSerializer):
    "Детальное представление учебных групп и курсов/мероприятий"
    course = CoursesSerializer(read_only=True)
    event = EventsSerializer(read_only=True)
    curator = CuratorField(read_only=True)
    status = serializers.SlugRelatedField(slug_field='name', read_only=True)

    class Meta:
        model = StudentGroups
        exclude = ('students', 'students_number', 'offer', 'event_url', 'survey_url')


class CoursesStGroupsSerializer(serializers.ModelSerializer):
    "Список учебных групп по курсам"
    course = CoursesSerializer(read_only=True)
    curator = CuratorField(read_only=True)

    class Meta:
        list_serializer_class = CoursesListSerializer
        model = StudentGroups
        exclude = ('event', 'students', 'students_number')


class EventsStGroupsSerializer(serializers.ModelSerializer):
    "Список учебных групп по мероприятиям"
    curator = CuratorField(read_only=True)
    event = EventsSerializer(read_only=True)

    class Meta:
        list_serializer_class = EventsListSerializer
        model = StudentGroups
        fields = '__all__'


class RegionsSerializer(serializers.ModelSerializer):
    "Список регионов (для заполнения анкеты)"
    class Meta:
        model = Regions
        fields = "__all__"


class MosSerializer(serializers.ModelSerializer):
    "Список мунициапльных образований (для заполнения анкеты)"
    class Meta:
        model = Mos
        fields = '__all__'


class OoNewSerializer(serializers.ModelSerializer):
    "Добавление организации"

    class Meta:
        model = Oos
        fields = ('id', 'mo', 'short_name', 'full_name', 'type_oo', 'form')


class OosSerializer(serializers.ModelSerializer):
    "Список организаций (для заполнения анкеты)"
    mo = serializers.SlugRelatedField(slug_field='name', read_only=True)
    type_oo = serializers.SlugRelatedField(slug_field='name', read_only=True)

    class Meta:
        model = Oos
        fields = ('id', 'mo', 'short_name', 'full_name', 'type_oo', 'form')


class PositionCategoriesSerializer(serializers.ModelSerializer):
    "Список категорий дожностей (для заполнения анекты)"
    class Meta:
        model = PositionCategories
        fields = "__all__"


class PositionsSerializer(serializers.ModelSerializer):
    "Список должностей (для заполнения анкеты)"
    class Meta:
        model = Positions
        fields = "__all__"


class EducationLevelsSerializer(serializers.ModelSerializer):
    "Список уровней образования"
    class Meta:
        model = EducationLevels
        fields = "__all__"


class EducationCatsSerializer(serializers.ModelSerializer):
    "Список уровней образования"
    class Meta:
        model = EducationCats
        fields = "__all__"


class CheckSurnameSerializer(serializers.ModelSerializer):
    "Получение фамилии пользователя из профилия"
    class Meta:
        model = Profiles
        fields = ('surname', )


class EventsFormsSerializer(serializers.ModelSerializer):
    "Добавление анкеты для регистрации в мероприятии"
    class Meta:
        model = EventsForms
        exclude = ('id', )


class CoursesFormsSerializer(serializers.ModelSerializer):
    "Добавление анкеты для регистрации в курсе"
    class Meta:
        model = CoursesForms
        exclude = ('id',)


class AppsSerializer(serializers.ModelSerializer):
    "Добавление заявки на прохождение мероприятия/курса"
    class Meta:
        model = Apps
        fields = ('profile', 'group', 'status')


class AppsStGroupsSerializer(serializers.ModelSerializer):
    "Список учебных групп по мероприятиям/курсам"
    curator = CuratorField(read_only=True)
    event = ShortEventsSerializer(read_only=True)
    course = ShortCoursesSerializer(read_only=True)

    class Meta:
        model = StudentGroups
        fields = ('id', 'curator', 'event', 'course')


class DetailAppSerializer(serializers.ModelSerializer):
    "Детальное описание заявки"
    status = serializers.SlugRelatedField(slug_field='name', read_only=True)

    class Meta:
        model = Apps
        fields = ('id', 'group_id', 'status', 'check_diploma_info')


class ListAppsSerializer(serializers.ModelSerializer):
    "Список заявок на участие в мероприятиях"
    group = AppsStGroupsSerializer(read_only=True)
    #offer = serializers.SlugRelatedField(slug_field='file', read_only=True)
    #pay_doc = serializers.SlugRelatedField(slug_field='file', read_only=True)
    status = serializers.SlugRelatedField(slug_field='name', read_only=True)

    class Meta:
        model = Apps
        fields = ('id', 'date_create', 'group', 'certificate_id', 'status')


class CheckAppSerializer(serializers.ModelSerializer):
    "Проверка существующей заявки на прохождение курса"
    class Meta:
        model = Apps
        fields = ('id', 'group_id', 'profile_id')


class DocsSerializer(serializers.ModelSerializer):
    "Получение документов пользователя"
    doc_type = serializers.SlugRelatedField(slug_field='name', read_only=True)
    filename = serializers.ReadOnlyField()

    class Meta:
        model = Docs
        exclude = ('profile', )


class UploadDocSerializer(serializers.ModelSerializer):
    "Загрузка нового файла пользователя"
    class Meta:
        model = Docs
        fields = "__all__"


class DocsTypesSerializer(serializers.ModelSerializer):
    "Получение списка типов файлов"
    class Meta:
        model = DocsTypes
        fields = "__all__"


class OoTypesSerializer(serializers.ModelSerializer):
    "Получение списка типов организаций"
    class Meta:
        model = OoTypes
        fields = ('name',)


class FullEventsFormsSerializer(serializers.ModelSerializer):
    "Полные анкеты регистрации в мероприятиях"
    region = RegionsSerializer(read_only=True)
    mo = MosSerializer(read_only=True)
    oo = OosSerializer(read_only=True)
    position_cat = PositionCategoriesSerializer(read_only=True)
    position = PositionsSerializer(read_only=True)

    class Meta:
        model = EventsForms
        fields = "__all__"


class FullCoursesFormsSerializer(serializers.ModelSerializer):
    "Полные анкеты регистрации в мероприятиях"
    region = RegionsSerializer(read_only=True)
    mo = MosSerializer(read_only=True)
    oo = OosSerializer(read_only=True)
    position_cat = PositionCategoriesSerializer(read_only=True)
    position = PositionsSerializer(read_only=True)
    edu_level = EducationLevelsSerializer(read_only=True)
    edu_cat = EducationCatsSerializer(read_only=True)
    edu_doc = DocsSerializer(read_only=True)
    change_surname = DocsSerializer(read_only=True)

    class Meta:
        model = CoursesForms
        fields = "__all__"


class EventUrlSerializer(serializers.ModelSerializer):
    "Получение ссылки на прохождение обучения"

    class Meta:
        model = StudentGroups
        fields = ('event_url', 'students')


class SurveyUrlSerializer(serializers.ModelSerializer):
    "Получение ссылки на прохождение опроса"

    class Meta:
        model = StudentGroups
        fields = ('survey_url', 'students')