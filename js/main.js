var YOUTUBE_PLAYER_ID = "youtube-player";
var ID_YOUTUBE_PLAYER_AREA = "youtube-player-area";
var GLOBAL_ID = 0;

// Youtubeプレイヤーの準備ができたら呼ばれる関数
function onYouTubePlayerReady(playerId) {
    youtubePlayer = document.getElementById(YOUTUBE_PLAYER_ID);
}


function EndlessTubeCtrl($scope) {
    $scope.tubeAreas = [];

    $scope.showYoutube = function () {
        var url = $scope.youtubeUrl;

        if (url == "") {
            return;
        } else {
            $scope.youtubeUrl = "";
        }

        // Youtube用の領域を生成
        var id = ID_YOUTUBE_PLAYER_AREA + "-" + GLOBAL_ID++;
        $("#" + ID_YOUTUBE_PLAYER_AREA).html("")
            .append(
            "<div class='player-container'>"
                + "<p class='lead'>" + url + "</p>"
                + "<div id='" + id + "'></div>"
                + "<div class='tube-controller'>"
                + "<input class='span1' type='num'> seconds later. &nbsp;&nbsp;&nbsp;"
                + "<input class='span1' type='num'> second play!"
                + "</div>"
                + "</div>"
        );

        // Youtubeの埋め込み
        setYoutube(url, 560, 380, id);
    };

}


// Youtubeアドレスから動画IDを取得
function extractYoutubeID(youtubeUrl) {
    var youtubeId = youtubeUrl.replace(/.*v=([\d\w]+).*/, '$1');
    return youtubeId;
}


// Youtubeの埋め込み
function setYoutube(youtubeUrl, width, height, id) {
    var flashvars = { };
    var params = { allowScriptAccess:'always' };
    var attributes = { id:YOUTUBE_PLAYER_ID };
    var youtubeId = extractYoutubeID(youtubeUrl);
    swfobject.embedSWF(
        'http://www.youtube.com/v/' + youtubeId + '?enablejsapi=1&playerapiid=youtubePlayer',
        id,
        width,
        height,
        '8.0.0', // Flash Player8 以降を指定
        'lib/swfobject/expressInstall.swf',
        flashvars,
        params,
        attributes
    );
}