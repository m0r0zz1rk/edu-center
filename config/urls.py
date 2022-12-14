"""edu URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_views
from dep.views import PersonalSchedule
from config import settings

urlpatterns = [
    path('', include('authen.urls', namespace='authen')),
    path('personal_schedule/', PersonalSchedule.as_view(), name='pers_schedule'),
    path('student/', include('students.urls', namespace='students')),
    path('centre/', include('centre.urls', namespace='centre')),
    path('dep/', include('dep.urls', namespace='dep')),
    path('admin/', admin.site.urls),
    path('password-reset/', auth_views.PasswordResetView.as_view(
             template_name='authen/password_reset/password_reset.html',
             subject_template_name='authen/password_reset/password_reset_subject.txt',
             email_template_name='authen/password_reset/password_reset_email.html',
         ), name='password_reset'),
    path('password-reset/done/',
         auth_views.PasswordResetDoneView.as_view(
             template_name='authen/password_reset/password_reset_mail_sent.html'
         ), name='password_reset_done'),
    path('password-reset-confirm/<uidb64>/<token>/',
         auth_views.PasswordResetConfirmView.as_view(
             template_name='authen/password_reset/password_reset_confirmation.html'
         ), name='password_reset_confirm'),
    path('password-reset-complete/',
         auth_views.PasswordResetCompleteView.as_view(
             template_name='authen/password_reset/password_reset_completed.html'
         ), name='password_reset_complete')
]
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
