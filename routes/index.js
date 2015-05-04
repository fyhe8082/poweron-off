//query.js
var conn = require("../models/conn")
  , sh = require("shelljs")
  , SSH = require('simple-ssh');
/* GET home page. */
exports.index =  function(req, res) {
    res.render('index',{
        title:'Express'
    });
};
exports.query = function(req, res) {
	conn.query("select * from machine order by machine_ip",function(err, rows, fields){
		console.log(rows);
        //var data = {};
        //data["success"] = true;
        //data["totalRows"] = rows.length;
        //data["curPage"] = 1;
        //data["data"] = rows;
		//res.JSON(data);
        res.send(rows);
		res.end();
	});
};
	
var update = function(req, res){
    var idList = JSON.parse(req.body.data); 
    console.log(idList.length);
    conn.query("update machine set machine_poweroff = '0'");
    for (var i=0;i<idList.length;i++){
        console.log(idList[i]);
        conn.query("update machine set machine_poweroff = '1' where machine_id = "+idList[i] + "");
    };
};
exports.update = update;

exports.poweroff = function(req, res){
    update(req, res);

    conn.query("select * from machine  ", function(err, rows, fields){
    var ssh;
    for(var i=0;i<rows.length;i++)
    {   
        (function(i){
        var row=rows[i];
        if (row.machine_poweroff == 1){
            ssh = new SSH({host:row.machine_ip,user:row.machine_user, pass:row.machine_pwd, port:row.ssh_port});
            ssh.exec('sudo poweroff',{pty:true,out:console.log}).start({
                success:function(){console.log(row.machine_ip+" success");}
                ,fail:function(){console.log(row.machine_ip+" fail");}
            });
        }}(i));
    }
  },function(){console.log("job done\n");});
};

exports.wakeonlan = function(req, res){
    var idList = JSON.parse(req.body.data); 
    console.log(idList.length);
    if (idList.length == 0){return 0;}
    str = "(";
    for (var i=0;i<idList.length;i++){
        console.log(idList[i]);
        str = str + idList[i] + ",";
    };
    str = str.slice(0,-1) + ")";
    console.log(str);
    conn.query("select * from  machine where machine_id in"+str,function(err,rows,fields){
    var row;
    var shCommand;
    for (var k=0;k<rows.length;k++)
    {
        (function(k){
           row = rows[k];
           shCommand = "wakeonlan  " + row.machine_mac;
           sh.exec(shCommand,function(code,output){
                console.log(row.machine_ip + " exit code: ",code);
           }); 
        }(k));
    }
    });
};

exports.getStatus = function(req, res){
    var ping = require("ping");
    
    conn.query("select * from machine  ", function(err, rows, fields){
    var idReachable = [];
    for(var i=0;i<rows.length;i++)
    {   
        (function(i){
            var row = rows[i];
            ping.sys.probe(row.machine_ip,function(msg){
                if(msg){
                    idReachable.push(row.machine_id);
                }
                if(i==rows.length-1){
                  var data = JSON.stringify(idReachable);
                  res.json(data);
                }
            });
        }(i));
    }
  });
};
