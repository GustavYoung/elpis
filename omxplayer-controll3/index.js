var events = require('events');
var eventEmitter = new events.EventEmitter();
var omx_dbus = require('./lib/omxp_dbus');

//TODO fix this to make user independent
omx_dbus.on('changeStatus', function(status) {
    eventEmitter.emit('changeStatus', status);
    var diff = status.duration - status.pos;
    if (diff > 2000000 && diff < 17000000 && aboutToFinishSentId3.s15 === false){
        aboutToFinishSentId3.s15 = true;
        eventEmitter.emit('aboutToFinish');
        eventEmitter.emit('aboutToFinish15s');
    }
    if (diff > 2000000 && diff < 12000000 && aboutToFinishSentId3.s10 === false){
        aboutToFinishSentId3.s10 = true;
        eventEmitter.emit('aboutToFinish10s');
    }
    if (diff > 2000000 && diff < 7000000 && aboutToFinishSentId3.s5 === false){
        aboutToFinishSentId3.s5 = true;
        eventEmitter.emit('aboutToFinish5s');
    }
});
omx_dbus.on('finish', function() {
    aboutToFinishSentId3 = { s15: false, s10: false, s5: false };
    eventEmitter.emit('finish');
});

/**
 * Open OmxPlayer, with the given parameter
 *
 * @path  {String} The file or folder path
 * @options {Object} The options available
 */
