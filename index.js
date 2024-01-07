let inputLocation = { x:0 , y:0 } ;
const food_sound = new Audio('audio/food.mp3') ;
const endGame_sound = new Audio('audio/endgame.mp3') ;
const movement_sound = new Audio('audio/movement.mp3') ; 
let prevtime = 0 ;
let food_pos = { x:5 , y:5 } ;
let snake_arr = [ { x : 10 , y : 10 }] ;
let score = 0 ;

updateScore( );
document.querySelector('.highScore').innerHTML = `${Number(localStorage.getItem('highscore'))}` ;

// Cycles for change in position 
function frame( time ){
    requestAnimationFrame( frame ) ;
    
    if( ( time - prevtime )/1000 < 0.29 )
        return;
    prevtime = time ;
    game( ) ;
}

function game( ){

    let mainElem = document.querySelector('.main') ;
    mainElem.innerHTML = "" ;
    
    //setting positon of food 
    foodElem = document.createElement('div');
    foodElem.style.gridRowStart = food_pos.y;
    foodElem.style.gridColumnStart = food_pos.x;
    foodElem.classList.add('food');
    mainElem.appendChild( foodElem );

    //setting positon of sake head and body in each frame 
    for (let index = 0; index < snake_arr.length; index++) {
        const elem = snake_arr[index];
        const snakeElem = document.createElement('div');
        snakeElem.style.gridRowStart = elem.y;
        snakeElem.style.gridColumnStart = elem.x;
      
        if (index === 0) {
          snakeElem.classList.add('head');
        } else {
          snakeElem.classList.add('body');
        }
      
        mainElem.appendChild(snakeElem);
      }
    
    //movement of snake 
    for( let i = snake_arr.length - 1 ; i > 0 ; i-- ){
        snake_arr[i].x = snake_arr[i-1].x ;
        snake_arr[i].y = snake_arr[i-1].y ;
    }
    snake_arr[0].x = snake_arr[0].x + inputLocation.x ;
    snake_arr[0].y = snake_arr[0].y + inputLocation.y ;
    
    //increase in size when encountering food
    if( snake_arr[0].x === food_pos.x && snake_arr[0].y === food_pos.y ){
        food_sound.play( );
        score ++ ;
        updateScore( ) ;
        snake_arr.unshift( {x : snake_arr[0].x + inputLocation.x , y : snake_arr[0].y + inputLocation.y} );
        food_pos.x = Math.floor(Math.random() * (18 - 2 + 1)) + 2 ;
        food_pos.y = Math.floor(Math.random() * (18 - 2 + 1)) + 2 ;
    }
    
    //End Game 
    if( collide(snake_arr) ){
        endGame_sound.play( );
        movement_sound.pause( );

        inputLocation = { x:0 , y :0 } ;
        snake_arr = [ { x : 10 , y : 10 }] ;

        if( score > Number( localStorage.getItem('highscore')) ){
            document.querySelector('.highScore').innerHTML = `${score}` ;
        }
        score = 0 ;
        updateScore( );
    }
}

//conditions for collision 
function collide( snake_arr ){
    if( snake_arr[0].x > 20 || snake_arr[0].x < 0 || snake_arr[0].y > 20 || snake_arr[0].y < 0 )
        return true ;
    for( let i = snake_arr.length - 1 ; i > 0 ; i-- ){
        if( snake_arr[i].x === snake_arr[0].x && snake_arr[i].y === snake_arr[0].y )
            return true ;
    }
}

function updateScore( ){
    let scoreElem = document.querySelector( '.score') ;
    scoreElem.innerHTML = `${score}` ;
}

requestAnimationFrame( frame ) ;
addEventListener( 'keydown' , function(e){
    movement_sound.play();

    if (e.key === "ArrowUp") {
        inputLocation.x = 0;
        inputLocation.y = -1;

    } else if (e.key === "ArrowDown") {
        inputLocation.x = 0;
        inputLocation.y = 1;

    } else if (e.key === "ArrowLeft") {
        inputLocation.x = -1;
        inputLocation.y = 0;

    } else if (e.key === "ArrowRight") {
        inputLocation.x = 1;
        inputLocation.y = 0;
    }
})