function getCookie(c_name)
{
    if (document.cookie.length > 0)
    {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1)
        {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start,c_end));
        }
    }
    return "";
 };
function StrDate(str){
     var dt   = str.substring(8,10);
     var mon  = str.substring(5,7);
     var yr   = str.substring(0,4);
     return dt+'.'+mon+'.'+yr;
};
function SwitchToCourses(){
    div = '<b>Мероприятия <a href="#" onclick="Initial();"><i class="fa fa-toggle-on fa-2x"></i></a> Курсы</b>'
    $('#choose').empty();
    $('#choose').append(div);
    $('#main').empty();
    $('#main').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px'}));
    $.ajax(
     {
        type: "GET",
        url: "/student/api/apps",
        dataType : "json",
        success: function(result) {
            div = '<table class="table_crit"><thead><tr><th>Дата подачи заявки</th><th>Тип мероприятия</th><th>Название мероприятия (Объем, часов)</th>'
                + '<th>Сроки проведения</th><th>Статус</th><th>Детали</th></tr></thead><tbody>'
            $.each(result, function(index, data) {
                if (data.group.event == null) {
                    div += '<tr><td>'+StrDate(data.date_create)+'</td><td>'+data.group.course.program.type_dpp+'</td>'
                        +'<td>'+data.group.course.program.name+' ('+data.group.course.program.duration+')</td>'
                        +'<td>'+StrDate(data.group.course.date_start)+' - '+StrDate(data.group.course.date_finish)+'</td><td style="white-space: nowrap;">';
                switch (data.status) {
                    case 'В работе':
                        div += '<b style="color: #bc2525">';
                        break;
                    case 'Ждем оплату':
                        div += '<b style="color: #951773">';
                        break;
                    case 'Оплачено':
                        div += '<b style="color: #92c928">';
                        break;
                    case 'На проверке':
                        div += '<b style="color: #1778ba">';
                        break;
                    case 'Проходит обучение':
                        div += '<b style="color: #22b840">';
                        break;
                    case 'Завершил обучение':
                        div += '<b style="color: #22b840">';
                        break;
                    }
                    div += data.status+'</b></td><td><a href="#win" onclick="DetailEvent('+data.id+');"><img src="/static/work/details.png"></a></td></tr>'
                }
            });
            div += '</tbody></table>'
            $('#main').empty();
            $('#main').append(div);
        }
     });
};
function Initial(){
    div = '<b>Мероприятия <a href="#" onclick="SwitchToCourses();"><i class="fa fa-toggle-off fa-2x"></i></a> Курсы</b>'
    $('#choose').empty();
    $('#choose').append(div);
    $('#main').empty();
    $('#main').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px'}));
    $.ajax(
     {
        type: "GET",
        url: "/student/api/apps",
        dataType : "json",
        success: function(result) {
            div = '<table class="table_crit"><thead><tr><th>Дата подачи заявки</th><th>Тип мероприятия</th><th>Название мероприятия (Объем, часов)</th>'
                + '<th>Сроки проведения</th><th>Статус</th><th>Детали</th></tr></thead><tbody>'
            $.each(result, function(index, data) {
                if (data.group.course == null) {
                    div += '<tr><td>'+StrDate(data.date_create)+'</td><td>'+data.group.event.type+'</td><td>'+data.group.event.name+' ('+data.group.event.duration+')</td>'
                    + '<td>'+StrDate(data.group.event.date_start)+' - '+StrDate(data.group.event.date_finish)+'</td>';
                switch (data.status) {
                    case 'В работе':
                        div += '<td style="white-space: nowrap;"><b style="color: #bc2525">В работе</b></td>';
                        break;
                    case 'Ждем оплату':
                        div += '<td style="white-space: nowrap;"><b style="color: #951773">Ждем оплату</b></td>';
                        break;
                    case 'Оплачено':
                        div += '<td style="white-space: nowrap;"><b style="color: #92c928">Оплачено</b></td>';
                        break;
                    case 'На проверке':
                        div += '<td style="white-space: nowrap;"><b style="color: #1778ba">На проверке</b></td>';
                        break;
                    case 'Проходит обучение':
                        div += '<td style="white-space: nowrap;"><b style="color: #22b840">Проходит обучение</b></td>';
                        break;
                    }
                    div += '<td><a href="#win" onclick="DetailEvent('+data.id+');"><img src="/static/work/details.png"></a></td></tr>'
                }
            });
            div += '</tbody></table>'
            $('#main').empty();
            $('#main').append(div);
        }
     });
};
function DetailEvent(id) {
    $('.popup').empty();
    $('.popup').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', width: '10vh', height: '10vh'}));
    $.ajax(
     {
        type: "GET",
        url: "/student/api/detail_app",
        data: {
            pk: id
        },
        success: function(result) {
            div = '<table class="table_crit"><thead><tr><th colspan="2">Детали заявки</th></tr></thead><tbody>'
                +'<tr><td>Договор оферты:</td><td>'
            if (result.data.status != 'В работе') {
                div += '<button type="button" class="m-25 btn btn-lg btn-primary"'
                    +'onclick="window.open(\'/offer_view/?group='+result.data.group_id+'\', \'_blank\');">'
                    +'Просмотр</button>'
            } else {
                div += 'Договор будет выставлен '+result.date_offer+'. Письмо с имзенением статуса заявки будет отправлено на Ваш адрес электронной почты'
            }
            div += '</td></tr><tr><td>Загрузка документа об оплате<br>(формат файла - pdf, jpg, png, rar)</td><td>'
            if (result.data.status == 'Ждем оплату') {
                div += '<input type="file" class="form-control" id="PayDoc"><br>'
                    +'<button type="button" class="m-auto btn btn-lg btn-primary" onclick="UploadPayCheck('+result.data.group_id+');">'
                    +'Загрузить</button><div id="doc_error"></div>'
            } else if (result.data.status == 'В работе'){
                div += 'Оплата будет доступна после публикации договора оферты'
            }
            div += '</td></tr><tr><td>Ссылка на обучение:</td><td>'
            var array = ['Оплачено', 'Проходит обучение']
            if (array.indexOf(result.data.status) != -1) {
                div += '<button type="button" class="m-auto btn btn-lg btn-primary" onclick="GoToStudy('+result.data.group_id+');">'
                    +'Перейти</button>'
            } else {
                div += 'Ссылка будет доступна после проверки отправленных документов об оплате'
            }
            div += '</td></tr><tr><td>Опрос:</td><td>'
            if (result.survey == true && result.data.status == 'Проходит обучение') {
                div += '<button type="button" class="m-auto btn btn-lg btn-primary" onclick="GoToSurvey('+result.data.group_id+');">'
                    +'Перейти</button>'
            } else {
                div += 'Опрос будет доступен по окончанию обучения'
            }
            div += '</td></tr></tbody></table><br><button type="button" class="m-auto btn btn-lg btn-primary" onclick="window.location.href=\'#close\';">'
                    +'Закрыть</button>'
            $('.popup').empty();
            $('.popup').append(div);
        }
    });
};
function UploadPayCheck(group) {
    if ($('#PayDoc').val() == '') {
        $('#doc_error').empty();
        $('#doc_error').append('<b style="color: red;">Файл не выбран</b>');
    } else if ($('#PayDoc').val().length > 50) {
       $('#doc_error').empty();
       $('#doc_error').append('<b style="color: red;">Длинное имя файла</b>');
    } else {
        if ($('#PayDoc')[0].files[0].size > 10485760) {
            $('#doc_error').empty();
            $('#doc_error').append('<b style="color: red;">Размер файла превышает 10 мб</b>');
        } else {
            var fileExtension = ['jpg', 'png', 'pdf', 'rar'];
            if ($.inArray($('#PayDoc').val().split('.').pop().toLowerCase(), fileExtension) == -1) {
                $('#doc_error').empty();
                $('#doc_error').append('<b style="color: red;">Выбран файл с недопустимым форматом</b>');
            } else {
                $.ajax(
                 {
                    type: "GET",
                    url: "/student/api/doc_types",
                    dataType : "json",
                    success: function(result) {
                        $.each(result, function(index, data) {
                            if (data.name == 'Документ об оплате') {
                                var fd = new FormData();
                                fd.append('doc_type', data.id);
                                fd.append('group', group);
                                fd.append('file', $('#PayDoc')[0].files[0]);
                                $('.popup').empty();
                                $('.popup').append('<h4>Подождите, идет загрузка файла...</h4>');
                                $('.popup').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', width: '10vh', height: '10vh'}));
                                $.ajax({
                                  headers: { "X-CSRFToken": getCookie("csrftoken") },
                                  url: '/student/api/doc_upload',
                                  data: fd,
                                  processData: false,
                                  contentType: false,
                                  type: 'POST',
                                  success: function(data){
                                    window.location.href='#close';
                                    console.log(data.type);
                                    location.reload();
                                  }
                              });
                            }
                        });
                    }
                });
          }
      }
  }
};
function GoToStudy(id) {
    $.ajax(
         {
            type: "GET",
            url: "/student/api/study_url",
            data: {
                pk: id,
            },
            dataType : "json",
            success: function(result) {
                window.open(result.data.event_url, '_blank');
                $.ajax(
                 {
                    type: "GET",
                    url: "/student/api/status_study",
                    data: {
                        pk: id,
                    },
                    dataType : "json",
                    success: function(result) {
                        location.href="#close"
                        location.reload();
                    }
                });
            }
        });
};
function GoToSurvey(id) {
    $.ajax(
         {
            type: "GET",
            url: "/student/api/survey_url",
            data: {
                pk: id,
            },
            dataType : "json",
            success: function(result) {
                window.open(result.data.survey_url, '_blank');
                $.ajax(
                 {
                    type: "GET",
                    url: "/student/api/status_survey",
                    data: {
                        pk: id,
                    },
                    dataType : "json",
                    success: function(result) {
                        location.href="#close";
                        if (result.type == 'event'){
                            location.href="/student/archive?type=event";
                        } else {
                            location.href="/student/apps?type=course";
                        }
                    }
                });
            }
        });
};