import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { TodoComponent } from '../components/todo/todo.component';
import { TodoListComponent } from '../components/todo-list/todo-list.component';
import { AddTodoComponent } from '../components/add-todo/add-todo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage, TodoComponent, TodoListComponent, AddTodoComponent]
})
export class HomePageModule {}
