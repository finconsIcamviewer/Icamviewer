import { Component, Input, ChangeDetectorRef, HostListener, ChangeDetectionStrategy, OnInit, AfterViewInit, DoCheck, KeyValueDiffers } from '@angular/core';
import { D3Service, ForceDirectedGraph, Node } from '../../d3';
import { SimulationNodeDatum, SimulationLinkDatum } from 'd3';

@Component({
  selector: 'graph',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg #svg [attr.width]="_options.width" [attr.height]="_options.height">
      <g [zoomableOf]="svg">
        <g [linkVisual]="link" *ngFor="let link of links"></g>
        <g [nodeVisual]="node" *ngFor="let node of nodes"
            [draggableNode]="node" [draggableInGraph]="graph"></g>
      </g>
    </svg>
  `,
  styleUrls: ['./graph.component.css']
})

export class GraphComponent implements OnInit, AfterViewInit,  DoCheck {
  
  @Input('nodes') nodes;
  @Input('links') links;
  graph: ForceDirectedGraph;
  differ: any;
  private _options: { width, height } = { width: 800, height: 600 };

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.graph.initSimulation(this.options);
  }


  constructor(private d3Service: D3Service, private ref: ChangeDetectorRef, differs:  KeyValueDiffers) {
    this.differ = differs.find([]).create(null);
  }

  ngOnInit() {
    /** Receiving an initialized simulated graph from our custom d3 service */
    this.graph = this.d3Service.getForceDirectedGraph(this.nodes, this.links, this.options);
    
    /** Binding change detection check on each tick
     * This along with an onPush change detection strategy should enforce checking only when relevant!
     * This improves scripting computation duration in a couple of tests I've made, consistently.
     * Also, it makes sense to avoid unnecessary checks when we are dealing only with simulations data binding.
     */
    this.graph.ticker.subscribe((e) => {
      
      let d3 = this.d3Service.getD3();
      let links = d3.selectAll("line").data(this.links);
      let nodes = d3.selectAll("ellipse").data(this.nodes);
      let k = 0.05// * e.alpha;
      
      links.each((d:any) => { 
          d.source.x += k, d.target.x -= k;
          d.x1 =  function(d) { return d.source.x; };
          d.y1 = function(d) { return d.source.y; };
          d.x2 = function(d) { return d.target.x; };
          d.y2 =  function(d) { return d.target.y; };
      });

      nodes.each((d:any) => {
        d.cx = function(d) { return d.x; }
        d.cy = function(d) { return d.y; };
      });
          
      this.ref.markForCheck();
    });
  }

  ngAfterViewInit() {
    this.graph.initSimulation(this.options);
    //this.d3Service.getD3().select('svg').select("g").attr("transform", `translate(1,1) scale(5)`);
  }

  //metodo implementato per intercettare gli oggetti nodes inseriti nell'app.component
  ngDoCheck(): void {
      var linksChanges = this.differ.diff(this.links);
      if(linksChanges){
        this.graph = this.d3Service.getForceDirectedGraph(this.nodes, this.links, this.options);
      }
     
  }

  get options() {
    return this._options = {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }
}
