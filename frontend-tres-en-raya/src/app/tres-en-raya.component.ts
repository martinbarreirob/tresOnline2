// import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';

// @Component({
//   selector: 'app-tres-en-raya',
//   templateUrl: './tres-en-raya.component.html',
//   styleUrls: ['./tres-en-raya.component.css']
// })

// export class TresEnRayaComponent implements OnChanges{
//   board: string[][] = [
//     ['', '', ''],
//     ['', '', ''],
//     ['', '', '']
//   ];
//   currentPlayer: string = '';
//   machinePlayer: string = ''
//   winner: string = '';
//   isGameOver: boolean = false;
//   playerWins: number = 0;
//   machineWins: number = 0;
//   turnoMachine: boolean = false;
//   isLoading: boolean = false;


//   @Input() playerChoice!: string;

//   ngOnChanges(changes: SimpleChanges): void {
//     if(changes['playerChoice']){
//       this.currentPlayer = this.playerChoice;
//       this.machinePlayer = this.playerChoice === 'X' ? 'O' : 'X';
//     }
//   }

//   getCellValue(row: number, col: number): string {
//     return this.board[row][col];
//   }

//   makeMove(row: number, col: number): void{
//     if(this.winner !== ''){
//       return;
//     }

//     if(!this.turnoMachine){
//       this.board[row][col] = this.currentPlayer;
//       if(this.checkWinner()) return;
//       this.togglePlayer();
//       //turno makina

//       this.isLoading = true;

//       setTimeout(() => {
//         // Movimiento de la máquina
//         this.isLoading = false;
//         this.machineMove();
//         if(this.checkWinner()) return;
//         this.togglePlayer();
//     }, 2000);
//     }
//   }

//   checkWinner(): boolean{
//     //Horizontales
//     for(let i=0; i < 3; i++){
//       if(this.board[i][0] === this.board[i][1] &&
//         this.board[i][1] === this.board[i][2] &&
//         this.board[i][0] !== ''){

//           if(this.turnoMachine === true){
//             this.winner = this.machinePlayer;
//             this.contador();
//           }else{
//             this.winner = this.currentPlayer;
//             this.contador();
//           }
//           console.log('Winner: ' + this.winner)
//           this.isGameOver = true;
//           return true;
//         }
//     }

//     // Verticales
//     for (let i = 0; i < 3; i++) {
//       if (this.board[0][i] === this.board[1][i] &&
//           this.board[1][i] === this.board[2][i] &&
//           this.board[0][i] !== '') {
//             if(this.turnoMachine === true){
//               this.winner = this.machinePlayer;
//               this.contador();
//             }else{
//               this.winner = this.currentPlayer;
//               this.contador();
//             }
//             console.log('Winner: ' + this.winner)
//             this.isGameOver = true;
//             return true;
//       }
//     }

//     //Diagonal
//     if (this.board[0][0] === this.board[1][1] &&
//       this.board[1][1] === this.board[2][2] &&
//       this.board[0][0] !== '') {
//         if(this.turnoMachine === true){
//           this.winner = this.machinePlayer;
//           this.contador();
//         }else{
//           this.winner = this.currentPlayer;
//           this.contador();
//         }
//         console.log('Winner: ' + this.winner)
//         this.isGameOver = true;
//         return true;
//     }

//     //Diagonal
//     if (this.board[0][2] === this.board[1][1] &&
//         this.board[1][1] === this.board[2][0] &&
//         this.board[0][2] !== '') {
//           if(this.turnoMachine === true){
//             this.winner = this.machinePlayer;
//             this.contador();
//           }else{
//             this.winner = this.currentPlayer;
//             this.contador();
//           }
//           console.log('Winner: ' + this.winner)
//           this.isGameOver = true;
//           return true;
//     }

//     //Empate
//     if (this.board.every(row => row.every(cell => cell !== ''))) {
//       console.log("Empate");
//       this.isGameOver = true;
//       return true;
//     }
//     return false
//   }

