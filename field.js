class Field {
  constructor(n) {
    this.arr = [];
    for (let i = 0; i < n; i++) {
      this.arr[i] = [];
      for (let j = 0; j < n; j++) {
        this.arr[i][j] = 0;
      }
    }
    this.on_turn_changed = null;
    this.side_size = n;
    this.whose_turn = 1;
    this.turn_state = 0;
    this.whose_win = 0;
  }

  set_on_turn_changed(handler) {
    this.on_turn_changed = handler;
  }

  reset_on_turn_changed() {
    this.on_turn_changed = null;
  }

  turn_changed() {
    if (this.on_turn_changed !== null) {
      this.on_turn_changed(this.whose_turn);
    }
  }

  output_state() {
    console.log(this.arr);
  }

  alter_turn() {
    this.whose_turn = (this.whose_turn % 2) + 1; // 2 - black_player 1 - white_player
    console.log(this.whose_turn);
  }

  is_ball_set(row, col) {
    return this.arr[row][col] !== 0;
  }

  set_ball(row, col) {
    if (this.is_wait_for_ball_set()) {
      if (!this.is_ball_set(row, col)) {
        this.arr[row][col] = this.whose_turn;
        this.turn_state = 1;
      }

      this.output_state();
    }
  }

  get_part_by_coord(row, col) {
    function divme(a, b) {
      return (a - (a % b)) / b;
    }
    return (
      2 * divme(row, this.side_size / 2) + divme(col, this.side_size / 2) + 1
    );
  }

  set_part_to_rotate(part) {
    if (this.is_wait_for_part_rotate_set()) {
      this.part_to_rotate = part;
      this.turn_state = 2;
    }
  }

  rotate(side) {
    //side == 1 // rotate to right; side == -1 // rotate to left
    let part = this.part_to_rotate;
    if (this.turn_state === 2) {
      let rotate_array = copy_array(this.arr, 6);
      if (part == 1) {
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            if (side == 1) rotate_array[i][j] = this.arr[2 - j][i];
            else rotate_array[i][j] = this.arr[j][2 - i];
          }
        }
      }
      if (part == 2) {
        for (let i = 0; i < 3; i++) {
          for (let j = 3; j < 6; j++) {
            if (side == 1) rotate_array[i][j] = this.arr[5 - j][i + 3];
            else rotate_array[i][j] = this.arr[j - 3][5 - i];
          }
        }
      }
      // if (arr[i][j] === color) {
      //   return true;
      // }
      if (part == 3) {
        for (let i = 3; i < 6; i++) {
          for (let j = 0; j < 3; j++) {
            if (side == 1) rotate_array[i][j] = this.arr[5 - j][i - 3];
            else rotate_array[i][j] = this.arr[j + 3][5 - i];
          }
        }
      }
      if (part == 4) {
        for (let i = 3; i < 6; i++) {
          for (let j = 3; j < 6; j++) {
            if (side == 1) rotate_array[i][j] = this.arr[5 - j + 3][i];
            else rotate_array[i][j] = this.arr[j][8 - i];
          }
        }
      }

      this.arr = copy_array(rotate_array, 6);
      console.log(this.arr);

      this.turn_state = 0;
      this.whose_turn = (this.whose_turn % 2) + 1;
      setTimeout(this.turn_changed.bind(this), 0);
    }
  }

  is_wait_for_ball_set() {
    return this.turn_state === 0;
  }

  is_wait_for_part_rotate_set() {
    return this.turn_state === 1;
  }

  is_wait_for_part_rotate_direction() {
    return this.turn_state === 2;
  }

  is_game_over() {
    let flag = false;
    let player1 = 1;
    let player2 = 2;
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        if (this.arr[i][j] === player1 || this.arr[i][j] === player2) {
          console.log(this.arr[i][j] + " player stay in " + i + " " + j);
          flag = false;
          //+
          if (j < 2) {
            flag = false;
            if (
              this.arr[i][j] === this.arr[i][j + 1] &&
              this.arr[i][j] === this.arr[i][j + 2] &&
              this.arr[i][j] === this.arr[i][j + 3] &&
              this.arr[i][j] === this.arr[i][j + 4]
            ) {
              flag = true;
              this.whose_win = this.arr[i][j];
              console.log(this.arr[i][j] + " player won");
              return flag;
            }
            console.log(flag + " 1 loop");
          }
          //
          //+
          if (i < 2) {
            flag = false;
            if (
              this.arr[i][j] === this.arr[i + 1][j] &&
              this.arr[i][j] === this.arr[i + 2][j] &&
              this.arr[i][j] === this.arr[i + 3][j] &&
              this.arr[i][j] === this.arr[i + 4][j]
            ) {
              flag = true;
              this.whose_win = this.arr[i][j];
              console.log(this.arr[i][j] + " player won");
              return flag;
            }
            console.log(flag + " 2 loop");
          }
          //
          //+
          if (i < 2 && j < 2) {
            let flag = false;

            if (
              this.arr[i][j] === this.arr[i + 1][j + 1] &&
              this.arr[i][j] === this.arr[i + 2][j + 2] &&
              this.arr[i][j] === this.arr[i + 3][j + 3] &&
              this.arr[i][j] === this.arr[i + 4][j + 4]
            ) {
              {
                flag = true;
                this.whose_win = this.arr[i][j];
                console.log(this.arr[i][j] + " player won");
                return flag;
              }
              console.log(flag + " 3 loop");
            }
          }
          //
          //+
          if (
            (i === 0 && j === 4) ||
            (i === 0 && j === 5) ||
            (i === 1 && j === 4) ||
            (i === 1 && j === 5)
          ) {
            flag = false;
            if (
              this.arr[i][j] === this.arr[i + 1][j - 1] &&
              this.arr[i][j] === this.arr[i + 2][j - 2] &&
              this.arr[i][j] === this.arr[i + 3][j - 3] &&
              this.arr[i][j] === this.arr[i + 4][j - 4]
            ) {
              flag = true;
              this.whose_win = this.arr[i][j];
              console.log(this.arr[i][j] + " player won");
              return flag;
            }
            console.log(flag + " 4 loop");
          }
          //
        }
      }
    }
  }

  predict_next_move() {
    return predict_next_move_func(this.arr, this.whose_turn);
  }
}
/////////////////////////

