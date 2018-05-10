$(document).ready(function () {

    var $todayNow = new Date();
    var $today = new Date();
    var $dayPeriod = +($today.getDate() + 4);
    $today.setDate(+$dayPeriod);
    var disabledDays = [0, 6];

    // console.log('myd: ' + $todayNow);
    // console.log('mydDay: ' + $dayPeriod);
    // console.log('res: ' + $today);

    $('#minMaxExample').datepicker({
        minDate: $todayNow,
        maxDate: $today,
        autoClose: true,
        onRenderCell: function (date, cellType) {
            if (cellType == 'day') {
                var day = date.getDay(),
                    isDisabled = disabledDays.indexOf(day) != -1;
                return {
                    disabled: isDisabled
                }
            }
        }
    });
});