module.exports = eventEmitter;
module.exports.open = omx_dbus.openPlayer;
module.exports.playPause = function(cb) { //checked
    omx_dbus.method('PlayPause', function(err) {
        return typeof cb === 'function' ? cb(err) : {};
    });
};
module.exports.pause = function(cb) { //checked IDEM playPause
    omx_dbus.method('Pause', function(err) {
        return typeof cb === 'function' ? cb(err) : {};
    });
};
module.exports.stop = function(cb) {
    omx_dbus.method('Stop', function(err) {
        return typeof cb === 'function' ? cb(err) : {};
    });
};
module.exports.getStatus = function(cb) { //checked
    omx_dbus.propertyRead('PlaybackStatus', function(err, status) {
        cb(err, status);
    });
};
module.exports.getDuration = function(cb) { //checked
    omx_dbus.propertyRead('Duration', function(err, status) {
        cb(err, status);
    });
};
module.exports.getPosition = function(cb) { //checked
    omx_dbus.propertyRead('Position', function(err, pos) {
        cb(err, Math.round(pos / 10000));
    });
};
module.exports.setPosition = function(pos, cb) { //checked
    pos = pos * 10000;
    omx_dbus.method('SetPosition', ['/not/used', pos], function(err) {
        return typeof cb === 'function' ? cb(err) : {};
    });
};
module.exports.seek = function(offset, cb) { //checked
    omx_dbus.method('Seek', [offset], function(err) {
        return typeof cb === 'function' ? cb(err) : {};
    });
};
module.exports.getVolume = function(cb) { //checked
    omx_dbus.propertyRead('Volume', function(err, vol) {
        cb(err, vol);
    });
};
module.exports.setVolume = function(vol, cb) { //checked *not oficially but Working
    //Working command
    //OMXPLAYER_DBUS_ADDR="/tmp/omxplayerdbus.${USER:-root}";OMXPLAYER_DBUS_PID="/tmp/omxplayerdbus.${USER:-root}.pid";export DBUS_SESSION_BUS_ADDRESS=`cat $OMXPLAYER_DBUS_ADDR`;export DBUS_SESSION_BUS_PID=`cat $OMXPLAYER_DBUS_PID`;dbus-send --print-reply=literal --session --reply-timeout=500 --dest=org.mpris.MediaPlayer2Id3.omxplayer /org/mpris/MediaPlayer2 org.freedesktop.DBus.Properties.Volume double:0.5
    if (vol <= 1.0 && vol >= 0.0) {
        omx_dbus.setVolume(vol, function(err, resp) {
            return typeof cb === 'function' ? cb(err, resp) : {};
        });
    } else {
        return cb(new Error('Volume should be between 0.0 - 1.0'));
    }
};
module.exports.volumeUp = function(cb) { //checked
    omx_dbus.method('Action', [18], function(err) {
        return typeof cb === 'function' ? cb(err) : {};
    });
};
module.exports.volumeDown = function(cb) { //checked
    omx_dbus.method('Action', [17], function(err) {
        return typeof cb === 'function' ? cb(err) : {};
    });
};
module.exports.toggleSubtitles = function(cb) { //checked not tested (I have no subtitles)
    omx_dbus.method('Action', [12], function(err) {
        return typeof cb === 'function' ? cb(err) : {};
    });
};
module.exports.hideSubtitles = function(cb) { //checked not tested (I have no subtitles)
    omx_dbus.method('Action', [30], function(err) {
        return typeof cb === 'function' ? cb(err) : {};
    });
};
module.exports.showSubtitles = function(cb) { //checked not tested (I have no subtitles)
    omx_dbus.method('Action', [31], function(err) {
        return typeof cb === 'function' ? cb(err) : {};
    });
};
module.exports.setLayer = function(layer, cb) { //checked
    omx_dbus.method('SetLayer', [layer], function(err) {
        return typeof cb === 'function' ? cb(err) : {};
    });
};
module.exports.setAlpha = function(alpha, cb) { //checked
    if (alpha >= 0 && alpha <= 255) {
        omx_dbus.method('SetAlpha', ['/not/used', alpha], function(err) {
            return typeof cb === 'function' ? cb(err) : {};
        });
    } else {
        return cb(new Error('Alpha should be between 0 - 255'));
    }
};
module.exports.fadeIn = function(fadeSpeed, fadeVolume, cb) {
    var alpha = 1;
    var volume = 0.0;
    if (fadeSpeed < 1) {var fadeSpeed = 1;}
    if (fadeSpeed > 253) {var fadeSpeed = 253;}
    while (alpha < 255) {
        if ((alpha + fadeSpeed) > 254) {alpha = 254;}
        omx_dbus.method('SetAlpha', ['/not/used', alpha], function(err) {
            return typeof cb === 'function' ? cb(err) : {};
        });
        if (fadeVolume === true) {
            var volume = (volume + (1.0 / (255 / fadeSpeed)));
            if (volume > 1.0) {var volume = 1.0;}
            if (alpha >= 253) {var volume = 1.0;}
            //console.log(alpha, volume);
            omx_dbus.setVolume(volume, function(err, resp) {
                return typeof cb === 'function' ? cb(err, resp) : {};
            });
        }
        alpha += fadeSpeed;
    }
};
module.exports.fadeOut = function(fadeSpeed, fadeVolume, cb) {
    var alpha = 254;
    var volume = 1.0;
    if (fadeSpeed < 1) {var fadeSpeed = 1;}
    if (fadeSpeed > 253) {var fadeSpeed = 253;}
    while (alpha > 1) {
        if ((alpha - fadeSpeed) < 1) {alpha = 1;}
        omx_dbus.method('SetAlpha', ['/not/used', alpha], function(err) {
            return typeof cb === 'function' ? cb(err) : {};
        });
        if (fadeVolume === true) {
            var volume = (volume - (1.0 / (255 / fadeSpeed)));
            if (volume < 0.0) {var volume = 0.0;}
            if (alpha <= 1) {var volume = 0.0;}
            //console.log(alpha, volume);
            omx_dbus.setVolume(volume, function(err, resp) {
                return typeof cb === 'function' ? cb(err, resp) : {};
            });
        }
        alpha -= fadeSpeed;
    }
};
module.exports.setVideoPos = function(x1, y1, x2, y2, cb) { //checked
    var vidPos = x1.toString() + ' ' + y1.toString() + ' ' + x2.toString() + ' ' + y2.toString();
    omx_dbus.method('VideoPos', ['/not/used', vidPos], function(err) {
        return typeof cb === 'function' ? cb(err) : {};
    });
};
module.exports.setVideoCropPos = function(x1, y1, x2, y2, cb) { //checked
    var vidPos = x1.toString() + ' ' + y1.toString() + ' ' + x2.toString() + ' ' + y2.toString();
    omx_dbus.method('SetVideoCropPos', ['/not/used', vidPos], function(err) {
        return typeof cb === 'function' ? cb(err) : {};
    });
};
module.exports.setAspectMode = function(aspect, cb) { //checked
    var available_aspects = ['letterbox', 'fill', 'stretch', 'default'];
    if (available_aspects.indexOf(aspect) > -1) {
        omx_dbus.method('SetAspectMode', ['/not/used', aspect], function(err) {
            return typeof cb === 'function' ? cb(err) : {};
        });
    } else {
        throw new Error('Not an available aspect use one of: ' + available_aspects.join(','));
    }
};
module.exports.getAspect = function(cb) {
    omx_dbus.propertyRead('Aspect', function(err, aspect) {
        cb(err, aspect);
    });
};
module.exports.getResWidth = function(cb) {
    omx_dbus.propertyRead('ResWidth', function(err, width) {
        cb(err, width);
    });
};
module.exports.getResHeight = function(cb) { //checked
    omx_dbus.propertyRead('ResHeight', function(err, height) {
        cb(err, height);
    });
};
module.exports.hideVideo = function(cb) { //checked
    omx_dbus.method('Action', [28], function(err) {
        return typeof cb === 'function' ? cb(err) : {};
    });
};
module.exports.unhideVideo = function(cb) { //checked
    omx_dbus.method('Action', [29], function(err) {
        return typeof cb === 'function' ? cb(err) : {};
    });
};
module.exports.getSource = function(cb) { //checked
    omx_dbus.propertyRead('GetSource', function(err, vol) {
        cb(err, vol);
    });
};
module.exports.getMinRate = function(cb) { //checked
    omx_dbus.propertyRead('MinimumRate', function(err, vol) {
        cb(err, vol);
    });
};
module.exports.getMaxRate = function(cb) { //checked
    omx_dbus.propertyRead('MaximumRate', function(err, vol) {
        cb(err, vol);
    });
};
module.exports.reduceRate = function(cb) { //checked
    omx_dbus.method('Action', [1], function(err) {
        return typeof cb === 'function' ? cb(err) : {};
    });
};
module.exports.increaceRate = function(cb) { //checked
    omx_dbus.method('Action', [2], function(err) {
        return typeof cb === 'function' ? cb(err) : {};
    });
};


//=========================Not working functions
// module.exports.quit = function(cb) { //not working
//     omx_dbus.method('Quit', function(err) {
//         return typeof cb === 'function' ? cb(err) : {};
//     });
// };
// module.exports.mute = function(cb) { //not working
//     omx_dbus.method('Mute', function(err) {
//         cb(err);
//     });
// };
// module.exports.getRate = function(cb) { //not working
//     omx_dbus.propertyRead('Rate', function(err, vol) {
//         cb(err, vol);
//     });
// };
// module.exports.play = function(cb) { //not working
//     omx_dbus.method('Play', function(err) {
//         return typeof cb === 'function' ? cb(err) : {};
//     });
// };
//=========================EN OF NOT WORKING FUNCTIONS
