const drag = (event, taskId) => {   //드래그 이벤트 >> 해당 id값을 던지는 역할입니다.
  event.dataTransfer.setData("id", taskId);
  //dataTransfer에 있는 setData로 데이터를 set하고 drop에서 getdata로 받아와서 사용
  //taskid의 경우        const taskId = Date.now(); 로 테스크를 만들때 날짜값으로 설정되어 있다
  //해당 하는 데이터를 id 타입으로 던져준다.
  //ex)로그에 찍어보면 1630074175547 같은 숫자형이 출력됩니다.
  
  //cons
  event.dataTransfer.setData("columnaViejaId",
      //위와 같음
      document.getElementById(taskId).parentElement.parentElement.id);
  //setData >>taskid 값의 부모요소(tasks) >>의 부모요소(column) 의 id 값을 던져주는 역할입니다.
};

const preventDefault = event => event.preventDefault();
//드래그시의 브라우저상의 기본 동작을 방지하기 위함입니다 >> 웨일의 경우 이미지를 끌어오면 새탭으로 img파일이 열립니다. >>해당 행위 방지

const drop = event => {//드롭이벤트 >> 이벤트:브라우저는 이벤트를 감지할 수 있으며 이벤트 발생 시에는 통지해 준다.
  // 이 과정을 통해 사용자와 웹페이지는 상호작용(Interaction)이 가능하게 된다. >>드롭이라는 이벤트를 브라우저가 감지하는거임 ㅇㅇ
  //
  //taskid >> 에 드래그한 task 의 id를 담습니다.
  const taskId = parseInt(event.dataTransfer.getData("id"));
  const task = document.getElementById(taskId);
  //task 에 taskid에 해당하는 task div 객체를 들고옵니다. <div class="task" id="1630078058313" draggable ondragstart="drag(event,1630078058313)">
  
  const columnaViejaId = parseInt(event.dataTransfer.getData("columnaViejaId"));
  //드래그한 task가 들고있던  컬럼의 아이디를 들고옵니다.
  
  
  let columnNuevaId = 0;
  let yaEsta = false;
  
  if (event.target.localName == "h5") {//내가 클릭한 element를 감지하여 "h5"  태그라면 조건 true
    columnNuevaId = event.target.parentElement.parentElement.id;
    //columnNuevald >> 드롭된 곳이 h5 태그의 부모의 부모요소인 div 클래스 "column"의 아이디를 변수에 저장합니다.
    event.target.parentElement.nextElementSibling.appendChild(task);
    //내가 드롭한 태그의 부모요소div class = "headColumn" ~~의 요소를 들고 오며, 해당 태그에 자식으로 드래그한 task를 추가합니다.
    
  } else if (event.target.className == "textAddTask") {
    columnNuevaId = event.target.parentElement.parentElement.id; //
    event.target.parentElement.previousElementSibling.appendChild(task);
    
  } else if (event.target.className == "column") {
    columnNuevaId = event.target.id;
    event.target.firstElementChild.nextElementSibling.appendChild(task);
    
  } else if (event.target.className == "boxAddTask") {
    columnNuevaId = event.target.parentElement.id;
    event.target.previousElementSibling.appendChild(task);
    
  } else if (event.target.className == "tasks") { //드롭한 곳의 클래스네임이 tasks라면
    if (!event.target.innerHTML.includes(taskId)) {//드롭한 곳의 HTML 이 드래그한 친구의 taskId를 가지고 있지 않다면
      columnNuevaId = event.target.parentElement.id; //columnNuevaId에 해당 드래그한 친구(tasks) 의 부모인 column 의 id를 저장
      event.target.appendChild(task);//tasks 의 자식에 task 객체를 추가
      
    } else {
      yaEsta = true;
    }
  } else if (event.target.className == "task") {//드롭한 곳의 클래스 네임이 task 이라면
    if (!event.target.parentElement.innerHTML.includes(taskId)) {//task의 부모요소인 tasks안의 요소가 taskid과 같은 친구가 있지않다면!
      columnNuevaId = event.target.parentElement.parentElement.id; //columnNuevald 에 이벤트가 발생한 요소인 task의 부모의 부모 요소인 해당 컬럼의 id를 담음.
      event.target.parentElement.appendChild(task);//그리고 task의 부모요소인 tasks의 첫번째 자식에 task를 담아줍니다.
    } else {
      yaEsta = true;//같은 친구가 있다면 스위칭변수 true
    }
  }

  if (!yaEsta) {//yaEsta 가 false 라면
    columnNuevaId = parseInt(columnNuevaId); //드롭한 컬럼 id 를 Int형으로 변환합니다.
    removeTaskInStorage(taskId, columnaViejaId); //여기 이해가 좀 안됨 >> 실질적으로 삭제하는 과정이 없어....
    //>>의미로는 드래그한 taskid 와 컬럼의 id에 해당하는 친구를 스토리지에서 제거함
    newTaskInStorage(taskId, task.innerText, columnNuevaId);
    //그리고 taskid과 새로운 컬럼id과 task안의 텍스트값을 로컬스토리지에 저장합니다.
    //즉 스위칭 변수가 false인 경우에는 새로운 컬럼으로 이동을 허용한다는 의미입니다.
  }
};
const columns = localStorage.getItem("columns") ? JSON.parse(
    localStorage.getItem("columns")) : [];
