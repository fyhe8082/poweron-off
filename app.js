
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , CronJob = require('cron').CronJob
  , http = require('http')
  , conn = require("./models/conn")
  , SSH = require('simple-ssh')
  , partials = require("express-partials")
    , xAdmin = require('express-admin')
  , path = require('path');

var config = {
    dpath: './node_modules/express-admin/',
    config: require('./adminConfig/config.json'),
    settings: require('./adminConfig/settings.json'),
    custom: require('./adminConfig/custom.json'),
    users: require('./adminConfig/users.json')
};
xAdmin.init(config, function (err, admin) {

    var job = new CronJob('00 44 20 * * 1-6', function () {
        conn.query("select * from machine  ", function (err, rows, fields) {
            var ssh;
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                if (row.machine_poweroff == 1) {
                    ssh = new SSH({
                        host: row.machine_ip,
                        user: row.machine_user,
                        pass: row.machine_pwd,
                        port: row.ssh_port
                    });
                    ssh.exec('sudo poweroff', {pty: true, out: console.log}).start();
                }
            }
        }, function () {
            console.log("job done\n");
        });
    });
//job.start();

    var app = express();
    var bodyParser = require('body-parser');
    var parseUrlencoded = bodyParser.urlencoded({extended: false});
// all environments
    app.set('port', process.env.PORT || 8000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');

    app.use('/admin', admin);

    app.use(partials());
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(parseUrlencoded);
// development only
    if ('development' == app.get('env')) {
        app.use(express.errorHandler());
    }

    app.get('/', routes.index);
    app.get("/getStatus", routes.getStatus);
    app.get('/query', routes.query);
    app.post('/wakeonlan', routes.wakeonlan);
    app.post('/poweroff', routes.poweroff);

    http.createServer(app).listen(app.get('port'), function () {
        console.log('Express server listening on port ' + app.get('port'));
    });

});
