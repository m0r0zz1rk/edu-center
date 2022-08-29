from django import template

from authen.models import Profiles
from students.models import DocsTypes, Docs

register = template.Library()


@register.simple_tag
def get_docstypes():
    return DocsTypes.objects.exclude(name__in=['Договор оферты', 'Документ об оплате', 'Скан удостоверения'])


@register.simple_tag(takes_context=True)
def get_docs(context):
    request = context['request']
    return Docs.objects.filter(profile_id=Profiles.objects.get(user_id=request.user.id)).\
        exclude(doc_type__in=DocsTypes.objects.filter(name__in=['Договор оферты', 'Документ об оплате']))
