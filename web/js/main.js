const toggleBtn = document.querySelector(".navbar_toogleBtn");
const menu = document.querySelector(".navbar_menu");
const icons = document.querySelector(".navbar_icons");
var dt = event.dataTransfer;

function toggleBtn_Click() {
  toggleBtn.addEventListener("click", () => {
    menu.classList.toggle("active");
    icons.classList.toggle("active");
  });
  
}

function alert_1() {
  swal("qkrtkdwns3410@naver.com");
}

function dragStart() {
  dt.setData("text/plain", "상준");
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("Url", "");
}

function drop(ev) {
  ev.preventDefault();
  window.location = ev.dataTransfer.getData("Url");
}





