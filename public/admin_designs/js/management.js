//date and time
const dateDiv = document.getElementById("clock");

function myDateFunction() {
  const now = new Date();
  const nowStr = now.toLocaleString("en-US");
  dateDiv.innerHTML = nowStr;
}
setInterval(myDateFunction, 1);

//logout-popup

function togglePopup() {
  document.getElementById("popup-1").classList.toggle("active");
  setTimeout("Redirect()", 5000);
}

function Redirect() {
  window.location = "logout.html";
}

//buttons on sidebarmanagement

function mainshow1() {
  document.getElementById("main1").style.display = "inline";
  document.getElementById("main2").style.display = "none";
  document.getElementById("main3").style.display = "none";
  document.getElementById("main4").style.display = "none";
  document.getElementById("main5").style.display = "none";
}
function mainshow2() {
  document.getElementById("main1").style.display = "none";
  document.getElementById("main2").style.display = "inline";
  document.getElementById("main3").style.display = "none";
  document.getElementById("main4").style.display = "none";
  document.getElementById("main5").style.display = "none";
}
function mainshow3() {
  document.getElementById("main1").style.display = "none";
  document.getElementById("main2").style.display = "none";
  document.getElementById("main3").style.display = "inline";
  document.getElementById("main4").style.display = "none";
  document.getElementById("main5").style.display = "none";
}

function mainshow4() {
  document.getElementById("main1").style.display = "none";
  document.getElementById("main2").style.display = "none";
  document.getElementById("main3").style.display = "none";
  document.getElementById("main4").style.display = "inline";
  document.getElementById("main5").style.display = "none";
}

function mainshow5() {
  document.getElementById("main1").style.display = "none";
  document.getElementById("main2").style.display = "none";
  document.getElementById("main3").style.display = "none";
  document.getElementById("main4").style.display = "none";
  document.getElementById("main5").style.display = "inline";
}


//selectdropdown

var yoj = [2018,2019]

var obj = {
  2015: {"I" : yoj, "II":yoj, "III" :yoj, "IV":yoj, "V":yoj, "VI":yoj, "VII":yoj, "VIII":yoj},
  2019: {"I" : yoj, "II":yoj, "III" :yoj, "IV":yoj, "V":yoj, "VI":yoj, "VII":yoj, "VIII":yoj}
};

var libraryObject = {
  "Civil Engineering": obj,
  "Computer Science & Engineering": obj,
  "Electronics & Communication Engineering": obj,
  "Electrical & Electronics Engineering": obj,
  "Information Technology": obj,
  "Mechanical Engineering": obj,
  "Safety & Fire Engineering": obj,
};

