// Global scope variables for period type, numbers etc.
var period, isPlay, noPeriods, lenPeriod, lenBreak, rollingClock, gameStarted;
// Added variables for improved time-keeping
var start_time, isRunning;
var MatchClockTock;
//$( document ).ready(function () {
//
//})
//var buzzer = new Audio('./mp3/47434BUZZER.mp3');
//var warningThiry = new Audio('./mp3/thirty.mp3');
var warningGiven;
var teamdata;

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

var scoreHome, scoreAway;

// Set global default values
noPeriods = 3;
lenPeriod = 20;
lenBreak = 10;
rollingClock = false;

function resetGame() {
    // Do stuff here
    period = 1;
    isPlay = true;
    // Do things here to get a hold of the number of periods,
    // the period length and the length of the period break
    noPeriods = parseInt($('#match-timer-no-periods').val()); // mins
    lenPeriod = parseInt($('#match-timer-len-period').val()); // mins
    lenBreak = parseInt($('#match-timer-len-break').val());; // mins
    rollingClock = $('#match-timer-rolling').prop('checked');
    gameStarted = false;
    done = false;
    warningGiven = false;

    clockRed('#match-timer');

    scoreHome = 0;
    scoreAway = 0;
    $("#team-home").val("").change();
    $("#team-away").val('').change();

    $('#match-period').text(period);

    // MatchClock object
    MatchClockTock = new Tock ({
        countdown: true,
        start_time: lenPeriod*60*1000,
        interval: 70,
        callback: function () {
            // if (MatchClockTock.lap() > 10000) {
            //     $('#match-timer').text(MatchClockTock.lap('{mm}:{ss}'));
            // } else {
            //     $('#match-timer').text(MatchClockTock.lap('{ss}.{ll}'));
            // }
            $('#match-timer').html(formatTime(this.lap()));
            if ((!isPlay) && (this.lap() < 30*1000) && (this.lap() > 29*1000) && (!warningGiven)) {
                lowLag.play('warningThirty');
                warningGiven = true;
            }
            if (this.go) {
                clockGreen('#match-timer');
            } else {
                clockRed('#match-timer');
            }
        },
//        onStop: function () {
//            // console.log('Inside onStop');
//        },
//        onStart: function () {
//            // console.log('Inside onStart');
//        },
        complete: function (playSound = true) {
            // console.log('Inside onComplete');
            if (playSound) { lowLag.play('buzzer'); }
//            setTimeout(function () {console.log('Game done'); }, 1000);
            if (period >= noPeriods && isPlay) {
                this.stop();
                clockRed('#match-timer');
//                var done = confirm('Looks like this game is done.\nClick OK to reset, ready for the next game\nClick cancel to return to the clock for this game')
//                if (done) {
//                    this.reset();
//                    resetGame();
//                }
                return;
            } 
            if (isPlay) {
                isPlay = false;
                period += 1;
                if (period <= noPeriods) {
                    newTime = lenBreak * 60. * 1000.;
                    warningGiven = false;
                } else {
                    newTime = 0.;
                }
                // $('#match-period').html(period-1+' (break)');
                $('#match-period').html(period+' next (period break)');
            } else {
                isPlay = true;
                newTime = lenPeriod * 60. * 1000.;
                $('#match-period').html(period);
            }
            if (newTime > 0) {
//                MatchClockTock.start_time = newTime;
//                MatchClockTock.reset();
                this.start(newTime);
                if (this.go) {
                     this.pause()
                     this.pause_time = newTime;
                }
                this.callback();
                // Fudge - add a resolution element
                // currentTime += incrementTime / 10.;
            }
            // this.Timer.stop().once();
            if (rollingClock && period <= noPeriods && period != 1 && !this.go) {
//                console.log('Autostart triggered')
                this.pause();
            }
        }
//        onReset: function () {
//            // console.log('Inside onReset');
//        }
    });

    // MatchClockTock.callback();
    MatchClockTock.alterTime  = function (secs) {
        if (secs > 0 || (-1000 * secs < MatchClockTock.lap())) {
            // console.log('Altering time...')
            var now = MatchClockTock.lap();
            // console.log(now)
//             console.log('Now is '+now)
            // console.log('Secs is'+1000*secs)
            var newTime = now + (secs * 1000);
//            // console.log('newTime is'+newTime);
//            MatchClockTock.duration_ms = newTime;
//            MatchClockTock.time = 0.
//            MatchClockTock.callback();
            // console.log('New start_time is '+MatchClockTock.start_time)
//            if (MatchClockTock.isRunning) {
//                MatchClockTock.reset();
//                MatchClockTock.start();
//            } else {
//                MatchClockTock.start_time = now + (secs * 1000);
//                MatchClockTock.reset();
//                MatchClockTock.callback();
//            }
            if (MatchClockTock.go) {
                MatchClockTock.duration_ms += secs * 1000;
            } else {
                MatchClockTock.pause_time = newTime;
                MatchClockTock.callback();
            }
            warningGiven = false;
        }
    }

    // Game start functions
    MatchClockTock.start_time = lenPeriod * 60. * 1000.;
//    MatchClockTock.reset();
    MatchClockTock.start(MatchClockTock.start_time + 10); // Added millisecond avoids floating-point errors;
    // otherwise, e.g., 16:00 will occasionally show up as 15:59(.999) at clock init
//    MatchClockTock.pause();
//    MatchClockTock.time = 0;
    MatchClockTock.callback();
    toggleClock(MatchClockTock);

}

