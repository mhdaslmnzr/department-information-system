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
  