function predict_next_move_func(arr, whose_turn) {
  let array = copy_array(arr);
  let opponent_color = (whose_turn % 2) + 1;

  //если могу выиграть сейчас:
  if (is_opponent_wins_in_next_turn(array, opponent_color) !== false) {
    //console.log(is_opponent_wins_in_next_turn(array, whose_turn));
    let coord = is_opponent_wins_in_next_turn(array, opponent_color);
    console.log("3");
    return {
      row: coord.row,
      col: coord.col,
      part: (((coord.row % 3) + (coord.col % 3) + 1) % 3) + 1,
      side: 1,
    };
  }

  for (let p = 1; p <= 4; p++) {
    for (let s = -1; s <= 1; s += 2) {
      array = rotate_array(array, p, s);
      if (is_opponent_wins_in_next_turn(array, opponent_color) !== false) {
        coord = is_opponent_wins_in_next_turn(array, opponent_color);
        console.log("4");
        return {
          row: coord.row,
          col: coord.col,
          part: p,
          side: s,
        };
      }
      let st = 0 - s;
      array = rotate_array(array, p, st);
    }
  }
  //если могу выиграть сейчас.
  //блок выиграша оппонента на след ходу:
  if (is_opponent_wins_in_next_turn(array, whose_turn) !== false) {
    //console.log(is_opponent_wins_in_next_turn(array, whose_turn));
    let coord = is_opponent_wins_in_next_turn(array, whose_turn);
    console.log("1");
    return {
      row: coord.row,
      col: coord.col,
      part: (((coord.row % 3) + (coord.col % 3) + 1) % 3) + 1,
      side: 1,
    };
  }

  for (let p = 1; p <= 4; p++) {
    for (let s = -1; s <= 1; s += 2) {
      array = rotate_array(array, p, s);
      if (is_opponent_wins_in_next_turn(array, whose_turn) !== false) {
        //console.log(is_opponent_wins_in_next_turn(array, whose_turn));
        coord = is_opponent_wins_in_next_turn(array, whose_turn);
        console.log("2");
        return {
          row: coord.row,
          col: coord.col,
          part: 1,
          side: 1,
        };
      }
      let st = 0 - s;
      array = rotate_array(array, p, st);
    }
  }
  //блок выиграша оппонента на след ходу.

  //если оппонент может собрать открытую четверку, то блочить:
  if (is_opponent_get_open_four_next_turn(array, whose_turn) !== false) {
    coord = is_opponent_get_open_four_next_turn(array, whose_turn);
    console.log(coord);
    console.log("5");
    return {
      row: coord.row,
      col: coord.col,
      part: coord.part,
      side: coord.side,
    };
  }
  //если оппонент может собрать открытую четверку, то блочить.

  //если игрок может собрать открытую четверку, то собирать:
  if (is_opponent_get_open_four_next_turn(array, opponent_color) !== false) {
    coord = is_opponent_get_open_four_next_turn(array, opponent_color);
    console.log(coord);
    console.log("6");
    return {
      row: coord.row,
      col: coord.col,
      part: coord.part,
      side: coord.side,
    };
  }
  //если игрок может собрать открытую четверку, то собирать.

  //если оппонент может собрать открытую тройку, то блочить:
  if (is_opponent_get_open_three_in_next_move(array, whose_turn) !== false) {
    coord = is_opponent_get_open_three_in_next_move(array, whose_turn);
    console.log(coord);
    console.log("7");
    return {
      row: coord.row,
      col: coord.col,
      part: coord.part,
      side: coord.side,
    };
  }
  //если оппонент может собрать открытую тройку, то блочить.

  //если игрок может собрать открытую тройку, то собирать:
  if (
    is_opponent_get_open_three_in_next_move(array, opponent_color) !== false
  ) {
    coord = is_opponent_get_open_three_in_next_move(array, opponent_color);
    console.log(coord);
    console.log("8");
    return {
      row: coord.row,
      col: coord.col,
      part: coord.part,
      side: coord.side,
    };
  }
  //если игрок может собрать открытую тройкresу, то собирать.

  //если оппонент может собрать разорванную тройку, то собирать:
  //...
  //если оппонент может собрать разорванную тройку, то собирать.

  //если игрок может собрать разорванную тройку, то собирать:
  //...
  //если игрок может собрать разорванную тройку, то собирать.

  //если оппонент может собрать открытую двойку, то блочить:
  if (
    is_opponent_get_interrupted_open_two_in_next_turn(array, whose_turn) !==
    false
  ) {
    coord = is_opponent_get_interrupted_open_two_in_next_turn(
      array,
      whose_turn
    );
    console.log(coord);
    console.log("9");
    return {
      row: coord.row,
      col: coord.col,
      part: coord.part,
      side: coord.side,
    };
  }
  //если оппонент может собрать открытую двойку, то блочить.
  //если игрок может собрать открытую двойку, то собирать:
  if (
    is_opponent_get_interrupted_open_two_in_next_turn(array, opponent_color) !==
    false
  ) {
    coord = is_opponent_get_interrupted_open_two_in_next_turn(
      array,
      opponent_color
    );
    console.log(coord);
    console.log("10");
    return {
      row: coord.row,
      col: coord.col,
      part: coord.part,
      side: coord.side,
    };
  }
  //если игрок может собрать открытую двойку, то собирать.

  if (array[1][1] === 0) {
    return {
      row: 1,
      col: 1,
      part: 2,
      side: 1,
    };
  }
  if (array[1][4] === 0) {
    return {
      row: 1,
      col: 4,
      part: 1,
      side: -1,
    };
  }
  if (array[4][4] === 0) {
    return {
      row: 4,
      col: 4,
      part: 3,
      side: -1,
    };
  }
  if (array[4][1] === 0) {
    return {
      row: 4,
      col: 1,
      part: 4,
      side: 1,
    };
  }
  if (array[2][2] === 0) {
    return {
      row: 2,
      col: 2,
      part: 3,
      side: 1,
    };
  }

  if (array[3][1] === 0) {
    return {
      row: 3,
      col: 1,
      part: 4,
      side: -1,
    };
  }
}

