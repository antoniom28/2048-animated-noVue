let matrix = [
    [0 , 0 , 0 , 0],
    [0 , 0 , 0 , 0],
    [0 , 0 , 0 , 0],
    [0 , 0 , 0 , 0]
];

let gameStarted = false;
let prevMatrix = null;
let newNumber = {row:-1,col:-1};
let noEventKey = false;
let added = false;
let score = 0;
let topScore = 0;
let numberToAdd = {row:-1,col:-1};
let boxInHtml = null;

function resetGame(){
    if(!gameStarted)
        return;
        
    gameStarted = false;
    matrix = [
        [0 , 0 , 0 , 0],
        [0 , 0 , 0 , 0],
        [0 , 0 , 0 , 0],
        [0 , 0 , 0 , 0]
    ];
    
    prevMatrix = null;
    newNumber = {row:-1,col:-1};
    noEventKey = false;
    added = false;
    score = 0;
    numberToAdd = {row:-1,col:-1};
    resetBoxInHtml();
    updateScore(0);
    startGame();
}

function startGame(){
    if(gameStarted)
        return;

    gameStarted = true;
    addNumber();
    addNumber();
    boxInHtml = updateBox();

    window.addEventListener('keydown' , ()=>{
        if(!noEventKey){
            added = false;
            prevMatrix = [...matrix];
            switch(event.key){
                case 'w':
                    moveVertical(0 , 1);
                    break;
        
                case 's':
                    moveVertical(3 , -1);
                    break;
        
                case 'a':
                    moveHorizontal(0 , 1);
                    break;
        
                case 'd':
                    moveHorizontal(3 , -1);
                    break;
            }
            numberToAdd = {row:-1,col:-1};
        }
    });
}

function resetBoxInHtml(){
    let box = document.querySelectorAll('.number-box');
    for(let i=0; i<box.length; i++){
        box[i].innerHTML = "";
        box[i].className = "number-0 number-box";
    }
}

function updateBox(){
    let box = document.querySelectorAll('.number-box');
    box = convertToMatrix(box,4);
    for (let i = 0; i < box.length; i++) {
        for (let j = 0; j < box[i].length; j++) {
            if(matrix[i][j] > 0){
                box[i][j].innerHTML = matrix[i][j];
                box[i][j].className += ` row-${i} col-${j} number-${matrix[i][j]} no-null`;
                if(newNumber.row == i && newNumber.col == j){
                    box[i][j].className += ` new-number`;
                    newNumber.row = -1; newNumber.col = -1;
                }
                else
                    box[i][j].classList.remove('new-number');
            }
        }
    }
    return box;
}

function convertToMatrix(array, elementsPerSubArray) {
    var matrix = [], i, k;

    for (i = 0, k = -1; i < array.length; i++) {
        if (i % elementsPerSubArray === 0) {
            k++;
            matrix[k] = [];
        }

        matrix[k].push(array[i]);
    }

    return matrix;
}

function addShift(numberToShift,row,col,shift,direction,where){
    if(numberToAdd != undefined && numberToAdd.row == row && numberToAdd.col == col)
        null;
    else if(where == "horizontal")
            numberToShift.push({row:row , col:shift , value: matrix[row][col]});
         else
            numberToShift.push({row:shift , col:col , value: matrix[row][col]});
        
    removeCol(boxInHtml[row][col]);
    removeRow(boxInHtml[row][col]);

    if(where == "horizontal"){
        if(numberToAdd != undefined && numberToAdd.row == row && numberToAdd.col == col){
            shift = shift - direction;
            boxInHtml[row][col].className += ` andra alla col-${shift} e row-${row}`;
            numberToAdd = {row:-1,col:-1};
            
        } else{
            boxInHtml[row][col].className += ` andra alla col-${shift} e row-${row}`;
        }
    } else{
        if(numberToAdd != undefined && numberToAdd.row == row && numberToAdd.col == col){
            shift = shift - direction;
            boxInHtml[row][col].className += ` andra alla row-${shift} e col-${col}`;
            numberToAdd = {row:-1,col:-1};
        } else{
            boxInHtml[row][col].className += ` andra alla row-${shift} e col-${col}`;
        }
    }

    shift = shift + direction;
    return {array:numberToShift , shift:shift};
}

function moveHorizontal(pos , direction){
    let numberToShift = [];
    let shift = 0;
    for (let row = 0; row < 4; row++){
        shift = pos;

        for (let col = pos; greaterOrLess(col , direction); col = col + direction){
            if(matrix[row][col] > 0){

                if(numberToAdd == undefined || (numberToAdd.row == -1))
                    numberToAdd = checkSum(row,col,direction,'col');
                
                let temp = addShift(numberToShift,row,col,shift,direction,'horizontal');
                numberToShift = temp.array;
                shift = temp.shift;
            }
        }
    }
    if(numberToShift.length > 0)
        updateMatrix(numberToShift);
}

