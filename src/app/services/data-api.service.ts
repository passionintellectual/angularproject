import { ReplaySubject } from 'rxjs/ReplaySubject';
import { BarDataModel } from './../models/bar-data-model';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { from } from 'rxjs/observable/from';

@Injectable()
export class DataApiService {


  get data(): ReplaySubject<BarDataModel[]> {
    const newData = new ReplaySubject<BarDataModel[]>(1);
    const data:  BarDataModel[]  = [
      {
        name: 'SENSEX',
        stock: 11.71,
        color: 'green'
      },
      {
        name: 'NIFTY',
        stock: 11.91,
        color: 'green'
      },
      {
        name: 'TAX SAVING',
        stock: 6.88,
        color: 'darkgrey'
      },
      {
        name: 'DEBT MF',
        stock: 8.36,
        color: 'darkgrey'
      },
      {
        name: 'EQUITY MF',
        stock: 9.95,
        color: 'darkgrey'
      },
      {
        name: 'LIQUID MF',
        stock: 27.49,
        color: 'darkgrey'
      }
    ];
    newData.next(data);
    return newData;
  }


  constructor() {

  }


}