//разорванная тройка:
function find_interrupted_open_three(arr, color) {
  if (find_interrupted_two(arr, color) !== false) {
    let a = find_interrupted_two(arr, color);
    if (
      (arr[a.nice_pos1[0]][a.nice_pos1[1]] === color &&
        arr[a.nice_pos2[0]][a.nice_pos2[1]] === 0) ||
      (arr[a.nice_pos1[0]][a.nice_pos1[1]] === 0 &&
        arr[a.nice_pos2[0]][a.nice_pos2[1]] === color)
    ) {
      return true;
    }
  }
  return false;
}
//разорванная тройка.

//разорванная двойка:
function find_interrupted_open_two(arr, color) {
  if (find_interrupted_two(arr, color) !== false) {
    let a = find_interrupted_two(arr, color);
    if (
      arr[a.nice_pos1[0]][a.nice_pos1[1]] === 0 &&
      arr[a.nice_pos2[0]][a.nice_pos2[1]] === 0
    ) {
      return true;
    }
  }
  return false;
}
//разорванная тройка.

//find_interrupted_two work:
function find_interrupted_two(arr, color) {
  for (let i = 0; i < 6; i++) {
    if (
      arr[1][i] === color &&
      //arr[2][i] === 0 &&
      //arr[3][i] === 0 &&
      arr[4][i] === color
    ) {
      return {
        begin: [1, i],
        end: [4, i],
        nice_pos1: [2, i],
        nice_pos2: [3, i],
      };
    }
    if (
      arr[i][1] === color &&
      //arr[i][2] === 0 &&
      //arr[i][3] === 0 &&
      arr[i][4] === color
    ) {
      return {
        begin: [i, 1],
        end: [i, 4],
        nice_pos1: [i, 2],
        nice_pos2: [i, 3],
      };
    }
  }
  if (
    arr[1][1] === color &&
    //arr[2][2] === 0 &&
    //arr[3][3] === 0 &&
    arr[4][4] === color
  ) {
    return { begin: [1, 1], end: [4, 4], nice_pos1: [2, 2], nice_pos2: [3, 3] };
  }
  if (
    arr[1][4] === color &&
    //arr[2][3] === 0 &&
    //arr[3][2] === 0 &&
    arr[4][1] === color
  ) {
    return { begin: [1, 4], end: [4, 1], nice_pos1: [2, 3], nice_pos2: [3, 2] };
  }
  return false;
}

