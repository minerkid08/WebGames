function update(){
    try{
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() { 
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                alert(xmlHttp.responseText);
        }
        let params = {
            targetAccountID: 16,
            secret: "Wmfd2893gb7"
        };
        xmlHttp.open("PUT", "http://boomlings.com/database/getGJUserInfo20.php", true);
        xmlHttp.send(params);
    }catch(e){
        alert(e);
    }
}