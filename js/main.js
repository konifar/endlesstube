$(function() {
    //
});

// Show Youtube
function showYoutube(youtube_id, selector) {
    $(selector).tubeplayer({
        width: '100%',
        allowFullScreen: false,
        initialVideo: youtube_id,
        preferredQuality: "default",
        start: 0,
        showControls: 1,
        showRelated: 0, // show the related videos when the player ends, 0 or 1
        autoPlay: false, // whether the player should autoplay the video, 0 or 1
        autoHide: true,
        theme: "light", // possible options: "dark" or "light"
        color: "red", // possible options: "red" or "white"
        showinfo: true, // if you want the player to include details about the video
        modestbranding: true, // specify to include/exclude the YouTube watermark
        // // the location to the swfobject import for the flash player, default to Google's CDN
        // wmode: "transparent", // note: transparent maintains z-index, but disables GPU acceleration
        // swfobjectURL: "http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js",
        // loadSWFObject: true, // if you include swfobject, set to false
        onPlay: function(id){}, // after the play method is called
        onPause: function(){}, // after the pause method is called
        onStop: function(){}, // after the player is stopped
        onSeek: function(time){}, // after the video has been seeked to a defined point
        onMute: function(){}, // after the player is muted
        onUnMute: function(){} // after the player is unmuted
    });
}

// Play Youtube
function playYoutube(selector, seekTime, endlessMillSeconds) {
    setInterval( function() {
        $(selector).tubeplayer("seek", seekTime).tubeplayer("play");
    }, endlessMillSeconds);
}

// Get YoutubeID from Youtube url
function extractYoutubeID(youtubeUrl) {
    var youtubeId = youtubeUrl.replace(/.*v=([\d\w]+).*/, '$1');
    return youtubeId;
}

function isNull(string) {
    return (string === undefined || string === "");
}

function EndlessTubeCtrl($scope) {

    $scope.youtubes = [];
    $scope.errorMsg = "";
    var MAX_YOUTUBE_COUNT = 4;
    var ERROR_NOT_INPUT_URL = "Not input Youtube URL !";
    var ERROR_MAX_YOUTUBES = "Max number of Youtube is 4 !";
    var ERROR_INVALID_URL = "This url is invalid !";
    var CLASS_DISPLAY_NONE = "displaynone";
    var CLASS_DISABLED = "disabled";
    var ID_YOUTUBE_PREFIX = "youtube-container-";

    // prepare Youtube display area
    $scope.prepareYoutubeArea = function () {
        if ($scope.youtubes.length >= 4) {
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
        $scope.youtubes.push({
            id:$scope.youtubes.length+1,
            youtubeid:youtubeId,
            startMinute:0,
            startSecond:0,
            endlessSec:0.0
        });
    };

    $scope.displayError =function() {
        if (isNull($scope.errorMsg)) {
            return CLASS_DISPLAY_NONE;
        } else {
            return "";
        }
    }

    $scope.showYoutube = function () {
        if ($scope.youtubes.length == 0) {
            return;
        }
        var youtubeId = $scope.youtubes[$scope.youtubes.length-1].youtubeid;
        $scope.youtubeUrl = "";

        if (isNull(youtubeId)) {
            return;
        }
        showYoutube(youtubeId, "#" + ID_YOUTUBE_PREFIX + ($scope.youtubes.length));
    };

    $scope.checkDisabledShowBtn = function() {
        if ($scope.youtubes.length >= MAX_YOUTUBE_COUNT) {
            return CLASS_DISABLED;
        } else {
            return "";
        }
    }

    $scope.removeYoutube = function(id) {
        angular.forEach($scope.youtubes, function(youtube, idx) {
            if (youtube.id == id) {
                $scope.youtubes.splice(idx, 1);
            }
            youtube.id = idx + 1;
        });
    }

    $scope.endlessPlay = function(id) {
        angular.forEach($scope.youtubes, function(youtube, idx) {
            if (youtube.id == id) {
                var selector = "#" + ID_YOUTUBE_PREFIX + youtube.id;
                var startSecond = youtube.startMinute * 60 + youtube.startSecond;
                var endlessMillSec = youtube.endlessSec * 1000;
                playYoutube(selector, startSecond, endlessMillSec);
            }
        });
    }

}
