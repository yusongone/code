var page={};
$(document).ready(function(){
});

function applystudio(){
    var json={};
        json.name="abcd";
    $.ajax({
        "type":"post",
        "url":"/applystudio",
        "data":json,
        "dataType":"json",
        "success":function(){
        
        }
    })
}
