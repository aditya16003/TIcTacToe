const form = document.getElementById('players-info');
var cells = document.getElementsByClassName('cell');
var message = document.querySelector('.message');
const overlay = document.querySelector('.overlay');
const start = document.getElementById('start-game');
const player1 = document.getElementById('player1');
const player2 = document.getElementById('player2');
const result = document.querySelector('.result');
const restart = document.getElementById('restart');
const newGame = document.getElementById('new-game')


const starting_board = [['', '', ''], ['', '', ''], ['', '', '']]



const Gameboard = function(){
    var _gameboard = starting_board.map(row => [...row]);

    const board_status = ()=>{
        return _gameboard;
    }

    const _invalid_move = (x, y)=>{
        if(_gameboard[x][y] != '') return true;
        else return false;
    }

    const update_board = (x, y, mark)=>{
        console.log(`invalid_move: ${_invalid_move(x, y)}`);
        if(_invalid_move(x, y)) return Gameflow.invalidMove();
        else Gameflow.validMove();
        _gameboard[x][y] = mark;
        Gameflow.incrementMoves();
    }

    const new_board = ()=>{
        _gameboard = starting_board.map(row => [...row]);
    }

    const winner = ()=>{
        var tie = true;
        var win_player;
        for(let i=0; i<3; i++){
            var com = _gameboard[i][i];
            let rowX = true;
            let colX = true;
            for(let j=0; j<3; j++){
                if(_gameboard[i][j] != com) colX = false;
                if(_gameboard[j][i] != com) rowX = false;
            }
            if(rowX || colX){
                win_player = (com == Gameflow.getPlayers()[0].get_mark())? Gameflow.getPlayers[0]: Gameflow.getPlayers[1]; 
                if(rowX){
                    return DisplayController.display_winner(win_player);
                }
                else  return DisplayController.display_winner(win_player);
            }
        }
        if(_gameboard[0][0] == _gameboard[1][1] && _gameboard[1][1]  == _gameboard[2][2]){
            win_player = (_gameboard[0][0] == Gameflow.getPlayers()[0].get_mark())? Gameflow.getPlayers()[0]: Gameflow.getPlayers()[1]; 
            return DisplayController.display_winner(win_player);
        }
        else if(_gameboard[0][2] == _gameboard[1][1] && _gameboard[1][1] == _gameboard[2][0]){
            win_player = (_gameboard[1][1] == Gameflow.getPlayers()[0].get_mark())? Gameflow.getPlayers()[0]: Gameflow.getPlayers()[1]; 
            return DisplayController.display_winner(win_player);
        }
        return DisplayController.display_draw();
    }
    return {winner, update_board, board_status, new_board};
}();

const Gameflow = function(){
    var turn = (Math.random() >= 0.5) ? 'Player0' : 'Player1';
    var noOfMoves = 0;
    const players = [];
    var invalid_move = false;
    const setPlayers = ()=>{
        var player0_name = document.getElementById('name0').value || 'Player1';
        var player1_name = document.getElementById('name1').value || 'Player2';
        var player0_mark = form.querySelector('input[name="mark"]:checked').value;
        var player1_mark = (player0_mark == 'X')? '0': 'X';
        var Player0 = Player(player0_name, player0_mark);
        var Player1 = Player(player1_name, player1_mark);
        players.push(Player0);
        players.push(Player1);
        DisplayController.display_playersinfo(players);
    }

    const getPlayers = ()=> {return players};

    const changeTurn = ()=>{
        if(invalid_move) return;
        if(turn == 'Player0') turn = 'Player1';
        else turn = 'Player0';
    }

    const player_turn = ()=>{
        if(turn == 'Player0') return players[0];
        else return players[1];
    }

    const validMove = ()=>{invalid_move = false};

    const invalidMove = ()=>{
        invalid_move = true;
    }

    const move_invalid = ()=>{return invalid_move};

    const incrementMoves = ()=>{
        if(invalid_move) return;
        noOfMoves++};

    const totalMoves = ()=>{return noOfMoves};

    const new_game = ()=>{
        noOfMoves = 0;
    }

    return{
        setPlayers, getPlayers, changeTurn, player_turn, invalidMove, incrementMoves, totalMoves, validMove, move_invalid, new_game
    }

}();

const DisplayController = function(){
    const update_display = (i, mark)=>{
        if(Gameflow.move_invalid()) return display_message('Invalid Move, try different cell!');
        const cell = document.getElementById(`${i}`);
        cell.textContent = mark;
        display_message('');
    }

    const display_message = (msg)=>{
        message.textContent = msg;
    }

    const display_winner = (win_player)=>{
        result.classList.add('active');
        result.querySelector('.result-msg').textContent = `${win_player.get_name()} is the Winner!`;
    }

    const display_draw = ()=>{
        result.classList.add('active');
        result.querySelector('.result-msg').textContent = 'The result is a Tie';
    }

    const display_playersinfo = (players)=>{
        document.getElementById('player1-name').textContent = `Name: ${players[0].get_name()}`;
        document.getElementById('player1-mark').textContent = `Mark: ${players[0].get_mark()}`;
        document.getElementById('player2-name').textContent = `Name: ${players[1].get_name()}`;
        document.getElementById('player2-mark').textContent = `Mark: ${players[1].get_mark()}`;
    }

    const display_activePlayer = (turn)=>{
        if(turn == Gameflow.getPlayers()[0].get_name()){
            player1.classList.add('active');
            player2.classList.remove('active');
        }

        else{
            player2.classList.add('active');
            player1.classList.remove('active');
        }

    }

    const restart_display = ()=>{
        for(let i=0; i<9; i++){
            update_display(i, '');
        }
        player1.classList.remove('active');
        player2.classList.remove('active');
        result.classList.remove('active');

        display_message('');
    }

    return {
        update_display, display_message, display_draw, display_winner, display_playersinfo,display_activePlayer, restart_display
    }
}();


const Player = (name, mark)=>{
    const make_move = ()=>{

    }

    const get_mark= ()=>{return mark};
    const get_name = ()=>{return name};
    return {get_mark, get_name};
}


//event listeners

start.addEventListener('click', ()=>{
    console.log('start button responding');
    overlay.classList.add('active');
    form.classList.add('active');
})

form.addEventListener('submit', ()=>{
    start.style.display = 'none';
    overlay.classList.remove('active');
    form.classList.remove('active');
    Gameflow.setPlayers();
    DisplayController.display_activePlayer(Gameflow.player_turn().get_name());
})

overlay.addEventListener('click', ()=>{
    overlay.classList.remove('active');
    form.classList.remove('active');
})

function addEventListenerList(list, event, fn) {
    for (var i = 0, len = list.length; i < len; i++) {
        list[i].addEventListener(event, fn, false);
    }
}

addEventListenerList(cells, "click", newMove);

restart.addEventListener('click', game_restart);
newGame.addEventListener('click', ()=>{
    window.location.reload();
})

function newMove(e){
    var index = Number(this.id);
    var x = Math.floor(index/3);
    var y = index%3;
    console.log(`x: ${x}, y: ${y}`);
    var current_mark = Gameflow.player_turn().get_mark();
    Gameboard.update_board(x, y, current_mark);
    Gameflow.changeTurn();
    DisplayController.update_display(index, current_mark);
    if(Gameflow.totalMoves()==9) Gameboard.winner();
    DisplayController.display_activePlayer(Gameflow.player_turn().get_name());
    console.log(Gameflow.player_turn().get_name());
}


function game_restart(){
    Gameboard.new_board();
    DisplayController.restart_display();
    Gameflow.new_game();
    console.log(starting_board);
}


