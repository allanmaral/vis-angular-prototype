import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {DataSet, DataView, Timeline, TimelineOptions} from 'vis-timeline/standalone';
import moment from 'moment';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit {
  @Input() title!: string;

  @Input() options: Partial<TimelineOptions> = {};

  @ViewChild('container', {static: true})
  containerRef!: ElementRef<HTMLDivElement>;

  timeline!: Timeline;

  constructor() {
    console.log('Hummm');
  }

  ngOnInit() {
    console.log('Init', this.containerRef.nativeElement);
    this.createVis();
  }

  private createVis() {
    const container = this.containerRef.nativeElement;
    const timeline = new Timeline(container, null, this.visOptions);
    timeline.setGroups(this.groups);
    timeline.setItems(this.items);

    this.timeline = timeline;
  }

  private get groups() {
    return new DataSet([
      {id: 1, content: 'EQPM01', className: 'app-timeline-group equipment', nestedGroups: [6, 7], showNested: true},
      {id: 2, content: 'EQPM02', className: 'app-timeline-group equipment', nestedGroups: [8], showNested: true},
      {id: 3, content: 'EQPM03', className: 'app-timeline-group equipment', nestedGroups: [9], showNested: true},
      {id: 4, content: 'EQPM04', className: 'app-timeline-group equipment', nestedGroups: [10], showNested: true},
      {id: 5, content: 'EQPM05', className: 'app-timeline-group equipment', nestedGroups: [11, 12], showNested: true},

      {id: 6, content: 'ORI001', className: 'app-timeline-group'},
      {id: 7, content: 'ORI002', className: 'app-timeline-group'},
      {id: 8, content: 'ORI003', className: 'app-timeline-group'},
      {id: 9, content: 'ORI004', className: 'app-timeline-group'},
      {id: 10, content: 'ORI005', className: 'app-timeline-group'},
      {id: 11, content: 'ORI006', className: 'app-timeline-group'},
      {id: 12, content: 'ORI007', className: 'app-timeline-group'},
    ]);
  }

  private get items() {
    const count = 50;
    const items = new DataSet<any>();

    let order = 1;
    let equipment = 6;
    for (let j = 0; j < 7; j++) {
      let date = moment().startOf('day').toDate();
      for (let i = 0; i < count / 4; i++) {
        date.setHours(date.getHours() + 4 * (Math.random() < 0.5 ? 1 : 0));
        const start = new Date(date);

        if (moment(start).isSameOrAfter(moment().endOf('day'))) {
          break;
        }

        date.setHours(date.getHours() + 2 + Math.floor(Math.random() * 4));
        let end = new Date(date);
        if (moment(end).isSameOrAfter(moment().endOf('day'))) {
          end = moment().endOf('day').toDate();
          date = new Date(end);
        }

        const types = [{
            content: 'EM USO',
            className: 'app-timeline-item using'
          },
          {
            content: 'PARADA OPERACIONAL',
            className: 'app-timeline-item stop'
          },
          {
            content: 'INSPENÇÃO / LUBRIFICAÇÃO',
            className: 'app-timeline-item inspection'
          }
        ];

        items.add({
          id: order,
          group: equipment,
          start: start,
          end: end,
          ...types[Math.floor(Math.random() * 3)]
        });

        order++;
      }
      equipment++;
    }

    return items;
  }

  private get visOptions(): TimelineOptions {
    const startDate = moment().startOf('day').toDate();
    const endDate = moment().endOf('day').toDate();

    return {
      stack: false,
      start: startDate,
      end: endDate,
      snap: (date, scale, step) => {
        const hour = 60 * 60 * 1000;
        return Math.round(date.getTime() / hour) * hour;
      },
      editable: true,
      moveable: false,
      zoomable: false,
      margin: {
        item: 20,
        axis: 10,
      },
      timeAxis: {scale: 'hour', step: 1},
      showMajorLabels: false,
      orientation: 'top',
      showCurrentTime: false,
      groupHeightMode: 'fixed',
      type: 'range',
      format: {
        minorLabels: {
          hour: 'HH',
        },
        majorLabels: {
          hour: 'HH',
        }
      },
      ...this.options,
    };
  }
}
