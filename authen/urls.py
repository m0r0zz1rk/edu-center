from django.conf.urls.static import static
from django.urls import path

from config import settings
from .views import *

app_name = 'authen'

urlpatterns = [
    path('', main, name='main'),
    path('login/', login_user, name='login_user'),
    path('logout/', logout_user, name='logout_user'),
    path('registration/', user_reg, name='user_reg'),
    path('profile/', ProfileDetailView.as_view(), name='profile'),
    path('change_prof/', change_info, name='change_prof'),
    path('upload_doc/', upload_doc, name='upload_doc'),
    path('doc_view/', doc_view, name='doc_view'),
    path('offer_view/', offer_view, name='offer_view'),
    path('delete_doc/', delete_doc, name='delete_doc'),
    path('change_pass/', change_pass, name='change_pass'),
    path('access_denied/', access_denied, name='access_denied'),
    path('check_data/', CheckUniqueData.as_view(), name='check_data')
]
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)