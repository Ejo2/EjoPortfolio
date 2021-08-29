let init=false;
let myCanvas;
let Context;

let tetrix_blockbox_boxsize=25;
let tetrix_blockbox_top=50;
let tetrix_blockbox_left=280;

// tetrix_blockbox[row][col]; 20행 10열
let tetrix_blockbox;

// 테트리스 블럭박스 초기화
function tetrix_blockbox_init()
{
    // 20행 10열의 박스 생성
    tetrix_blockbox=new Array();
    for(i=0;i<20;++i)
    {
        tetrix_blockbox.push(new Array(10));
        // 모두 0으로 채운다
        for(j=0;j<10;++j)tetrix_blockbox[i][j]=0;
    }
}

// 5가지 타입 블록
let tetrix_block;

// 현재 사용중인 블록
let tetrix_block_this;

// 5가지 블럭 초기화
function tetrix_block_init()
{
    tetrix_block=new Array();
    
    // 첫번째 블럭
    // □□□□
    tmp=new Array();
    tmp.push(0,0); tmp.push(0,1); tmp.push(0,2); tmp.push(0,3);
    tetrix_block.push(tmp);
    
    // 두번째 블럭
    // □□□
    //  □
    tmp=new Array();
    tmp.push(0,0); tmp.push(0,1); tmp.push(0,2); tmp.push(1,1);
    tetrix_block.push(tmp);
    
    // 세번째 블럭
    // □□
    //  □□
    tmp=new Array();
    tmp.push(0,0); tmp.push(0,1); tmp.push(1,1); tmp.push(1,2);
    tetrix_block.push(tmp);
    
    // 네번째 블럭
    //  □□
    // □□
    tmp=new Array();
    tmp.push(0,1); tmp.push(0,2); tmp.push(1,0); tmp.push(1,1);
    tetrix_block.push(tmp);
    
    // 다섯번째 블럭
    // □□
    // □□
    tmp=new Array();
    tmp.push(0,0); tmp.push(0,1); tmp.push(1,0); tmp.push(1,1);
    tetrix_block.push(tmp);
}

// 현재 떨어지는 블록번호와 좌표
let tetrix_block_number=1;
let tetrix_block_x=3;
let tetrix_block_y=0;

// 초기화
function Init()
{
    if(init==false)
    {
        myCanvas=document.getElementById("MyCanvas");
        Context=myCanvas.getContext("2d");
        init=true;
        tetrix_block_init();	// 5가지 블럭 모양 초기화
        tetrix_blockbox_init();	// 블럭상자 초기화
        tetrix_block_number=Math.floor(Math.random()*4.9);
        tetrix_block_this = tetrix_block[tetrix_block_number].slice();
    }
}

function CheckConflict()
{
    let size=tetrix_block_this.length;
    for(k=0;k<size;k+=2)
    {
        check_y = tetrix_block_y + tetrix_block_this[k];
        check_x = tetrix_block_x + tetrix_block_this[k+1];
        // 겹치는 경우
        if(check_x < 0 || check_x >=10 || check_y >= 20 || tetrix_blockbox[check_y][check_x]!=0)return true;
    }
    return false;
}

function Run()
{
    let size=tetrix_block_this.length;
    
    // 블럭을 한칸 떨어뜨리고
    tetrix_block_y++;
    
    // 겹침검사
    if(CheckConflict())
    {
        // 다시 위로 이동시킨 다음
        tetrix_block_y--;
        // 블럭을 블럭판에 박는다
        for(k=0;k<size;k+=2)
        {
            check_y = tetrix_block_y + tetrix_block_this[k];
            check_x = tetrix_block_x + tetrix_block_this[k+1];
            tetrix_blockbox[check_y][check_x]=1;
        }
        
        // 블럭을 다시 제일 위로 생성시키고
        tetrix_block_y=0;
        tetrix_block_x=3;
        // 블럭번호도 바꿔 주자
        tetrix_block_number=Math.floor(Math.random()*4.9);
        tetrix_block_this=tetrix_block[tetrix_block_number].slice();
    }
    
    // 그리기 이벤트
    onDraw();
}

function RotateBlock()
{
    switch(tetrix_block_number)
    {
        case 0: case 1: case 2: case 3:
        // 첫번째 블럭
        // □□□□
        // 두번째 블럭
        // □□□
        //  □
        // 세번째 블럭
        // □□
        //  □□
        // 네번째 블럭
        //  □□
        // □□
        centerY=0; centerX=1;	// ( 0, 1 ) 지점을 중심
        break;
        case 4:
            // 다섯번째 블럭
            // □□
            // □□
            return;
    }
    
    // 회전
    // x ← -y
    // y ← x
    // 이전 형태를 미리 기억
    tetrix_block_save = tetrix_block_this.slice();
    for(i=0;i<tetrix_block_this.length;i+=2)
    {
        y=tetrix_block_this[i+1] - centerX;
        x=-(tetrix_block_this[i] - centerY);
        tetrix_block_this[i]=y + centerY;
        tetrix_block_this[i+1]=x + centerX;
    }
    
    // 충돌인 경우 원상복귀
    if(CheckConflict())
        tetrix_block_this=tetrix_block_save.slice();
}

// 키입력
function onKeyDown(event)
{
    if(event.which==37)	// 왼쪽키
    {
        tetrix_block_x--;
        if(CheckConflict())tetrix_block_x++;
        else onDraw();
    }
    if(event.which==39)	// 오른쪽키
    {
        tetrix_block_x++;
        if(CheckConflict())tetrix_block_x--;
        else onDraw();
    }
    if(event.which==40 || event.which==32)	// 아래쪽키, 스페이스키
    {
        tetrix_block_y++;
        if(CheckConflict())tetrix_block_y--;
        else onDraw();
    }
    if(event.which==38)	// 위쪽키(회전)
    {
        RotateBlock();
        onDraw();
    }
}

// draw 이벤트
function onDraw() {
    if (init == false) {
        return;
    }
    // 전체 테두리
    Context.strokeStyle = "#000";
    Context.lineWidth = 1;
    Context.strokeRect(0, 0, myCanvas.width - 1, myCanvas.height - 1);
    // 블럭 표시
    for (i = 0; i < 20; ++i) {
        for (j = 0; j < 10; ++j) {
            if (tetrix_blockbox[i][j] == 0) {
                Context.fillStyle = "#ccc";
            } else {
                Context.fillStyle = "green";
            }
            
            // 떨어지는 블럭표시
            let size = tetrix_block_this.length;
            for (k = 0; k < size; k += 2) {
                if (tetrix_block_y + tetrix_block_this[k] == i
                    && tetrix_block_x + tetrix_block_this[k + 1] == j) {
                    Context.fillStyle = "blue";
                }
            }
            
            x = tetrix_blockbox_left + j * tetrix_blockbox_boxsize;
            y = tetrix_blockbox_top + i * tetrix_blockbox_boxsize;
            Context.fillRect(x, y, tetrix_blockbox_boxsize - 2, tetrix_blockbox_boxsize - 2);
        }
    }
}
function openPop() {
    const popUrl = "tetgame.html";
    const popup = window.open(popUrl, "테트리스",
        "width=840px,height=700px,scrollbars=no,menubar=no, toolbar=no");
    
}

$(document).ready(function(){
    Init();
    setInterval(Run, 500);
});

$(document).keydown(function( event ){
    onKeyDown(event);
})