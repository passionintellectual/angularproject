import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Component, OnInit, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import * as d3 from 'd3';
import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';
import { BarDataModel } from '../../models/bar-data-model';

@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class BarchartComponent implements OnInit {
  @ViewChild('chart') private chartContainer: ElementRef;
  @Input() public data$: Observable<BarDataModel>;
  @Input() public xColumnName: string;
  @Input() public yColumnName: string;

  private margin: any = { top: 20, bottom: 20, left: 20, right: 20 };
  private chart: any;
  private width: number;
  private height: number;
  private xScale: any;
  private yScale: any;
  private colors: any;
  private xAxis: any;
  private yAxis: any;


  private rendered = false;
  constructor() { }

  ngOnInit() {

    if (this.data$) {
      this.data$
        .subscribe((d) => {
          this.initiateChart(d)
            .subscribe(x => this.updateGraph(d));
        });
    }
  }

  // ngOnChanges() {
  //   if (this.chart) {
  //     this.updateGraph();
  //   }
  // }

  initiateChart(data: any = []) {
    const done$ = new ReplaySubject<any>(1);
    const element = this.chartContainer.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
    const svg = d3.select(element).append('svg').attr('width', element.offsetWidth).attr('height', element.offsetHeight);

    // defining chart area
    this.chart = svg.append('g')
      .attr('class', 'bars')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    this.generateScalesAndAxis(data);

    // Generating axis
    this.xAxis = svg.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top + this.height})`)
      .call(d3.axisBottom(this.xScale)); this.yAxis = svg.append('g')
        .attr('class', 'axis axis-y')
        .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
        .call(d3.axisLeft(this.yScale));

    done$.next(true);
    return done$;
  }

  generateScalesAndAxis(data): any {
    // defining domain
    const xDomain = data.map(d => {
      console.log(d);
      return d ? d[this.xColumnName] : '';

    });
    // defining scales
    this.xScale = d3.scaleBand()
      .padding(0.1)
      .domain(xDomain)
      .rangeRound([0, this.width]);
    const yDomain = [0, d3.max(data, d => {
      // TODO: this will fail if d is integer
      return d ? parseFloat(d[this.yColumnName]) : 0;
    })];
    this.yScale = d3.scaleLinear()
      .domain(yDomain)
      .range([this.height, 0]);
  }

  updateGraph(data: any = []) {
    const { xScale, yScale, xColumnName, yColumnName, height } = this;
    this.generateScalesAndAxis(data);

    this.xAxis.transition().call(d3.axisBottom(this.xScale));
    this.yAxis.transition().call(d3.axisLeft(this.yScale));
    const update = this.chart.selectAll('.bar')
      .data(data);

    // remove exiting bars
    update.exit().remove();
    // update existing bars
    this.chart.selectAll('.bar').transition()
      .attr('x', d => this.xScale(d[0]))
      .attr('y', d => this.yScale(d[1]))
      .attr('width', d => this.getWidth(xScale))
      .attr('height', d => this.height - this.yScale(d[1]))
      .style('fill', (d, i) => this.colors(i));

    let halfXBandwidth = xScale.bandwidth() / 2;
    // add new bars
   const entered = update
      .enter();

      entered.append('text')
      .attr('x', d => xScale(d[xColumnName]))
      .attr('y', d => {
        return yScale(d[yColumnName]) ;
      })
      .text(d => d[yColumnName])
      .attr('text-anchor', 'start')
      .style('transform', (d, i, nodes) => {
        const w =    nodes[i].getComputedTextLength();
         return `translate(${w}px, -5px)`;

      })
      .attr('fill', d => d.color);

      entered.append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d[xColumnName]))
      .attr('y', d => yScale(0))
      .attr('width', this.getWidth(xScale))
      .style('transform', () => {

        let c = halfXBandwidth - (25 / 2); // TODO: 25 is bar width , have it in configuration service for the graph.
        return `translateX(${c}px)`;

      })
      .attr('height', 0)
      .transition()
      .delay((d, i) => i * 10)
      .attr('fill', d => d.color)
      .attr('y', d => {
        return yScale(d[yColumnName]);
      })
      .attr('height', d => height - yScale(d[yColumnName]));
  }


  private getWidth(xScale: any): any {
    return 25;
    // return xScale.bandwidth();
  }
}
