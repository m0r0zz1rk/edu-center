$(function() {
    function GetTodayDate() {
       var tdate = new Date();
       var dd = tdate.getDate(); //yields day
       var MM = tdate.getMonth(); //yields month
       var yyyy = tdate.getFullYear(); //yields year
       var currentDate= new Date(yyyy, MM, dd);
       return currentDate;
    }
    function compareDate(str){
     // str format should be dd/mm/yyyy. Separator can be anything e.g. / or -. It wont effect
     var dt   = parseInt(str.substring(8,10));
     var mon  = parseInt(str.substring(5,7));
     var yr   = parseInt(str.substring(0,4));
     var date = new Date(yr, mon-1, dt);
     return date;
    }
    var a = $('#ProgramName').val();
     $.ajax(
         {
            type: "GET",
            url: "/centre/study/planning/course_create",
            data:{
                id: a
            },
            success: function(data) {
                $('.ProgramDuration').html(data['duration']+"<br>"+data['type_dpp']+"<br>"+data['date_order']);
            }
     });
    $('#ProgramName').change(function(){
        var a = $(this).val();
         $.ajax(
             {
                type: "GET",
                url: "/centre/study/planning/course_create",
                data:{
                    id: a
                },
                beforeSend: function() {
                    $('.ProgramDuration').text('');
                    $('.ProgramDuration').prepend('<img src="/static/work/load_full.gif" width="15px" height="15px">');
                },
                success: function(data) {
                    $('.ProgramDuration').html(data['duration']+"<br>"+data['type_dpp']+"<br>"+data['date_order']);
                }
         });
    });
    $("[id^=StartDate]").bind('blur', function() {
        var id = $(this).attr('id');
        if (id.length > 9) {
            var finish = $("#FinishDate_"+id.substring(10)).val();
        } else {
            var finish = $("#FinishDate").val();
        }
        var delta = Math.round((compareDate($(this).val())-GetTodayDate())/(1000*60*60*24));
        var start = $(this).val();
        $.ajax(
         {
            type: "GET",
            url: "/centre/study/planning/course_create",
            data:{
                al: 'plan_days'
            },
            success: function(data) {
                if (delta >= parseInt(data.val)) {
                    $('.err').empty();
                    if (finish != '') {
                        if (compareDate(start) > compareDate(finish)) {
                            $('#'+id).val("");
                            $('.err').text("Дата начала обучения не может быть позже даты окончания");
                        } else {
                            $('.err').empty();
                        }
                    }
                } else {
                    $('#'+id).val("");
                    $('.err').text("Планирование курса должно быть осуществлено не раньше, чем за "+data.val+" дней до фактического начала мероприятия");
                }
            }
        });
    });
    $("[id^=FinishDate]").bind('blur', function(){
        var id = $(this).attr('id');
        if (id.length > 10) {
            var start = $("#StartDate_"+id.substring(11)).val();
        } else {
            var start = $("#StartDate").val();
        }
        if (start == '') {
            $(this).val("");
            $('.err').text("Заполните дату начала обучения");
            return;
        } else {
            $('.err').empty();
        }
        var finish = $(this).val();
        if (compareDate(start) > compareDate(finish)) {
            $(this).val("");
            $('.err').text("Дата начала обучения не может быть позже даты окончания");
        } else {
            $('.err').empty();
        }
    });
});