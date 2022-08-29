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
 function isUrl(s) {
   var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
   return regexp.test(s);
};
function OfferScanWindow(id) {
    $("#popup_js").empty();
    $('#popup_js').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', width: '10vh', height:'10vh'}));
    div = '<table class="table_crit"><thead><tr><th colspan="2">Загрузка скана договора оферты</th></thead><tbody><tr>'
        +'<td>Выберите документ:<br>(формат файла - pdf)</td><td><input type="file" id="new_doc" class="form-control">'
        +'<div id="doc_error"></div</td></tr>'
        +'<tr><td colspan="2"><button type="button" class="btn btn-lg btn-primary" onclick="OfferScanDownload('+id+');">'
        +'Загрузить скан</button></td></tr></table><br><button type="button" class="btn btn-lg btn-primary" onclick="window.location.href=\'#close\'">'
        +'Закрыть</button>'
    $("#popup_js").empty();
    $('#popup_js').append(div);
}
function OfferScanDownload(id) {
    if ($('#new_doc').val().split('.').pop().toLowerCase() != 'pdf') {
        $('#doc_error').empty();
        $('#doc_error').append('<b style="color: red;">Выбран файл с недопустимым форматом</b>');
    } else {
        $('#doc_error').empty();
        var fd = new FormData();
        fd.append('file', $('#new_doc')[0].files[0]);
        fd.append('id_group', id);
        $('#popup_js').empty();
        $('#popup_js').append('<h4>Подождите, идет загрузка файла...</h4>');
        $('#popup_js').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', width: '10vh', height: '10vh'}));
        $.ajax({
          headers: { "X-CSRFToken": getCookie("csrftoken") },
          url: '/dep/study/studentgroups',
          data: fd,
          processData: false,
          contentType: false,
          type: 'POST',
          success: function(data){
            location.href="#close";
            location.reload();
          }
        });
    }
};
function StudyURLWindow(id) {
    $("#popup_js").empty();
    $('#popup_js').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', width: '10vh', height:'10vh'}));
    div = '<table class="table_crit"><thead><tr><th colspan="2">Ссылка на курс/мероприятие</th></thead><tbody><tr>'
        +'<td>Ссылка<br>(в формате URL: https://coko38.ru/...)</td><td><input type="url" id="url_study" class="form-control">'
        +'<div id="url_error"></div</td></tr>'
        +'<tr><td colspan="2"><button type="button" class="btn btn-lg btn-primary" onclick="StudyURLSave('+id+');">'
        +'Сохранить ссылку</button></td></tr></table><br><button type="button" class="btn btn-lg btn-primary" onclick="window.location.href=\'#close\'">'
        +'Закрыть</button>'
    $("#popup_js").empty();
    $('#popup_js').append(div);
}
function StudyURLSave(id) {
    if (!isUrl($('#url_study').val())) {
        $('#url_error').empty();
        $('#url_error').append('<b style="color: red;">Строка не является URL адресом</b>');
    } else {
        if ($('#url_study').val() == '') {
            $('#url_error').empty();
            $('#url_error').append('<b style="color: red;">Заполните поле</b>');
        } else {
            $('#url_error').empty();
            var val = $('#url_study').val();
            $('#popup_js').empty();
            $('#popup_js').append('<h4>Подождите, записываем URL адрес...</h4>');
            $('#popup_js').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', width: '10vh', height: '10vh'}));
            $.ajax({
              headers: { "X-CSRFToken": getCookie("csrftoken") },
              url: '/dep/study/studentgroups',
              data: {
                id_group: id,
                url_study: val
              },
              type: 'POST',
              success: function(data){
                location.href="#close";
                location.reload();
              }
            });
        }
    }
};
function SurveyURLWindow(id) {
    $("#popup_js").empty();
    $('#popup_js').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', width: '10vh', height:'10vh'}));
    div = '<table class="table_crit"><thead><tr><th colspan="2">Ссылка на прохождение опроса</th></thead><tbody><tr>'
        +'<td>Ссылка<br>(в формате URL: https://coko38.ru/...)</td><td><input type="url" id="url_survey" class="form-control">'
        +'<div id="url_error"></div</td></tr>'
        +'<tr><td colspan="2"><button type="button" class="btn btn-lg btn-primary" onclick="SurveyURLSave('+id+');">'
        +'Сохранить ссылку</button></td></tr></table><br><button type="button" class="btn btn-lg btn-primary" onclick="window.location.href=\'#close\'">'
        +'Закрыть</button>'
    $("#popup_js").empty();
    $('#popup_js').append(div);
};
function SurveyURLSave(id) {
    if (!isUrl($('#url_survey').val())) {
        $('#url_error').empty();
        $('#url_error').append('<b style="color: red;">Строка не является URL адресом</b>');
    } else {
        if ($('#url_survey').val() == '') {
            $('#url_error').empty();
            $('#url_error').append('<b style="color: red;">Заполните поле</b>');
        } else {
            $('#url_error').empty();
            var val = $('#url_survey').val();
            $('#popup_js').empty();
            $('#popup_js').append('<h4>Подождите, записываем URL адрес...</h4>');
            $('#popup_js').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', width: '10vh', height: '10vh'}));
            $.ajax({
              headers: { "X-CSRFToken": getCookie("csrftoken") },
              url: '/dep/study/studentgroups',
              data: {
                id_group: id,
                url_survey: val
              },
              type: 'POST',
              success: function(data){
                location.href="#close";
                location.reload();
              }
            });
        }
    }
};