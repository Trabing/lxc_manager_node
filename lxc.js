'use strict';
var exec = require('child_process').exec;

function sysExec(command, callback){
	command = 'unset XDG_SESSION_ID XDG_RUNTIME_DIR; cgm movepid all virt $$; ' + command;

	return exec(command, (function(callback){
		return function(err,data,stderr){
			if(callback){
				return callback(data, err, stderr);
			}
		}
	})(callback));
};

var lxc = {
	create: function(name, template, config, callback){
		return sysExec('lxc-create -n '+name+' -t '+template, callback);
	},

	clone: function(name, base_name, callback){
		return sysExec('lxc-clone -o '+base_name+ ' -n '+name +' -B overlayfs -s', callback);
	},

	destroy: function(name, callback){
		return sysExec('lxc-destroy -n '+ name, function(data){
			callback(!data.match(/Destroyed container/));
		});
	},

	start: function(name, callback){
		var cmd = 'lxc-start --name '+name+' --daemon';
		return sysExec(cmd, callback);
	},

	startEphemeral: function(name, base_name, callback){
		var command = 'lxc-start-ephemeral -o '+base_name+ ' -n '+name +' --union-type overlayfs -d';
		return sysExec(command, function(data){
			console.log('startEphemeral', arguments);
			if(data.match("doesn't exist.")){
				return callback({status: 500, error: "doesn't exist."});
			}
			if(data.match("already exists.")){
				return callback({status: 500, error: "already exists"});
			}
			if(data.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)){
				return callback({status: 200, state:'RUNNING', ip: data.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)[0]});
			}

			callback({'?': '?', data: data, name: name, base_name: base_name});
		});
	},

	stop: function(name, callback){
		return sysExec('lxc-stop -n '+ name, callback);
	},

	freeze: function(name, callback){
		return sysExec('lxc-freeze -n '+name, callback);
	},

	unfreeze: function(name, callback){
		return sysExec('lxc-unfreeze -n '+name, callback);
	},

	info: function(name, callback){
		return sysExec('lxc-info -n '+name, function(data){
			console.log('info', arguments);
			if(data.match("doesn't exist")){
				return callback({state: 'NULL'});
			}

			var info = {};
			data = data.replace(/\suse/ig, '').replace(/\sbytes/ig, '').split("\n").slice(0,-1);
			for(var i in data){
				var temp = data[i].split(/\:\s+/);
				info[temp[0].toLowerCase().trim()] = temp[1].trim();
			}
			callback(info);
		});
	},

	list: function(callback){
		sysExec('lxc-ls --fancy', function(data){
			var output = data.split("\n");
			var keys = output.splice(0,1)[0].split(/\s+/).slice(0,-1);
			var info = [];

			keys = keys.map(function(v){return v.toLowerCase()});
			output = output.slice(0).splice(1).slice(0,-1);

			for(var i in output){   

				var aIn = output[i].split(/\s+/).slice(0,-1);
				var mapOut = {};
				aIn.map(function(value,idx){
					mapOut[keys[idx]] = value;
				});
				info.push(mapOut);
				
			}
			var args = [info].concat(arguments.splice(1));
			callback(args);
		});
	}
};

module.exports = lxc;