//   togglePlayer(): void{
//     this.turnoMachine = !this.turnoMachine;
//   }

//   machineMove(): void{
//     let machineRow: number;
//     let machineCol: number;
//     let bestMove: Array<number> | null;
//     let machineMove: Array<number> | null;



//     //Si hay un movimiento correcto la funcion machineMove lo suelta y termina la función
//     bestMove = this.findBestMove();
//     if(bestMove){
//       if(this.board[bestMove[0]][bestMove[1]] !== '') return;
//       this.board[bestMove[0]][bestMove[1]] = this.machinePlayer;
//       return;
//     }


//     //Si no hay ningun movimiento correcto se asigna uno aleatorio.
//       machineRow = Math.floor(Math.random() * 3);
//       machineCol = Math.floor(Math.random() * 3);
//       machineMove = [machineRow, machineCol];

//     while(this.board[machineMove[0]][machineMove[1]] !== ''){
//       machineRow = Math.floor(Math.random() * 3);
//       machineCol = Math.floor(Math.random() * 3);
//       machineMove = [machineRow, machineCol];
//     }

//     this.board[machineMove[0]][machineMove[1]] = this.machinePlayer;
//     this.checkWinner();

//   }

//   findBestMove(): Array<number> | null {
//     // 1. Comprobar si la máquina puede ganar con un movimiento.
//     for (let i = 0; i < 3; i++) {
//       for (let j = 0; j < 3; j++) {
//         if (this.board[i][j] === '') {
//           this.board[i][j] = this.machinePlayer; // Intento de movimiento
//           if (this.isWinningMove(this.machinePlayer, i, j)) {
//             this.board[i][j] = ''; // Deshacer el movimiento
//             return [i, j];
//           }
//           this.board[i][j] = ''; // Deshacer el movimiento
//         }
//       }
//     }

//     // 2. Comprobar si el jugador humano puede ganar con un movimiento y bloquearlo.
//     for (let i = 0; i < 3; i++) {
//       for (let j = 0; j < 3; j++) {
//         if (this.board[i][j] === '') {
//           this.board[i][j] = this.currentPlayer; // Intento de movimiento
//           if (this.isWinningMove(this.currentPlayer, i, j)) {
//             this.board[i][j] = ''; // Deshacer el movimiento
//             return [i, j];
//           }
//           this.board[i][j] = ''; // Deshacer el movimiento
//         }
//       }
//     }

//     // 3. Si no hay movimientos estratégicos, devolver null.
//     return null;
//   }

//   isWinningMove(player: string, row: number, col: number): boolean {
//     // Implementa la lógica para verificar si el movimiento en (row, col) es una jugada ganadora para 'player'.
//     // Puedes utilizar la lógica de tu método `checkWinner` como referencia.

//     //horizontal
//     if (this.board[row][0] === player &&
//         this.board[row][1] === player &&
//         this.board[row][2] === player) {
//         return true;
//     }

//     //Vertical
//     if (this.board[0][col] === player &&
//         this.board[1][col] === player &&
//         this.board[2][col] === player) {
//         return true;
//     }

//     //Diagonal
//     if (this.board[0][0] === player &&
//       this.board[1][1] === player &&
//       this.board[2][2] === player) {
//       return true;
//     }

//     //Diagonal
//     if (this.board[0][2] === player &&
//       this.board[1][1] === player &&
//       this.board[2][0] === player) {
//       return true;
//     }

//     return false
//   }

//   contador(): void{
//     if(this.winner === ''){
//       return
//     }

//     this.winner === 'X' ? this.playerWins++ : this.machineWins++
//   }

//   restartGame(): void{
//     this.board = [
//       ['', '', ''],
//       ['', '', ''],
//       ['', '', '']
//     ];
//     this.isGameOver = false;
//     this.winner = '';
//     this.turnoMachine = false;
//   }
// }