function resetGameManual(clock) {
    if (clock.go) { toggleClock(clock); }
    var confirmReset = confirm('Are you sure? This will remove all current game information...');
    if (confirmReset) {
        resetGame();
    }
}

function toggleClock(clock) {
    clock.pause();
    if (clock.go) {
        clockGreen('#match-timer');
    } else {
        clockRed('#match-timer');
    }
//    if (clock.isRunning) {
//        clock.stop();
//        clockRed('#match-timer');
//    } else {
//        clock.start();
//        clockGreen('#match-timer');
//    }
}

function clockRed(id) {
    var $select = $(id);
    // $select.attr('style', '');
    // $select.attr('style', 'border-right: 10px solid red;');
    $select.removeClass('clockGreen');
    $select.addClass('clockRed');
}

function clockGreen(id) {
    var $select = $(id);
    // $select.attr('style', '');
    // $select.attr('style', 'border-right: 10px solid green;');
    $select.removeClass('clockRed');
    $select.addClass('clockGreen');
}

// Common functions
function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {str = '0' + str;}
    return str;
}
function formatTime(time) {
    var min = parseInt(time / 60000),
        sec = parseInt(time / 1000) - (min * 60),
        mills = Math.floor((time - (sec * 1000) - (min * 60000)) / 100);
    return (min > 0 ? pad(min, 2) + "<g id='timerColon'>:</g>" : "<g id='timerRedundant'>0:</g>") + pad(sec, 2) + (min < 1 ? "<g id='timerColon'>.</g>" + mills : "");
}
function startGame() {
    gameStarted = true;
}
function populateSelect (id, start_no, end_no) {
    var $select = $(id);
    for (i=start_no; i<=end_no; i++) {
        $select.append($('<option></option>').val(i).html(i));
    }
}
function populateSelectTeamArray (id, arr) {
    // console.log('Running populateSelectTeamArray')
    var $select = $(id)
    // // console.log($select)
    // jQuery.each(arr, function () {
    //     $select.append($('<option></option>')).val(this['name']).html(this['name']);
    // })
    // $select.append($('<option></option>');
    // $select.append($('<option></option>').val('').html(''));
    // arr.forEach(function (i) {
    //     $select.append($('<option></option>').val(i).html(i['name']));
    //     // console.log(i['name'])
    // })
    $.each(arr, function (key, value) {
        // console.log(key);
        $select.append($('<option></option>').val(key).html(value['name'])
            .css('background-color', value['bg-clr']).css('color', value['tx-clr']));
    });
}
function populateSelects () {
    // var $perLen = $('#match-timer-len-period')
    // for (i=1; i<=10; i++) {
    //     $perLen.append($('<option></option>').val(i).html(i))
    // }
    populateSelect('#match-timer-no-periods', 1, 9);
    populateSelect('#match-timer-len-period', 1, 30);
    populateSelect('#match-timer-len-break', 1, 15);
}

function populateTeamSelects (data) {
    // console.log('Doing populateTeamSelects');
    populateSelectTeamArray('#team-home', data);
    populateSelectTeamArray('#team-away', data);
}

function alterBGTeamImage (id, team) {
    var $div = $(id);
    // Clear the existing classes on the team-img
    $div.attr('style', '');
    if (team != '') {
    // Attach the photo
    $div.css('background-image',
        'url('+teamdata[team]['img']+')');
    $div.css('background-color',
        teamdata[team]['img-clr']);
    }
}

function showTeamScore (id, score) {
    var $score = $(id);
    $score.text(score);
}

function alterBGTeamScore (id, team, score) {
    var $div = $(id);
    // Clear the existing classes on the team-img
    // $div.attr('style', '');
    $div.css('background-color',
        "");
    $div.css('color', "");
    $div.text('');
    // Attach the photo
    if (team != '') {
    $div.css('background-color',
        teamdata[team]['bg-clr']);
    $div.css('color',
        teamdata[team]['tx-clr']);
    $div.text(score);
    }   
}

function alterHomeScore (inc) {
    if (-1 * scoreHome < (inc+1)) {
    scoreHome += inc;
    showTeamScore('#team-score-home', scoreHome);
    }
}

function alterAwayScore (inc) {
    if (-1 * scoreAway < (inc+1)) {
    scoreAway += inc;
    showTeamScore('#team-score-away', scoreAway);
    }
}

