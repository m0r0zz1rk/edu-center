function CheckExist(id) {
    $.ajax(
         {
            type: "GET",
            async: false,
            url: "/student/api/check_app",
            data: {
                id_group: id
            },
            dataType : "json",
            success: function(result) {
                res = result.length
            }
    });
    return res
}
function Href(id){
    function StrDate(str){
     var dt   = str.substring(8,10);
     var mon  = str.substring(5,7);
     var yr   = str.substring(0,4);
     return dt+'.'+mon+'.'+yr;
    }
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    const csrftoken = getCookie('csrftoken');
    $('.popup_add').empty();
    var id_event = id.substr(6);
    $.ajax(
     {
        type: "GET",
        url: "/student/api/events",
        dataType : "json",
        beforeSend: function() {
            $('.popup_add').text('');
            $('.popup_add').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', width: '10%', height:'10%'}));
        },
        success: function(result) {
            $.each(result, function (index, data) {
                var id_el = data.id;
                if (id_el == id_event) {
                    event = '<div class="add" style="width: 100%;">'
                        + '<table border="0" style="width: 100%;">'
                        + '<tr><td colspan="4"><b>'+data.event.name+'</b></td></tr>'
                        + '<tr><td style="white-space: nowrap;"><br>Шифр группы:<br><b>'+data.code+'</b></td>'
                        + '<td style="white-space: nowrap;"><br>Тип мероприятия:<br><b>'+data.event.type+'</b></td>'
                        + '<td style="white-space: nowrap;"><br>Объем (часов):<br><b>'+data.event.duration+'</b></td>'
                        + '<td style="white-space: nowrap;"><br>Дата проведения:<br><b>'+StrDate(data.event.date_start)+'</b></td></tr><tr>'
                        + '<td style="width: 20%;"><br>Структурное подразделение:<br><b>'+data.event.department+'</b></td>';
                    if (data.curator != null) {
                        var str = data.curator;
                        var fio = str.substring(0, str.indexOf(':'));
                        var phone = str.substring(str.indexOf(':')+1, str.indexOf('&'));
                        var email = str.substr(str.indexOf('&')+1);
                        event += '<td style="white-space: nowrap;"><br>Руководитель группы:<br><b>'+fio+'</b></td>'
                            + '<td style="white-space: nowrap;"><br>Контактный телефон:<br><b>'+phone+'</b></td>'
                            + '<td style="white-space: nowrap;"><br>Email:<br><b>'+email+'</b></td>';
                    }
                    if (CheckExist(data.id) == 1) {
                        event += '</tr><tr><td colspan="4">'
                            + '<b style="color: red";>Вы уже подавали заявку на участие в этом мероприятии</b></td></tr></table><br>'
                            + '<button type="button" class="m-auto btn btn-lg btn-primary" onclick="window.location.href=\'#close\';">'
                            + 'Закрыть</button></div>';
                    } else {
                        event += '</tr><tr><td colspan="4">'
                            + '<form action="/student/event_reg" method="GET">'
                            + '<input type="hidden" name="group" value="'+id_el+'">'
                            + '<button type="submit" class="btn btn-lg btn-primary" onclick="window.location.href=\'#\'">'
                            + 'Оставить заявку</button></form></td></tr></table><br>'
                            + '<button type="button" class="m-auto btn btn-lg btn-primary" onclick="window.location.href=\'#close\';">'
                            + 'Закрыть</button></div>';
                    }
                    $('.popup_add').empty();
                    $('.popup_add').append(event);
                    return false;
                }
            });
        }
     });
};
function Initial(){
    $.ajax(
     {
        type: "GET",
        url: "/student/api/events",
        dataType : "json",
        beforeSend: function() {
            $('.load').text('');
            $('.load').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', width: '10vw', height: '10vw'}));
        },
        success: function(result) {
            $('.load').empty();
            putGridData(result);
        }
     });
};
function putGridData(result) {
    function StrDate(str){
     var dt   = str.substring(8,10);
     var mon  = str.substring(5,7);
     var yr   = str.substring(0,4);
     return dt+'.'+mon+'.'+yr;
    }
    var deps = [];
    $("#main").html("");
    $.each(result, function (index, data) {
        var dep = data.event.department;
        if ($.inArray(dep, deps) == -1) {
            deps.push(dep);
            childwr = '<h5>'+dep+'</h5>'
                +'<div class="childwr_'+ $.inArray(dep, deps)+'"></div><br><br>';
            $("#main").append(childwr);
        }
    });
    $.each(result, function (index, data) {
        var dep = data.event.department;
        event = '<a href=\'#win\' id=\'event_'+String(data.id)+'\' style=\'text-decoration: none;\' onclick=\'Href(this.id);\'>'
            + '<div class="box_'+String(data.id)+'">'
            + '<table border="0">'
            + '<tr><td colspan="3"><b>'+data.event.name+'</b></td></tr>'
            + '<tr><td style="white-space: nowrap; text-align: right;"><br>Шифр группы:</td><td><br><b>'+data.code+'</b></td></tr><tr>'
            + '<td style="white-space: nowrap; text-align: right;">Тип мероприятия:</td><td><b>'+data.event.type+'</b></td></tr><tr>'
            + '<td style="white-space: nowrap; text-align: right;">Дата проведения:</td><td><b>'+StrDate(data.event.date_start)+'</b></td></tr></table></div></a>';
        $(".childwr_"+$.inArray(dep, deps)).append(event);
    });
};