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
function FindWin() {
    $('.popup').empty();
    $('.popup').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', height: "10%", width: "10%"}));
    div = '<form method="GET"><center><input type="hidden" value="'+id_group+'" name="id_group">'
        +'<table class="table_crit"><thead><tr><th colspan="2">Поиск обучающихся</th></tr></thead>'
        +'<tbody><tr><td>Фамилия:</td><td><input type="text" class="form-control" name="surname"></td></tr>'
        +'<tr><td>Имя:</td><td><input type="text" class="form-control" name="name"></td></tr>'
        +'<tr><td>Отчество:</td><td><input type="text" class="form-control" name="patronymic"></td></tr>'
        +'<tr><td>Email:</td><td><input type="email" class="form-control" name="email"></td></tr>'
        +'<tr><td colspan="2"><button type="submit" class=" m-auto btn btn-lg btn-primary" onclick="document.location.href =\'#close\'">'
        +'Поиск</button></td></tr></tbody></table><br><button type="button" class="m-auto btn btn-lg btn-primary" onclick="window.location.href=\'#close\';">'
        +'Закрыть</button></form>'
    $('.popup').empty();
    $('.popup').append(div);
};
function CheckDiplomas(){
    $('.popup').empty();
    $('.popup').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', height: "10vh", width: "10vh"}));
    $.ajax(
     {
        type: "GET",
        url: "/dep/study/students",
        data:{
            list_sts: 'yes',
            group: id_group
        },
        success: function(result) {
            if (result.list_st.length == 0) {
                window.location.href='#close';
                location.reload();
            } else {
                DiplomaInfo(result.list_st[0])
            }
        }
    });
};
function DiplomaInfo(id_student) {
    $.ajax(
     {
        type: "GET",
        url: "/dep/study/students",
        data:{
            student: id_student,
            group: id_group
        },
        success: function(result) {
            div = '<table class="table_crit"><thead><tr><th colspan="2">Проверка документа об образовании<br>('+result.fio+')</th>'
                +'</thead><tbody><tr><td>Документ об образовании:</td><td><form method="GET" action="/doc_view" target="_blank">'
                +'<input type="hidden" name="doc_id" value="'+result.id_doc+'">'
                +'<button type="submit" class="m-auto btn btn-lg btn-primary">Просмотр</button></form></td></tr>'
            if (result.edu_cat == null) {
                div += '<tr><td>Документ о смене фамилии:</td><td>'
                if (result.id_changesur == null) {
                    div += 'Не предоставлен'
                } else {
                    div += '<form method="GET" action="/doc_view" target="_blank">'
                        +'<input type="hidden" name="doc_id" value="'+result.id_changesur+'">'
                        +'<button type="submit" class="m-auto btn btn-lg btn-primary">Просмотр</button></form>'
                }
                div += '</td></tr><tr><td>Фамилия:</td><td><input type="text" class="form-control" id="CheckSurname"'
                    +' onchange="ChangeDiplomaSurname('+result.id_form+');" value="'+result.surname+'"><div class="sur_info"></div></td></tr>'
                    +'<tr><td>Серия документа:</td><td><input type="text" class="form-control" id="CheckSerial"'
                    +' onchange="ChangeDiplomaSerial('+result.id_form+');" value="'+result.serial+'"><div class="ser_info"></div></td></tr>'
                    +'<tr><td>Номер документа:</td><td><input type="text" class="form-control" id="CheckNumber"'
                    +' onchange="ChangeDiplomaNumber('+result.id_form+');" class="form-control" value="'+result.number+'"><div class="num_info"></div></td></tr>'
                    +'<tr><td>Дата выдачи документа:</td><td><input type="date" id="CheckDate"'
                    +' onchange="ChangeDiplomaDate('+result.id_form+');" class="form-control" value="'+result.date+'"><div class="date_info"></div></td></tr>'
            } else {
                div +='</td></tr><tr><td>Категория получаемого образования:</td><td>'+result.edu_cat+'</td></tr>'
            }
            div += '<tr><td><button type="button" class="m-auto btn btn-lg btn-primary" onclick="window.location.href=\'#close\';">'
                +'Закрыть</button></td><td><button type="button" class="m-auto btn btn-lg btn-primary" onclick="CheckEnd('+result.id_form+');">'
                +'Завершить проверку документа</td></tr></tbody></table>';
            $('.popup').empty();
            $('.popup').append(div);
        }
    });
};
function ChangeDiplomaSurname(form_id){
    $('.sur_info').empty();
    $('.sur_info').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', height: "10%", width: "10%"}));
    var val = $('#CheckSurname').val();
    if (val.length > 0) {
        $.ajax(
         {
            headers: { "X-CSRFToken": getCookie("csrftoken") },
            type: "POST",
            url: "/dep/study/students",
            data:{
                form: form_id,
                surname: val
            },
            dataType : "json",
            success: function(result) {
                $('.sur_info').empty();
                $('.sur_info').append('<b style="color: green;">Значение успешно изменено</b>');
            }
        });
    } else {
        $('.sur_info').empty();
        $('.sur_info').append('<b style="color: red;">Поле не может быть пустым</b>');
    }
};
function ChangeDiplomaSerial(form_id){
    $('.ser_info').empty();
    $('.ser_info').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', height: "10%", width: "10%"}));
    var val = $('#CheckSerial').val();
    if (val.length > 0) {
        $.ajax(
         {
            headers: { "X-CSRFToken": getCookie("csrftoken") },
            type: "POST",
            url: "/dep/study/students",
            data:{
                form: form_id,
                serial: val
            },
            dataType : "json",
            success: function(result) {
                $('.ser_info').empty();
                $('.ser_info').append('<b style="color: green;">Значение успешно изменено</b>');
            }
        });
    } else {
        $('.ser_info').empty();
        $('.ser_info').append('<b style="color: red;">Поле не может быть пустым</b>');
    }
};
function ChangeDiplomaNumber(form_id){
    $('.num_info').empty();
    $('.num_info').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', height: "10%", width: "10%"}));
    var val = $('#CheckNumber').val();
    if (val.length > 0) {
        $.ajax(
         {
            headers: { "X-CSRFToken": getCookie("csrftoken") },
            type: "POST",
            url: "/dep/study/students",
            data:{
                form: form_id,
                number: val
            },
            dataType : "json",
            success: function(result) {
                $('.num_info').empty();
                $('.num_info').append('<b style="color: green;">Значение успешно изменено</b>');
            }
        });
    } else {
        $('.num_info').empty();
        $('.num_info').append('<b style="color: red;">Поле не может быть пустым</b>');
    }
};
function ChangeDiplomaDate(form_id){
    $('.date_info').empty();
    $('.date_info').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', height: "10%", width: "10%"}));
    var val = $('#CheckDate').val();
    if (val.length > 0) {
        $.ajax(
         {
            headers: { "X-CSRFToken": getCookie("csrftoken") },
            type: "POST",
            url: "/dep/study/students",
            data:{
                form: form_id,
                date: val
            },
            dataType : "json",
            success: function(result) {
                $('.date_info').empty();
                $('.date_info').append('<b style="color: green;">Значение успешно изменено</b>');
            }
        });
    } else {
        $('.date_info').empty();
        $('.date_info').append('<b style="color: red;">Поле не может быть пустым</b>');
    }
};
function CheckEnd(form_id) {
    $.ajax(
         {
            headers: { "X-CSRFToken": getCookie("csrftoken") },
            type: "POST",
            url: "/dep/study/students",
            data:{
                form: form_id,
                end: 'yes'
            },
            dataType : "json",
            success: function(result) {
                CheckDiplomas();
            }
        });
};
function StudentManage(id) {
    $('.popup').empty();
    $('.popup').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', height: "10vh", width: "10vh"}));
    $.ajax(
     {
        type: "GET",
        url: "/dep/study/students",
        data:{
            pay_student: id,
            group: id_group
        },
        success: function(result) {
            div = '<table class="table_crit"><thead><tr><th colspan="2">Управление</th></tr></thead><tbody><tr><td>'
                +'Документ об оплате:</td><td>'
            if (result.pay_doc != null) {
                div += '<button type="button" class="m-auto btn btn-lg btn-primary"'
                    +' onclick="window.open(\'/doc_view/?doc_id='+result.pay_doc+'\', \'_blank\');">'
                    +'Просмотр</button>'
                if (result.status == 'На проверке') {
                    div += '<br><br><button type="button" class="m-auto btn btn-lg btn-primary" onclick="AcceptPay('+id+');">'
                        +'Подтвердить оплату</button></td>'
                } else {
                    div += '</td>'
                }
            } else {
                div += 'Не предоставлен</td>'
            }
            div += '</tr><tr><td colspan="2"><button type="button" class="m-auto btn btn-lg btn-primary"'
                +' onclick="">Убрать обучающегося из группы</button></td></tr></tbody></table>'
                +'<br><button type="button" class="m-auto btn btn-lg btn-primary" onclick="window.location.href=\'#close\';">'
                +'Закрыть</button>'
            $('.popup').empty();
            $('.popup').append(div);
        }
    });
};
function AcceptPay(id){
    $('.popup').empty();
    $('.popup').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', height: "10vh", width: "10vh"}));
    $.ajax(
     {
        type: "GET",
        url: "/dep/study/students",
        data:{
            pay_accept: id,
            group: id_group
        },
        success: function(result) {
            window.location.href="#close";
            location.reload();
        }
    });
};
function CheckPays(){
    $('.popup').empty();
    $('.popup').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', height: "10vh", width: "10vh"}));
    $.ajax(
     {
        type: "GET",
        url: "/dep/study/students",
        data:{
            list_pay: 'yes',
            group: id_group
        },
        success: function(result) {
            if (result.list_pay.length == 0) {
                window.location.href='#close';
                location.reload();
            } else {
                PayInfo(result.list_pay[0])
            }
        }
    });
};
function PayInfo(id_student) {
    $.ajax(
     {
        type: "GET",
        url: "/dep/study/students",
        data:{
            pay_doc_id: id_student,
            group: id_group
        },
        success: function(result) {
            div = '<table class="table_crit"><thead><tr><th colspan="2">Проверка документа об оплате<br>('+result.fio+')</th>'
                +'</thead><tbody><tr><td>Документ об оплате:</td><td><form method="GET" action="/doc_view" target="_blank">'
                +'<input type="hidden" name="doc_id" value="'+result.pd_id+'">'
                +'<button type="submit" class="m-auto btn btn-lg btn-primary">Просмотр</button></form></td></tr>'
                +'<tr><td><button type="button" class="m-auto btn btn-lg btn-primary" onclick="window.location.href=\'#close\';">'
                +'Закрыть</button></td><td><button type="button" class="m-auto btn btn-lg btn-primary" onclick="CheckPayEnd('+result.app+');">'
                +'Подтвердить оплату</td></tr></tbody></table>';
            $('.popup').empty();
            $('.popup').append(div);
        }
    });
};
function DeniedPay(id, message){
    $('.popup').empty();
    $('.popup').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', height: "10vh", width: "10vh"}));
    $.ajax(
     {
        type: "GET",
        url: "/dep/study/students",
        data:{
            pay_denied: id,
            group: id_group,
            message: message
        },
        success: function(result) {
            CheckPays();
        }
    });
};
function CheckPayEnd(app_id) {
    $.ajax(
         {
            headers: { "X-CSRFToken": getCookie("csrftoken") },
            type: "POST",
            url: "/dep/study/students",
            data:{
                pay_end: app_id,
            },
            dataType : "json",
            success: function(result) {
                CheckPays();
            }
        });
};
function PayMesDeny(id_app, id_student) {
    $('.popup').empty();
    $('.popup').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', height: "10vh", width: "10vh"}));
    div = '<table class="table_crit"><thead><tr><th colspan="2">Сообщение пользователю об отклоненной оплате</th>'
    +'</thead><tbody><tr><td>Сообщение:</td><td><textarea class="form-control" id="MessageDenyPay"></textarea></td>'
    +'<tr><td><button type="button" class="m-auto btn btn-lg btn-primary" onclick="PayInfo('+id_student+');">Назад</button></td></td>'
    +'<td><button type="button" class="m-auto btn btn-lg btn-primary" onclick="DeniedPay('+id_app+', $(\'#MessageDenyPay\').val());">Отклонить с отправкой сообщения</button></td>'
    +'</tr></tbody></table>'
    $('.popup').empty();
    $('.popup').append(div);
};
function WinCert(id_student) {
    $('.popup').empty();
    $('.popup').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', height: "10vh", width: "10vh"}));
    $.ajax(
     {
        type: "GET",
        url: "/dep/study/students",
        data:{
            student: id_student,
            group: id_group
        },
        success: function(result) {
            div = '<form method="POST" enctype="multipart/form-data"><table class="table_crit"><thead><tr><th colspan="2">Загрузка cкана сертификата обучающегося<br>"'+result.fio+'"</th>'
            +'</thead><tbody><tr><td>Файл скана:</td><td><input type="file" class="form-control" id="scan"></td></tr>'
            +'<tr><td><button type="button" class="m-auto btn btn-lg btn-primary" onclick="window.location.href=\'#close\';">Закрыть</button></td>'
            +'<td><button type="button" class="m-auto btn btn-lg btn-primary" onclick="UploadCert('+id_student+')">Загрузить</button></td>'
            +'</tr></tbody></table></form>'
            $('.popup').empty();
            $('.popup').append(div);
        }
    });
};
function UploadCert(id_student) {
    var fd = new FormData();
    fd.append('scan', $('#scan')[0].files[0]);
    fd.append('student', id_student);
    fd.append('group', id_group);
    $('.popup').empty();
    $('.popup').append('<h4>Подождите, идет загрузка файла...</h4>');
    $('.popup').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', height: "10vh", width: "10vh"}));
    $.ajax({
      headers: { "X-CSRFToken": getCookie("csrftoken") },
      url: '/dep/study/students',
      data: fd,
      processData: false,
      contentType: false,
      type: 'POST',
      success: function(data){
        window.location.href='#close';
        location.reload();
      }
    });
};