function alterPeriod(inc) {
   if (inc == 0) { return ;} // No action needed
   var wasGoing = MatchClockTock.go
   if (wasGoing) {
     toggleClock(MatchClockTock);
   }
    var conf = confirm("Are you sure? You don't need to alter the period manually unless there has been an error")
    if (conf) {
        if (inc > 0) {
            // Just fire the clock completion
            MatchClockTock.complete(false);
        } else {
            // Need to take the period counter back N whole periods (play + break), then fire complete
            if (period + inc + 1 > 1) {
                console.log("period was " + period);
                period += inc;
                console.log("period is now " + period);
                toggleClock(MatchClockTock);
                MatchClockTock.complete(false);
            }
        }
    }

   // Hold the clock after a change
    if (MatchClockTock.go) {
        toggleClock(MatchClockTock);
    }
}


// On-page-load events
$( document ).ready(function () {

    if ( $( 'div#lowLag ').length == 0 ) {
        console.log('Initializing lowLag...');
        lowLag.init({sm2url: './js/sm2/swf/', urlPrefix: './mp3/'});
        lowLag.load(['47434BUZZER.mp3', '47434BUZZER.ogg', '47434BUZZER.wav'], 'buzzer');
        lowLag.load(['thirty.mp3', 'thirty.ogg', 'thirty.wav'], 'warningThirty');
    }

    clockToggleH = parseInt($('#clock-toggle').css('height'));
    $('#clock-toggle').css('height', 2*clockToggleH + 'px');

    $.ajaxSetup({beforeSend: function(xhr){
      if (xhr.overrideMimeType)
      {
        xhr.overrideMimeType("application/json");
      }
    }
    });

    teamdata = {};
    var teamjson = [
        "./json/teams.colours.json"
    ]
    teamjson.forEach(function (i, index) {
        ($.getJSON(i, function (json) {
            console.log('JSON populate index = ' + index);
            // // console.log('Have team JSON!');
            $.extend(teamdata, json);
            // populateTeamSelects(teamdata);
            if (index == teamjson.length - 1) {
                console.log('Pop team selects');
                populateTeamSelects(teamdata);
            }
        }));
    });
    // Initialize system
    populateSelects();

    // Set game-alteration selects to system hard-coded defaults
    $('#match-timer-no-periods').val(noPeriods)
    $('#match-timer-len-period').val(lenPeriod)
    $('#match-timer-len-break').val(lenBreak)
    $('#match-timer-rolling').prop('checked', rollingClock)

    // Bind window open function
    $('#window-open').click(function () {
        ext = window.open('./standard-screen.html', 'null',
            "height=1080,width=1920,menubar=no,location=no,dependent=yes,resizable,scrollbars=no,personalbar=no");
        // Close external display if confirmed
        $( window ).on('unload', function () {
            ext.close();
    })
    })
    // Bind window unload function
    // Make user connfirm navigation away
    window.onbeforeunload = function () {
        return 'Are you sure you want to leave/refresh?'
    }

    // Bind timer-alteration selects
    $('#match-timer-no-periods').change(function () {
        noPeriods = parseInt($( this ).val());
    });
    $('#match-timer-len-period').change(function () {
        lenPeriod = parseInt($( this ).val());
        if (!gameStarted) {
            currHome = $('#team-home').val();
            currAway = $('#team-away').val();
            resetGame();
            $('#team-home').val(currHome).change();
            $('#team-away').val(currAway).change();
        }
    });
    $('#match-timer-len-break').change(function () {
        lenBreak = parseInt($( this ).val());
    })
    $('#match-timer-rolling').change(function () {
        if ($( this ).prop('checked') == true) {
            rollingClock = true;
        } else {
            rollingClock = false;
        }
    })

    // Bind team-alteration selects
    $('#team-home').change(function () {
        alterBGTeamImage('#team-img-home', $( this ).val());
        alterBGTeamScore('#team-score-home', $( this ).val(), scoreHome);
    })
    $('#team-away').change(function () {
        alterBGTeamImage('#team-img-away', $( this ).val());
        alterBGTeamScore('#team-score-away', $( this ).val(), scoreAway);
    })

    // Set up the manual buzzer system
    $('#arm-manual-buzzer').change(function () {
        console.log('Clicked arm-manual-buzzer');
        if ($(this).is(":checked")) {
            // Enable buzzer button
            $("#manual-buzzer").prop("disabled", false);
        } else {
            // Disable buzzer button
            $("#manual-buzzer").prop("disabled", true);
        }
    });
    $('#arm-manual-buzzer').prop("checked", false).change();

    $('#manual-buzzer').click(function () {
        lowLag.play('buzzer');
        $('#arm-manual-buzzer').prop("checked", false).change();
    });


    // Should now be ready - reset game to start!
    resetGame();

});