function moveVertical(pos , direction){
    let numberToShift = [];
    let shift = 0;
    for (let col = 0; col < 4; col++){
        shift = pos;

        for (let row = pos; greaterOrLess(row , direction); row = row + direction){
            if(matrix[row][col] > 0){

                if(numberToAdd == undefined || (numberToAdd.row == -1))
                    numberToAdd = checkSum(row,col,direction,'row');

                let temp = addShift(numberToShift,row,col,shift,direction,'vertical');
                numberToShift = temp.array;
                shift = temp.shift;
            }
        }
    }
    if(numberToShift.length > 0)
        updateMatrix(numberToShift);
}

function checkSum(row,col,direction,colOrRow){
    let numberAdded;
    if(colOrRow == 'row')
        for(let k=row + direction; greaterOrLess(k , direction); k = k + direction){
            if(matrix[row][col] == matrix[k][col]){
                matrix[row][col] *= 2;
                updateScore( matrix[row][col]);
                //matrix[k][col] = 0;
                added = true;
                numberAdded = {row:k , col:col};
                break;
            } else 
                if(matrix[k][col] != 0)
                    break;
        }

    if(colOrRow == 'col')
        for(let k=col + direction; greaterOrLess(k , direction); k = k + direction){
            if(matrix[row][col] == matrix[row][k]){
                matrix[row][col] *= 2;
                updateScore( matrix[row][col]);
                //matrix[row][k] = 0;
                added = true;
                numberAdded = {row:row , col:k};
                break;
            } else 
                if(matrix[row][k] != 0)
                    break;
        }

        return numberAdded;
}

function greaterOrLess(index , direction){
    if(direction == 1)
        if(index < 4)
            return true;
        else
            return false;
    if(direction == -1)
        if(index >= 0)
            return true;
        else
            return false;

    return true;
}

function removeRow(elem){
    for (let index = 0; index < 4; index++) {
        elem.classList.remove(`row-${index}`);
    }
}

function removeCol(elem){
    for (let index = 0; index < 4; index++) {
        elem.classList.remove(`col-${index}`);
    }
}

function updateMatrix(numberToShift){
    noEventKey = true;
    matrix = [
        [0 , 0 , 0 , 0],
        [0 , 0 , 0 , 0],
        [0 , 0 , 0 , 0],
        [0 , 0 , 0 , 0]
    ];
    for(let i=0; i<numberToShift.length; i++){
        matrix[numberToShift[i].row][numberToShift[i].col] = numberToShift[i].value;
    }

    if(!areEqualMtrx(matrix,prevMatrix) || added == true)
        addNumber();

    setTimeout(() => {
    let defaultBox = document.querySelectorAll('.default-box');
    for(let i=0; i<defaultBox.length; i++){
        let reset = document.createElement('div');
        defaultBox[i].innerHTML = "";
        reset.className = "number-0 number-box aaa";
        defaultBox[i].append(reset);
    }
    
    boxInHtml = 0;
    boxInHtml = updateBox();
    noEventKey = false;
    }, 250);
}

function areEqualObj(a1 , a2){
    if(a1.length != a2.length)
        return false;
    for (let index = 0; index < a1.length; index++) {
        if(a1[index].row != a2[index].row){
            return false;
        } else{
            if(a1[index].col != a2[index].col)
            return false;
        }
    }
    return true;
}

function areEqualMtrx(a1 , a2){
    if(a1.length != a2.length){
        return false;}
    for (let index = 0; index < a1.length; index++) {
        for(let j=0; j<a1.length; j++){
            if(a1[index][j] != a2[index][j] )
            return false;
        }
    }
    return true;
}

function addNumber(){
    while(1){
        let random = Math.floor(Math.random()*4);
        let random2 = Math.floor(Math.random()*4);
        if(matrix[random][random2] == 0){
            matrix[random][random2] = 2;
            newNumber = {row:random,col:random2};
            break;
        }
    }
}

function updateScore(add){
    score += add;
    let scoreBox = document.getElementById('main-score-number');
    let topScoreBox = document.getElementById('top-score-number');

    scoreBox.className += " score-updated";
    setTimeout(() => {
        scoreBox.classList.remove('score-updated');
    }, 200);

    scoreBox.innerHTML = score;
    if(score > topScore){
        topScore = score;
        topScoreBox.innerHTML = topScore;
    }
}