//////////////////////////////////////////////////////////////

var adsDirPath = '/home/uslu/elements/Video_chico';
var scheduleTime = '*/1 * * * *';

//////////////////////////////////////////////////////////////

console.log('Starting');

var fs = require('fs');
var execSync = require('child_process').execSync;
var schedule = require('node-schedule');
var omxp1 = require('omxplayer-controll-ucp');
var omxp3 = require('omxplayer-controll3');
var devRes = getDevResolution();
var sleep = require('sleep');
var cmd = require('node-cmd');

//v2.5+
var rl = require('readline').createInterface(process.stdin, process.stdout);
var appdirs = ['saves', 'logs'];
var configs = {logs: true};
var colors = require('colors');
var version = '2.5.1';
// var q = require('q');
/////////////////////////////
var alpha = 1;
var volume = -9000;
var fadeSpeed = 2;
var running = { Id: '', Omx: ''};

var opts1 = {
	'audioOutput':			'local',			// 'hdmi' | 'local' | 'both'
	'blackBackground':		false,			// false | true | default: true
	'disableKeys':			true,			// false | true | default: false
	'disableOnScreenDisplay':	true,			// false | true | default: false
	'disableGhostbox':		false,			// false | true | default: false
};

if (devRes.height == 480) {
	var changeSpeed = 5;
	var vidHeight = 288;
	var winPos = '470 304 695 429';
} else if (devRes.height == 720) {
	var changeSpeed = 5;
	var vidHeight = 480;
	var winPos = '852 480 1280 720';
} else if (devRes.height == 1080) {
    var changeSpeed = 10; 
    var vidHeight = 720;
    var winPos = '1280 720 1920 1080';
}

console.log('Device Resolution:', devRes);

omxp1.open('dummy', opts1);
running.Id = '1';
running.Omx = omxp1;

var job = schedule.scheduleJob(scheduleTime, function(){ showAd(getAdFile(adsDirPath)); });

omxp3.on('finish',function(){
	cmd.run('killall bannerimg2');
	logAndPrint('pass', 'showAd: finished');
    changeVideoPos(running.Omx, changeSpeed, vidHeight, devRes.height);
    nextJob();
});

omxp1.on('aboutToFinish15s',function(){
    console.log('About to finish T minus 15 + 15 next');
	sleep.sleep(30);
	console.log('Wait 30 OK');
});

omxp1.on('aboutToFinish10s',function(){
	console.log('About to finish T minus 10 + 15 next');
	sleep.sleep(30);
	console.log('Wait 25 OK');
});

omxp1.on('aboutToFinish5s',function(){
	console.log('About to finish T minus 5 + 15 next');
	sleep.sleep(30);
	console.log('Wait 20 OK');
});

