/**
 * Created by Vijay on 09/02/2018.
 */
var express = require('express');
var app = express();
var request = require('request');
var formidable = require('formidable');
var fs = require('fs');
//this global variable will be used to store the Java Program arguments
var args = "junit ";
var mainFolder = __dirname + "\\tmp";
app.set('view engine', 'html');
//This body-parser module parses the JSON, buffer, string and url encoded data submitted
// using HTTP POST request.
//Install body-parser using NPM as shown below.
var bodyParser = require("body-parser");
//This is used to load static files such as css, fonts, img, and js files.
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", function(req, res)
{
    res.sendFile("index.html", {"root": __dirname});
});
app.get("/loadProject", function(req, res)
{
    console.log(req.query.id);
    var projectName = req.query.id;
    //res.sendFile("arch.jpg", {"root": __dirname + "\\tmp\\" + projectName });
    res.writeHead(200, {'Content-Type': 'text/html'});
    var ResultURL =  '\\tmp\\' + projectName + '\\Results.html';
    console.log(ResultURL);
    res.write(ResultURL);
    res.end();
});
app.post('/pArchive', function (req, res) {
    const testFolder = './tmp/';
    var result={
        'project': []
    };
    fs.readdir(testFolder, (err, files) => {
        files.forEach(file => {
            //console.log(file);
            result.project.push({
                'name': file,
                'path': mainFolder + '\\' + file + '\\Results.html'
            });
        });
        res.writeHead(200, {'Content-Type': 'application/json'});
        JSONResult = JSON.stringify(result);
        //console.log(JSONResult);
        res.write(JSONResult);
        res.end();
    })


});
app.post('/fileupload', function (req, res) {
    var form = new formidable.IncomingForm(),
        files = [],
        fields = [];
    form.multiples = true;
    form.on('field', function(field, value) {
        console.log("field")
        console.log(field);
        fields.push([field, value]);
    })
    form.on('file', function(field, file) {
        console.log("field and file")
        console.log(field);
        console.log(file.name);
        files.push([field, file]);
    })
    form.on('end', function() {
        console.log('-> upload done');
        //res.writeHead(200, {'content-type': 'text/plain'});
        //res.write('received fields:\n\n '+util.inspect(fields));
        //res.write('\n\n');
        //res.end('received files:\n\n '+util.inspect(files));
    });
    //form.parse(req);
    form.parse(req, function (err, fields, files) {
        console.log(files.filetoupload[0].path);
        //This local temporary folder will be used to store the selected jar files
        var pName = fields.pname.toString();
        if (pName == ""){
            pName = "project1";
        }
        else {
            pName = pName.replace(/\s+/g, '');
        }
        var localtmpURL = mainFolder + '\\' + pName + "\\";
        console.log(localtmpURL);
        var filestoupload = files.filetoupload;
        var filenumLeft = filestoupload.length;
        args = pName + " ";
        args += filenumLeft + ' ';
        //Create a path if not exists

        if (!fs.existsSync(localtmpURL)){
            fs.mkdirSync(localtmpURL);
        }
        ///Copy files over
        for (var i = 0; i < filestoupload.length; i++)
        {

            args += localtmpURL + filestoupload[i].name + ' ';
            var oldpath = filestoupload[i].path;
            var newpath = localtmpURL + filestoupload[i].name;
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
                if(--filenumLeft == 0){
                    //res.writeHead(200, {'Content-Type': 'text/html'});
                    //res.write('All files have been uploaded!');
                    //res.write(newpath);
                    //res.end();
                }
            });
        }
        console.log(args);
        args += ' ' + pName;
        //Call Java Program to process the uploaded files
        var exec = require('child_process').exec, child;
        child = exec('java -jar JavaCallGraphVJ2.jar ' + args,
            function (error, stdout, stderr){
                console.log('stdout: ' + stdout);
                result = stdout;

                    //Reset the program arguments
                    args = "junit ";
                    // Send the response body

                    //Send JSON file of table back to Client

                    var result={
                        'text': []
                    };
                    fs.readFile(localtmpURL + "kpisForAllVersions.txt", function(err, data) {
                        if (err) throw err;
                        var array = data.toString().split("\n");
                        for (i in array) {

                            var subarray = array[i].toString().split(" ");
                            result.text.push({
                                "version": subarray
                            });
                            //console.log(array[i]);
                            for (j in subarray) {
                                console.log(subarray[j]);
                            }

                        }
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        JSONResult = JSON.stringify(result);
                        //console.log(JSONResult);
                        res.write(JSONResult);
                        res.end();
                    });
                //});
                console.log('stderr: ' + stderr);
                if(error !== null){
                    console.log('exec error: ' + error);
                }

            });

    });

});
app.post('/test', function(req, res, next) {
    //res.json({ message: 'Hello World' });
    var result={
        'text': []
    };
    fs.readFile('kpisForAllVersions.txt', function(err, data) {
        if(err) throw err;
        var array = data.toString().split("\n");
        for(i in array) {

            var subarray = array[i].toString().split(" ");
            result.text.push({
                "version": subarray
            });
            //console.log(array[i]);
            for (j in subarray){
                console.log(subarray[j]);
            }

        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        JSONResult = JSON.stringify(result);
        //console.log(JSONResult);
        res.write(JSONResult);
        res.end();
        //done();
    });
});
var port = process.env.PORT || 8080;
var server = app.listen(port, function () {
    // var host = server.address().address
    var port = server.address().port;

    console.log("Graphevo App is currently listening at http://127.0.0.1:%s",port)
});