//컬럼에 로컬 스토리지안의 매개변수(columns)에 해당하는 키값을 가진 친구의 밸류값이 undefined가 아니라면 JSON파일로 변환하여 배열에 저장합니다
//값이 없다면 그냥 진행 ㅇㅇ

// 로컬스토리지 직렬화 과정 -- //
columns.forEach(column => { // columns 안에 column div 객체를 하나씩 담습니다.
  let taskInStorage = "";//taskInStorage 변수 생성
  if (column.tasks.length > 0) {//column 안의 tasks의 개수가 1개 이상이라면
    column.tasks.forEach(task => {//column > tasks
      taskInStorage += `
            <div class="task" id="${task.id}" draggable ondragstart ="drag(event,${task.id})" >
                <h6 contenteditable onblur="changeTitleTask(event, ${task.id})" onkeydown="preventEnter(event)" onkeyup="changeTitleTask(event, ${task.id})">${task.title}</h6>
                <i class="far fa-trash-alt" onclick="removeTask(${task.id})"></i>
            </div>`;//taskInStorage 안에 task객체를 하나씩 하나씩 추가합니다.
    });
  }
  //메인 (columns의 부모) 의 하위 모든 HTML element를 삭제후 재할당 >>
  // .innerHtml  : (요소(element)의 자손의 HTML 직렬화를 포함하는 DOMString 입니다.
  //
  document.querySelector("main").innerHTML += `
    <div class="column" id="${column.id}" ondragover="preventDefault(event)" ondrop="drop(event)">
        <div class="headColumn">
            <h5 contenteditable onblur="changeTitleColumn(event, ${column.id})" onkeydown="preventEnter(event)" onkeyup="changeTitleColumn(event, ${column.id})">${column.title}</h5>
            <div class="btn-group">
                <button type="button" class="btn btn-sm btn-default" data-toggle="dropdown"><img src="img/puntitos.png" alt="" class="imgOptions"></button>
                <ul class="dropdown-menu" role="menu">
                <li><a href="#" onclick="removeColumn(${column.id})">제거</a></li> <!--말그대로 해당 컬럼 아이디에 해당하는 값을 제거하는 역할-->
                <li><a href="#" onclick="getFocusInTitle(${column.id})">이름 변경</a></li><!--말그대로 해당 컬럼 아이디에 해당하는 값을 수정하는 역할-->
                </ul>
                </div>
            </div>
            <div class="tasks" ondragover="preventDefault(event)" ondrop="drop(event)">${taskInStorage}</div><!--taskInStorage안의 task내용들을
             tasks에 담습니다 >> ondragover의 경우 브라우저 마다의 드래그시의 기본동작이 있기 때문에
             이를 방지하기 위하여 preventDefault 함수를   사용합니다-->
	        <div class="boxAddTask">
                <textarea placeholder="+내용을 입력해주세요" cols="20" rows="2"
                onkeydown="adjustHeightAddNewTask(event)"
                onkeyup="newTask(event,${column.id})"
                onclick="showAddTasksMenu(event)" class="textAddTask"></textarea>
                <div class="addDelTask">
                    <input type="button" disabled value="Press Enter" class="buttonAddTask" onclick="newTask(event,${column.id})">
                    <a href="#"><img src="cancelar.png" alt="" class="imgHideAddTask" onclick="hideAddTasksMenu(event)"></a>
		        </div>
	        </div>
        </div>`;
});//keydown 시 textarea의 높이를  (5+event.target.scrollHeight) 로 변경합니다 >>콘텐츠의 스크롤 길이만큼 textarea 설정
//keyUp 시 새로운 task를 생성합니다.
//textarea 클릭시 테스크가 적힐 텍스트area를 보여줍니다
//생성버튼 클릭시 task생성
//취소버튼 클릭시 textarea를 보이지 않게하며 , 스타일을 초기화합니다.


