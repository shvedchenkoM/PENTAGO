class View {
  constructor(array, side_size) {
    this.game_view = document.getElementById("game_field");
    this.help_button = document.getElementById("is_user_need_help");
    this.left_robutton = document.getElementById("rotate_to_left");
    this.restart_the_game_button = document.getElementById("restart_the_game");
    this.right_robutton = document.getElementById("rotate_to_right");
    this.play_mode = document.getElementById("play_mode");
    this.game_over_mode = document.getElementById("game_over_mode");
    this.game_over_text = document.getElementById("game_over_text");

    if (this.game_view.getContext) {
      this.ctx = this.game_view.getContext("2d");
    }
    this.colors = ["White", "Black"];
    this.game_view.onclick = this.on_field_click.bind(this);
    this.cell_r = 20;
    this.dist_ce = 50;
    this.side_size = side_size;
  }

  set_onclick(observer) {
    this.onclick_observer = observer;
  }

  set_help_handler(handler) {
    this.help_button.onclick = handler;
  }

  set_left_robutton_handler(handler) {
    this.left_robutton.onclick = handler;
  }

  set_right_robutton_handler(handler) {
    this.right_robutton.onclick = handler;
  }

  set_restart_the_game_handler(handler) {
    this.restart_the_game_button.onclick = handler;
  }

  draw_back_field() {
    if (this.game_view.getContext) {
      // this.ctx = this.game_view.getContext('2d');
      this.ctx.beginPath();
      this.ctx.rect(75, 75, 230, 230);
      this.ctx.fillStyle = "#FCFFCB";
      this.ctx.fill();
      this.ctx.strokeStyle = "#FCFFCB";
      this.ctx.lineJoin = "round";
      this.ctx.lineWidth = 50;
      this.ctx.stroke();
    }
  }

  set_play_mode() {
    this.play_mode.style.display = "block";
    this.game_over_mode.style.display = "none";
  }

  set_game_over_mode() {
    this.game_over_mode.style.display = "block";
    this.play_mode.style.display = "none";
  }

  set_game_over_message(whose_win) {
    this.game_over_text.textContent = whose_win;
  }

  draw_part(part) {
    if (this.game_view.getContext) {
      // let i = convert_i(part)
      // let j = convert_j(part)
      let i, j;
      this.ctx.beginPath();
      let s = "OrangeRed";
      if (part == 1) {
        /*s = "Red";*/ i = 66;
        j = 66;
      }
      if (part == 2) {
        /*s = "Black";*/ i = 216;
        j = 66;
      }
      if (part == 3) {
        /*s = "Yellow";*/ i = 66;
        j = 216;
      }
      if (part == 4) {
        /*s = "Blue";*/ i = 216;
        j = 216;
      }
      this.ctx.rect(i, j, 98.3, 98.3);
      this.ctx.fillStyle = s;
      this.ctx.fill();
      this.ctx.strokeStyle = s;
      this.ctx.lineJoin = "round";
      this.ctx.lineWidth = 50;
      this.ctx.stroke();
      if (this.part_to_rotate === part) {
        this.ctx.rect(i, j, 98.3, 98.3);
        this.ctx.fillStyle = "Blue";
        this.ctx.fill();
        this.ctx.strokeStyle = "Blue";
        this.ctx.lineJoin = "round";
        this.ctx.lineWidth = 50;
        this.ctx.stroke();
      }
    }
  }

  draw_hole(arr) {
    if (this.game_view.getContext) {
      this.ctx = this.game_view.getContext("2d");
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
          this.ctx.beginPath();
          if (i > 2 && j > 2) {
            this.ctx.arc(
              15 + this.dist_ce * (i + 1),
              15 + this.dist_ce * (j + 1),
              this.cell_r,
              0,
              2 * Math.PI
            );
          }
          if (i <= 2 && j <= 2) {
            this.ctx.arc(
              10 + 5 + this.dist_ce * (i + 1),
              10 + 5 + this.dist_ce * (j + 1),
              this.cell_r,
              0,
              2 * Math.PI
            );
          }
          if (i > 2 && j <= 2) {
            this.ctx.arc(
              15 + this.dist_ce * (i + 1),
              10 + 5 + this.dist_ce * (j + 1),
              this.cell_r,
              0,
              2 * Math.PI
            );
          }
          if (j > 2 && i <= 2) {
            this.ctx.arc(
              10 + 5 + this.dist_ce * (i + 1),
              15 + this.dist_ce * (j + 1),
              this.cell_r,
              0,
              2 * Math.PI
            );
          }

          this.ctx.strokeStyle = "Black";
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
          this.draw_ball(i, j, arr[i][j]);
        }
      }
    }
  }
  draw_field(array) {
    this.draw_back_field();
    this.draw_part(1);
    this.draw_part(2);
    this.draw_part(3);
    this.draw_part(4);
    this.draw_hole(array);
    //this.draw_help();
  }

  //   draw_help() {
  //     if (this.game_view.getContext) {
  //       //this.ctx = this.game_view.getContext("2d");
  //       this.ctx.beginPath();
  //       this.ctx.rect(75, 375, 50, 10);
  //       this.ctx.fillStyle = "Black";
  //       this.ctx.fill();
  //       this.ctx.strokeStyle = "Green";
  //       this.ctx.lineJoin = "round";
  //       this.ctx.lineWidth = 60;
  //       let strk = this.ctx.stroke();
  //       this.ctx.font = "30px Arial";
  //       this.ctx.fillText("help?", 64.5, 390);
  //     }
  //   }

  draw_ball(j, i, color) {
    if (this.game_view.getContext) {
      this.ctx = this.game_view.getContext("2d");
      this.ctx.beginPath();
      if (i > 2 && j > 2) {
        this.ctx.arc(
          15 + this.dist_ce * (i + 1),
          15 + this.dist_ce * (j + 1),
          this.cell_r,
          0,
          2 * Math.PI
        );
      }
      if (i <= 2 && j <= 2) {
        this.ctx.arc(
          10 + 5 + this.dist_ce * (i + 1),
          10 + 5 + this.dist_ce * (j + 1),
          this.cell_r,
          0,
          2 * Math.PI
        );
      }
      if (i > 2 && j <= 2) {
        this.ctx.arc(
          15 + this.dist_ce * (i + 1),
          10 + 5 + this.dist_ce * (j + 1),
          this.cell_r,
          0,
          2 * Math.PI
        );
      }
      if (j > 2 && i <= 2) {
        this.ctx.arc(
          10 + 5 + this.dist_ce * (i + 1),
          15 + this.dist_ce * (j + 1),
          this.cell_r,
          0,
          2 * Math.PI
        );
      }

      this.ctx.strokeStyle = "Black";
      this.ctx.lineWidth = 1;

      if (color > 0) {
        this.ctx.fillStyle = this.colors[color - 1];
        this.ctx.fill();
      }
      this.ctx.stroke();
    }
  }

  draw_arraws() {
    if (this.game_field.is_wait_for_rotate_direction()) {
    }
  }

  on_arrows_click() {}

  on_field_click(event) {
    console.log(event);
    console.log(this.dist_ce, "-", this.cell_r);
    let col;
    let row;
    for (let i = 0; i < this.side_size; i++) {
      let XX = 15 + this.dist_ce * (i + 1);
      if (event.clientX < XX + this.cell_r && event.clientX > XX - this.cell_r)
        col = i;
      if (event.clientY < XX + this.cell_r && event.clientY > XX - this.cell_r)
        row = i;
    }
    this.onclick_observer(row, col);
  }
}
