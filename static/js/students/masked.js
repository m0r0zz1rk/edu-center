$(function() {
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
    $.mask.definitions['~']='[А-Яа-яA-Za-z0-9-/]';
    $.mask.definitions['h'] = "[А-Я]";
    $.mask.definitions['z'] = "[а-я]";
    $.mask.definitions['n'] = "[0-9]";
    $("#InputSurname").click(function(){
      $(this).setCursorPosition(0);
    }).mask("hz?zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz",{placeholder:" "});
    $("#InputSerial").click(function(){
      $(this).setCursorPosition(0);
    }).mask("~?~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",{placeholder:" "});
    $("#InputNumber").click(function(){
      $(this).setCursorPosition(0);
    }).mask("nnnnn?nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn",{placeholder:" "});
});