// --여기까지 로컬스토리지 직렬화 과정이였습니다. //

const removeTask = (taskId) => {
  const currentColumnId = document.getElementById(
      taskId).parentElement.parentElement.id;
  removeTaskInStorage(taskId, currentColumnId);
  document.getElementById(taskId).remove();
  //taskid를 매개변수를 받아서
  //currentColumnId : 클릭된 task의 id과 일치하는 요소를 검색후 >>부모의 부모 요소인
  //컬럼 id를 변수에 담습니다.
  //  removeTaskInStorage(taskId, currentColumnId); >.이 과정이 이해가 잘 안됨
  //taskId에 해당하는 요소를 삭제합니다.
};
const removeTaskInStorage = (taskId, columnId) => { //
  const columns = localStorage.getItem("columns") ? JSON.parse(
      localStorage.getItem("columns")) : [];
  const currentColumn = columns.find(column => column.id == columnId);
  const tasksFiltered = currentColumn.tasks.filter(task => task.id !== +taskId);
  //currentColumn배열의 테스크중에 taskid와 일치하지 않는 친구들을 찾아서 tasksFiltered
  //에 배열로 저장합니다.
  //>>결국 : taskid 에 해당하는 친구는 배열로 담기지 않습니다.
  currentColumn.tasks = tasksFiltered;
  //현재 column의 tasks에 tasksFiltered 배열을 담습니다.
  localStorage.setItem("columns", JSON.stringify(columns));
  //columns 객체를 JSON문자열로 변환한 값을 localStorage에 저장합니다.
};

const removeColumn = (columnId) => { //컬럼아이디를 매개변수를 받아 JSON의 컬럼id와 일치하는 값을 로컬스토리지에 담음.
  //이후에 컬럼아이디와 일치하는 값을 제거합니다.
  const columns = localStorage.getItem("columns") ? JSON.parse(
      localStorage.getItem("columns")) : [];
  const columnsFiltered = columns.filter(column => column.id !== columnId);
  localStorage.setItem("columns", JSON.stringify(columnsFiltered));
  document.getElementById(columnId).remove();
};

function showAddColumnMenu() { //칸반의 내용이 보이게합니다.
  document.querySelector("div.boxAddColumn").style.height = "4em";
  document.querySelector(
      "input#textAddColumn.textAddColumn").placeholder = "제목을 입력해주세요";
  document.querySelector(
      "input#textAddColumn.textAddColumn").style.border = "1px solid rgb(59, 180, 228)";
  document.querySelector(
      "input#textAddColumn.textAddColumn").style.backgroundColor = "white";
  document.querySelector(".addDelColumn").style.display = "flex";
}

