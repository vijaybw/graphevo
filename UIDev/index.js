$(document).ready(function() {
    document.getElementById('get_file').onclick = function () {
        document.getElementById('filetoupload').click();
    };
    $('input[type=file]').change(function (e) {
        var fileNames = ""
        $('#customfileupload').text("");
        //$('#customfileupload').html($(this).val());
        var files = $("#filetoupload")[0].files;
        console.log(files);

        //alert($("#pname").val());
        for (var i = 0; i < files.length; i++) {
            //Print the selected files to upload online
            // alert(files[i].name);

            fileNames += "<br>" + files[i].name;
        }
        fileNames = fileNames.substr(4); //omit first <br>
        $('#customfileupload').append(fileNames);
        var url = 'fileupload';
        let data = "";
        /*$.ajax({
            url: url,
            method: 'POST',
            data: data,
            dataType: 'text'
        }).done(function (response) {
            console.log("in done");
            console.log(response);
            var result = response;
            $("#distanceField").html(result);
            $("#distanceField").css("white-space","pre-line"); //break down to multiple lines
        }).fail(function() {
            alert("Sorry. Server unavailable. ");
        });*/
    });

/////Test Button for Java function
    $("#btn_getSum").click(function () {
        //$("#demo").html("Hello, World!");

        let data = {
            num1: $("#num1").val(),
            num2: $("#num2").val()
        };
        console.log(data);
        var url = 'addnum';
        $.ajax({
            url: url,
            method: 'POST',
            data: data,
            dataType: 'text'
        }).done(function (response) {
            console.log(response);
            /*for (var i = 0; i<response.location.length; i++){
                console.log("\nThe Distance that it takes to travel is: " + response.location[i].distance);
                console.log("\nThe Traveling Time is: " + response.location[i].duration);
                var result = "\nThe Distance is: " + response.location[i].distance
                    + "\nThe Time is: " + response.location[i].duration*/
            $("#distanceField").html(response);
            $("#distanceField").css("white-space", "pre-line"); //break down to multiple lines
            //}
        }).fail(function () {
            alert("Sorry. Server unavailable. ");
        });
        $("#demo").html("Bye bye, World!");
    });
    $("#directory-btn").click(function () {
        //$("#demo").html("Hello, World!");

        /*let data = {
            num1: $("#num1").val(),
            num2: $("#num2").val()
        };*/
        var url = 'pArchive';
        $.ajax({
            url: url,
            method: 'POST',
            dataType: 'json'
        }).done(function (response) {
            console.log(response);
            $('#result').text("");
            console.log(response.project.length);
            for (var i = 0; i < response.project.length; i++) {
                //console.log("\nThe Distance that it takes to travel is: " + response.location[i].distance);
                //console.log("\nThe Traveling Time is: " + response.location[i].duration);
                $('<a>', {
                    title: "Click to see results of project " + response.project[i].name,
                    id: response.project[i].name,
                    text: response.project[i].name,
                    href: '/loadProject?id=' + response.project[i].name,
                    style: "font-size: 20px",
                    //click:function(){alert('test');return false;}
                }).appendTo($('#result'));
                $('<br>').appendTo($('#result'));
                //$("#distanceField").html(response);
                //$("#distanceField").css("white-space","pre-line"); //break down to multiple lines
            }
        }).fail(function () {
            alert("Sorry. Server unavailable. ");
        });
        //$("#demo").html("Bye bye, World!");


    });
    $("#submit-btn").click(function (event) {
        //alert("clicked");
        //stop submit the form, we will post it manually.

        event.preventDefault();
        //$("#fileuploadForm").submit();
        //get the action-url of the form
        var actionurl = "fileupload";
        var data = new FormData();
        jQuery.each(jQuery('#filetoupload')[0].files, function (i, file) {
            data.append('filetoupload', file);
        });
        data.append('pname', $("#pname").val());
        console.log(data);
        //do your own request an handle the results
        $.ajax({
            url: actionurl,
            cache: false,
            contentType: false,
            processData: false,
            method: 'POST',
            data: data,
            success: function (response) {
                $("#metrics").show();
                var versionArr = [];
                var nodeArr = [];
                var edgeArr = [];
                var pathArr = [];
                var avgDegArr = [];
                var clustCoeffArr = [];
                var diaArr = [];
                $.each(response.text, function (i, item) {
                    $.each(response.text[i], function (j, item2) {
                        //first line of .txt file
                        if (i == 0) {
                            var trHTML = '<tr><th>' + "Version Name"
                                + '</th><th>' + "Number of Nodes"
                                + '</th><th>' + "Number of Edges"
                                + '</th><th>' + "Number of Paths"
                                + '</th><th>' + "Average Degrees"
                                + '</th><th>' + "Clustering Coefficient"
                                + '</th><th>' + "Diameter"
                                + '</th></tr>';
                            $("#versionTable").append(trHTML);
                        }

                        //the rest of the txt file (except for last line, which is blank and will cause one "undefined" bottom row)
                        else if (i != response.text.length-1){
                            //Item is value of each array: [1.45,3,4,...]
                            versionArr.push(item2[0]); //Version Name
                            nodeArr.push(item2[1]); //Number of Nodes
                            edgeArr.push(item2[2]); //Number of Edges
                            pathArr.push(item2[3]); //Number of Paths
                            avgDegArr.push(item2[4]); //Average Degrees
                            clustCoeffArr.push(item2[5]); //Clustering Coefficient
                            diaArr.push(item2[6]); //Diameter

                            var trHTML = '<tr><td>' + item2[0]
                                + '</td><td>' + item2[1]
                                + '</td><td>' + item2[2]
                                + '</td><td>' + item2[3]
                                + '</td><td>' + item2[4]
                                + '</td><td>' + item2[5]
                                + '</td><td>' + item2[6]
                                + '</td><td><button id = \'' + item2[0] + '\' class = \'btn call-graph-btn\'>View Call Graph</button>'
                                + '</td></tr>';
                            $("#versionTable").append(trHTML);
                            //Add Item to Drop-down Menus;
                            var newFileItem = "<option>" + item2[0] + "</option> " ;
                            $("#drop-1").append(newFileItem);
                            $("#drop-2").append(newFileItem);
                        }
                        //end of inner loop
                    });

                    //end of outer loop
                });
                console.log(versionArr);
                console.log(nodeArr);
                console.log(edgeArr);
                console.log(pathArr);
                console.log(avgDegArr);
                console.log(clustCoeffArr);
                console.log(diaArr);
                $("#versionTable .btn").click(function () {
                    //alert($(this).attr('id'));
                    console.log($(this).attr('id'));
                    // Check browser support for local storage
                    if (typeof(Storage) !== "undefined") {
                        // Store
                        localStorage.setItem("verID", $(this).attr('id'));
                        localStorage.setItem("pName", $("#pname").val());
                        // Retrieve
                        document.getElementById("result").innerHTML = localStorage.getItem("verID");
                        window.open('/callgraph-popup.html', 'MyWindow', 'width=800,height=600');
                    } else {
                        document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
                    }
                    return false;

                });
                ///Show Charts///
                $("#chartRow").show();
                var ctx = document.getElementById("myChart");
                var myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: versionArr,
                        datasets: [{
                            data: nodeArr,
                            label: "Nodes",
                            borderColor: "#3e95cd",
                            fill: false
                        },
                            {
                                data: edgeArr,
                                label: "Nodes",
                                borderColor: "#B22222",
                                fill: false
                            }
                        ]
                    },
                    options: {
                        title: {
                            display: true,
                            text: 'Versions vs Number of Nodes and Edges'
                        }
                    }
                });
                var ctx = document.getElementById("myChart2");
                var myChart2 = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: versionArr,
                        datasets: [{
                            data: pathArr,
                            label: "Paths",
                            borderColor: "#3e95cd",
                            fill: false
                        }
                        ]
                    },
                    options: {
                        title: {
                            display: true,
                            text: 'Versions vs Number of Paths'
                        }
                    }
                });
                var ctx = document.getElementById("myChart3");
                var myChart3 = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: versionArr,
                        datasets: [{
                            data: avgDegArr,
                            label: "Avg Degrees",
                            borderColor: "#3e95cd",
                            fill: false
                        }
                        ]
                    },
                    options: {
                        title: {
                            display: true,
                            text: 'Versions vs Average Degrees'
                        }
                    }
                });
                var ctx = document.getElementById("myChart4");
                var myChart4 = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: versionArr,
                        datasets: [{
                            data: clustCoeffArr,
                            label: "Cluster Coeff.",
                            borderColor: "#3e95cd",
                            fill: false
                        }
                        ]
                    },
                    options: {
                        title: {
                            display: true,
                            text: 'Versions vs Clustering Coefficients'
                        }
                    }
                });
                var ctx = document.getElementById("myChart5");
                var myChart5 = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: versionArr,
                        datasets: [{
                            data: diaArr,
                            label: "Diameter",
                            borderColor: "#3e95cd",
                            fill: false
                        }
                        ]
                    },
                    options: {
                        title: {
                            display: true,
                            text: 'Versions vs Diameters'
                        }
                    }
                });
                ///Call Load results.html
                var loadURL = '/loadProject?id=' + $("#pname").val();
                $.ajax({
                    url: loadURL,
                    method: 'get',
                    dataType: 'text',
                    success: function (response) {
                        console.log(response);
                        $("#resultPage").attr("src", response);
                        $("#linebreak").show();
                        $(".wrap-iframe").show();
                        $("#resultPage").show();
                    }
                })
            },
            error: (function () {
                alert("Sorry. Server unavailable. ");
            })

        });
    });
    $("#compareBtn").click(function () {
        var diffFile = $( "#drop-1 option:selected" ).text() + $( "#drop-2 option:selected" ).text();
        console.log($( "#drop-1 option:selected" ).text());
        console.log($( "#drop-2 option:selected" ).text());
        console.log(diffFile);
        if (typeof(Storage) !== "undefined") {
            // Store project name and diff file
            localStorage.setItem("diffFile", diffFile);
            localStorage.setItem("pName", $("#pname").val());
            // Retrieve
            document.getElementById("result").innerHTML = localStorage.getItem("diffFile");

            window.open('/callgraph-comp.html', 'MyWindow', 'width=800,height=600');
        } else {
            document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
        }
    });
});
