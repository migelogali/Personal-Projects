import random



class Connectfour:
    """Class that represents the Connectfour game, played by 2 players. Uses Player class so each player's data members can
    be accessed. End result of class determines who won the game or if there was a tie. Also provides information on the
    current state of the game, taking into account its rules."""

    def __init__(self):
        self._rows = 6
        self._cols = 7
        self._num_moves = 0
        # creating rows and columns instead of 42 spots
        self._board = [[0 for _ in range(self._cols)] for _ in range(self._rows)]
        # to determine who goes first
        self._current_player = random.choice([1, 2])
        # used as a game status check instead of 42 calls in main
        self._game_over = False

    def _print_board(self):
        for row in self._board:
            print(row)
        print()

    def _drop_checker(self, col):
        # -self._rows end range since going backwards indices
        for row in range(-1, -self._rows - 1, -1):
            if self._board[row][col] == 0:
                # current player now occupies that spot
                self._board[row][col] = self._current_player
                self._num_moves += 1
                return row % self._rows, col
        return None
    
    def _check_win(self, row, col):
        # implement 2D movement
        directions = [(0,1), (1,0), (1,1), (1,-1)]
        for dr, dc in directions:
            # since checking at initial checker, start count at 1
            count = 1
            r, c = row + dr, col + dc
            # between row and column maxes as well as same checker
            while 0 <= r < self._rows and 0 <= c < self._cols and self._board[r][c] == self._current_player:
                # update consecutive amount and keep going in that direction
                count += 1
                r, c = r+dr, c+dc
            r, c = row-dr, col-dc
            while 0 <= r < self._rows and 0 <= c < self._cols and self._board[r][c] == self._current_player:
                count += 1
                r, c = r-dr, c-dc
            # if connect four is reached
            if count >= 4:
                return True
        return False

    def play(self):
        while self._game_over is False:
            self._print_board()
            try:
                col = int(input(f"Player {self._current_player}, choose column (0–6): "))
                if col < 0 or col >= self._cols:
                    print("Invalid column. Try again.")
                    continue
                move = self._drop_checker(col)
                if move is None:
                    print("Column is full. Try another.")
                    continue
                row, col = move
                # end game since connect four is reached
                if self._check_win(row, col) is True:
                    self._print_board()
                    print(f"Player {self._current_player} wins!")
                    self._game_over = True
                elif self._num_moves == 42:
                    print("It is a tie!")
                    self._game_over = True
                else:
                    # update player turn
                    if self._current_player == 2:
                        self._current_player = 1
                    else:
                        self._current_player = 2
            except ValueError:
                print("Please enter a number.")




def full_game_test():
    game = Connectfour()
    print(f"Starting player: Player {game._current_player}\n")

    # Simulate moves in random columns until game ends
    while not game._game_over:
        # pick a random column
        col = random.randint(0, game._cols - 1)
        move = game._drop_checker(col)
        if move is None:
            # Column full, try another
            continue

        row, col = move

        # check for a win
        if game._check_win(row, col):
            game._print_board()
            print(f"Player {game._current_player} wins!")
            game._game_over = True
            break

        # check for tie
        if game._num_moves == 42:
            game._print_board()
            print("It is a tie!")
            game._game_over = True
            break

        # Switch player
        if game._current_player == 2:
            game._current_player = 1
        else:
            game._current_player = 2

    # Final board state
    game._print_board()
    print("Game over.")

full_game_test()


game = Connectfour()
game.play()