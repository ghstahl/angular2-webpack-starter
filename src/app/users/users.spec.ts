import { TestComponentBuilder } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  addProviders,
  inject
} from '@angular/core/testing';

// Load the implementations that should be tested
import { Users } from './users.component';

describe('About', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => addProviders([
    // provide a better mock
    {
      provide: ActivatedRoute,
      useValue: {
        data: {
          subscribe: (fn) => fn({yourData: 'yolo'})
        }
      }
    },
    Users
  ]));

  it('should log ngOnInit', inject([ Users ], (users) => {
    spyOn(console, 'log');
    expect(console.log).not.toHaveBeenCalled();

    users.ngOnInit();
    expect(console.log).toHaveBeenCalled();
  }));

});