window.onload = function () {
  var branchSel = document.getElementById("branch");
  var schemeSel = document.getElementById("scheme");
  var semesterSel = document.getElementById("semester");
  var yojSel  = document.getElementById("yoj");

  for (var x in libraryObject) {
    branchSel.options[branchSel.options.length] = new Option(x, x);
  }

  branchSel.onchange = function () {
    $("#showFirst").empty();
    $('#showSecond').empty()
    $('#intbtn').hide();
    
    semesterSel.length = 1;
    schemeSel.length = 1;
    for (var y in libraryObject[this.value]) {
      schemeSel.options[schemeSel.options.length] = new Option(y, y);
    }
  };

  schemeSel.onchange = function () {
    $("#showFirst").empty();
    $('#showSecond').empty()
    $('#intbtn').hide();
    semesterSel.length = 1;
    for (var z in libraryObject[branchSel.value][this.value]) { 
      semesterSel.options[semesterSel.options.length] = new Option(z, z);
    }
  };

  semesterSel.onchange = function () {
    $("#showFirst").empty();
    $('#showSecond').empty()
    $('#intbtn').hide();
    yojSel.length = 1;
    var w = libraryObject[branchSel.value][schemeSel.value][this.value];
    for (var i = 0; i < w.length; i++) {
      yojSel.options[yojSel.options.length] = new Option(w[i], w[i]);
    }
  };






  
    var branchSela = document.getElementById("brancha");
    var schemeSela = document.getElementById("schemea");
    var semesterSela = document.getElementById("semestera");
    var yojSela  = document.getElementById("yoja");
  
    for (var x in libraryObject) {
      branchSela.options[branchSela.options.length] = new Option(x, x);
    }
  
    branchSela.onchange = function () {
      $("#showAttendance").empty();
      $('#attbtn').hide()
      semesterSela.length = 1;
      schemeSela.length = 1;
      for (var y in libraryObject[this.value]) {
        schemeSela.options[schemeSela.options.length] = new Option(y, y);
      }
    };
  
    schemeSela.onchange = function () {
      $("#showAttendance").empty();
      $('#attbtn').hide()
      semesterSela.length = 1;
      for (var z in libraryObject[branchSela.value][this.value]) { 
        semesterSela.options[semesterSela.options.length] = new Option(z, z);
      }
    };
  
    semesterSela.onchange = function () {
      $("#showAttendance").empty();
      $('#attbtn').hide()
      yojSela.length = 1;
      var w = libraryObject[branchSela.value][schemeSela.value][this.value];
      for (var i = 0; i < w.length; i++) {
        yojSela.options[yojSela.options.length] = new Option(w[i], w[i]);
      }
    };

  

    var branchSelb = document.getElementById("branchb");
    var schemeSelb = document.getElementById("schemeb");
    var semesterSelb = document.getElementById("semesterb");
    var yojSelb  = document.getElementById("yojb");
  
    for (var x in libraryObject) {
      branchSelb.options[branchSelb.options.length] = new Option(x, x);
    }
  
    branchSelb.onchange = function () {
      $("#showData").empty();
      $('#sembtn').hide();
      semesterSelb.length = 1;
      schemeSelb.length = 1;
      yojSelb.length = 1;
      for (var y in libraryObject[this.value]) {
        schemeSelb.options[schemeSelb.options.length] = new Option(y, y);
      }
    };
  
    schemeSelb.onchange = function () {
      $("#showData").empty();
      $('#sembtn').hide();
      semesterSelb.length = 1;
      yojSelb.length = 1;
      for (var z in libraryObject[branchSelb.value][this.value]) { 
        semesterSelb.options[semesterSelb.options.length] = new Option(z, z);
      }
    };
  
    semesterSelb.onchange = function () {
      $("#showData").empty();
      $('#sembtn').hide();
      yojSelb.length = 1;
      var w = libraryObject[branchSelb.value][schemeSelb.value][this.value];
      for (var i = 0; i < w.length; i++) {
        yojSelb.options[yojSelb.options.length] = new Option(w[i], w[i]);
      }
    };


    var branchSelc = document.getElementById("branchc")
    for (var x in libraryObject) {
      branchSelc.options[branchSelc.options.length] = new Option(x, x);
    }
    branchSelc.onchange = function() {
      $('#showInternal').empty()
    }

    var branchSeld = document.getElementById("branchd")
    for (var x in libraryObject) {
      branchSeld.options[branchSeld.options.length] = new Option(x, x);
    }
};







//<-----------------Jishnu------------------------>


function toTable(response ,id){
  var col =[];
  for(var i=0;i<response.length;i++){
    for(var key in response[i]){
      if(col.indexOf(key) === -1){
        col.push(key);
      }
    }
  }

  var table = document.createElement("table");
  var tr = table.insertRow(-1); 
  for (var i = 0; i < col.length; i++) {
    var th = document.createElement("th"); 
    th.innerHTML = col[i];
    tr.appendChild(th);
  }

  for (var i = 0; i < response.length; i++) {
    tr = table.insertRow(-1);
    for (var j = 0; j < col.length; j++) {
      var tabCell = tr.insertCell(-1);
      tabCell.innerHTML = response[i][col[j]];
    }
  }
  var divShowData = document.getElementById(id);
  divShowData.innerHTML = "";
  let table_id = divShowData.appendChild(table);
  return table_id;
}


function noEntry(id){
  $(id).append(
    `<div class="not-found">Entry not found</div>`
  )
}


function Export(id) {
  $(id).table2excel({
    filename: "Table.xls"
  });
}