function hideAddDelColumn() {//칸반의 내용을 숨기는 역할입니다.
  document.querySelector("div.boxAddColumn").style.height = "unset";
  //"unset" 은 부모로부터 상속할 값이 존재하면 상속값을, 그렇지 않다면 초깃값을 적용합니다.
  document.querySelector(
      "input#textAddColumn.textAddColumn").placeholder = "+ 내용을 입력해주세요";
  //텍스트값에 placeholder "~~"
  document.querySelector("input#textAddColumn.textAddColumn").style.border = "";
  //border스타일 없음
  document.querySelector(
      "input#textAddColumn.textAddColumn").style.backgroundColor = "";
  //backgroundcolor 없음
  document.querySelector("div.addDelColumn").style.display = "none";
  //display >> 안보이게
}

// DESPLIEGA MENU AGREGAR TAREAS -- //
// function showAddTasksMenu() {
//     Array.from(document.querySelectorAll('.textAddTask')).forEach(textAddTask => {
//         textAddTask.onclick = event => {
//             textAddTask.parentElement.style.height = "unset";
//             textAddTask.placeholder = "Introduzca el nombre de la tarea";
//             textAddTask.style.border = "1px solid rgb(59, 180, 228)";
//             textAddTask.style.backgroundColor = "white";
//             textAddTask.nextElementSibling.style.display = "flex";
//         }
//     })
// }

function showAddTasksMenu(event) {
  
  if (event.key === "Enter" || event.currentTarget.type === "textarea") {
    //해당 이벤트가 발생한 곳에서 엔터키를 누르거나 현재 이벤트 발생한 위치가 textarea 라면
    currentTextAddTask = event.target;
    //암시적 변수 (자바스크립의 경우 :https://bluepoet.me/2012/02/17/javascript%EC%95%94%EB%AC%B5%EC%A0%81-%EC%A0%84%EC%97%AD%EB%B3%80%EC%88%98-%EC%8B%A4%EC%8A%B5-%EC%95%88%ED%8B%B0%ED%8C%A8%ED%84%B4/currentTextAddTask >>
    //var 나 let등의 타입을 정해주지 않는다면 암시적으로 전역변수로 인식하게된다.
    //currentTestAddTask 는 textarea 타입의 textAddTask 클래스의 요소를 가지고있음.
  } else if (event.currentTarget.type === "textarea") {
    //여기 왜 이렇게 처리한지 모르겠음
    //어차피 || 에서 다 걸릴텐데..?
    currentTextAddTask = event.target.parentElement.parentElement.firstElementChild;
  }
  currentTextAddTask.parentElement.style.height = "unset";
  currentTextAddTask.placeholder = "내용입력";
  currentTextAddTask.style.border = "1px solid rgb(59, 180, 228)";
  currentTextAddTask.style.height = "2em";
  currentTextAddTask.style.backgroundColor = "white";
  currentTextAddTask.nextElementSibling.style.display = "flex";
  //textAddTask 의 스타일을 js 로 처리.
}


function hideAddTasksMenu(event) {
  Array.from(document.querySelectorAll("img.imgHideAddTask")).
      forEach(cancelButton => {
        cancelButton.onclick = event => {
          const boxAddTask = event.target.parentElement.parentElement.parentElement;
          console.log(event.target.parentElement.parentElement.parentElement);
          //boxAddTask 에 삭제버튼 의 부모의 부모 부모요소인 div 객체 boxAddTask 요소를 담습니다.
          
          boxAddTask.style.height = "2em";
          boxAddTask.firstElementChild.placeholder = "생성";
          boxAddTask.firstElementChild.style.border = "";
          boxAddTask.firstElementChild.style.backgroundColor = "";
          event.target.parentElement.parentElement.style.display = "none";
          //스타일을 초기화하여 텍스트박스와 생성 > 취소버튼을 보이지 않게 합니다.
        };
      });
}