//just four
function just_four_in_a_line(arr, color) {
  let value = 0;
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 3; j++) {
      if (
        arr[i][j] === color &&
        arr[i][j + 1] === color &&
        arr[i][j + 2] === color &&
        arr[i][j + 3] === color
      ) {
        value += 1;
      }

      if (
        arr[j][i] === color &&
        arr[j + 1][i] === color &&
        arr[j + 2][i] === color &&
        arr[j + 3][i] === color
      ) {
        value += 1;
      }

      if (
        arr[j][j] === color &&
        arr[j + 1][j + 1] === color &&
        arr[j + 2][j + 2] === color &&
        arr[j + 3][j + 3] === color
      ) {
        value += 1;
      }

      if (
        arr[j][5 - j] === color &&
        arr[j + 1][5 - j + 1] === color &&
        arr[j + 2][5 - j + 2] === color &&
        arr[j + 3][5 - j + 3] === color
      ) {
        value += 1;
        //return true;
      }
    }
  }

  //for(let i = 0; i<)
  if (value === 0) {
    return false;
  } else {
    return { bool: true, value: value };
  }
}

// just three
function just_three_in_a_line(arr, color) {}

function is_opponent_get_interrupted_open_two_in_next_turn(arr, color) {
  //возвращает координаты куда поставить или false
  let opp_color = (color % 2) + 1;
  let new_array = copy_array(arr);
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      if (
        new_array[i][j] === 0 &&
        find_interrupted_open_two(new_array, opp_color) === false
      ) {
        new_array[i][j] = opp_color;
        for (let p = 1; p <= 4; p++) {
          for (let s = -1; s <= 1; s += 2) {
            new_array = rotate_array(new_array, p, s);
            if (find_interrupted_open_two(new_array, opp_color) === true) {
              return { row: i, col: j, part: p, side: s };
            } else {
              new_array = rotate_array(new_array, p, 0 - s);
            }
          }
        }
        new_array[i][j] = 0;
      }
    }
  }
  return false;
}

