export var monitorRouter = require('express').Router();

monitorRouter.get('/', function (req, res) {
    console.log('get panel:');
    res.render('monitor/index');
});
