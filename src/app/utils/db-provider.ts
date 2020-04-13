/**
 * Ceci est une sorte de wrapper (que j'ai trouvé sur le net et que j'ai légérement modifiée)
 * permettant au navigateur de supporter l'utilisation de sqlite. Je l'ai testé mais j'ai un
 * avertissement bizarre m'indiquant qu'il me faut le plugin sqlite for browser.
 * Je laisse ça là peut être que ça pourra t'aider :)
 */

import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

const DB_NAME = 'FeroUser';
const win: any = window;
export enum TABLES { Product, User }

@Injectable()
export class DbProvider {
  private dbPromise: Promise<any>;

  constructor(public platform: Platform) {
    this.dbPromise = new Promise((resolve, reject) => {
      try {
        let db: any;
        this.platform.ready().then(() => {
          if (this.platform.is('cordova') && win.sqlitePlugin) {
            db = win.sqlitePlugin.openDatabase({
              name: DB_NAME,
              location: 'default'
            });
          } else {
            // tslint:disable-next-line: max-line-length
            console.warn('Storage: SQLite plugin not installed, falling back to WebSQL. Make sure to install cordova-sqlite-storage in production!');
            db = win.openDatabase(DB_NAME, '1.0', 'database', 5 * 1024 * 1024);
          }
          resolve(db);
        });
      } catch (err) {
        reject({ err });
      }
    });
    this._tryInit();
  }

  // Initialize the DB with our required tables
  _tryInit(drop = false) {
    if (drop) {
      this.dropTable(TABLES.User);
      this.dropTable(TABLES.Product);
    }
    this.createProductTable();
    this.createUserTable();
  }

  private dropTable(table: TABLES) {
    this.query('DROP TABLE ' + TABLES[table]
    ).catch(err => {
      console.error('Storage: Unable to create initial storage User table', err.tx, err.err);
    });
  }

  private createProductTable() {
    this.query(`
      CREATE TABLE IF NOT EXISTS ` + TABLES[TABLES.Product] + ` (
                         id	INTEGER PRIMARY KEY AUTOINCREMENT,
                         name	TEXT NOT NULL UNIQUE
                     )
    `).catch(err => {
      console.error('Storage: Unable to create initial storage PRODUCT tables', err.tx, err.err);
    });
  }

  private createUserTable() {
    this.query(`
      CREATE TABLE IF NOT EXISTS ` + TABLES[TABLES.User] + ` (
                         id	INTEGER PRIMARY KEY AUTOINCREMENT,
                         name	DATE NOT NULL UNIQUE
                         birthday	DATE NOT NULL
                     )
    `).catch(err => {
      console.error('Storage: Unable to create initial storage User table', err.tx, err.err);
    });
  }

  list(table: TABLES): Promise<any> {
    return this.query('SELECT * FROM ' + TABLES[table]).then(data => {
      if (data.res.rows.length > 0) {
        console.log('Rows found.');
        if (this.platform.is('cordova') && win.sqlitePlugin) {
          const result = [];

          for (let i = 0; i < data.res.rows.length; i++) {
            const row = data.res.rows.item(i);
            result.push(row);
          }
          return result;
        } else {
          return data.res.rows;
        }
      }
    });
  }

  insert(newObject, table: TABLES): Promise<any> {
    return this.query('INSERT INTO ' + TABLES[table] + ' (' + this.getFieldNamesStr(newObject)
      + ') VALUES (' + this.getFieldValuesStr(newObject) + ')', []);
  }

  private getFieldNamesStr(newObject) {
    let fields = '';
    for (const f in newObject) {
      if (f !== 'id') { fields += f + ','; }
    }
    fields = fields.substr(0, fields.length - 1);
    return fields;
  }

  private getFieldValuesStr(object) {
    let fields = '';
    for (const f in object) {
      if (f !== 'id') { fields += '\"' + object[f] + '\",'; }
    }
    fields = fields.substr(0, fields.length - 1);
    return fields;
  }

  update(object, table: TABLES): Promise<any> {
    return this.query('UPDATE ' + TABLES[table] + ' SET ' + this.getFieldSetNamesStr(object) + ' WHERE id=?',
      this.getFieldValuesArray(object));
  }

  private getFieldSetNamesStr(object) {
    let fields = '';
    for (const f in object) {
      if (f !== 'id') { fields += f + '=? ,'; }
    }
    fields = fields.substr(0, fields.length - 1);
    return fields;
  }

  private getFieldValuesArray(object) {
    const fields = [];
    for (const f in object) {
      if (f !== 'id') { fields.push(object[f]); }
    }
    fields.push(object.id);
    return fields;
  }

  delete(table: TABLES, object): Promise<any> {
    const query = 'DELETE FROM ' + TABLES[table] + ' WHERE id=?';
    return this.query(query, object.id);
  }

  query(query: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.dbPromise.then(db => {
          db.transaction((tx: any) => {
              tx.executeSql(query, params,
                // tslint:disable-next-line: no-shadowed-variable
                (tx: any, res: any) => resolve({tx, res}),
                // tslint:disable-next-line: no-shadowed-variable
                (tx: any, err: any) => reject({tx, err}));
            },
            (err: any) => reject({ err }));
        });
      } catch (err) {
        reject({ err });
      }
    });
  }
}