//is_opponent_get_open_three_in_next_move ACHTUNG!
function is_opponent_get_open_three_in_next_move(arr, color) {
  //возвращает координаты куда поставить или false
  let opp_color = (color % 2) + 1;
  let new_array = copy_array(arr);
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      if (new_array[i][j] === 0) {
        new_array[i][j] = opp_color;
        for (let p = 1; p <= 4; p++) {
          for (let s = -1; s <= 1; s += 2) {
            new_array = rotate_array(new_array, p, s);
            if (find_open_three(new_array, opp_color) !== false) {
              return { row: i, col: j, part: p, side: s };
            } else {
              new_array = rotate_array(new_array, p, 0 - s);
            }
          }
        }
        new_array[i][j] = 0;
      }
    }
  }
  return false;
}

//find_open_three
function find_open_three(arr, color) {
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 6; j++) {
      if (
        arr[i][j] === 0 &&
        arr[i + 1][j] === color &&
        arr[i + 2][j] === color &&
        arr[i + 3][j] === color &&
        arr[i + 4][j] === 0
      ) {
        return { start: [i + 1, j], finish: [i + 3, j] };
      }

      if (
        arr[j][i] === 0 &&
        arr[j][i + 1] === color &&
        arr[j][i + 2] === color &&
        arr[j][i + 3] === color &&
        arr[j][i + 4] === 0
      ) {
        return { start: [j, i + 1], finish: [j, i + 3] };
      }
    }
  }
  for (let i = 0; i < 2; i++) {
    for (let j = 4; j < 6; j++) {
      if (
        arr[i][j] === 0 &&
        arr[i + 1][j - 1] === color &&
        arr[i + 2][j - 2] === color &&
        arr[i + 3][j - 3] === color &&
        arr[i + 4][j - 4] === 0
      ) {
        return { start: [i + 1, j - 1], finish: [i + 3, j - 3] };
      }
    }
  }
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      if (
        arr[i][j] === 0 &&
        arr[i + 1][j + 1] === color &&
        arr[i + 2][j + 2] === color &&
        arr[i + 3][j + 3] === color &&
        arr[i + 4][j + 4] === 0
      ) {
        return { start: [i + 1, j + 1], finish: [i + 3, j + 3] };
      }
    }
  }
  return false;
}

//is_opponent_wins_in_next_move work
function is_opponent_wins_in_next_turn(arr, whose_turn_color) {
  //console.log(arr);
  //вернет координаты куда поставить шарик, чтоб выиграть или false
  let opponent_color = (whose_turn_color % 2) + 1;
  let new_array = copy_array(arr);
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      if (new_array[i][j] === 0) {
        new_array[i][j] = opponent_color;
        if (is_player_win(new_array, opponent_color)) {
          return { row: i, col: j };
        } else {
          new_array[i][j] = 0;
        }
      }
    }
  }
  return false;
}

//is_oponent_get_open_four_next_turn work
function is_opponent_get_open_four_next_turn(arr, color) {
  //возвращает координаты куда поставить или false
  let opp_color = (color % 2) + 1;
  let new_array = copy_array(arr);
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      if (new_array[i][j] === 0) {
        new_array[i][j] = opp_color;
        for (let p = 1; p <= 4; p++) {
          for (let s = -1; s <= 1; s += 2) {
            new_array = rotate_array(new_array, p, s);
            if (find_open_four(new_array, opp_color) !== false) {
              return { row: i, col: j, part: p, side: s };
            } else {
              new_array = rotate_array(new_array, p, 0 - s);
            }
          }
        }
        new_array[i][j] = 0;
      }
    }
  }
  return false;
}

