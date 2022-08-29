from django import template
from authen.models import *

register = template.Library()

@register.simple_tag
def get_states():
    return States.objects.all()