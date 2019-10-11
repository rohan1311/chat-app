var socket = io()
var user
var typing=false
var timeout=undefined

function setUserName(){
    socket.emit('setUserName', $('#unit').val())
}

socket.on('userExists', (data)=>{
    //console.log('html')
    $('.error').text(`${data}`)
})

$(document).ready(function(){
    socket.on('userSet', (data)=>{
    user=data.username
    console.log(user)
    $("#area").html("<span class=\"input-group-text\">Message</span>")
    $("#unit").val("")
    $("#unit").attr("placeholder", "")
    //textarea class=\"form-control\" rows=\"5\" cols=\"50\" id=\"message\" aria-label=\"With textarea\"></textarea>")
    $("#send").attr("onclick", "sendMessage()")
    $("#send").attr("value", "Send")
    $('.error').text("")
    getMessages()
    })
    $('#unit').keypress((e)=>{
    //console.log('...')
    if($("#unit").attr("placeholder")!="Username"){
    if(e.which!=13){
        typing=true
        socket.emit('typing', {user:user, typing:true})
        clearTimeout(timeout)
        timeout=setTimeout(typingTimeout, 1500)
    }else{
        clearTimeout(timeout)
        typingTimeout()
        sendMessage()
    }
    }
    })

    /*$('#abc').keypress(()=>{
    i=i+1
    console.log(i)
    })*/
    socket.on('display', (data)=>{
    if(data.typing==true)
        $('.typing').text(`${data.user} is typing...`)
    else
        $('.typing').text("")
    })
})

socket.on('message',getMessages)

function typingTimeout(){
    typing=false
    socket.emit('typing', {user:user, typing:false})
}

function getMessages(){
    //change here before cf push
    $.getJSON("http://localhost:3000/messages/", (data)=>{
        //console.log(Math.random()+"  3")
        var message = []
        $.each(data, (key, val) => {
        $.each(val, (key, val) => {
            var username = key
            var msg = val
            message.push(`<h6>${username}</h6><p>${msg}</p>`)
        })
        })
    $(".chatbox").html(message)
    })
}

function sendMessage(){
    var userName = user 
    var message = $('#unit').val()
    var unit = `{"${userName}" : "${message}"}`
    $.post('/send_message', JSON.parse(unit), ()=>{
    console.log('unit posted succesfully')
    })
    $('#unit').val("")
    //console.log("6")
}