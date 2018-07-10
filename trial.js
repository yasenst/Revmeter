var timeOutVar = null;
var currentArrowAngle = -120; // 0 rpm
var values = [0]; // 0 rpm

function rpmToAngle(rpm) { //convert rpm to degrees
    var divided = rpm / 1000;
    var angle = (divided*30) - 120;
    return angle;
}

function angleToRpm(angle) { // convert degrees to rpm
    var divided = (angle+120) / 30;
    var rpm = divided*1000;
    return rpm;
}

function next(nextValue, smoothing) { // filter function
    
    // push new value to the end, and remove oldest one
    var removed = values.push(nextValue);
    // smooth value using all values from buffer
    var result = values.reduce(function(last, current) {
        return smoothing * current + (1 - smoothing) * last;
    }, removed);
    // replace smoothed value
    values[values.length - 1] = Math.floor(result);
    return Math.floor(result);
}

function moveArrow(targetDeg, smoothing, lastArrowAngle, tempTargetRpm) { 
    if (currentArrowAngle == targetDeg) {
        console.log("smoothing is:"+ smoothing);
        console.log(values);  // see intermediate values
        clearTimeout(timeOutVar);
        return;
    } 
    if (currentArrowAngle == lastArrowAngle) {
        smoothing+=0.01;
    }
    var targetRpm = angleToRpm(targetDeg);
    if (currentArrowAngle < targetDeg && values.length > 2) {
        tempTargetRpm = next(targetRpm, smoothing);
        while (tempTargetRpm <= values[values.length-2]) {
            values.pop();
            smoothing+=0.01;
            tempTargetRpm = next(targetRpm, smoothing);
        }
    } 
    
    else if (currentArrowAngle > targetDeg && values.length > 2) {
        smoothing=0.15;
        tempTargetRpm = next(targetRpm, smoothing);
        
        while (tempTargetRpm >= values[values.length-2]) {
            values.pop();
            smoothing+=0.05;
            tempTargetRpm = next(targetRpm, smoothing);
        }
    }
    
    else {
        tempTargetRpm = next(targetRpm, smoothing);
    }

    currentArrowAngle = rpmToAngle(tempTargetRpm);
    lastArrowAngle = currentArrowAngle;
    $('#line').css('transform',"rotate(" + currentArrowAngle + "deg)")
    timeOutVar = setTimeout( function(){moveArrow(targetDeg, smoothing, lastArrowAngle, tempTargetRpm);}, 25 );
}


$('#myButton').on('click', function () {

    var rpm = $('#target').val();

    var angle = rpmToAngle(rpm);
    //console.log(" " + angle);
    var newRpm = angleToRpm(angle);
    console.log("Next target: " + newRpm);

    var initialSmoothing = 0.01;
    var tempTargetRpm;
    var lastArrowAngle;
    //console.log(values);
    moveArrow(angle, initialSmoothing, lastArrowAngle, tempTargetRpm);   
    
});
