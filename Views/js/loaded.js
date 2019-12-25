function onLoad()
{
    let lbl = document.getElementById("nameLbl");
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "getmyemail", true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = () =>
    {
        if (xmlhttp.readyState == 4)
        {
            if(xmlhttp.status == 200)
                lbl.innerHTML = xmlhttp.responseText;
            else if(xmlhttp.status == 201)
                eval(xmlhttp.responseText);
        }
    }
}

onLoad();