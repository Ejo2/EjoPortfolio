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
function alert_trello() {
  Swal.fire({
    title: 'Are you sure??',
    text: "트렐로를 이 창에서 여시겠습니까?",
    icon: 'info',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'OK'
  }).then((result) => {
    if (result.isConfirmed) {	
      location.href="Trello.html";
    }
  })
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





