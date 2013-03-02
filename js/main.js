
var ID_YOUTUBE_PREFIX = "youtube-container-";
var CLASS_YOUTUBE_AREA = "youtube-area";
var CLASS_DISPLAY_NONE = "displaynone";
var CLASS_DISABLED = "disabled";

var MAX_YOUTUBE_COUNT = 4;

var ERROR_NOT_INPUT_URL = "Not input Youtube URL !";
var ERROR_MAX_YOUTUBES = "Max number of Youtube is " + MAX_YOUTUBE_COUNT + "!";
var ERROR_INVALID_URL = "This url is invalid !";

var PARAM_YT_ID = "ytid";
var PARAM_S_MIN = "sMin";
var PARAM_S_SEC = "sSec";
var PARAM_END_SEC = "endSec";


function EndlessTubeCtrl($scope) {
    $scope.youtubes = [];
    $scope.errorMsg = "";
    $scope.canShowBtn = CLASS_DISABLED;
    $scope.urls = "http://konifar.com/endlesstube";


    $(function() {
        // Show Youtube from url parameters
        angular.forEach($scope.youtubes, function(youtube) {
            showYtPlayer(youtube);
            endlessPlay(youtube);
        });

    });


    $scope.init = function() {
        // Set Youtubes from url parameter
        var params = parseUrlParamsToHash();

        for (var idx = 0; idx < MAX_YOUTUBE_COUNT; idx++) {
            var id = idx+1;
            var ytid = params[PARAM_YT_ID + id];

            if (isNull(ytid)) {
                return;
            }

            var sMin = Number(params[PARAM_S_MIN + id]);
            var sSec = Number(params[PARAM_S_SEC + id]);
            var endSec = Number(params[PARAM_END_SEC + id]);

            $scope.youtubes.push(createYoutubeJson(id, ytid, sMin, sSec, endSec));
        }
    }


    // prepare Youtube display area
    $scope.prepareYoutubeArea = function () {
        if ($scope.youtubes.length >= MAX_YOUTUBE_COUNT) {
            $scope.errorMsg = ERROR_MAX_YOUTUBES;
            return;
        }

        var url = $scope.youtubeUrl;
        if (isNull(url)) {
            $scope.errorMsg = ERROR_NOT_INPUT_URL;
            return;
        }

        var youtubeId = extractYoutubeID(url);
        if (isNull(youtubeId)) {
            $scope.errorMsg = ERROR_INVALID_URL;
            return;
        }
        $scope.youtubes.push(createYoutubeJson($scope.youtubes.length+1, youtubeId, 0, 0, 0));
    };


    // Show Youtube by youtubeAPI
    $scope.showYoutube = function () {
        if ($scope.youtubes.length == 0) {
            return;
        }

        $scope.youtubeUrl = "";
        $scope.canShowBtn = CLASS_DISABLED;

        var youtube = $scope.youtubes[$scope.youtubes.length-1]
        if (isNull(youtube.youtubeid)) {
            return;
        }

        showYtPlayer(youtube);
        changeUrlParameter();
    };


    $scope.removeYoutube = function(youtube) {
        clearInterval(youtube.timeId);
        $scope.youtubes.splice(youtube.id-1, 1);
        // init Youtube area
        angular.forEach($scope.youtubes, function(youtube, idx) {
            $scope.youtubes[idx].id = idx + 1;
        });

        changeUrlParameter();
    }


    var endlessPlay = function(youtube) {
        clearInterval(youtube.timeId);
        var selector = "#" + ID_YOUTUBE_PREFIX + youtube.id;
        var startSecond = youtube.startMinute * 60 + youtube.startSecond;
        var endlessMillSec = youtube.endlessSec * 1000;
        if (endlessMillSec <= 0) {
            pausePlay(youtube);
            return;
        }

        var timeId = playYoutube(selector, startSecond, endlessMillSec);
        youtube.timeId = timeId; // set interval time id
    }


    var pausePlay = function(youtube) {
        clearInterval(youtube.timeId);
        var selector = "#" + ID_YOUTUBE_PREFIX + youtube.id;
        $(selector).tubeplayer("pause");
    }


    $scope.checkCanEndless = function(youtube) {
        if (youtube.endlessSec > 0) {
            endlessPlay(youtube);
        } else {
            pausePlay(youtube.id);
        }
        changeUrlParameter();
    }


    var changeUrlParameter = function() {
        var params = "";
        angular.forEach($scope.youtubes, function(youtube, idx) {
            params += createUrlParam(youtube.id, youtube.youtubeid, youtube.startMinute, youtube.startSecond, youtube.endlessSec);
            if ($scope.youtubes.length-1 > idx) {
                params += "&";
            }
        });
        changeUrlParam(params);
        $scope.urls = window.location.href;
    }


    $scope.clearEndless = function(youtube) {
        youtube.startMinute = 0;
        youtube.startSecond = 0;
        youtube.endlessSec = 0;
        clearInterval(youtube.timeId);
        pausePlay(youtube.id);
    }


    var showYtPlayer = function(youtube) {
        var selector = "#" + ID_YOUTUBE_PREFIX + youtube.id;

        $(selector).tubeplayer({
            width: '100%',
            allowFullScreen: false,
            initialVideo: youtube.youtubeid,
            preferredQuality: "default",
            start: 0,
            showControls: 1,
            showRelated: 0,
            autoPlay: false,
            autoHide: false,
            theme: "light",
            color: "red",
            showinfo: true,
            modestbranding: true,
            onSeek: function(time){},
            onPlayerPlaying: function() {
                endlessPlay(youtube);
            },
            onPlayerPaused: function() {
                pausePlay(youtube);
            }
        });
    }


    var changeUrlParam = function(param) {
        if (window.history && window.history.pushState){
                window.history.pushState(null, null, "/endlesstube" + "?" + param);
        }
    }


    var createUrlParam = function(id, ytid, sMin, sSec, endSec) {
        return PARAM_YT_ID + id + "=" + ytid + "&"
             + PARAM_S_MIN + id + "=" + sMin + "&"
             + PARAM_S_SEC + id + "=" + sSec + "&"
             + PARAM_END_SEC + id + "=" + endSec
             ;
    }


    var playYoutube = function(selector, seekTime, endlessMillSeconds) {
        $(selector).tubeplayer("seek", seekTime).tubeplayer("play"); // first
        var timeId = setInterval(function() {
            $(selector).tubeplayer("seek", seekTime).tubeplayer("play");
        }, endlessMillSeconds);
        return timeId;
     }


    var extractYoutubeID = function(youtubeUrl) {
        var youtubeId = youtubeUrl.replace(/.*v=([\d\w]+).*/, '$1');
        return youtubeId;
    }


    var isNull = function(string) {
        return (string === undefined || string === "");
    }


    var parseUrlParamsToHash = function() {
        var params = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i <hashes.length; i++) {
            hash = hashes[i].split('=');
            params.push(hash[0]);
            params[hash[0]] = hash[1];
        }
        return params;
    }

    var createYoutubeJson = function(id, ytid, sMin, sSec, endSec) {
        return {
                 id:id,
                 youtubeid:ytid,
                 startMinute:sMin,
                 startSecond:sSec,
                 endlessSec:endSec
               };
    }


    // TODO
    $scope.displayError =function() {
        if (isNull($scope.errorMsg)) {
            return CLASS_DISPLAY_NONE;
        } else {
            return "";
        }
    }

    // TODO
    $scope.checkDisabledShowBtn = function() {
        var above_max_count = $scope.youtubes.length >= MAX_YOUTUBE_COUNT;
        var null_url = isNull($scope.youtubeUrl);
        if (above_max_count || null_url) {
            $scope.canShowBtn = CLASS_DISABLED;
        } else {
            $scope.canShowBtn = "";
        }
    }

}