function showAd(adFile) {
//    var deferred = q.defer();
	logAndPrint('pass', 'showAd:', adFile);
	logAndPrint('pass', adFile);
	logAndPrint('pass', adsDirPath + '/');
    if (adFile == adsDirPath + '/'){
    logAndPrint('pass', 'there is no file');
    return;
//  process.exit()
    } else {logAndPrint('pass', 'there is a file') };
	cmd.run('killall banner_sleep');
	var opts3 = {
		'audioOutput':			'hdmi',			// 'hdmi' | 'local' | 'both'
		'blackBackground':		false,			// false | true | default: true
		'disableKeys':			true,			// false | true | default: false
		'disableOnScreenDisplay':	true,			// false | true | default: false
		'disableGhostbox':		false,			// false | true | default: false
		'subtitlePath':			'',			// default: ""
		'startAt':			0,			// default: 0
		'startVolume':			-6000,			// default: 1.0 (0.0 - 1.0)
		'alpha':			2,			// default: 254 (1 - 255)
		'layer':			14,			// default: 1
		'win':				winPos			//
	};
	running.Omx.getSource(function(err, source){
		if (typeof source !== 'undefined' && source.match(/\/uploads\/ads\//gi)) {
			logAndPrint('showAd: a full size ad video is been played.. skipping.');
			setTimeout(function(){ showAd(getAdFile(adsDirPath)); }, 60000);
		} else {
			if (typeof source === 'undefined') {
				console.log('showAd: there is no main video been played.. playing ad.');
				//opts3.win = '0 0 0 0';
			}
			omxp3.open(adFile, opts3);
			setTimeout(function(){ omxp3.fadeIn(3, false, function(err){}); }, 500);
			changeVideoPos(running.Omx, changeSpeed, devRes.height, vidHeight);
		}
	});
//    return deferred.promise;
}

function getAdFile(path) {
    if (typeof _lastAd === 'undefined') {_lastAd = '';}
    var files = fs.readdirSync(path)
    for (var i = 0; i < files.length; i++) {
        if (_lastAd == '') {
            _lastAd = files[i];
            break;
        } else if (_lastAd == files[i] && (i + 1) == files.length) {
            _lastAd = files[0];
            break;
        } else if (_lastAd == files[i] && (i + 1) < files.length) {
            _lastAd = files[i+1];
            break;
        } else {
        }
    }
    return path.replace(/\/$/gm,'') + '/' + _lastAd;
}

function changeVideoPos(id, speed, fromHeight, toHeight) {
	var setHeight = fromHeight;
	var setWidth = (setHeight * ratio);
	var ratio = 1.7777777777777777;
	if (toHeight < fromHeight) {
		if (fromHeight == 1080) {var space = 0; var space2 = 0; var ratio = 1.7777777777777777} else if (fromHeight == 480) {var space2 = 58; var space = 0; var ratio = 1.6369} else {var space = 0; var space2 = 0; var ratio = 1.7777777777777777}
		while (setHeight > toHeight) {
			setHeight -= speed;
			if (setHeight < toHeight) {setHeight = toHeight;}
			setWidth = (setHeight * ratio);
			id.setVideoPos(space, space2, setWidth, setHeight, function(err){
				//console.log(err);
			});
		}
	} else if (toHeight >= fromHeight) {
		while (setHeight < toHeight) {
			setHeight += speed;
			if (setHeight > toHeight) {setHeight = toHeight;}
			setWidth = (setHeight * ratio);
			id.setVideoPos(0, 0, setWidth, setHeight, function(err){
				//console.log(err);
			});
		}
	}
}

function getDevResolution() {
	var width = 1920;
	var height = 1080;
	var hz = 60.00;
	try {
		var stdout = execSync('tvservice -s').toString();
		regex = /\s*?state\s*?.*\,\s+(\d+)x(\d+)\s+\@\s+([\.\d]+)Hz\,.*/;
		result = stdout.trim().match(regex);
		if (result === null) {
			console.log('getDevResolution: regex failed. (stdout: ' + stdout +')');
		} else {
			var width = result[1];
			var height = result[2];
			var hz = result[3];
		}
	} catch (error) {
		console.log('getDevResolution: exec error: \n    ' + error.toString().trim().replace('\n', ' \n    '));
	}
	return {
		width: Math.round(width),
		height: Math.round(height),
		hertz: Math.round(hz),
		hz: Math.round(hz)
	};
}
//v 2.5

function makeMaindirs() {
    for (var i in appdirs) {
        if (!fs.existsSync(__dirname + '/' + appdirs[i])) {
            fs.mkdirSync(__dirname + '/' + appdirs[i]);
        }
    }
}

function getTime() {
    var hour = parseInt(new Date().getHours()),
        minute = parseInt(new Date().getMinutes()),
        second = parseInt(new Date().getSeconds());
    hour = hour < 10 ? '0' + hour : hour;
    minute = minute < 10 ? '0' + minute : minute;
    second = second < 10 ? '0' + second : second;
    return hour + ':' + minute + ":" + second;
}

function getDate() {
    var date = new Date();
    var dd = date.getDate(),
        mm = date.getMonth() + 1,
        yy = date.getFullYear();
    return yy + '-' + mm + '-' + dd;
}

function setLogs(bool) {
    configs.logs = bool;
    var status = configs.logs ? 'on' : 'off';
    logAndPrint('pass', 'logging turned ' + status + '.');
    saveConfigs();
}

function loadConfigs() {
    var tempConfigs = configs;
    if (fs.existsSync(__dirname + '/saves/configs.json')) {
        try {
            configs = JSON.parse(fs.readFileSync(__dirname + '/saves/configs.json'));
//            omxconfig['-o'] = configs.output;
        } catch (err) {
            fs.unlinkSync(__dirname + '/saves/configs.json');
            logAndPrint('fail', 'configs.json damaged, and deleted.');
            configs = tempConfigs;
            return false;
        }
    }
    return true;
}

function saveConfigs() {
    return !!fs.writeFileSync(__dirname + '/saves/configs.json', JSON.stringify(configs));
}

function logError(data) {
    var path = __dirname + '/logs',
        fileName = 'omxplayer_errors.log';
    if (configs.logs) fs.appendFile(path + '/' + fileName, 'command: ' + input + '\n', function(err) {
        if (err) console.log('info: '.red + '(' + getTime() + ') ' + 'failing to write log, ' + err);
    });
}

function logInput(input) {
    var path = __dirname + '/logs',
        fileName = getDate() + '.log';
    if (configs.logs) fs.appendFile(path + '/' + fileName, 'command: ' + input + '\n', function(err) {
        if (err) console.log('info: '.red + '(' + getTime() + ') ' + 'failing to write log, ' + err);
    });
}

function logAndPrint(type, output) {
    if (type === 'pass') console.log('pass: '.green + '(' + getTime() + ') ' + output);
    else if (type === 'passInfo') console.log('pass: '.cyan + '(' + getTime() + ') ' + output);
    else if (type === 'info') console.log('info: '.cyan + '(' + getTime() + ') ' + output);
    else if (type === 'warningInfo') console.log('info: '.red + '(' + getTime() + ') ' + output);
    else if (type === 'fail') console.log('fail: '.red + '(' + getTime() + ') ' + output);
    else if (type === 'err') console.log('err: '.red + '(' + getTime() + ') ' + output);
    var path = __dirname + '/logs',
        fileName = getDate() + '.log';
    if (configs.logs) fs.appendFile(path + '/' + fileName, type + ': (' + getTime() + ') ' + output + '\n', function(err) {
        if (err) console.log('info: '.red + '(' + getTime() + ') ' + 'failing to write log, ' + err);
    });
}
process.on('uncaughtException', function(err) {
    logAndPrint('warningInfo', 'Caught exception message: ' + err.message);
    logAndPrint('warningInfo', 'Caught exception at line: ' + err.lineNumber);
});
rl.on('line', function(line) {
//    var arr;
    logInput(line);
    switch (line.trim().split(' ')[0]) {
        case 'anuncio':
            abortJob();
            showAd(getAdFile(adsDirPath));
            setTimeout(function(){ setJob(); }, 60000);
            break;
        case 'help':
            printHelp();
            break;
        case 'restart':
            restartJob();
            break;
        case 'next':
            nextJob();
            break;
        case 'version':
            logAndPrint('pass', 'Llayer v' + version + ' ' + ' uxm_rev');
            break;
        default:
            logAndPrint('fail', line.trim() + ' bad command, use help for list of commands.');
            break;
    }
});

function printHelp() {
    logAndPrint('pass', 'Main L layer commands list:')
    logAndPrint('pass', '| anuncio | Triggers the next ad');
    logAndPrint('pass', '| help | Show commands.');
    logAndPrint('pass', '| restart | Clean and set a new internal Cron Job.');
    logAndPrint('pass', '| next | Show when is gona be displayed the next ad.');
    logAndPrint('pass', '| version | Show the current version of this software.');
}

function mainStart() {
//    getDevResolution();
    makeMaindirs();
    loadConfigs();
}

function restartJob() {
    console.log(job.nextInvocation());
    setTimeout(function(){ console.log(job.cancel()); }, 1000);
    setTimeout(function(){ console.log(job.nextInvocation()); }, 5000);
    setTimeout(function(){ setJob(); }, 8000);
    setTimeout(function(){ console.log(job.nextInvocation()); }, 11000);
}

function setJob() {
    job = schedule.scheduleJob(scheduleTime, function(){ showAd(getAdFile(adsDirPath)); });
}

function abortJob() {
    console.log(job.cancel()); // completly cancels all the scheulde.
//    job.cancelNext();// only cancel next interaction.
}

function nextJob() {
    console.log(job.nextInvocation());
}

mainStart();
