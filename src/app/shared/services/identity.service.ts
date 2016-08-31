/**
 * Created by Herb on 8/30/2016.
 */
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
//Grab everything with import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {  IUser, ISchedule, IScheduleDetails, Pagination, PaginatedResult,
          IAspNetUser,AspNetUsersPaginatedResult,IAspNetUserDetails} from '../interfaces';
import { ItemsService } from '../utils/items.service';
import { ConfigService } from '../utils/config.service';

@Injectable()
export class IdentityService {

  _baseUrl: string = '';

  constructor(private http: Http,
              private itemsService: ItemsService,
              private configService: ConfigService) {
    this._baseUrl = configService.getApiIdentityURI();
  }


  getAspNetUsers(page?: number, itemsPerPage?: number): Observable<AspNetUsersPaginatedResult<IAspNetUser[]>> {
    var peginatedResult: AspNetUsersPaginatedResult<IAspNetUser[]> = new AspNetUsersPaginatedResult<IAspNetUser[]>();

    let headers = new Headers();
    if (page != null && itemsPerPage != null) {
      var url = 'v1/IdentityAdmin/users/page/'+itemsPerPage+'?pagingState=';
      headers.append('Pagination', page + ',' + itemsPerPage);
    }

    return this.http.get(this._baseUrl + url, {
      headers: headers
    })
      .map((res: Response) => {
        console.log(res.headers.keys());
        peginatedResult = res.json();
        return peginatedResult;
      })
      .catch(this.handleError);
  }
  getAspNetUserDetails(id: string): Observable<IAspNetUserDetails[]> {
    return this.http.get(this._baseUrl + 'v1/IdentityAdmin/users/id?id=' + id )
      .map((res: Response) => {
        return res.json();
      })
      .catch(this.handleError);
  }

  addAspNetUserRole(id:string,role:string): Observable<void> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.post(this._baseUrl + 'v1/IdentityAdmin/users/roles?id=' + id +"&role="+ role, "", {
      headers: headers
    })
      .map((res: Response) => {
        return;
      })
      .catch(this.handleError);
  }

  removeAspNetUserRole(id:string,role:string): Observable<void> {
    return this.http.delete(this._baseUrl + 'v1/IdentityAdmin/users/roles?id=' + id +"&role="+ role)
      .map((res: Response) => {
        return;
      })
      .catch(this.handleError);
  }

  getUsers(): Observable<IUser[]> {
    return this.http.get(this._baseUrl + 'users')
      .map((res: Response) => {
        return res.json();
      })
      .catch(this.handleError);
  }

  getUserSchedules(id: number): Observable<ISchedule[]> {
    return this.http.get(this._baseUrl + 'users/' + id + '/schedules')
      .map((res: Response) => {
        return res.json();
      })
      .catch(this.handleError);
  }

  createUser(user: IUser): Observable<IUser> {

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.post(this._baseUrl + 'users/', JSON.stringify(user), {
      headers: headers
    })
      .map((res: Response) => {
        return res.json();
      })
      .catch(this.handleError);
  }

  updateUser(user: IUser): Observable<void> {

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.put(this._baseUrl + 'users/' + user.id, JSON.stringify(user), {
      headers: headers
    })
      .map((res: Response) => {
        return;
      })
      .catch(this.handleError);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete(this._baseUrl + 'users/' + id)
      .map((res: Response) => {
        return;
      })
      .catch(this.handleError);
  }
  /*
   getSchedules(page?: number, itemsPerPage?: number): Observable<ISchedule[]> {
   let headers = new Headers();
   if (page != null && itemsPerPage != null) {
   headers.append('Pagination', page + ',' + itemsPerPage);
   }

   return this.http.get(this._baseUrl + 'schedules', {
   headers: headers
   })
   .map((res: Response) => {
   return res.json();
   })
   .catch(this.handleError);
   }
   */

  getSchedules(page?: number, itemsPerPage?: number): Observable<PaginatedResult<ISchedule[]>> {
    var peginatedResult: PaginatedResult<ISchedule[]> = new PaginatedResult<ISchedule[]>();

    let headers = new Headers();
    if (page != null && itemsPerPage != null) {
      headers.append('Pagination', page + ',' + itemsPerPage);
    }

    return this.http.get(this._baseUrl + 'schedules', {
      headers: headers
    })
      .map((res: Response) => {
        console.log(res.headers.keys());
        peginatedResult.result = res.json();

        if (res.headers.get("Pagination") != null) {
          //var pagination = JSON.parse(res.headers.get("Pagination"));
          var paginationHeader: Pagination = this.itemsService.getSerialized<Pagination>(JSON.parse(res.headers.get("Pagination")));
          console.log(paginationHeader);
          peginatedResult.pagination = paginationHeader;
        }
        return peginatedResult;
      })
      .catch(this.handleError);
  }

  getSchedule(id: number): Observable<ISchedule> {
    return this.http.get(this._baseUrl + 'schedules/' + id)
      .map((res: Response) => {
        return res.json();
      })
      .catch(this.handleError);
  }

  getScheduleDetails(id: number): Observable<IScheduleDetails> {
    return this.http.get(this._baseUrl + 'schedules/' + id + '/details')
      .map((res: Response) => {
        return res.json();
      })
      .catch(this.handleError);
  }

  updateSchedule(schedule: ISchedule): Observable<void> {

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.put(this._baseUrl + 'schedules/' + schedule.id, JSON.stringify(schedule), {
      headers: headers
    })
      .map((res: Response) => {
        return;
      })
      .catch(this.handleError);
  }

  deleteSchedule(id: number): Observable<void> {
    return this.http.delete(this._baseUrl + 'schedules/' + id)
      .map((res: Response) => {
        return;
      })
      .catch(this.handleError);
  }

  deleteScheduleAttendee(id: number, attendee: number) {

    return this.http.delete(this._baseUrl + 'schedules/' + id + '/removeattendee/' + attendee)
      .map((res: Response) => {
        return;
      })
      .catch(this.handleError);
  }

  private handleError(error: any) {
    var applicationError = error.headers.get('Application-Error');
    var serverError = error.json();
    var modelStateErrors: string = '';

    if (!serverError.type) {
      console.log(serverError);
      for (var key in serverError) {
        if (serverError[key])
          modelStateErrors += serverError[key] + '\n';
      }
    }

    modelStateErrors = modelStateErrors = '' ? null : modelStateErrors;

    return Observable.throw(applicationError || modelStateErrors || 'Server error');
  }
}
