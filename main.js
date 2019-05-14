class Controller {
  constructor(n) {
    this.side_size = n;

    this.init_game();
  }

  init_game() {
    this.field_model = new Field(this.side_size);
    this.game_view = new View(this.field_model.arr, this.side_size);
    this.game_view.draw_field(this.field_model.arr);
    this.game_view.set_play_mode();

    this.game_view.set_onclick(this.screen_click.bind(this));
    this.game_view.set_help_handler(this.help_button_handler.bind(this));
    this.game_view.set_left_robutton_handler(
      this.left_robutton_handler.bind(this)
    );
    this.game_view.set_restart_the_game_handler(
      this.restart_the_game_handler.bind(this)
    );
    this.game_view.set_right_robutton_handler(
      this.right_robutton_handler.bind(this)
    );

    this.field_model.set_on_turn_changed(this.handle_turn_changed.bind(this));
  }

  screen_click(row, col) {
    if (this.field_model.is_wait_for_ball_set()) {
      this.screen_click_set_ball(row, col);
      return;
    }
    if (this.field_model.is_wait_for_part_rotate_set()) {
      let part = this.field_model.get_part_by_coord(row, col);
      this.screen_click_chose_part_to_rotate(part);
      return;
    }
  }

  screen_click_set_ball(row, col) {
    this.field_model.set_ball(row, col);
    this.game_view.draw_field(this.field_model.arr);
    if (this.field_model.is_game_over()) {
      this.game_view.set_game_over_mode();
      this.game_view.set_game_over_message(
        this.field_model.whose_win + " is win"
      );
    }
  }

  screen_click_chose_part_to_rotate(part) {
    this.field_model.set_part_to_rotate(part);
    this.game_view.part_to_rotate = part;
    this.game_view.draw_field(this.field_model.arr);
  }
  screen_click_chose_rotate_direction(side) {
    this.field_model.rotate(side);
    this.game_view.part_to_rotate = -1;
    this.game_view.draw_field(this.field_model.arr);
    if (this.field_model.is_game_over()) {
      this.game_view.set_game_over_mode();
      this.game_view.set_game_over_message(
        this.field_model.whose_win + " is win"
      );
    }
  }

  handle_turn_changed(whose_turn) {
    if (whose_turn === 2) {
      let move = this.field_model.predict_next_move();
      setTimeout(
        function() {
          this.screen_click_set_ball(move.row, move.col);
          this.screen_click_chose_part_to_rotate(move.part);
          this.screen_click_chose_rotate_direction(move.side);
        }.bind(this),
        1000
      );
    }
    console.log(whose_turn);
  }

  help_button_handler(event) {
    let obj = this.field_model.predict_next_move();

    console.table(obj);
  }

  left_robutton_handler() {
    this.screen_click_chose_rotate_direction(-1);
  }
  right_robutton_handler() {
    this.screen_click_chose_rotate_direction(1);
  }
  restart_the_game_handler() {
    this.init_game();
  }

  // rotate(part, side)
  // {

  // }

  // cell_click(col, row)
  // {
  //     console.log(col, '+', row);
  //     this.set_ball(col, row);
  // }
}

let contr = new Controller(6);
