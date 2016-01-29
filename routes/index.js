var express = require('express');
var router = express.Router();
var extend = require('node.extend');
var redis = require("redis");
var client = redis.createClient();
var lxc = require('../lxc')({sshBind: false/*['/usr/bin/ssh', 'virt@127.0.0.1']*/});
//lxc.startEphemeral('ubuntu_template', 'ue0', function(){console.log('cb1', arguments)}, function(){console.log('cb2', arguments)})

router.get('/start/:name', function(req, res, next){
    lxc.start(req.params.name, null, function(status, message){
       if(status){
           res.json({status: 500, name: req.params.name, message: message});
       }else{
           setTimeout(function() {
                lxc.info(req.params.name, null, function(data){
                    var domain = req.query.domain || 'vm42.us';
                    domain = req.params.name+'.'+domain;
                    client.SADD("hosts", domain, function(){});
                    
                    var ip = data.ip + ':5000';
                    client.HSET(domain, "ip", ip, redis.print);
                    client.HSET(domain, "updated", (new Date).getTime(), redis.print);
                    client.hset(domain, "include", "proxy.include");
                    res.json({status: 200, info: data});
               });
           }, 5000);

       }
    });
});

router.get('/live/:template/:name', function(req, res, next){
    lxc.startEphemeral(req.params.name, req.params.template, function (data) {
        res.json(data);
    });
});

router.get('/stop/:name', function(req, res, next){
    lxc.stop(req.params.name, null, function(data, message){
        if(data){
           res.json({status: 500, name: req.params.name, message: message});
       }else{
           res.json({status: 200});
       }
    });
});

router.get('/clone/:template/:name', function(req, res, next){
    lxc.clone(req.params.name, req.params.template, function(message){
        if( message.match(/Created container/) ){
            res.json({status: 200});
        }else{
            res.json({status: 500, message: message});
        }
    });
});

router.get('/destroy/:name', function(req, res, next){
    lxc.destroy(req.params.name, function(data, message){
        if(data){
            res.json({status: 500, message: message});
        }else{
            res.json({status: 200});
        }
    });
});

router.get('/info/:name', function(req, res, next){
    lxc.info(req.params.name, null, function(data){
        res.json(data);
    });
});

router.get('/list', function(req, res, next) {
    lxc.list(function(data){
        res.json(data); 
    });
});

