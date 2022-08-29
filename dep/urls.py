from django.conf.urls.static import static
from django.urls import path
from config import settings
from .views import *

app_name = 'dep'

urlpatterns = [
    path('study/programs', ProgramsListView.as_view(), name='programslist'),
    path('study/editprogram_<int:pk>', ProgramDetailView.as_view(), name='editprogram'),
    path('study/newprogram', ProgramCreateView.as_view(), name='newprogram'),
    path('study/kug_<int:pk>', KugListView.as_view(), name='changekug'),
    path('study/planning/choose', PlanningChoose, name='plan_choose'),
    path('study/planning/courses', CoursesList.as_view(), name='courseslist'),
    path('study/planning/course_create', CoursesCreate.as_view(), name='coursecreate'),
    path('study/planning/events', EventsList.as_view(), name='eventslist'),
    path('study/planning/event_<int:pk>', EventDetailView.as_view(), name='editevent'),
    path('study/planning/event_create', EventCreateView.as_view(), name='eventcreate'),
    path('study/studentgroups', StudentsGroupList.as_view(), name='studentgroups'),
    path('study/studentgroups/new', StudentGroupCreate.as_view(), name='groupnew'),
    path('study/students', StGrStudentsList.as_view(), name='studentslist'),
    path('study/schedule', ShedulesList.as_view(), name='schedulelist'),
    path('study/schedule/course_lessons_<int:group>', CourseLessonsList.as_view(), name='courselessons'),
    path('study/schedule/event_lessons_<int:group>', EventLessonsList.as_view(), name='eventlessons'),
]