function newColumn(event) {
  if (event.key === "Enter" || event.type === "click") {//이벤트 키가 엔터가 입력되거나 || 마우스 클릭 이라면
    //
    
    if (document.querySelector(".textAddColumn").value != "") {
      //textAddColumn 이라는 선택자와 일치하는 문서 내 첫번째 요소의 값이 존재한다면
      //>>칸반제목 입력부분에서 쓰여진 문자가 있다면 생성이 눌림 >> 그렇지 않은 경우에는 눌러도 반응 X
      const columns = localStorage.getItem("columns") ? JSON.parse(
          localStorage.getItem("columns")) : [];
      //로컬 스토리지에서 columns 라는 키값을 가진 친구에 값이 존재한다면
      //로컬스토리지의 columns 키값을 가진 친구를 JSON으로 변환해서 columns에 담습니다.
      const columnId = Date.now();
      //column의 id는 현재 시간기준 으로 생성
      const title = document.querySelector(".textAddColumn").value;
      //title : .textAddColumn 클래스의 밸류를 들고옵니다.
  
      //아래과정은 main이라는 선택자 안에 백틱안의 html 파일을 주입. >> 칸반보드(column)가 하나 생기는 과정임.
      document.querySelector("main").innerHTML += `
            <div class="column" id="${columnId}" ondragover="preventDefault(event)" ondrop="drop(event)">
                <div class="headColumn">
                    <h5 contenteditable onblur="changeTitleColumn(event, ${columnId})" onkeydown="preventEnter(event)" onkeyup="changeTitleColumn(event, ${columnId})"">${title}</h5>
                    <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-default" data-toggle="dropdown"><img src="puntitos.png" alt="" class="imgOptions"></button>
                    <ul class="dropdown-menu" role="menu">
                    <li><a href="#" onclick="removeColumn(${columnId})">제거</a></li>
                    <li><a href="#" onclick="getFocusInTitle(${columnId})">수정</a></li>
                    </ul>
                    </div>
                </div>
                <div class="tasks" ondragover="preventDefault(event)"  ondrop="drop(event)"></div>
                    <div class="boxAddTask">
                        <textarea placeholder="+ 내용을 입력해주세요" cols="25" rows="2"
                        onkeydown="adjustHeightAddNewTask(event)" onkeyup="newTask(event,${columnId})" 
                        onclick="showAddTasksMenu(event)" class="textAddTask"></textarea>
                        <div class="addDelTask">
                            <input type="button" disabled value="Press Enter" class="buttonAddTask" onkeyup="newTask(event,${columnId})">
                            <a href="#"><img src="../img/cancelar.png" alt="" class="imgHideAddTask"></a>
                        </div>
                    </div>
                </div>`;
      columns.push({
        //columns배열에 id값과 title tasks 배열을 추가합니다.
        id: columnId,
        title,
        tasks: [],
      });
      localStorage.setItem("columns", JSON.stringify(columns));
      //ㅇ후 로컬스토리지에 columns 키를 가진 Json으로 변환된 자바스크립의 columns를 밸류값으로 요소저장합니다.
      document.querySelector(".textAddColumn").value = "";
      //.textAddColumn이라는 선택자 >> 안의 값을 빈값으로 만들어줍니다
      //미니 시나리오 : 칸반 제목 입력후 >> 생성하면 columns가 로컬 스토리지 저장..> 이후 칸반 제목입력 인풋태그 안의값을 초기화.
    }
  } else {
    // Mensaje error: "Debe ingresar el titulo de la columna"
  }
}

