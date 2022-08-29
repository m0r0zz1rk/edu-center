from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from .views import CoursesStGroupsViewSet, EventsStGroupsViewSet, CoursesList, \
    EventsList, RegionsViewSet, MosViewSet, OosViewSet, \
    PositionCategoriesViewSet, PositionsViewSet, EventsFormCreate, \
    NewEventRegistration, NewCourseRegistration, ListApps, AppsList, \
    CheckExistApp, AppCreate, EducationLevelsViewSet, EducationCatsViewSet, \
    CheckSurname, StudyCertViewSet, DocsTypesViewSet, UploadDocViewSet, \
    DiplomaViewSet, ChangeSurnameViewSet, CoursesFormCreate, ArchiveApps, \
    ArchiveList, GetLastEventForm, GetLastCourseForm, Detail, \
    ServiceDetail, DetailAppViewSet, GetUrlStudyViewSet, ChangeAppToOnStudyViewSet, ChangeAppToEndViewSet, \
    GetUrlSurveyViewSet, OoTypesViewSet, OoCreateViewSet

app_name = 'students'

urlpatterns = format_suffix_patterns([
    path('api/courses', CoursesStGroupsViewSet.as_view({'get': 'list'})),
    path('api/detail', ServiceDetail.as_view({'get': 'retrieve'})),
    path('api/events', EventsStGroupsViewSet.as_view({'get': 'list'})),
    path('api/regions', RegionsViewSet.as_view({'get': 'list'})),
    path('api/mos', MosViewSet.as_view({'get': 'list'})),
    path('api/oos', OosViewSet.as_view({'get': 'list'})),
    path('api/type_oos', OoTypesViewSet.as_view({'get': 'list'})),
    path('api/oo_new', OoCreateViewSet.as_view({'get': 'create'})),
    path('api/pos_cats', PositionCategoriesViewSet.as_view({'get': 'list'})),
    path('api/positions', PositionsViewSet.as_view({'get': 'list'})),
    path('api/edu_levels', EducationLevelsViewSet.as_view({'get': 'list'})),
    path('api/edu_cats', EducationCatsViewSet.as_view({'get': 'list'})),
    path('api/new_eventform', EventsFormCreate.as_view({'post': 'create'})),
    path('api/getlast_event', GetLastEventForm.as_view({'get': 'list'})),
    path('api/getlast_course', GetLastCourseForm.as_view({'get': 'list'})),
    path('api/new_courseform', CoursesFormCreate.as_view({'post': 'create'})),
    path('api/new_app', AppCreate.as_view({'post': 'create'})),
    path('api/apps', ListApps.as_view({'get': 'list'})),
    path('api/detail_app', DetailAppViewSet.as_view({'get': 'retrieve'})),
    path('api/archive', ArchiveApps.as_view({'get': 'list'})),
    path('api/check_app', CheckExistApp.as_view({'get': 'list'})),
    path('api/check_surname', CheckSurname.as_view({'get': 'list'})),
    path('api/study_certs', StudyCertViewSet.as_view({'get': 'list'})),
    path('api/diploma', DiplomaViewSet.as_view({'get': 'list'})),
    path('api/change_surname', ChangeSurnameViewSet.as_view({'get': 'list'})),
    path('api/doc_types', DocsTypesViewSet.as_view({'get': 'list'})),
    path('api/doc_upload', UploadDocViewSet.as_view({'post': 'create'})),
    path('api/study_url', GetUrlStudyViewSet.as_view({'get': 'retrieve'})),
    path('api/survey_url', GetUrlSurveyViewSet.as_view({'get': 'retrieve'})),
    path('api/status_study', ChangeAppToOnStudyViewSet.as_view({'get': 'retrieve'})),
    path('api/status_survey', ChangeAppToEndViewSet.as_view({'get': 'retrieve'})),
    path('courses/', CoursesList, name='courseslist'),
    path('event_reg/', NewEventRegistration.as_view({'get': 'new'}), name='event_reg'),
    path('course_reg/', NewCourseRegistration.as_view({'get': 'new'}), name='course_reg'),
    path('events/', EventsList, name='eventslist'),
    path('detail/<int:id>', Detail, name='detail'),
    path('apps/', AppsList, name='appslist'),
    path('archive/', ArchiveList, name='archivelist'),
])