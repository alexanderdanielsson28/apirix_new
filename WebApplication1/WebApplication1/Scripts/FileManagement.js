﻿//-------------GLOBAL VARIABLES--------------------
//-------------SETTING UP ARRAYS-----------------------------
//-------------INITIATOR--------------------------
//-------------GENERATING OF DISPLAY FILES---------------------
//-------------CLICK EVENTS---------------------------
//-------------FILE-RELATED FUNCTIONS---------------------------
//-------------SESSION-RELATED FUNCTIONS--------------------------






//------------GLOBAL VARIABLES--------------------
var html = "";
var matchArray = [];
var fileArray = [];
var dblClickedFile;
var dblClickedElement;


//dummy variables
var testsubFolder = {
    Name: "html",
    Content:[]
}
var testsub2Folder = {
    Name: "style",
    Content: []
}
var testsub3Folder = {
    Name: "scripts",
    Content: []
}
var testsub3Folder = {
    Name: "tests",
    Content: []
}
var testsub4Folder = {
    Name: "images",
    Content: []
}
var File1 = {
    Name: "markup.html",
    Content: "<div id=''></div>",
    Type: "html"
}
var File2 = {
    Name: "style.css",
    Content: "body{margin:0}",
    Type: "css"
}
var File3 = {
    Name: "script.js",
    Content: "var test = 5;",
    Type: "javascript"
}
var File4 = {
    Name: "template.js",
    Content: "var asd = 5;",
    Type: "javascript"
}
var File5 = {
    Name: "test.js",
    Content: "var asdasdasd = 15;",
    Type: "javascript"
}
var File6 = {
    Name: "functions1.js",
    Content: "var xcvxcv = 22225;",
    Type: "javascript"
}
var File7 = {
    Name: "functions2.js",
    Content: "var asdasdasdasxcxcvxcvdasdasd = 22225;",
    Type: "javascript"
}
var File8 = {
    Name: "functions3.js",
    Content: "var asdasdasdasdaxxcvxcvxcvxcvxcvsdasd = 22225;",
    Type: "javascript"
}
var File9 = {
    Name: "functions4.js",
    Content: "var asdasdasdasdasdcccccccccasd = 22225;",
    Type: "javascript"
}
//end of dummy variables


//------------END OF GLOBAL VARIABLES--------------------



//----------------------------"SETTING UP DUMMY ARRAYS"-----------------------------
testsubFolder.Content.push(File4);
testsubFolder.Content.push(testsub2Folder);
testsub2Folder.Content.push(File5);
testsub2Folder.Content.push(testsub3Folder);
testsub3Folder.Content.push(File7);
testsub3Folder.Content.push(testsub4Folder);
testsub4Folder.Content.push(File8);
testsub2Folder.Content.push(File6);
fileArray.push(File1);
fileArray.push(File2);
fileArray.push(testsubFolder);
fileArray.push(File3);

//----------------------------"END OF SETTING UP DUMMY ARRAYS"-----------------------------


//----------------------------INITIATOR--------------------------

$(document).ready(function () {

    console.log(fileArray)
    callFileGeneration();


})
//----------------------------END OF INITIATOR--------------------------


//---------------GENERATING OF DISPLAY FILES---------------------
/*
 * simply iterates the first layer of the file-object array and calls the html-generation function
 */
function callFileGeneration() {

    var folderCount = 1;
    for (var i = 0; i < fileArray.length; i++) {
        generateFilesAndFolders(fileArray, i);
    }
    $("#FileManager").append(html);
}


/*
 * This function iterates through the incoming array, in our case an array that looks like a file-hierarchy but instead of files and folders, there is objects and arrays
 * we use a css-standard that uses ol/li tags to simulate a file hierarchy, all this function does is generate html code ín that format.
 * 
 */
function generateFilesAndFolders(array, iterator) {
    if (Array.isArray(array[iterator].Content)) {
        html += "<li><label  for=" + array[iterator].Name + ">" +  array[iterator].Name + "</label> <input type='checkbox' id=" +array[iterator].Name + "></input><ol>";
        for (var j = 0; j < array[iterator].Content.length; j++) {

            generateFilesAndFolders(array[iterator].Content, j);
        }
        html += "</ol></li>"
    }
    else {
        html += ("<li class='file' id=" + array[iterator].Name + "><a href='" + array[iterator].Type + "'>" + array[iterator].Name + "</a></li>");
        matchArray.push(array[iterator]);
    }
}
//---------------END OF GENERATING OF DISPLAY FILES---------------------



