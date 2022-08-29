import os
import celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = celery.Celery('config')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

app.conf.beat_schedule = {
    'CheckRegEnd': {
        'task': 'centre.tasks.CheckRegistrationEnd',
        'schedule': crontab(minute=0, hour=0),
    },
    'ShowSurveyUrl': {
        'task': 'centre.tasks.ShowSurveyUrl',
        'schedule': crontab(minute=0, hour=0),
    },
}
