     let Logged_In = false;
     
     function site_change(end) {
            const xhr= new XMLHttpRequest();
            const uri= "http://localhost:8188/UniProxService.svc/" + end;
            xhr.open("GET", uri, true);
            xhr.onload= () => {
                if (end == 'courses'){
                    hide("none", "block", "none", "none", "none", "none");
                    const json_array = JSON.parse(xhr.responseText);
                    courses_display(json_array.data);   
                }
                else if (end == 'people'){
                    hide("none", "block", "none", "none", "none", "none");
                    const json_array = JSON.parse(xhr.responseText);
                    people_display(json_array.list);    
                }
                else if (end == 'itemlist'){
                    hide("none", "block", "none", "none", "block", "none");
                    const xmlDoc = xhr.responseXML.getElementsByTagName("item");
                    itemlist_get(xmlDoc);   
                }
                else if (end == 'newsfeed'){
                    hide("none", "block", "none", "none", "none", "none");
                    const xmlDoc = xhr.responseXML.getElementsByTagName("item");
                    newsfeed(xmlDoc);    
                }
                else if (end == 'noticesfeed'){
                    hide("none", "block", "none", "none", "none", "none");
                    const xmlDoc = xhr.responseXML.getElementsByTagName("item");
                    noticesfeed(xmlDoc);   
                }
                else if (end == 'htmlcomments'){
                    hide("block", "none", "block", "none", "none", "none");
                    document.getElementById("guestbook").innerHTML = xhr.responseText;
                    document.getElementById("Input").value = "";
                    document.getElementById("Name").value = "";
                    }                   
        };  xhr.send(null);
    }
        function home () {
            hide("none", "block", "none", "none", "none", "none");
            document.getElementById("showTab").innerHTML = "  Computer Science is the study of computers and computer concepts: their systems, design, development and use.";
        };
        function courses_display(json_array) {
            let tableContent = "<table><tr class='orderTitle'><td>Subject</td><td>Title</td><td>Description</td></tr>\n";
            let odd = true;
            const addRecord = (course) => {
                tableContent += odd ? "<tr class='orderOdd'>" : "<tr class='orderEven'>";
                odd = !odd;
                tableContent += "<td><a onclick = 'schedule(" + course.catalogNbr + ")' href = '#'>" + course.subject  + course.catalogNbr + "</a></td><td>" + course.title + "</td><td>" + course.description + "</td></tr>\n";
                }
            json_array.sort(comparator);
            json_array.forEach(addRecord);
            document.getElementById("showTab").innerHTML = tableContent;
                }
        
        function people_display(json_array) {
            let tableContent = "<table><tr class='orderTitle'><td> </td><td>Name</td><td>Job Title</td><td>Contact Info</td><td>Phone</td><td>Email</td></tr>\n";
            let odd = true;
            const uni_num = "+64 9 373 7999"
            const addRecord = (person) => {
                tableContent += odd ? "<tr class='orderOdd'>" : "<tr class='orderEven'>";
                odd = !odd;
                let id_image = person.imageId
                if (id_image == undefined){
                    id_image = "144000"}
                let uni_num = person.extn
                if (uni_num == undefined){
                    uni_num = "+64 9 373 7999";}
                else {
                    uni_num = "+64 9 373 7999" + person.extn
                }
                tableContent += "<tr><td><image id= 'image_dets' src = https://unidirectory.auckland.ac.nz/people/imageraw/" + person.profileUrl[1] + 
                    "/" + id_image + "/small alt='No ID photo to display'></td><td>" + person.names + "</td><td>" + person.jobtitles + "</td><td><a href = 'https://unidirectory.auckland.ac.nz/people/vcard/" + person.profileUrl[1] + 
                    "'>&#128199;</a></td><td><a href= 'tel:" + uni_num + "'>&#128242;</a><td><a href = 'mailto:" + person.emailAddresses[0] + "'>&#128231;</a></td></tr>\n";}
            json_array.forEach(addRecord);
            document.getElementById("showTab").innerHTML = tableContent;
                }
        
        function schedule(end) {
                    const xhr = new XMLHttpRequest();
                    const uri = "http://localhost:8188/UniProxService.svc/course?c=" + end;
                    xhr.open("GET", uri, true);
                    xhr.onload= () => {
                        hide("none", "block", "none", "none");
                        const json_array = JSON.parse(xhr.responseText);
                        schedule_display(json_array.data);
                    }; xhr.send(null);
                } 
        
        function schedule_display(json_array){
                    let tableContent = "<table><tr class='orderTitle'><td>Type</td><td>Start Date</td><td>End Date</td><td>Start Time</td><td>End Time</td><td>Location</td><td>Day</td></tr>\n";
                    const addRecord = (person) => {
                        const addMore = (details) => {
                            tableContent += "<tr><td>" + person.component + "</td><td>" + person.startDate + "</td><td>" + details.endDate + "</td><td>" + details.startTime + "</td><td>" + details.endTime + "</td><td>" + details.location + "</td><td>" + details.daysOfWeek + "</td></tr>\n";}
                            person.meetingPatterns.forEach(addMore);}
                        json_array.forEach(addRecord);
                    document.getElementById("showTab").innerHTML = tableContent;
                }

        function newsfeed (xmlDoc){
            let tableContent = "<table><tr class='orderTitle'><td>Title</td><td>Description</td></tr>\n";
            Array.from(xmlDoc).forEach(function(course) {
                document.getElementById("showTab").innerHTML = course;
                tableContent += "<tr><td><a id='news' href =" + course.getElementsByTagName('link')[0].innerHTML + ">" + course.getElementsByTagName('title')[0].innerHTML + "</a></td><td>" + course.getElementsByTagName('description')[0].innerHTML + "</td></tr>\n";})
            tableContent += "</table>"
            document.getElementById("showTab").innerHTML = tableContent;};

        function noticesfeed (xmlDoc){
            let tableContent = "<table><tr class='orderTitle'><td>Title</td><td>Description</td><td>Date Posted</td></tr>\n";
            Array.from(xmlDoc).forEach(function(course) {
                document.getElementById("showTab").innerHTML = course;
                tableContent += "<tr><td>" + course.getElementsByTagName('title')[0].innerHTML + "</td><td>" + course.getElementsByTagName('description')[0].innerHTML + "</td><td>" + course.getElementsByTagName('pubDate')[0].innerHTML + "</td></tr>\n";})
            tableContent += "</table>";
            document.getElementById("showTab").innerHTML = tableContent;};

        function guestbook_write () {
                let comment = document.getElementById("Input").value;
                let name = document.getElementById("Name").value;
                const xhr = new XMLHttpRequest();
                const uri = "http://localhost:8188/UniProxService.svc/comment?name=" + name;
                xhr.open("POST", uri, true);
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhr.onload = function () {
                    site_change('htmlcomments');
                    }
                xhr.send(JSON.stringify(comment));
                    }

        function itemlist_get(){
            const xhr = new XMLHttpRequest();
                    const uri = "http://localhost:8188/UniProxService.svc/itemlist";
                    xhr.open("GET", uri, true);
                    xhr.setRequestHeader("Accept", "application/json");
                    xhr.onload= () => {
                        hide("none", "block", "none", "none");
                        const json_array = JSON.parse(xhr.responseText);
                        itemlist_display(json_array);
                    }; xhr.send(null);
                } 
        
        function itemlist_display(xmlDoc){
            document.getElementById("search").innerHTML
            let tableContent = "<table><tr class='orderTitle'><td>Software</td><td>Title</td><td>Version</td><td>Download</td></tr>\n";
            Array.from(xmlDoc).forEach(function(item) {
                document.getElementById("showTab").innerHTML = item;
                download_button = "Download('"+ item.ItemId + "')";
                tableContent += "<tr><td><img src =" + "http://localhost:8188/UniProxService.svc/img?id=" + item.ItemId + "></img></td><td>'" + item.Title + "'</td><td>" + item.Version + "</td><td><a onclick =" + download_button + " href = '#'>Download</td></tr>\n";})
            document.getElementById("showTab").innerHTML = tableContent;};

        function registerUser(){
            var name = document.getElementById("r_username").value;
            var password = document.getElementById("r_password").value;
            var address = document.getElementById("address").value;
            var registerDict = {"Address":address, "Name":name, "Password":password}
            var jsonFormat = JSON.stringify(registerDict);
            var uri = "http://localhost:8188/UniProxService.svc/register"
            var xhr = new XMLHttpRequest();
            xhr.open("POST", uri, true);
            xhr.setRequestHeader("Content-Type", "application/JSON");
            xhr.onload = function(){
                var json_array = JSON.parse(xhr.responseText);
                document.getElementById("register").innerHTML = json_array;
          }; xhr.send(jsonFormat);
        }

        function register(){
            hide("none", "none", "none", "block", "none", "none");
        }
        
        function LoggingIn(){
            var username = document.getElementById("username").value;
            var password = document.getElementById("password").value;
            if (username.length > 0 && password.length > 0){
                const xhr = new XMLHttpRequest();
                const uri = "http://localhost:8189/Service.svc/user";
                xhr.open("GET", uri, true, username, password);
                xhr.setRequestHeader("Accept", "application/json");
                xhr.withCredentials = true;
                xhr.onload = () => {
                    if (xhr.statusText == "OK"){
                        alert("Log in successful!");
                        Logged_In = true;
                        log_status_change();
                        site_change("itemlist");
                    }else{
                        alert("Incorrect Username or Password");
                    }
                
                }; 
                xhr.send(null);
            }
        }

        function log_out () {
            if (Logged_In) {
                Logged_In = false;
                alert("logged out");
                log_status_change();
            }
            else {
                alert("Already logged out");
            }
        }

        function log_in() {
            hide("none", "none", "none", "none", "none", "block");
        }

        function Download(ItemId){
            if (Logged_In) {
                const xhr = new XMLHttpRequest();
                const uri = "http://localhost:8189/Service.svc/dl?id=" + ItemId;
                xhr.open("GET", uri, true);
                xhr.setRequestHeader("Accept", "application/json;charset=UTF-8")
                xhr.onload= () => {
                    alert(xhr.responseText);
                }; 
                xhr.send(null);
                } 
            else {
                log_in();
            }
        }

        function SearchItem(){
            var input = document.getElementById("searchInput").value;
            const xhr = new XMLHttpRequest();
            const uri = "http://localhost:8188/UniProxService.svc/search?term=" + input;
            xhr.open("GET", uri, true);
            xhr.setRequestHeader("Accept", "application/json");
            xhr.onload= () => {
                const json_array = JSON.parse(xhr.responseText);
                search_display(json_array);
            }; xhr.send(null);
        }
        
        function search_display(xmlDoc){
            document.getElementById("searchInput").innerHTML
            let tableContent = "<table><tr class='orderTitle'><td>Software</td><td>Title</td><td>Version</td><td>Download</td></tr>\n";
            Array.from(xmlDoc).forEach(function(item) {
                document.getElementById("showTab").innerHTML = item;
                download_button = "Download('"+ item.ItemId + "')";
                tableContent += "<tr><td><img src =" + "http://localhost:8188/UniProxService.svc/img?id=" + item.ItemId + "></img></td><td>'" + item.Title + "'</td><td>" + item.Version + "</td><td><a onclick =" + download_button + " href = '#'>Download</td></tr>\n";})
            document.getElementById("showTab").innerHTML = tableContent;};
        
        
        function hide(a, b, c, d, e, f) {
                var x = document.getElementById("guestbook");
                x.style.display = a;
                var y = document.getElementById("showTab");
                y.style.display = b;
                var z = document.getElementById("comment");
                z.style.display = c;
                var z = document.getElementById("register");
                z.style.display = d;
                var z = document.getElementById("search");
                z.style.display = e;
                var z = document.getElementById("LogIn");
                z.style.display = f;
            }
        
        function comparator (a, b){
                if (a.catalogNbr < b.catalogNbr) 
                    return -1;
                if (a.catalogNbr > b.catalogNbr) 
                    return 1;
                return 0;
        }

        function log_status_change() {
            var elem = document.getElementById("log_in_status").value;
            if (elem =="You are logged out" && Logged_In==true) {
                document.getElementById("log_in_status").value = "LoggedIn: Click to Log Out";}
            else {
                document.getElementById("log_in_status").value = "You are logged out";}
        }

        
        

        
        