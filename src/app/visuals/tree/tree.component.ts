import { Component, Input, ChangeDetectorRef, HostListener, ChangeDetectionStrategy, OnInit, AfterViewInit, DoCheck, KeyValueDiffers } from '@angular/core';
import { D3Service, ForceDirectedGraph, Node } from '../../d3';
import { SimulationNodeDatum, SimulationLinkDatum } from 'd3';
import { Tree } from 'app/d3/models/tree';

@Component({
  selector: 'tree',
  template: `
    <svg [attr.width]="_options.width" [attr.height]="_options.height">
    </svg>
  `,
  styleUrls: ['./tree.component.css']
})

export class TreeComponent implements OnInit, DoCheck {
  
  @Input('nodes') nodes;
  @Input('links') links;
  tree: Tree;
  differ: any;
  private _options: { width, height } = { width: 800, height: 600 };

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    //this.tree.initSimulation(this.options);
  }

  constructor(private d3Service: D3Service, private ref: ChangeDetectorRef, differs:  KeyValueDiffers) {
    this.differ = differs.find([]).create(null);
  }

  ngOnInit() {
    /** Receiving an initialized simulated graph from our custom d3 service */
    //this.tree = this.d3Service.getTree(this.nodes, this.links, this.options);
  }

  //metodo implementato per intercettare gli oggetti nodes inseriti nell'app.component
  ngDoCheck(): void {
      var linksChanges = this.differ.diff(this.links);
      if(linksChanges){
        this.tree = this.d3Service.getTree(this.nodes, this.links, this.options);
      }
     
  }

  get options() {
    return this._options = {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }
}
