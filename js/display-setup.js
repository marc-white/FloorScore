// Formatting setup for screen

var advertImgList = [
    './img/sponsors/EDS_33449_ACT_GOV_CBR_Reversed.png',
    './img/sponsors/efloorball_logo_2000x1000-white.png',
    './img/sponsors/PH-LOGO-edit-white-1200.png',
    './img/sponsors/logo_florbee_final_1200.png'
];
var advertShown = 0;
var advertisingCadence = 45000.;

function formatScreen () {
    // console.log('Running formatScreen()...');
    // Home team logo & score
    var tourneyLogoH = parseInt($('#tourney-logo').css('height'));
    var teamNameHome = $('#team-name-home');
    var teamNameAway = $('#team-name-away');
    var teamImgHome = $('#team-img-home');
    var teamScoreHome = $('#team-score-home');
    var teamImgAway = $('#team-img-away');
    var teamScoreAway = $('#team-score-away');
    var matchTimer = $('#match-timer');
    var matchPeriod = $('#match-period');
    var advertising = $('#advertising');
    var scoreFontSizeFactor = 0.75;

    teamNameHome.css('top', tourneyLogoH+'px');
    var homeLogoW = parseInt(teamImgHome.css('width'));
    teamNameHome.css('height', 0.4*homeLogoW+'px');
    var homeNameH = parseInt(teamNameHome.css('height'));
//    $('#team-name-home').css('font-size', 0.38*homeNameH+'px');
//    $('#team-name-home').css('line-height', 0.40*homeNameH+'px');
    teamNameHome.css('font-size', '38px');
    teamNameHome.css('line-height', '40px');
    teamImgHome.css('height', homeLogoW+'px');
    teamImgHome.css('top', tourneyLogoH+homeNameH+homeLogoW+'px');
    teamScoreHome.css('height', homeLogoW+'px');
    teamScoreHome.css('line-height', homeLogoW+'px');
    // console.log(tourneyLogoH);
    var homeScoreY = homeNameH + tourneyLogoH;
    // console.log(homeScoreY)
    teamScoreHome.css("top", homeScoreY+'px');
    teamScoreHome.css("font-size", scoreFontSizeFactor*parseInt(homeLogoW)+'px');

    teamNameAway.css('top', tourneyLogoH+'px');
    var awayLogoW = parseInt(teamImgAway.css('width'));
    teamNameAway.css('height', 0.4*awayLogoW+'px');
    var awayNameH = parseInt(teamNameAway.css('height'));
//    $('#team-name-away').css('font-size', 0.38*awayNameH+'px');
//    $('#team-name-away').css('line-height', 0.40*awayNameH+'px');
    teamNameAway.css('font-size', '38px');
    teamNameAway.css('line-height', '40px');
    teamImgAway.css('height', awayLogoW+'px');
    teamImgAway.css('top', tourneyLogoH+awayNameH+awayLogoW+'px');
    teamScoreAway.css('height', awayLogoW+'px');
    teamScoreAway.css('line-height', awayLogoW+'px');
    // console.log(tourneyLogoH);
    var awayScoreY = awayNameH + tourneyLogoH;
    // console.log(awayScoreY)
    teamScoreAway.css("top", awayScoreY+'px');
    teamScoreAway.css("font-size", scoreFontSizeFactor*parseInt(awayLogoW)+'px');

    // $('.team-logo').css('font-size', 0.8*homeLogoW+"px");

    // Timer
    timerW = parseInt(matchTimer.css('width'));
    // console.log(timerW);
    matchTimer.css('height', 0.3*timerW+"px");
    matchTimer.css('line-height', 0.32*timerW+"px");
    timerH = parseInt(matchTimer.css('height'));
    matchTimer.css('font-size', 0.84*timerH+"px");
    timerFS = parseInt(matchTimer.css('font-size'));
    matchPeriod.css('top', tourneyLogoH+timerH+'px');
    matchPeriod.css('height', 0.65 * timerH + "px");
    // matchPeriod.css('line-height', 0.40 * timerH + "px");
    matchPeriod.css('font-size', 0.45 * timerH + "px");
    periodH = parseInt(matchPeriod.css('height'));
    periodBoxes = $( '.period-box' );
    periodBoxes.css('width', periodBoxes.css('height'));
    $('.period-arrow')
        .css('height', periodBoxes.css('height'))
        .css('line-height', periodBoxes.css('height'))
        .css('margin-top', periodBoxes.css('margin-top'));

    // Advertising
    advertW = parseInt(advertising.css('width'));
    var advertY = tourneyLogoH+timerH+periodH;
    // console.log(tourneyLogoH);
    // console.log(timerH);
    // console.log(periodH);
    // console.log('makes');
    // console.log(advertY);
    advertising.css('top', advertY+'px');
    advertising.css('height', 0.4*advertW+'px');
    var advertH = parseInt(advertising.css('height'));
    // console.log(0.18*advertH + 'px')
    $('#advertising td').css('font-size', 0.08*advertH + 'px');

}

function updateAdvert (i) {
    $('#advertising-space').css('background-image', 'url('+advertImgList[i]+')');
}

// Shift around home elements
$( document ).ready( function () {
    formatScreen();

    // Append first advert
    // $('#advertising-space').css('background-image', 'url('+advertImgList[0]+')');
    updateAdvert(0);

    // Cycle advertising
    var advertCycle = setInterval(function () {
        (advertShown < (advertImgList.length-1)) ? advertShown += 1 : advertShown = 0;
        // console.log(advertShown);
        updateAdvert(advertShown);
    }, advertisingCadence);
});