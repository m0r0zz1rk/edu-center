function PlanningParams(){
    $('#params').empty();
    $('#params').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', width: '10vh', height: '10vh'}));
     $.ajax(
     {
        type: "GET",
        url: "/centre/study/planning/choose",
        data: {
            get_pars: 'yes'
        },
        dataType : "json",
        success: function(result) {
            div = '<table class="table_crit"><thead><tr><th colspan="2">Измените нужный параметр</th></tr><tr><th>'
                +'Параметр</th><th>Значение</th></tr></thead><tbody>'
            $.each(result.params, function (index, data) {
                div += '<tr><td>'+index+'</td><td><input type="text" class="form-control" style="text-align: center;" id="inp_'+data[1]+'" onchange="ChangeParam(\''+data[1]+'\');"'
                    +' value="'+data[0]+'"></td></tr><tr id="tr_'+data[1]+'" style="visibility:collapse;"><td colspan="2"><div id="div_'+data[1]+'"></td></tr>'
            });
            div += '</tbody></table><br><button type="button" class=" btn btn-lg btn-primary"'
                +'onclick="window.location.href=\'#close\';">Закрыть</button>'
            $('#params').empty();
            $('#params').append(div);
        }
    });
};
function ChangeParam(alias){
    $('#tr_'+alias).css('visibility', 'visible');
    $('#div_'+alias).empty();
    $('#div_'+alias).append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', width: '10vh', height: '10vh'}));
    var value = $('#inp_'+alias).val();
    $.ajax(
     {
        type: "GET",
        url: "/centre/study/planning/choose",
        data: {
            al: alias,
            val: value
        },
        dataType : "json",
        success: function(result) {
            $('#div_'+alias).empty();
            $('#div_'+alias).html('<b style="color:green;">Значение успешно изменено</b>');
        }
    });
};
