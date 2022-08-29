$(function() {
    $('#SelectType').change(function(){
        $('#tr_formbutton').css('visibility', 'collapse');
        $('#FormButton').prop('disabled', true);
        var val = $(this).val();
        $.ajax(
         {
            type: "GET",
            url: "/centre/study/studentgroups/new",
            data:{
                id_type: val
            },
            beforeSend: function() {
                $('.load').text('');
                $('.load').append($("<img src='/static/work/load_full.gif'>").css({width: '20px', height: '20px'}));;
            },
            success: function(data) {
                $('.load').empty();
                console.log(data['type']);
                if (data['voc'] != null) {
                    if (data['type'] == true) {
                        $('#SelectCourse option').remove();
                        $('#SelectCourse').append($('<option>', {
                            value: 'start',
                            text: 'Выберите из списка...'
                        }));
                        $.each(data['voc'], function(index, element) {
                            $('#SelectCourse').append($('<option>', {
                                value: index,
                                text: element
                            }));
                        });
                        $('#tr_event').css('visibility', 'collapse');
                        $('#SelectEvent').prop('disabled', true);
                        $('#tr_course').css('visibility', 'visible');
                        $('#SelectCourse').prop('disabled', false);
                        $('#tr_studentsnumber').css('visibility', 'collapse');
                        $('#StudentsNumber').prop('disabled', true);
                        $('#StudentsNumber').prop('required', false);
                    } else {
                        $('#SelectEvent option').remove();
                        $('#SelectEvent').append($('<option>', {
                            value: 'start',
                            text: 'Выберите из списка...'
                        }));
                        $.each(data['voc'], function(index, element) {
                            $('#SelectEvent').append($('<option>', {
                                value: index,
                                text: element
                            }));
                        });
                        $('#tr_course').css('visibility', 'collapse');
                        $('#SelectCourse').prop('disabled', true);
                        $('#tr_event').css('visibility', 'visible');
                        $('#SelectEvent').prop('disabled', false);
                        $('#tr_studentsnumber').css('visibility', 'visible');
                        $('#StudentsNumber').prop('disabled', false);
                        $('#StudentsNumber').prop('required', true);
                    }
                } else {
                    $('.load').css('color', 'red');
                    $('.load').text('Мероприятия не найдены');
                }
            }
        });
    });
    $('#SelectCourse').change(function(){
        if ($(this).val() != 'start') {
            $('#tr_formbutton').css('visibility', 'visible');
            $('#FormButton').prop('disabled', false);
        } else {
            $('#tr_formbutton').css('visibility', 'collapse');
            $('#FormButton').prop('disabled', true);
        }
    });
    $('#SelectEvent').change(function(){
        if ($(this).val() != 'start') {
            $('#tr_formbutton').css('visibility', 'visible');
            $('#FormButton').prop('disabled', false);
        } else {
            $('#tr_formbutton').css('visibility', 'collapse');
            $('#FormButton').prop('disabled', true);
        }
    });
});