var sendButtonPushed = false;
(function () {
  document.getElementById("message-list").innerHTML = "Enter message below and press <b>Send</b>!";
  const ws = new WebSocket("ws://localhost:3000")
  ws.onmessage = (data) => {
    let message = JSON.parse(data.data);
    let date = new Date(message.date)
    let dateMinutes = date.getMinutes().toString();
    if (dateMinutes.length == 1) {
      dateMinutes = "0" + dateMinutes;
    }
    $("#message-list").append('<br><span class="message-date">' + date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate() + ". " + date.getHours() + ":" + dateMinutes + '</span> <span class="message-text">' + message.text + '</span> ');
    $("#message-list").animate({ scrollTop: $("#message-list")[0].scrollHeight }, 1000);
  }
})();

const resizeTextarea = id => {
  var h = $("#" + id).height();
  $("#" + id).css("height", "0px");
  var sh = $("#" + id).prop("scrollHeight");
  var minh = $("#" + id).css("min-height").replace("px", "");
  $("#" + id).css("height", Math.max(sh, minh) + "px");
}

$('#message-textarea').bind('input propertychange', () => {
  resizeTextarea('message-textarea');
  if (sendButtonPushed == true) {
    checkMessageFieldEmptiness();
  }
});

const checkMessageFieldEmptiness = () => {
  if ($('#message-textarea').val() == '') {
    $("#empty-error-message").show();
  } else {
    $("#empty-error-message").hide();
  }
}

$('#send-button').click(() => {
  var textareaVal = $('#message-textarea').val();
  if (textareaVal != '') {
    var lineBreaked = textareaVal.replace(/\n/g, '<br />');
    $.ajax({
      url: 'http://localhost:3000/message',
      type: 'POST',
      data: '{"message": "' + lineBreaked + '"}',
      dataType: 'json',
      contentType: "application/json; charset=utf-8",
      success: function (res) {
        //console.log("message received: " + res.body);
        $('#message-textarea').val('');
        resizeTextarea('message-textarea')
        sendButtonPushed = false;
      },
      error: function (res) {
        console.log("Error: couldn't send the message. Code: " + res.statusText)
      }
    });
  } else {
    sendButtonPushed = true;
    checkMessageFieldEmptiness();
  }
});