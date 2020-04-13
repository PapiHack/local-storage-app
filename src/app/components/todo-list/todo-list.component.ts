import { Component, OnInit } from '@angular/core';
import { Todo } from 'src/app/models/todo';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {

  todos: Array<Todo> = [];

  constructor(private db: DbService) { }

  ngOnInit() {
    this.todos = this.db.getAll();
  }

}
