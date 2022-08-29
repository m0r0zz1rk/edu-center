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
    $('.popup_add').empty();
    var id_course = id.substr(7);
    $.ajax(
     {
        type: "GET",
        url: "/student/api/courses",
        dataType : "json",
        beforeSend: function() {
            $('.popup_add').text('');
            $('.popup_add').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', width: '10%', height:'10%'}));
        },
        success: function(result) {
            $.each(result, function (index, data) {
                var id_el = data.id;
                if (id_el == id_course) {
                    course = '<div class="add" style="width: 100%; margin:0 auto;">'
                        + '<table border="0" style="width: 100%; margin:0 auto;">'
                        + '<tr><td colspan="4"><b>'+data.course.program.name+'</b></td></tr>'
                        + '<tr><td style="white-space: nowrap;"><br>Шифр группы:<br><b>'+data.code+'</b></td>'
                        + '<td style="white-space: nowrap;"><br>Тип программы:<br><b>'+data.course.program.type_dpp+'</b></td>'
                        + '<td style="white-space: nowrap;"><br>Сроки обучения:<br><b>'+StrDate(data.course.date_start)+' - '+StrDate(data.course.date_finish)+'</b></td>'
                        + '<td style="white-space: nowrap;"><br>Объем (часов):<br><b>'+data.course.program.duration+'</b></td></tr><tr>'
                        + '<td style="width: 20%;"><br>Структурное подразделение:<br><b>'+data.course.program.department+'</b></td>';
                    if (data.curator != null) {
                        var str = data.curator;
                        var fio = str.substring(0, str.indexOf(':'));
                        var phone = str.substring(str.indexOf(':')+1, str.indexOf('&'));
                        var email = str.substr(str.indexOf('&')+1);
                        course += '<td style="white-space: nowrap;"><br>Руководитель группы:<br><b>'+fio+'</b></td>'
                            + '<td style="white-space: nowrap;"><br>Контактный телефон:<br><b>'+phone+'</b></td>'
                            + '<td style="white-space: nowrap;"><br>Email:<br><b>'+email+'</b></td>';
                    }
                    if (CheckExist(data.id) == 1) {
                        course += '</tr><tr><td colspan="4">'
                            + '<b style="color: red";>Вы уже подавали заявку на участие в этом курсе</b></td></tr></table><br>'
                            + '<button type="button" class="m-auto btn btn-lg btn-primary" onclick="window.location.href=\'#close\';">'
                            + 'Закрыть</button></div>';
                    } else {
                        course += '</tr><tr><td colspan="4">'
                            + '<form action="/student/course_reg" method="GET">'
                            + '<input type="hidden" name="group" value="'+id_el+'">'
                            + '<button type="submit" class="btn btn-lg btn-primary" onclick="window.location.href=\'#\'">'
                            + 'Оставить заявку</button></form></td></tr></table><br>'
                            + '<button type="button" class="m-auto btn btn-lg btn-primary" onclick="window.location.href=\'#close\';">'
                            + 'Закрыть</button></div>';
                    }
                    $('.popup_add').empty();
                    $('.popup_add').append(course);
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
        url: "/student/api/courses",
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
        var dep = data.course.program.department;
        if ($.inArray(dep, deps) == -1) {
            deps.push(dep);
            childwr = '<h5>'+dep+'</h5>'
                +'<div class="childwr_'+ $.inArray(dep, deps)+'"></div><br><br>';
            $("#main").append(childwr);
        }
    });
    $.each(result, function (index, data) {
        var dep = data.course.program.department;
        course = '<a href=\'#win\' id=\'course_'+data.id+'\' style=\'text-decoration: none;\' onclick=\'Href(this.id);\'><div class="box_'+String(data.id)+'">'
            + '<table border="0">'
            + '<tr><td colspan="2"><b>'+data.course.program.name+'</b></td></tr>'
            + '<tr><td style="text-align: right;"><br>Шифр группы:</td><td style="white-space: nowrap;"><br><b>'+data.code+'</b></td></tr><tr>'
            + '<td style="text-align: right;">Сроки обучения:</td><td><b>'+StrDate(data.course.date_start)+'-'+StrDate(data.course.date_finish)+'</b></td></tr><tr>'
            + '<td style="text-align: right;">Тип программы:</td><td><b>'+data.course.program.type_dpp+'</b></td></tr></table></div>'
        $(".childwr_"+$.inArray(dep, deps)).append(course);
    });
};
