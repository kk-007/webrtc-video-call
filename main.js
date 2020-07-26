var Peer = require("simple-peer");

var video = document.querySelector("#video1");
var op = document.querySelector("#video2");
var outgoingLogger = document.querySelector("#outgoing");
var myform = document.querySelector("form");
var token = document.querySelector("#incoming");

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then(addMedia)
  .catch(() => {});
function addMedia(stream) {
  video.srcObject = stream;
  video.muted = true;
  video.play();
  var peer = new Peer({
    initiator: location.hash === "#host", //true then signal is called automatically it's needed for host
    stream: stream,
    trickle: false,
  });
  peer.on("signal", (data) => {
    console.log(JSON.stringify(data));
    outgoingLogger.textContent = JSON.stringify(data);
  });
  peer.on("connect", function () {
    outgoingLogger.textContent = "CONNECT";
    console.log("CONNECT");
  });
  myform.addEventListener("submit", function (ev) {
    ev.preventDefault();
    peer.signal(JSON.parse(token.value));
  });
  peer.on("stream", (stream) => {
    if ("srcObject" in op) {
      op.srcObject = stream;
    } else {
      op.src = window.URL.createObjectURL(stream); // for older browsers
    }
    op.play();
  });
}
//copy btn code
const span = document.querySelector("span");

span.onclick = function () {
  span.innerText = outgoingLogger.innerText;
  document.execCommand("copy");
};

span.addEventListener("copy", function (event) {
  event.preventDefault();
  if (event.clipboardData) {
    event.clipboardData.setData("text/plain", span.textContent);
  }
});
