import { Component, Input } from '@angular/core';
import { Node } from '../../../d3';

@Component({
  selector: '[nodeVisual]',
  template: `
    <svg:g [attr.transform]="'translate(' + node.x + ',' + node.y + ')'">
        <svg:ellipse
          class="node"
          [attr.fill]="node.color"
          cx="0"
          cy="0"
          [attr.rx]="node.rx"
          [attr.ry]="node.ry">
          <title>{{node.name}}</title>
        </svg:ellipse>
      <svg:text
          class="node-name"
          [attr.font-size]="node.fontSize">
        {{node.short}}
      </svg:text>
    </svg:g>
  `,
  styleUrls: ['./node-visual.component.css']
})
export class NodeVisualComponent {
  @Input('nodeVisual') node: Node;
}
