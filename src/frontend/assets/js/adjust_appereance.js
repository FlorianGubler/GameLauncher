var headerColor;
var backgroundColor;
var BtnColor;

window.api.send("toMain", JSON.stringify({type: 'DataMgr', cmd: 'getAppereance', attributes: ''}));
window.api.receive("fromMainB", (args) => {
    if(args.type == "replyAppereance"){
        var styles = JSON.parse(args.attributes);
        styles.forEach(styling => {
            switch(styling.name){
                case "BtnColor": 
                    var buttons = document.getElementsByTagName('button'); 
                    for (let i = 0; i < buttons.length; i++) {
                        buttons[i].style.backgroundColor = styling.value;
                    }
                    BtnColor = styling.value;
                    if(document.getElementById("appe-button-color") != undefined){
                        document.getElementById("appe-button-color").value = BtnColor;
                    }

                    //Also anchor tags
                    var anchors = document.getElementsByTagName('a'); 
                    for (let i = 0; i < anchors.length; i++) {
                        anchors[i].style.color = styling.value;
                    }
                break;
                case "HeaderColor": 
                    if(document.getElementById("header-bar") != undefined){
                        document.getElementById("header-bar").style.backgroundColor = styling.value;
                    }
                    headerColor = styling.value;
                    if(document.getElementById("appe-header-color") != undefined){
                        document.getElementById("appe-header-color").value = headerColor;
                    }
                break;
                case "backgroundColor": 
                    if(document.body.id != "index-body"){
                        document.body.style.backgroundColor = styling.value;
                    }
                    backgroundColor = styling.value;
                    if(document.getElementById("appe-background-color") != undefined){
                        document.getElementById("appe-background-color").value = backgroundColor;
                    }
                break;
            }
        });
    }
});