function adjustHeightAddNewTask(event) { //이거 왜 여깄음? css에 안가고..?
  event.target.style.height = "1px";
  //이건 왜 1px로 설정한지는 모르겠음. 키를 textArea에 입력할 때마다
  //1px >>41px 1px >>41px 로 로그가 찍혔음
  event.target.style.height = (5 + event.target.scrollHeight) + "px";
  //scrollHeight 값은 수직 스크롤바를 사용하지 않고 요소의 콘텐츠를
  // 모두 나타낼 때 필요한 최소 높이의 값과 동일합니다
  //>>즉 콘텐츠의 높이만큼 창이 늘어나게되는 효과입니다.
}

//task를 새로 생성하는 함수
function newTask(event, columnId) {
  let title = "";
  //title을 String으로 선언 /////////
  if (event.key === "Enter" ) { //엔터가 입력된다면
    title = event.target.value.replace(/\n/ig, "");
    //이벤트 객체에 담겨있는 현재의 텍스트 값중 개행문자를 공 치환후 title 변수에 담음
    event.target.value = ""; //값은 null로
  } else if (event.type === "click") { //클릭을 한다면
    title = event.target.parentElement.previousElementSibling.value.replace(
        /\n/ig, "");
    //이벤트 객체의 부모요소의 이전형제요소의 텍스트 값중 개행문자를 공 치환후 title 변수에 담음
    event.target.parentElement.previousElementSibling.value = ""; //값은 null
  }
  //위의 코드는 그냥 암것도 안한다는 소리 같음
  
  if (title != "") { //title에 문자가 입력됐다면
    const taskId = Date.now();	//1970년 1월 1일 0시 0분 0초부터 현재까지 경과된 밀리 초를 반환하여 taskId로 저장
    document.getElementById(columnId).children[1].innerHTML +=
        //columnId의 자식요소인 tasks[1] 요소안의 HTML이나 XML에 생성된 task 담음
        //이때 task는 드래그 할 수 있는 객체, h6에 입력된 값으로 title명을 변경가능하고, 아이콘으로 삭제가능한 속성을 가지고있다.
        `<div class="task" id="${taskId}" draggable ondragstart ="drag(event,${taskId})" >
         	<h6 contenteditable onblur="changeTitleTask(event, ${taskId})" onkeydown="preventEnter(event)" onkeyup="changeTitleTask(event, ${taskId})">${title}</h6>
            <i class="far fa-trash-alt" onclick="removeTask(${taskId})"></i>
         </div>`;
//${} : id를 알아내는 마치 document.getElementById()와 비슷
//draggable : 드래그될 수 있는 객체(draggable object)로 변환
//ondragstart : 드래그될 수 있는 객체(draggable object)로 변환 후 DataTransfer' 객체의 setData() 메소드를 호출 setData(드래그대상객체의 데이터, 타입설정)
//onblur : 포커스 해제시 발생 이벤트
//onkeydown : 키가 눌렸을때 발생 이벤트
//onkeyup : 키가 올라왔을때(손을 뗐을때) 발생 이벤트
//contenteditable : true시 해당 div안의 요소 편집 가능
    newTaskInStorage(taskId, title, columnId); //localStorage에 새로 생성한 task담음
    showAddTasksMenu(event);/////////////////추가해야해//////////////////////////////
  } else {
    // Mensaje error: "Debe ingresar el titulo de la columna"
  }
}

//localStorage에 새로 생성한 task를 담는 함수
const newTaskInStorage = (taskId, title, columnId) => {
  const columns = localStorage.getItem("columns") ? JSON.parse(
      localStorage.getItem("columns")) : [];
  //localStorage의 key값(columns)의 밸류값이  null이 아닐때 JSON객체로 반환한 columns의 값을 반환하고 null일때는 아무것도 안함(그냥 진행)
  const currentColumn = columns.find(column => {
    return column.id === +columnId;
  });
  //columns배열에서 columnId와 동일한 column.id를 가지는 column을 찾아 currentColumn변수에 저장
  if (title == "") {
    title = document.getElementById(taskId).firstElementChild.innerText;
  }
  //task title이 없을때 taskId의 자식요소인 h6(입력되는란)의 text를 title로 저장한다.
  currentColumn.tasks.push({
    id: taskId,
    title,
  });
  //currentColumn의 tasks배열 맨끝에 id값 taskId와 그의 title을 추가합니다.
  localStorage.setItem("columns", JSON.stringify(columns));
  //localStorage에 키값과 Sting으로 변환한 columns를 담습니다.
};
//h6(task의 입력란)에 입력되는 text를 title로, 그 부모인 taskId와 함께 해당 컬럼의 배열 끝에 저장

