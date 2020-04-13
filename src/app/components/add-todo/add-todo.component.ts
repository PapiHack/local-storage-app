import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DbService } from 'src/app/services/db.service';
import { Todo } from 'src/app/models/todo';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.scss'],
})
export class AddTodoComponent implements OnInit {
  todoForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private db: DbService) { }

  ngOnInit() {
    this.todoForm = this.formBuilder.group({
      name: new FormControl(null, [Validators.required, Validators.pattern('[a-zA-Z]+')])
    });
  }

  addTodo(event: any, todoInfos: any): void {
    event.preventDefault();
    if (todoInfos.name === null || todoInfos.name === '') {
      return ;
    }
    const todo = new Todo();
    todo.name = todoInfos.name;
    todo.complete = false;
    this.db.add(todo);
  }

}
