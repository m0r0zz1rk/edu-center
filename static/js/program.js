$(function() {
    $('#CheckFile').on('change', function(){
        if (this.checked) {
            $('#InputFile').prop('disabled',false);
            $('#InputFile').prop('required',true);
        } else {
            $('#InputFile').prop('disabled',true);
            $('#InputFile').prop('required',false);
        }
    });
    $('#SelectType').on('change', function(){
        if ($('#SelectType').val() == 'Профессиональная переподготовка') {
            $('#DurationProg').attr("placeholder", "Не менее 250 часов");
            $('#DurationProg').attr("min", 250);
            $('#DurationProg').attr("max", null);
        } else {
            $('#DurationProg').attr("placeholder", "Не больше 250 часов");
            $('#DurationProg').attr("max", 250);
            $('#DurationProg').attr("min", 0);
        }
    });
});