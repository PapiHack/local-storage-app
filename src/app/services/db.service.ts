import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { Todo } from '../models/todo';

const CREATE_DB = `CREATE TABLE IF NOT EXISTS todo(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(25),
  complete BOOLEAN,
)`;

@Injectable({
  providedIn: 'root'
})
export class DbService {

  databaseObj: SQLiteObject;
  rowData: any = [];

  constructor(private sqlite: SQLite,
              private platform: Platform) {
    this.platform.ready().then(
      () => {
        if (this.platform.is('cordova')) {
          this.createDB();
        }
      }).catch(error => console.log('error when platform ready ' + error));
  }

  createDB(): void {
    this.sqlite = new SQLite();
    this.sqlite.create({
      name: 'data.db',
      location: 'default',
    })
    .then((db: SQLiteObject) => {
      this.databaseObj = db;
      db.executeSql(CREATE_DB, [])
      .then(() => console.log('Table Created !'))
      .catch(e => console.log('error when create table - ' + JSON.stringify(e)));
    })
    .catch(error => console.log('erreur when create db - ' + error));
  }

  add(todo: Todo): void {
    this.databaseObj.executeSql(`INSERT INTO todo (name, complete) VALUES (${todo.name}, ${todo.complete})`, [])
    .then(() => console.log('Todo inserted in DB !'))
    .catch(error => console.log('error ' + JSON.stringify(error)));
  }

  getAll(): any {
    this.databaseObj.executeSql(`SELECT * FROM todo`, [])
    .then(res => {
      this.rowData = [];
      if (res.rows.length > 0) {
        res.rows.map(item => this.rowData.push(item));
      }
    })
    .catch(error => console.log('error ' + JSON.stringify(error)));
    return this.rowData;
  }

  remove(todo: Todo): void {
    this.databaseObj.executeSql(`DELETE FROM todo WHERE id = ${todo.id}`, [])
    .then(() => console.log('Todo deleted !'))
    .catch(error => console.log('error ' + JSON.stringify(error)));
  }
}
