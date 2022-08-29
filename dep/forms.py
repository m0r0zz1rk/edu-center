from django import forms

from authen.middleware import GetDepsFromAD
from centre.models import AudienceCategories, Programs, Courses, EventTypes, Events


class ProgramForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        if 'dep' in kwargs:
            dep_name = kwargs.pop('dep')
            kwargs.update(initial={
                'department': dep_name
            })
        super(ProgramForm, self).__init__(*args, **kwargs)

    class Meta:
        dep_choices = GetDepsFromAD()
        cats = AudienceCategories.objects.all()
        cat_choices = ()
        for cat in cats:
            cat_choices = cat_choices + ((str(cat.id), cat.name), )
        cat_choices = tuple(sorted(cat_choices))
        type_choices = (('Повышение квалификации', 'Повышение квалификации'), ('Профессиональная переподготовка', 'Профессиональная переподготовка'))
        model = Programs
        fields = (
            'department',
            'name',
            'type_dpp',
            'duration',
            'categories',
            'annotation',
            'price',
        )
        widgets = {
            'department': forms.TextInput(attrs={
                'class': 'form-control',
                'style': 'text-align:center;',
                'value': '',
                'readonly': 'true',
            }),
            'name': forms.TextInput(attrs={
                'class': 'form-control',
                'style': 'text-align:center;',
                'value': '',
                'required': 'true',
            }),
            'type_dpp': forms.Select(choices=type_choices, attrs={
                'class': 'form-control',
                'style': 'text-align: center;',
                'required': 'true',
                'id': 'SelectType'
            }),
            'duration': forms.NumberInput(attrs={
                'class': 'form-control',
                'style': 'text-align:center;',
                'required': 'true',
                'placeholder': 'Не более 250 часов',
                'max': 250,
                'id': 'DurationProg'
            }),
            'annotation': forms.Textarea(attrs={
                'class': 'form-control',
                'required': 'true',
            }),
            'price': forms.NumberInput(attrs={
                'class': 'form-control',
                'style': 'text-align:center;',
                'required': 'true',
            }),
        }

    categories = forms.ModelMultipleChoiceField(
        label='Категории слушателей',
        queryset=AudienceCategories.objects.all().order_by('-id'),
        widget=forms.CheckboxSelectMultiple(attrs={
            'style': 'align-items: left;',
        })
    )


class CoursesForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        if 'dep' in kwargs:
            dep_name = kwargs.pop('dep')
            super(CoursesForm, self).__init__(*args, **kwargs)
            self.fields['program'].queryset = Programs.objects.filter(department=dep_name).exclude(order_id='').order_by('-id')
        else:
            super(CoursesForm, self).__init__(*args, **kwargs)

    class Meta:
        progs = Programs.objects.all().order_by('-id')
        progs_choices = ()
        count = 1
        for prog in progs:
            progs_choices = progs_choices + ((str(count), prog.name),)
            count += 1
        model = Courses
        fields = (
            'program',
            'place',
            'date_start',
            'date_finish',
        )
        widgets = {
            'program': forms.Select(choices=progs_choices, attrs={
                'class': 'form-control',
                'id': 'ProgramName',
                'style': 'text-align: center;',
                'required': 'true',
            }),
            'place': forms.TextInput(attrs={
                'class': 'form-control',
                'style': 'text-align:center;',
                'required': 'true',
            }),
            'date_start': forms.DateInput(attrs={
                'type': 'date',
                'class': 'form-control',
                'id': 'StartDate',
                'style': 'text-align:center;',
                'required': 'true',
            }),
            'date_finish': forms.DateInput(attrs={
                'type': 'date',
                'class': 'form-control',
                'id': 'FinishDate',
                'style': 'text-align:center;',
                'required': 'true',
            }),
        }


class EventsForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        if 'dep' in kwargs:
            dep_name = kwargs.pop('dep')
            kwargs.update(initial={
                'department': dep_name
            })
        super(EventsForm, self).__init__(*args, **kwargs)

    class Meta:
        types = EventTypes.objects.all().order_by('-id')
        types_choices = ()
        count = 1
        for type in types:
            types_choices = types_choices + ((str(count), type.name),)
            count += 1
        dep_choices = GetDepsFromAD()
        model = Events
        fields = (
            'department',
            'type',
            'name',
            'duration',
            'categories',
            'place',
            'date_start',
            'date_finish',
            'price',
        )
        widgets = {
            'department': forms.TextInput(attrs={
                'class': 'form-control',
                'style': 'text-align:center;',
                'required': 'true',
                'readonly': 'true',
            }),
            'type': forms.Select(choices=types_choices, attrs={
                'class': 'form-control',
                'id': 'Type',
                'style': 'text-align: center;',
                'required': 'true',
            }),
            'name': forms.Textarea(attrs={
                'class': 'form-control',
                'required': 'true',
            }),
            'duration': forms.NumberInput(attrs={
                'class': 'form-control',
                'style': 'text-align: center;',
                'required': 'true',
            }),
            'place': forms.TextInput(attrs={
                'class': 'form-control',
                'style': 'text-align:center;',
                'required': 'true',
            }),
            'date_start': forms.DateInput(
                format=('%Y-%m-%d'),
                attrs={
                'type': 'date',
                'class': 'form-control',
                'id': 'StartDate',
                'style': 'text-align:center;',
                'required': 'true',
            }),
            'date_finish': forms.DateInput(
                format=('%Y-%m-%d'),
                attrs={
                'type': 'date',
                'class': 'form-control',
                'id': 'FinishDate',
                'style': 'text-align:center;',
                'required': 'true',
            }),
            'price': forms.NumberInput(attrs={
                    'min': 0,
                    'class': 'form-control',
                    'style': 'text-align: center;',
                    'required': 'true',
            }),
        }

    categories = forms.ModelMultipleChoiceField(
        label='Категории слушателей',
        queryset=AudienceCategories.objects.all().order_by('-id'),
        widget=forms.CheckboxSelectMultiple(attrs={
            'style': 'align-items: left;',
        })
    )