module.exports = router;
// {"changed":true,"filter":false,"title":"index.js","tooltip":"/routes/index.js","value":"var express = require('express');\nvar router = express.Router();\nvar extend = require('node.extend');\nvar redis = require(\"redis\");\nvar client = redis.createClient();\nvar lxc = require('../lxc')({sshBind: ['/usr/bin/ssh', 'virt@127.0.0.1']});\n//lxc.startEphemeral('ubuntu_template', 'ue0', function(){console.log('cb1', arguments)}, function(){console.log('cb2', arguments)})\n\nrouter.get('/start/:name', function(req, res, next){\n    lxc.start(req.params.name, null, function(status, message){\n       if(status){\n           res.json({status: 500, name: req.params.name, message: message});\n       }else{\n           setTimeout(function() {\n                lxc.info(req.params.name, null, function(data){\n                    var domain = req.query.domain || 'vm42.us';\n                    domain = req.params.name+'.'+domain;\n                    client.SADD(\"hosts\", domain, function(){});\n                    \n                    var ip = data.ip + ':5000';\n                    client.HSET(domain, \"ip\", ip, redis.print);\n                    client.HSET(domain, \"updated\", (new Date).getTime(), redis.print);\n                    client.hset(domain, \"include\", \"proxy.include\");\n                    res.json({status: 200, info: data});\n               });\n           }, 5000);\n\n       }\n    });\n});\n\nrouter.get('/live/:template/:name', function(req, res, next){\n    lxc.startEphemeral(req.params.name, req.params.template, null, function (data) {\n        res.json(data);\n    });\n});\n\nrouter.get('/stop/:name', function(req, res, next){\n    lxc.stop(req.params.name, null, function(data, message){\n        if(data){\n           res.json({status: 500, name: req.params.name, message: message});\n       }else{\n           res.json({status: 200});\n       }\n    });\n});\n\nrouter.get('/clone/:template/:name', function(req, res, next){\n    lxc.clone(req.params.name, req.params.template, function(message){\n        if( message.match(/Created container/) ){\n            res.json({status: 200});\n        }else{\n            res.json({status: 500, message: message});\n        }\n    });\n});\n\nrouter.get('/destroy/:name', function(req, res, next){\n    lxc.destroy(req.params.name, null, function(data, message){\n        if(data){\n            res.json({status: 500, message: message});\n        }else{\n            res.json({status: 200});\n        }\n    });\n});\n\nrouter.get('/info/:name', function(req, res, next){\n    lxc.info(req.params.name, null, function(data){\n        res.json(data);\n    });\n});\n\nrouter.get('/list', function(req, res, next) {\n    lxc.list(function(data){\n        res.json(data); \n    });\n});\n\nmodule.exports = router;","undoManager":{"mark":90,"position":100,"stack":[[{"start":{"row":32,"column":27},"end":{"row":32,"column":30},"action":"remove","lines":["par"],"id":37},{"start":{"row":32,"column":27},"end":{"row":32,"column":33},"action":"insert","lines":["params"]}],[{"start":{"row":32,"column":33},"end":{"row":32,"column":34},"action":"insert","lines":["."],"id":38}],[{"start":{"row":32,"column":34},"end":{"row":32,"column":35},"action":"insert","lines":["n"],"id":39}],[{"start":{"row":32,"column":35},"end":{"row":32,"column":36},"action":"insert","lines":["a"],"id":40}],[{"start":{"row":32,"column":36},"end":{"row":32,"column":37},"action":"insert","lines":["m"],"id":41}],[{"start":{"row":32,"column":37},"end":{"row":32,"column":38},"action":"insert","lines":["e"],"id":42}],[{"start":{"row":32,"column":38},"end":{"row":32,"column":39},"action":"insert","lines":[","],"id":43}],[{"start":{"row":32,"column":39},"end":{"row":32,"column":40},"action":"insert","lines":[" "],"id":44}],[{"start":{"row":32,"column":40},"end":{"row":32,"column":41},"action":"insert","lines":["p"],"id":45}],[{"start":{"row":32,"column":41},"end":{"row":32,"column":42},"action":"insert","lines":["a"],"id":46}],[{"start":{"row":32,"column":42},"end":{"row":32,"column":43},"action":"insert","lines":["q"],"id":47}],[{"start":{"row":32,"column":42},"end":{"row":32,"column":43},"action":"remove","lines":["q"],"id":48}],[{"start":{"row":32,"column":41},"end":{"row":32,"column":42},"action":"remove","lines":["a"],"id":49}],[{"start":{"row":32,"column":40},"end":{"row":32,"column":41},"action":"remove","lines":["p"],"id":50}],[{"start":{"row":32,"column":40},"end":{"row":32,"column":41},"action":"insert","lines":["r"],"id":51}],[{"start":{"row":32,"column":41},"end":{"row":32,"column":42},"action":"insert","lines":["e"],"id":52}],[{"start":{"row":32,"column":42},"end":{"row":32,"column":43},"action":"insert","lines":["q"],"id":53}],[{"start":{"row":32,"column":43},"end":{"row":32,"column":44},"action":"insert","lines":[","],"id":54}],[{"start":{"row":32,"column":43},"end":{"row":32,"column":44},"action":"remove","lines":[","],"id":55}],[{"start":{"row":32,"column":43},"end":{"row":32,"column":44},"action":"insert","lines":["."],"id":56}],[{"start":{"row":32,"column":44},"end":{"row":32,"column":45},"action":"insert","lines":["p"],"id":57}],[{"start":{"row":32,"column":44},"end":{"row":32,"column":45},"action":"remove","lines":["p"],"id":58},{"start":{"row":32,"column":44},"end":{"row":32,"column":50},"action":"insert","lines":["params"]}],[{"start":{"row":32,"column":50},"end":{"row":32,"column":51},"action":"insert","lines":[","],"id":59}],[{"start":{"row":32,"column":50},"end":{"row":32,"column":51},"action":"remove","lines":[","],"id":60}],[{"start":{"row":32,"column":50},"end":{"row":32,"column":51},"action":"insert","lines":["."],"id":61}],[{"start":{"row":32,"column":51},"end":{"row":32,"column":52},"action":"insert","lines":["t"],"id":62}],[{"start":{"row":32,"column":52},"end":{"row":32,"column":53},"action":"insert","lines":["e"],"id":63}],[{"start":{"row":32,"column":51},"end":{"row":32,"column":53},"action":"remove","lines":["te"],"id":64},{"start":{"row":32,"column":51},"end":{"row":32,"column":59},"action":"insert","lines":["template"]}],[{"start":{"row":32,"column":59},"end":{"row":32,"column":60},"action":"insert","lines":[","],"id":65}],[{"start":{"row":32,"column":60},"end":{"row":32,"column":61},"action":"insert","lines":[" "],"id":66}],[{"start":{"row":32,"column":61},"end":{"row":32,"column":62},"action":"insert","lines":["n"],"id":67}],[{"start":{"row":32,"column":62},"end":{"row":32,"column":63},"action":"insert","lines":["u"],"id":68}],[{"start":{"row":32,"column":63},"end":{"row":32,"column":64},"action":"insert","lines":["k"],"id":69}],[{"start":{"row":32,"column":64},"end":{"row":32,"column":65},"action":"insert","lines":["k"],"id":70}],[{"start":{"row":32,"column":64},"end":{"row":32,"column":65},"action":"remove","lines":["k"],"id":71}],[{"start":{"row":32,"column":63},"end":{"row":32,"column":64},"action":"remove","lines":["k"],"id":72}],[{"start":{"row":32,"column":63},"end":{"row":32,"column":64},"action":"insert","lines":["l"],"id":73}],[{"start":{"row":32,"column":64},"end":{"row":32,"column":65},"action":"insert","lines":["l"],"id":74}],[{"start":{"row":32,"column":65},"end":{"row":32,"column":66},"action":"insert","lines":["m"],"id":75}],[{"start":{"row":32,"column":65},"end":{"row":32,"column":66},"action":"remove","lines":["m"],"id":76}],[{"start":{"row":32,"column":64},"end":{"row":32,"column":65},"action":"remove","lines":["l"],"id":77}],[{"start":{"row":32,"column":63},"end":{"row":32,"column":64},"action":"remove","lines":["l"],"id":78}],[{"start":{"row":32,"column":62},"end":{"row":32,"column":63},"action":"remove","lines":["u"],"id":79}],[{"start":{"row":32,"column":61},"end":{"row":32,"column":62},"action":"remove","lines":["n"],"id":80}],[{"start":{"row":32,"column":60},"end":{"row":32,"column":61},"action":"remove","lines":[" "],"id":81}],[{"start":{"row":32,"column":60},"end":{"row":32,"column":61},"action":"insert","lines":[" "],"id":82}],[{"start":{"row":32,"column":61},"end":{"row":32,"column":62},"action":"insert","lines":["n"],"id":83}],[{"start":{"row":32,"column":62},"end":{"row":32,"column":63},"action":"insert","lines":["u"],"id":84}],[{"start":{"row":32,"column":63},"end":{"row":32,"column":64},"action":"insert","lines":["l"],"id":85}],[{"start":{"row":32,"column":64},"end":{"row":32,"column":65},"action":"insert","lines":["l"],"id":86}],[{"start":{"row":32,"column":65},"end":{"row":32,"column":66},"action":"insert","lines":[","],"id":87}],[{"start":{"row":32,"column":66},"end":{"row":32,"column":67},"action":"insert","lines":[" "],"id":88}],[{"start":{"row":32,"column":67},"end":{"row":32,"column":68},"action":"insert","lines":["f"],"id":89}],[{"start":{"row":32,"column":68},"end":{"row":32,"column":69},"action":"insert","lines":["i"],"id":90}],[{"start":{"row":32,"column":68},"end":{"row":32,"column":69},"action":"remove","lines":["i"],"id":91}],[{"start":{"row":32,"column":68},"end":{"row":32,"column":69},"action":"insert","lines":["u"],"id":92}],[{"start":{"row":32,"column":69},"end":{"row":32,"column":70},"action":"insert","lines":["n"],"id":93}],[{"start":{"row":32,"column":67},"end":{"row":32,"column":70},"action":"remove","lines":["fun"],"id":94},{"start":{"row":32,"column":67},"end":{"row":34,"column":5},"action":"insert","lines":["function function_name(argument) {","        // body...","    }"]}],[{"start":{"row":32,"column":76},"end":{"row":32,"column":89},"action":"remove","lines":["function_name"],"id":95}],[{"start":{"row":32,"column":77},"end":{"row":32,"column":85},"action":"remove","lines":["argument"],"id":96},{"start":{"row":32,"column":77},"end":{"row":32,"column":78},"action":"insert","lines":["d"]}],[{"start":{"row":32,"column":78},"end":{"row":32,"column":79},"action":"insert","lines":["a"],"id":97}],[{"start":{"row":32,"column":79},"end":{"row":32,"column":80},"action":"insert","lines":["t"],"id":98}],[{"start":{"row":32,"column":80},"end":{"row":32,"column":81},"action":"insert","lines":["a"],"id":99}],[{"start":{"row":33,"column":9},"end":{"row":33,"column":18},"action":"remove","lines":["/ body..."],"id":100}],[{"start":{"row":33,"column":8},"end":{"row":33,"column":9},"action":"remove","lines":["/"],"id":101}],[{"start":{"row":33,"column":8},"end":{"row":33,"column":9},"action":"insert","lines":["r"],"id":102}],[{"start":{"row":33,"column":9},"end":{"row":33,"column":10},"action":"insert","lines":["e"],"id":103}],[{"start":{"row":33,"column":9},"end":{"row":33,"column":10},"action":"remove","lines":["e"],"id":104}],[{"start":{"row":33,"column":9},"end":{"row":33,"column":10},"action":"insert","lines":["s"],"id":105}],[{"start":{"row":33,"column":9},"end":{"row":33,"column":10},"action":"remove","lines":["s"],"id":106}],[{"start":{"row":33,"column":8},"end":{"row":33,"column":9},"action":"remove","lines":["r"],"id":107}],[{"start":{"row":33,"column":8},"end":{"row":33,"column":9},"action":"insert","lines":["r"],"id":108}],[{"start":{"row":33,"column":9},"end":{"row":33,"column":10},"action":"insert","lines":["e"],"id":109}],[{"start":{"row":33,"column":10},"end":{"row":33,"column":11},"action":"insert","lines":["s"],"id":110}],[{"start":{"row":33,"column":11},"end":{"row":33,"column":12},"action":"insert","lines":["."],"id":111}],[{"start":{"row":33,"column":12},"end":{"row":33,"column":13},"action":"insert","lines":["j"],"id":112}],[{"start":{"row":33,"column":13},"end":{"row":33,"column":14},"action":"insert","lines":["s"],"id":113}],[{"start":{"row":33,"column":12},"end":{"row":33,"column":14},"action":"remove","lines":["js"],"id":114},{"start":{"row":33,"column":12},"end":{"row":33,"column":16},"action":"insert","lines":["json"]}],[{"start":{"row":33,"column":16},"end":{"row":33,"column":18},"action":"insert","lines":["()"],"id":115}],[{"start":{"row":33,"column":17},"end":{"row":33,"column":18},"action":"insert","lines":["d"],"id":116}],[{"start":{"row":33,"column":18},"end":{"row":33,"column":19},"action":"insert","lines":["a"],"id":117}],[{"start":{"row":33,"column":19},"end":{"row":33,"column":20},"action":"insert","lines":["t"],"id":118}],[{"start":{"row":33,"column":20},"end":{"row":33,"column":21},"action":"insert","lines":["a"],"id":119}],[{"start":{"row":33,"column":22},"end":{"row":33,"column":23},"action":"insert","lines":["l"],"id":120}],[{"start":{"row":33,"column":22},"end":{"row":33,"column":23},"action":"remove","lines":["l"],"id":121}],[{"start":{"row":33,"column":22},"end":{"row":33,"column":23},"action":"insert","lines":[";"],"id":122}],[{"start":{"row":34,"column":6},"end":{"row":34,"column":7},"action":"insert","lines":[";"],"id":123}],[{"start":{"row":52,"column":53},"end":{"row":52,"column":54},"action":"insert","lines":[";"],"id":124}],[{"start":{"row":62,"column":35},"end":{"row":62,"column":36},"action":"insert","lines":[";"],"id":125}],[{"start":{"row":22,"column":67},"end":{"row":22,"column":68},"action":"insert","lines":[";"],"id":126}],[{"start":{"row":5,"column":19},"end":{"row":5,"column":20},"action":"insert","lines":["."],"id":127}],[{"start":{"row":23,"column":0},"end":{"row":23,"column":4},"action":"remove","lines":["    "],"id":128}],[{"start":{"row":23,"column":0},"end":{"row":23,"column":4},"action":"remove","lines":["    "],"id":129}],[{"start":{"row":23,"column":0},"end":{"row":23,"column":4},"action":"remove","lines":["    "],"id":130}],[{"start":{"row":23,"column":0},"end":{"row":23,"column":4},"action":"remove","lines":["    "],"id":131}],[{"start":{"row":23,"column":0},"end":{"row":23,"column":3},"action":"remove","lines":["   "],"id":132}],[{"start":{"row":23,"column":0},"end":{"row":23,"column":4},"action":"insert","lines":["    "],"id":133}],[{"start":{"row":23,"column":4},"end":{"row":23,"column":8},"action":"insert","lines":["    "],"id":134}],[{"start":{"row":23,"column":8},"end":{"row":23,"column":12},"action":"insert","lines":["    "],"id":135}],[{"start":{"row":23,"column":12},"end":{"row":23,"column":16},"action":"insert","lines":["    "],"id":136}],[{"start":{"row":23,"column":16},"end":{"row":23,"column":20},"action":"insert","lines":["    "],"id":137}]]},"ace":{"folds":[],"scrolltop":0,"scrollleft":0,"selection":{"start":{"row":23,"column":20},"end":{"row":23,"column":20},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":{"row":92,"mode":"ace/mode/javascript"}},"timestamp":1448259407910}