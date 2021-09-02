const btn = document.getElementById('btn');
const color = document.getElementById('color');
const body = document.body;


btn.addEventListener('click', changeBG);


function changeBG(){
    const col1 = getRandomRGB();
    const col2 = getRandomRGB();
    const col3 = getRandomRGB();

    const colorString = `rgb(${col1}, ${col2}, ${col3})`;

console.log(colorString)

    body.style.background = colorString;
    color.innerText = colorString;
}

function getRandomRGB(){
    return Math.floor(Math.random() * 256);
}