

function student(){
    var oldPass = document.getElementById("old").value
    var newPass = document.getElementById("new").value
    var conPass = document.getElementById("confirm").value

    if(newPass === conPass){
        $.ajax({
            url:'/settings/changeStudent',
            type:'post',
            data:{oldPass:oldPass,newPass:newPass},
            success: function(response){
                
                window.location.href = response.redirect
            }
        })
    }
    else{
        console.log("wrong")
        noEntry('#error')
    }
}


function faculty(){
    var oldPass = document.getElementById("old").value
    var newPass = document.getElementById("new").value
    var conPass = document.getElementById("confirm").value

    if(newPass === conPass){
        $.ajax({
            url:'/settingf/changeFaculty',
            type:'post',
            data:{oldPass:oldPass,newPass:newPass},
            success: function(response){
                if(response === ""){
                    noEntry('#error')
                } else{
                    window.location.href = response.redirect
                }
            }
        })
    }
    else{
        console.log("wrong")
        noEntry('#error')
    }
}


function noEntry(id,message){
    $(id).append(
      `<div class="not-found">Password</div>`
    )
  }