//엔터를 막는 변수
const preventEnter = event => event.key === "Enter"
    ? event.preventDefault()
    : "";
//브라우저 자체의 엔터 기능을 무력화시킴
//ex)onkeydown="preventEnter(event)" // 엔터가 입력되기 전까지 문자열을 받음

//컬럼의 title을 변경하는 함수
function changeTitleColumn(event, columnId) {
  //컬럼 id에서 이벤트
  if (event.key === "Enter" || event.type === "blur") {
    //엔터가 입력되거나 포커스를 잃는 이벤트가 발생된다면 (포커스 갔다가 나올때의 모든 경우)
    const columns = localStorage.getItem("columns") ? JSON.parse(
        localStorage.getItem("columns")) : [];
    //localStorage의 key값(columns)의 밸류값이  null이 아닐때 JSON객체로 반환한 columns의 값을 반환하고 null일때는 아무것도 안함(그냥 진행)
    const currentColumn = columns.find(column => {
      return column.id === +columnId; // +columnId는 columnId가 숫자라는 뜻
    });
    //columns배열(localStorage의 Key의 집합)에서 columnId 동일한 column.id를 가지는 column을 찾아 currentColumn변수에 저장
    
    currentColumn.title = (event.target.innerText).replace(/\n/ig, "");
    ;
    //이벤트가 발생한 대상(column)의 text 중 개행문자를 공백1칸으로 변경후 currentColumn의 title로 저장
    localStorage.setItem("columns", JSON.stringify(columns));
    //localStorage에 키값, value: String으로 변환한 columns을 담음
    event.target.blur();
    //이벤트 대상에서 포커스를 뺌
  }
}

//컬럼이 가진 task에 포커스를 주는 함수
function getFocusInTitle(columnId) {
  document.getElementById(columnId).firstElementChild.firstElementChild.focus();
  //columnId의 task에 포커스 이벤트 발생
}

//task의 Title을 변경하는 함수
function changeTitleTask(event, taskId) {
  if (event.key === "Enter" || event.type === "blur") {
    //엔터가 입력되거나 포커스를 잃는 이벤트가 발생된다면 (포커스 갔다가 나올때의 모든 경우)
    const currentColumnId = document.getElementById(
        taskId).parentElement.parentElement.id;
    //이벤트가 발생된 해당 task의 부모요소의 부모요소의 id를 currentColumnId 변수에 저장
    //currentColumnId==taskId의 부모-부모(column)의 id
    const currentColumn = columns.find(column => column.id == currentColumnId);
    //columns(localStorage의 Key)배열에서 currentColumnId값과 column.id값이 같은 요소의
    //column을 currentColumn변수에 저장
    //currentColumn == 이벤트 발생된 task의 coulmn
    const currentTask = currentColumn.tasks.find(task => task.id == taskId);
    //위와 동일
    //currentTask == 이벤트 발생된 task
    currentTask.title = (event.target.innerText).replace(/\n/ig, "");
    //이벤트가 발생한 대상의 텍스트의 개행문자를 공백 1칸으로 변경하여 currentTask의 title로 지정
    localStorage.setItem("columns", JSON.stringify(columns));
    //localStorage에 키값: columns,  value: JSON->String으로 변환한 columns을 담는다.
    event.target.blur();
    //이벤트 발생한 대상에서 포커스를 치운다
  }
}