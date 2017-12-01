import { Http } from "@angular/http";
import { Injectable } from "@angular/core";
import { Node, Link } from "app/d3";

@Injectable()
export class DbService{
    
    constructor (private http:Http){}

    getNodes(){
        return this.http.get('http://localhost:3000/nodes')
        .toPromise()
        .then((data) => {
          return data.json();
        })
    }

    getLinks(){
        return this.http.get('http://localhost:3000/links')
        .toPromise()
        .then((data) => {
          return data.json();
        })
    }

}