//localstorage 사용법
//key ="visitorCount" -> value로 방문자수 배열 담기
//key ="loverCount" -> value로 좋아요수 배열 담기
let visitorArr = [0];
let loverArr = [0];
window.onload = function () {


  //지우는 함수(개발자가 지워야 할 일 있을때 호출해서 사용할것)
  function deleteFootprintAll(myKey) {
    localStorage.removeItem(myKey);
  }

  //vistiorcount 방문할때마다 늘려주는 함수
  function visitorCountAdd() {
    if (localStorage.getItem("visitorCount") == null) {
      localStorage.setItem("visitorCount", JSON.stringify(visitorArr));
    } else {
      let output = localStorage.getItem("visitorCount"); //직렬화되어있음
      let arr = JSON.parse(output); //역직렬화
      arr.push(arr[arr.length - 1] + 1); //배열에 넣어줌
      localStorage.setItem("visitorCount", JSON.stringify(arr)); //로컬스토리지에 json다시 넣어줌
      document.querySelector("#visitor").innerHTML = arr[arr.length - 1] ; //화면에 보이게
      document.querySelector("#ment").innerHTML = arr[arr.length - 1];
    }
  }

  //로컬 저장소 내역을 console.log로 보는 함수(개발자용)
  function viewStorageAtConsol(myKey) {
    let output = localStorage.getItem(myKey);
    let arr = JSON.parse(output);
    for (let i = 0; i < arr.length; i++) {
      console.log(myKey + " : " + i + "번째 방에는 " + arr[i]);
    }
  }

  loverCountView();
  visitorCountAdd();

  //viewStorageAtConsol("visitorCount");
  //deleteFootprintAll("visitorCount");
  //deleteFootprintAll("loverCount");
};

////lover


//lovercount 클릭할때마다 늘려주는 함수
function loverCountAdd() {
  if (localStorage.getItem("loverCount") == null) {
    localStorage.setItem("loverCount", JSON.stringify(loverArr));
  } else {
    let output = localStorage.getItem("loverCount");
    let arr = JSON.parse(output);
    arr.push(arr[arr.length - 1] + 1);
    localStorage.setItem("loverCount", JSON.stringify(arr));
    document.querySelector("#lover").innerHTML = arr[arr.length - 1];
  }
}
//lovercount 누르지 않아도 기존 숫자는 보여주는 함수
function loverCountView() {
  if (localStorage.getItem("loverCount") != null) {
    let output = localStorage.getItem("loverCount");
    let arr = JSON.parse(output);
    document.querySelector("#lover").innerHTML = arr[arr.length - 1];
  }
}
