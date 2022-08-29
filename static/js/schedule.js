$(function() {
    $(".check").click(function() {
        if ($(this).attr('id') == 'showall'){
            $("[class^=tr_]").css('visibility', 'visible');
            $("#showall").html('Скрыть прошедшие занятия');
            $("#showall").prop("id","hideall");
        } else {
            $("[class^=tr_]").css('visibility', 'collapse');
            $("#hideall").html('Показать прошедшие занятия');
            $("#hideall").prop("id","showall");
        }
    });
});