//----------------CLICK EVENTS---------------------------
/*
 * this onClick function sets a marker on the selected file and gets it's type, then sets the current language to that of the selected file-object
 * it also inserts any content in the file-object into the editor
 */
$(document).on('click', ".file a", function (e) {
    e.preventDefault();

    if (!$(".ace_gutter-layer").children().hasClass("ace_error")) {

        $(".file a").removeClass("selectedFile");
        $(this).addClass("selectedFile")
        var clickedFile = GetFileFromID($(this).parent())
        console.log(clickedFile)

        editor.setValue("", 0);
        setSessionLanguage(editor.getSession(), clickedFile.Type)
        editor.setValue(clickedFile.Content, 1);
        fileText = clickedFile.Content
    }
});
/*
 * checks if you click anything but a file or the input field for changing name
 * then calls the clearnaming function
 */
$('html').click(function (e) {
    if (!$(e.target).hasClass('file') && !$(e.target).hasClass('NameChangeInput')) {
        clearNaming(dblClickedElement, dblClickedFile);
    }
});

/*
 * appends an input field for changing filename 
 */
$(document).on('dblclick', ".file a", function (e) {
    e.preventDefault();
    $(this).text("")
    if (!$(".NameChangeInput").length >= 1) {
        dblClickedElement = $(this);
        dblClickedFile = GetFileFromID($(this).parent())
        $(this).parent().append("<input type='text' class='NameChangeInput' value=" + dblClickedFile.Name + ">")
    }
})
//----------------END OF CLICK EVENTS---------------------------



//----------------FILE-RELATED FUNCTIONS---------------------------
/*function GetFileFromID(Element) {
    var id = $(Element).attr('id');
    return $.map(matchArray, function (file) {
        if (file.Name === id) {
            return file;
        }
    });
}
*/

function GetFileFromID(Element) {
    var id = $(Element).attr('id');
    console.log(id);
    var clickedFile = IterateForFile(fileArray, id)
    return clickedFile;
}
/*
 * searches for a specific file-object and returns it
 */
function IterateForFile(array, id) {
    for (var i = 0; i < array.length; i++) {
        if (Array.isArray(array[i].Content)) {
            var file = IterateForFile(array[i].Content, id)
            if (typeof file != 'undefined') {
                if (file.Name == id) {
                    return file;
                }
            }
        }
        else if (array[i].Name == id) {
            return array[i];
        }   
    }
}
/*
 * searches for a specific file-object and sets a specific property
 */
function SetFileprop(array, property, olddata, newdata) {
        for (var i = 0; i < array.length; i++) {
            if (Array.isArray(array[i].Content)) {
                SetFileprop(array[i].Content, property, olddata, newdata)
            }
            else if (array[i][property] == olddata) {
                array[i][property] = newdata;
            }
    }
}
/*
 * removes the input field for changing name and sets the name of the visual file and the property of the matching file-object
 */
function clearNaming(Element, fileObject) {
    if ( $(".NameChangeInput").length >= 1) { 
    Element.parent().attr("id", $(".NameChangeInput").val())
    Element.text($(".NameChangeInput").val())
    SetFileprop(fileArray, "Name", fileObject.Name, $(".NameChangeInput").val());
    $(".NameChangeInput").remove();
        }

}

   
/*
function lookDeeperForFile(id,iterator, array) {
        console.log(array[iterator])
        if (Array.isArray(array[iterator])) {
            for (var i = 0; i < array[iterator].length; i++) {
            //for (var j = 0; j < array[i].length; j++) {

                console.log("we are going deeper!");
                console.log(array[iterator])
                return lookDeeperForFile(id,i, array[iterator]);
            }
            //}
        }
            
        else if (array[iterator].Name == id) {
            console.log(array[iterator], id)
            console.log("Emil found!");
            return array[iterator];
        }
        console.log(array[iterator].Name)
    

}
*/

//----------------END OF FILE-RELATED FUNCTIONS---------------------------




//----------------SESSION-RELATED FUNCTIONS--------------------------------
/*
 * sets the current syntax of a session
 */
function setSessionLanguage(editSession, Language) {
    if (Language == null || editSession == null) {
        return null;
    }
    editSession.setMode("ace/mode/" + Language);
}

//----------------SESSION-RELATED FUNCTIONS--------------------------------