//find_open_four work
function find_open_four(arr, color) {
  if (
    arr[1][4] === color &&
    arr[2][3] === color &&
    arr[3][2] === color &&
    arr[4][1] === color
  ) {
    return { start: [1, 4], finish: [4, 1] };
  }

  if (
    arr[1][1] === color &&
    arr[2][2] === color &&
    arr[3][3] === color &&
    arr[4][4] === color
  ) {
    return { start: [1, 1], finish: [4, 4] };
  }

  for (let idx = 0; idx <= 5; idx++) {
    if (arr[1][idx] === color) {
      if (
        arr[1][idx] === color &&
        arr[2][idx] === color &&
        arr[3][idx] === color &&
        arr[4][idx] === color
      ) {
        return { start: [1, idx], finish: [4, idx] };
      }
    }
    if (arr[idx][1] === color) {
      if (
        arr[idx][1] === color &&
        arr[idx][2] === color &&
        arr[idx][3] === color &&
        arr[idx][4] === color
      ) {
        return { start: [idx, 1], finish: [idx, 4] };
      }
    }
  }
  return false;
}

//rotate_array work
function rotate_array(array, part, side) {
  let rotate_array = copy_array(array);
  if (part == 1) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (side == 1) rotate_array[i][j] = array[2 - j][i];
        else rotate_array[i][j] = array[j][2 - i];
      }
    }
  }
  if (part == 2) {
    for (let i = 0; i < 3; i++) {
      for (let j = 3; j < 6; j++) {
        if (side == 1) rotate_array[i][j] = array[5 - j][i + 3];
        else rotate_array[i][j] = array[j - 3][5 - i];
      }
    }
  }
  if (part == 3) {
    for (let i = 3; i < 6; i++) {
      for (let j = 0; j < 3; j++) {
        if (side == 1) rotate_array[i][j] = array[5 - j][i - 3];
        else rotate_array[i][j] = array[j + 3][5 - i];
      }
    }
  }
  if (part == 4) {
    for (let i = 3; i < 6; i++) {
      for (let j = 3; j < 6; j++) {
        if (side == 1) rotate_array[i][j] = array[5 - j + 3][i];
        else rotate_array[i][j] = array[j][8 - i];
      }
    }
  }

  return rotate_array;
}
//copy_array work
function copy_array(arr) {
  let res = arr.map(x => x.slice());
  return res;
}
//is_player_win work
function is_player_win(arr, color) {
  let flag = false;

  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      if (arr[i][j] === color) {
        flag = false;

        if (j < 2) {
          flag = false;
          if (
            arr[i][j] === arr[i][j + 1] &&
            arr[i][j] === arr[i][j + 2] &&
            arr[i][j] === arr[i][j + 3] &&
            arr[i][j] === arr[i][j + 4]
          ) {
            flag = true;

            return flag;
          }
        }

        if (i < 2) {
          flag = false;
          if (
            arr[i][j] === arr[i + 1][j] &&
            arr[i][j] === arr[i + 2][j] &&
            arr[i][j] === arr[i + 3][j] &&
            arr[i][j] === arr[i + 4][j]
          ) {
            flag = true;

            return flag;
          }
        }

        if (i < 2 && j < 2) {
          let flag = false;

          if (
            arr[i][j] === arr[i + 1][j + 1] &&
            arr[i][j] === arr[i + 2][j + 2] &&
            arr[i][j] === arr[i + 3][j + 3] &&
            arr[i][j] === arr[i + 4][j + 4]
          ) {
            {
              flag = true;

              return flag;
            }
          }
        }

        if (
          (i === 0 && j === 4) ||
          (i === 0 && j === 5) ||
          (i === 1 && j === 4) ||
          (i === 1 && j === 5)
        ) {
          flag = false;
          if (
            arr[i][j] === arr[i + 1][j - 1] &&
            arr[i][j] === arr[i + 2][j - 2] &&
            arr[i][j] === arr[i + 3][j - 3] &&
            arr[i][j] === arr[i + 4][j - 4]
          ) {
            flag = true;

            return flag;
          }
        }
      }
    }
  }
  return false;
}

let arr = [
  [0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0],
];
