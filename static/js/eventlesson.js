$(function() {
    function EventDate(str){
     // str format should be dd/mm/yyyy. Separator can be anything e.g. / or -. It wont effect
     var dt   = parseInt(str.substring(8,10));
     var mon  = parseInt(str.substring(5,7));
     var yr   = parseInt(str.substring(0,4));
     var date = new Date(yr, mon, dt);
     return date;
    }
    function compareDate(str){
     // str format should be dd/mm/yyyy. Separator can be anything e.g. / or -. It wont effect
     var dt   = parseInt(str.substring(8,10));
     var mon  = parseInt(str.substring(5,7));
     var yr   = parseInt(str.substring(0,4));
     var hrs = parseInt(str.substring(11,13));
     var mns = parseInt(str.substring(14,16))
     var date = new Date(yr, mon, dt, hrs, mns);
     return date;
    }
    $("#refresh").click(function() {
        $("[id^=tr_]").css('visibility', 'collapse');
        $(".err_timestart").empty();
        $(".err_timefinish").empty();
        $("#timestart").val('');
        $("#timefinish").val('');
        $("#LectureHours").val(0);
        $("#PracticeHours").val(0);
        $("#TextareaTheme").val('');
        $("#TeachersList").val('');
        $("#timestart").prop('readonly',false);
        $("#TeachersList").prop('readonly',true);
        $("#butt").attr('disabled',true);
    });
    $('#timestart').change(function(){
        var time = $(this).val();
        var EventStart = EventDate($('#EventStart').val());
        var EventFinish = EventDate($('#EventFinish').val());
        var Current = EventDate(time);
        if (EventStart <= Current && Current <= EventFinish) {
            var id = $('#GroupId').val();
            $('#StartErr').css('visibility', 'visible');
             $.ajax(
                 {
                    type: "GET",
                    url: "/centre/study/schedule/event_lessons_"+id,
                    data:{
                        timestart: time
                    },
                    beforeSend: function() {
                        $('.err_timestart').text('');
                        $('.err_timestart').append($("<img src='/static/work/load_full.gif'>").css({width: '20px', height: '20px'}));
                    },
                    success: function(data) {
                        $('.err_timestart').empty();
                        if (data['check_timestart'] == true) {
                            $('.err_timestart').css('color', 'green');
                            $('.err_timestart').text('Время начала занятия свободно');
                            $('#tr_timefinish').css('visibility', 'visible');
                            $('#timefinish').prop('required',true);
                            $('#timefinish').prop('readonly',false);
                        } else {
                            $('.err_timestart').css('color', 'red');
                            $('.err_timestart').text('Время совпадает с другим занятием');
                            $('#tr_timefinish').css('visibility', 'collapse');
                            $('#timefinish').prop('required',false);
                            $('#timefinish').prop('readonly',true);
                        }
                    }
            });
        } else {
            $('.err_timestart').css('color', 'red');
            $('.err_timestart').text('Указанная дата вне периода прохождения мероприятия');
            $('#tr_timefinish').css('visibility', 'collapse');
            $('#timefinish').prop('required',false);
            $('#timefinish').prop('readonly',true);
        }
    });
    $('#timefinish').change(function(){
        var start = $('#timestart').val();
        timestart = compareDate(start)
        var time = $(this).val();
        timefinish = compareDate(time);
        if ((start.substring(8,10) != time.substring(8,10)) || (start.substring(5,7) != time.substring(5,7)) || (start.substring(0,4) != time.substring(0,4))) {
            $('.err_timefinish').css('color', 'red');
            $('.err_timefinish').text('День окончания занятия не может отличаться от дня начала');
            $('#tr_theme').css('visibility', 'collTextareaThemeapse');
            $('#TextareaTheme').prop('required',false);
            $('#TextareaTheme').prop('readonly',true);
        } else {
            if (timestart > timefinish) {
                $('.err_timefinish').css('color', 'red');
                $('.err_timefinish').text('Окончание занятие должно быть позже его начала');
                $('#tr_theme').css('visibility', 'collapse');
                $('#TextareaTheme').prop('required',false);
                $('#TextareaTheme').prop('readonly',true);
            } else {
                $('#timestart').attr('readonly', 'true');
                var id = $('#GroupId').val();
                 $.ajax(
                     {
                        type: "GET",
                        url: "/centre/study/schedule/event_lessons_"+id,
                        data:{
                            timefinish: time
                        },
                        beforeSend: function() {
                            $('.err_timefinish').text('');
                            $('.err_timefinish').append($("<img src='/static/work/load_full.gif'>").css({width: '20px', height: '20px'}));
                        },
                        success: function(data) {
                            $('.err_timefinish').empty();
                            if (data['check_timefinish'] == true) {
                                $('.err_timefinish').css('color', 'green');
                                $('.err_timefinish').text('Время окончания занятия свободно');
                                $('#tr_theme').css('visibility', 'visible');
                                $('#tr_lecture').css('visibility', 'visible');
                                $('#tr_practice').css('visibility', 'visible');
                                $('#tr_teacher').css('visibility', 'visible');
                                $('#TextareaTheme').prop('required',true);
                                $('#TextareaTheme').prop('readonly',false);
                                $('#LectureHours').prop('required',true);
                                $('#LectureHours').prop('readonly',false);
                                $('#PracticeHours').prop('required',true);
                                $('#TeachersList').prop('required',true);
                                $('#PracticeHours').prop('readonly',false);
                                $('#TeachersList').prop('readonly',false);
                            } else {
                                $('.err_timefinish').css('color', 'red');
                                $('.err_timefinish').text('Время совпадает с другим занятием');
                                $('#tr_theme').css('visibility', 'collapse');
                                $('#tr_lecture').css('visibility', 'collapse');
                                $('#tr_practice').css('visibility', 'collapse');
                                $('#tr_teacher').css('visibility', 'collapse');
                                $('#TextareaTheme').prop('required',false);
                                $('#TextareaTheme').prop('required',true);
                                $('#LectureHours').prop('required',true);
                                $('#TeachersList').prop('required',true);
                                $('#LectureHours').prop('readonly',false);
                                $('#TeachersList').prop('readonly',false);
                                $('#PracticeHours').prop('required',true);
                                $('#PracticeHours').prop('readonly',false);
                            }
                        }
                 });
            }
        }
    });
    $('#TextareaTheme').change(function(){
       $('#timefinish').attr('readonly', 'true');
    });
    $('#TeachersList').change(function(){
        $('#LectureHours').attr('readonly', 'true');
        $('#PracticeHours').attr('readonly', 'true');
        $('#TextareaTheme').attr('readonly', 'true');
        var teacher = $(this).val();
        id_teacher = teacher.substring(teacher.indexOf(':')+1, teacher.indexOf(')'));
        var id = $('#GroupId').val();
        $.ajax(
             {
                type: "GET",
                url: "/centre/study/schedule/event_lessons_"+id,
                data:{
                    id_teach: id_teacher,
                    time_start: $('#timestart').val(),
                    time_finish: $('#timefinish').val(),
                },
                beforeSend: function() {
                    $('.err_teach').text('');
                    $('.err_teach').append($("<img src='/static/work/load_full.gif'>").css({width: '20px', height: '20px'}));
                },
                success: function(data) {
                    $('.err_teach').empty();
                    $('#tr_teacherinfo').css('visibility', 'visible');
                    var fio = data['fio'];
                    var email = data['email'];
                    var phone = data['phone'];
                    if (data['freetime'] == true) {
                        $('.teacherinfo').html('ФИО: '+String(fio)+'<br>Почта: '+email+'<br>Телефон: '+phone+'<br><font color="green">Преподаватель свободен</green>');
                        $('#tr_formbutton').css('visibility', 'visible');
                        $('#butt').attr('disabled', false);
                    } else {
                        $('.teacherinfo').html('ФИО: '+String(fio)+'<br>Почта: '+email+'<br>Телефон: '+phone+'<br><font color="red">Преподаватель занят</red>');
                        $('#tr_formbutton').css('visibility', 'collapse');
                        $('#butt').attr('disabled', true);
                    }
                }
        });
    });
});
function CourseDate(str){
 // str format should be dd/mm/yyyy. Separator can be anything e.g. / or -. It wont effect
 var dt   = parseInt(str.substring(8,10));
 var mon  = parseInt(str.substring(5,7));
 var yr   = parseInt(str.substring(0,4));
 var date = new Date(yr, mon, dt);
 return date;
}
function compareDate(str){
 // str format should be dd/mm/yyyy. Separator can be anything e.g. / or -. It wont effect
 var dt   = parseInt(str.substring(8,10));
 var mon  = parseInt(str.substring(5,7));
 var yr   = parseInt(str.substring(0,4));
 var hrs = parseInt(str.substring(11,13));
 var mns = parseInt(str.substring(14,16))
 var date = new Date(yr, mon, dt, hrs, mns);
 return date;
}
function CheckTS() {
    $('#StartErr').css('visibility', 'visible');
    $('.err_timestart').empty();
    $('.err_timestart').append($("<img src='/static/work/load_full.gif'>").css({width: '4vw', height: '4vw'}));
    var time = $('#LessonDay').val()+' '+$('#timestart').val();
     $.ajax(
         {
            type: "GET",
            url: "/centre/study/schedule/event_lessons_"+group_id,
            data:{
                timestart: time
            },
            success: function(data) {
                $('.err_timestart').empty();
                if (data['check_timestart'] == true) {
                    if (data['check_break'] == true) {
                        if (data['check_lunch'] == true) {
                            $('.err_timestart').css('color', 'green');
                            $('.err_timestart').text('Время начала занятия доступно');
                            $('#tr_timefinish').css('visibility', 'visible');
                            $('#timefinish').prop('required',true);
                            $('#timefinish').prop('readonly',false);
                        } else {
                            $('.err_timestart').css('color', 'red');
                            $('.err_timestart').text('Необходим обеденный перерыв на 30 минут (До указанного времени проведено 4 академических часа)');
                            $('#tr_timefinish').css('visibility', 'collapse');
                            $('#timefinish').prop('required',false);
                            $('#timefinish').prop('readonly',true);
                        }
                    } else {
                        $('.err_timestart').css('color', 'red');
                        $('.err_timestart').text('Минимальный переыв между занятием продолжительностью 2 академ. часа - 10 минут');
                        $('#tr_timefinish').css('visibility', 'collapse');
                        $('#timefinish').prop('required',false);
                        $('#timefinish').prop('readonly',true);
                    }
                } else {
                    $('.err_timestart').css('color', 'orange');
                    $('.err_timestart').text('Время совпадает с другим занятием, занятия будут смещены');
                    $('#tr_timefinish').css('visibility', 'visible');
                    $('#timefinish').prop('required',true);
                    $('#timefinish').prop('readonly',false);
                }
            }
    });
};
function CheckTF(){
    var start = $('#timestart').val();
    timestart = compareDate($('#LessonDay').val()+' '+start)
    var time = $('#timefinish').val();
    timefinish = compareDate($('#LessonDay').val()+' '+time);
    if (timestart > timefinish) {
        $('.err_timefinish').css('color', 'red');
        $('.err_timefinish').text('Окончание занятие должно быть позже его начала');
        $('#tr_theme').css('visibility', 'collapse');
        $('#SelectThemes').prop('required',false);
        $('#SelectThemes').prop('readonly',true);
    } else {
        $('#timestart').attr('readonly', 'true');
         $.ajax(
             {
                type: "GET",
                url: "/centre/study/schedule/event_lessons_"+group_id,
                data:{
                    timefinish: $('#LessonDay').val()+' '+time
                },
                beforeSend: function() {
                    $('.err_timefinish').text('');
                    $('.err_timefinish').append($("<img src='/static/work/load_full.gif'>").css({width: '20px', height: '20px'}));
                },
                success: function(data) {
                    $('.err_timefinish').empty();
                    if (data['check_timefinish'] == true) {
                        $('.err_timefinish').css('color', 'green');
                        $('.err_timefinish').text('Время окончания занятия свободно');
                    } else {
                        $('.err_timefinish').css('color', 'orange');
                        $('.err_timefinish').text('Время совпадает с другим занятием, будет произведено смещение занятий');
                    }
                    $('#tr_theme').css('visibility', 'visible');
                    $('#tr_lecture').css('visibility', 'visible');
                    $('#tr_practice').css('visibility', 'visible');
                    $('#tr_teacher').css('visibility', 'visible');
                    $('.choose_teach').empty();
                    div = '<input type="text" id="TeachersList" list="teachers" Placeholder="Начните вводить имя..."'
                        +' name="teacher" class="form-control" onchange="TeacherChoose();"><datalist id=\'teachers\'>';
                    $.each(data.list_t, function(id, t){
                        div += '<option value="'+t+'">';
                    });
                    div += '</datalist>';
                    $('.choose_teach').append(div);
                }
         });
    }
};
function getCookie(c_name){
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
function HiddenLessons(index) {
    $("#shhid_"+index).html('<a href="#/" onclick="ShowLessons('+index+');"><i class="fa fa-plus-square fa-2x"></i></a>');
    $('[id^=lesson_'+index+']').css('visibility', 'collapse');
};
function ShowLessons(index) {
    $("#shhid_"+index).html('<a href="#/" onclick="HiddenLessons('+index+');"><i class="fa fa-minus-square fa-2x"></i></a>');
    $('[id^=lesson_'+index+']').css('visibility', 'visible');
};
function NewDayLesson(date) {
    $('.popup').append($('<img src="/static/work/load_full.gif">').css({width: '5vw', height: '5vw', margin: '0 -64px'}));
    div = '<form method="POST"><input type="hidden" name="csrfmiddlewaretoken" value="'+getCookie('csrftoken')+'">'
        +'<input type="hidden" id="GroupId" name="group_id" value="'+group_id+'"><table class="table_crit"><thead><tr><th colspan="2">'
        +'Новое занятие <a href="#win_newlesson" onclick="RefreshForm();"><i class="fa fa-refresh"></i></a></th></tr></thead>'
        +'<tbody><tr><td style="width: 20vw;">Дата проведения занятия</td><td><input type="date" id="LessonDay" name="lesson_day" class="form-control"'
        +' value="'+date+'" style="text-align:center;" readonly></td></tr><tr><td>Начало занятия<br>(в формате: ЧЧ:ММ)</td><td><input type="text"'
        +' class="form-control" id="timestart" style="text-align: center;" name="lesson_time_start" onchange="CheckTS();"><div class="err_timestart">'
        +'</div></td></tr><tr id="tr_timefinish" style="visibility: collapse;"><td>Окончание занятия:<br>(в формате: ЧЧ:ММ)</td><td>'
        +'<input type="text" class="form-control" id="timefinish" style="text-align: center;" name="lesson_time_finish" onchange="CheckTF();" readonly>'
        +'<div class="err_timefinish"></div></td></tr><tr id="tr_theme" style="visibility: collapse;"><td>Тема занятия:</td><td>'
        +'<input type="text" class="form-control" name="theme"></td></tr><tr id="tr_lecture" style="visibility: collapse;"><td>'
        +'Часов лекций:</td><td><input type="number" class="form-control" id="LectureHours" name="lecture_hours">'
        +'</td></tr><tr id="tr_practice" style="visibility: collapse;">'
        +'<td>Часов практических<br>занятий:</td><td><input type="number" class="form-control" id="PracticeHours" name="practice_hours">'
        +'</td></tr><tr id="tr_noway" style="visibility: collapse;">'
        +'<td colspan="2"><div class="noway"></div></td></tr><tr id="tr_teacher" style="visibility: collapse;"><td>Преподаватель:'
        +'</td><td><div class="choose_teach"></div><div class="err_teach"></div></td><tr id="tr_teacherinfo"'
        +' style="visibility: collapse;"><td colspan="2"><div class="teacherinfo" style="text-align: center;"></div></td></tr>'
        +'<tr id="tr_formbutton" style="visibility: collapse;"><td colspan="2"><button type="submit" id="butt" class=" btn btn-lg btn-primary"'
        +'onclick="window.location.href=\'#close\';" disabled>Добавить занятие</button></td></tr></tbody></table></form><br>'
        +'<button type="button" class=" btn btn-lg btn-primary" onclick="window.location.href=\'#close\';">Закрыть</button>'
    $('.popup').empty();
    $('.popup').append(div);
    addMask();
};
function TeacherChoose(){
    $('#LectureHours').attr('readonly', 'true');
    $('#PracticeHours').attr('readonly', 'true');
    var teacher = $('#TeachersList').val();
    id_teacher = teacher.substring(teacher.indexOf(':')+1, teacher.indexOf(')'));
    $.ajax(
         {
            type: "GET",
            url: "/centre/study/schedule/event_lessons_"+group_id,
            data:{
                id_teach: id_teacher,
                time_start: $('#LessonDay').val()+' '+$('#timestart').val(),
                time_finish: $('#LessonDay').val()+' '+$('#timefinish').val(),
            },
            beforeSend: function() {
                $('.err_teach').text('');
                $('.err_teach').append($("<img src='/static/work/load_full.gif'>").css({width: '20px', height: '20px'}));;
            },
            success: function(data) {
                $('.err_teach').empty();
                $('#tr_teacherinfo').css('visibility', 'visible');
                var fio = data['fio'];
                var email = data['email'];
                var phone = data['phone'];
                if (data['freetime'] == true) {
                    $('.teacherinfo').html('ФИО: '+String(fio)+'<br>Почта: '+email+'<br>Телефон: '+phone+'<br><font color="green">Преподаватель свободен</green>');
                    $('#tr_formbutton').css('visibility', 'visible');
                    $('#butt').attr('disabled', false);
                } else {
                    $('.teacherinfo').html('ФИО: '+String(fio)+'<br>Почта: '+email+'<br>Телефон: '+phone+'<br><font color="red">Преподаватель занят</red>');
                    $('#tr_formbutton').css('visibility', 'collapse');
                    $('#butt').attr('disabled', true);
                }
            }
    });
};
function addEditMask(){
    $.mask.definitions['H'] = "[0-2]";
    $.mask.definitions['h'] = "[0-9]";
    $.mask.definitions['M'] = "[0-5]";
    $.mask.definitions['m'] = "[0-9]";
    $('#t_s').mask("Hh:Mm");
    $('#t_f').mask("Hh:Mm");
};
function addGenMask(){
    $.fn.setCursorPosition = function(pos) {
      if ($(this).get(0).setSelectionRange) {
        $(this).get(0).setSelectionRange(pos, pos);
      } else if ($(this).get(0).createTextRange) {
        var range = $(this).get(0).createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
      }
    };
    $.mask.definitions['H'] = "[0-2]";
    $.mask.definitions['h'] = "[0-9]";
    $.mask.definitions['M'] = "[0-5]";
    $.mask.definitions['m'] = "[0-9]";
    $('#Gen_TS').click(function(){
      $(this).setCursorPosition(0);
    }).mask("Hh:Mm");
};
function addMask() {
    $.fn.setCursorPosition = function(pos) {
      if ($(this).get(0).setSelectionRange) {
        $(this).get(0).setSelectionRange(pos, pos);
      } else if ($(this).get(0).createTextRange) {
        var range = $(this).get(0).createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
      }
    };
    $.mask.definitions['H'] = "[0-2]";
    $.mask.definitions['h'] = "[0-9]";
    $.mask.definitions['M'] = "[0-5]";
    $.mask.definitions['m'] = "[0-9]";
    $('#timestart').click(function(){
      $(this).setCursorPosition(0);
    }).mask("Hh:Mm");
    $('#timefinish').click(function(){
      $(this).setCursorPosition(0);
    }).mask("Hh:Mm");
}