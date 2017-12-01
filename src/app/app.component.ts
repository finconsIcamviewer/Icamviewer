import { Component } from '@angular/core';
import APP_CONFIG from './app.config';
import { Node, Link } from './d3/models';
import { Http } from '@angular/http';
import { DbService } from 'app/d3/services/db.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[DbService]
})

export class AppComponent {
  nodes: Node[] = []; 
  links: Link[] = [];
  hierarchy : any;
  constructor(private dbService : DbService) {
   
    this.dbService.getNodes()
    .then( items => {
      //this.nodes = items;
      items.forEach(e => {
        this.nodes.push(new Node(e.id, e.name, e.size, e.group))  
      });
      
      this.dbService.getLinks()
      .then( items2 => {
        this.links = items2;
        for (let i = 0; i <= this.nodes.length -1; i++) {
          this.nodes[i].linkCount = 0;
          for (let m = 0; m <= this.links.length -1; m++) {
            if(this.links[m].source == this.nodes[i].id){
              //console.log('incrementa')
              this.nodes[i].linkCount++;
            }
          }
        } 
      });  
    });
  }
}
