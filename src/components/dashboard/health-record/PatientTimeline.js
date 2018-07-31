import React, { Component } from 'react';
import moment from 'moment';
import Timeline from 'react-calendar-timeline/lib';
import Legend from './TimelineLegend';


export default class PatientTimeline extends Component {

  constructor(props){
    super(props);
    let groupHash = {}
    groupHash['Procedure'] = ['fa fa-hospital-o', 1]
    groupHash['Condition'] = ['fa fa-heartbeat', 2]
    groupHash['Lab'] = ['fa fa-flask', 3]
    groupHash['Medication'] = ['fa fa-stethoscope', 4]

    // Define the bounds of the timeline
    let visibleTimeStart = moment().clone().add(-1, 'years');
    let visibleTimeEnd = moment().clone()
    this.state = {
    items: props.items,
    groups: props.groups,
    visibleTimeStart: visibleTimeStart.valueOf(),
    visibleTimeEnd: visibleTimeEnd.valueOf(),
    timeSteps: {
        minute: 1,
        hour: 1,
        day: 1,
        month: 1,
        year: 1
    },
    legendItems: props.legendItems,
    hoverItem: {
    title: '',
    details: '',
    style: {top: 0, left: 0, display: 'none'}
}
  };
  this.oneMonth = this.oneMonth.bind(this)
  this.threeMonth = this.threeMonth.bind(this)
  this.sixMonth = this.sixMonth.bind(this)
  this.oneYear = this.oneYear.bind(this)
  this.fiveYear = this.fiveYear.bind(this)
  this.beginning = this.beginning.bind(this)
}

oneMonth(num) {
  let visibleTimeStart = moment().clone().add(-1, 'months');
  let visibleTimeEnd = moment().clone();
  this.setState({
  visibleTimeStart: visibleTimeStart.valueOf(),
  visibleTimeEnd: visibleTimeEnd.valueOf()
})
}

threeMonth() {
  let visibleTimeStart = moment().clone().add(-3, 'months');
  let visibleTimeEnd = moment().clone();
  this.setState({
  visibleTimeStart: visibleTimeStart.valueOf(),
  visibleTimeEnd: visibleTimeEnd.valueOf()
})
}

sixMonth() {
  let visibleTimeStart = moment().clone().add(-6, 'months');
  let visibleTimeEnd = moment().clone();
  this.setState({
  visibleTimeStart: visibleTimeStart.valueOf(),
  visibleTimeEnd: visibleTimeEnd.valueOf()
})
}

oneYear() {
  let visibleTimeStart = moment().clone().add(-1, 'year');
  let visibleTimeEnd = moment().clone();
  this.setState({
  visibleTimeStart: visibleTimeStart.valueOf(),
  visibleTimeEnd: visibleTimeEnd.valueOf()
})
}

fiveYear() {
  let visibleTimeStart = moment().clone().add(-5, 'year');
  let visibleTimeEnd = moment().clone();
  this.setState({
  visibleTimeStart: visibleTimeStart.valueOf(),
  visibleTimeEnd: visibleTimeEnd.valueOf()
})
}

beginning() {
  let items = this.state.items
  if(items.length === 0)
  {
    this.setState({
      visibleTimeStart: moment().clone().add(-1, 'week').valueOf(),
      visibleTimeEnd: moment().clone().valueOf()
    })
  }
  else
  {
    var k = 0
    let all_times = []
    for(k = 0; k < this.state.items.length; k++)
    {
      all_times.push(this.state.items[k]["start_time"])
    }
    let visibleTimeStart = moment.min(all_times)
    let visibleTimeEnd = moment().clone()
    alert(visibleTimeStart)
    this.setState({
    visibleTimeStart: visibleTimeStart.valueOf(),
    visibleTimeEnd: visibleTimeEnd.valueOf()
  })
}
}

// Create a set of groups that match those used by the items.
createGroupsForItems = (numGroups) => {
    // extract the group IDs
    let groups = [];

    for (let i = 0; i < numGroups; i++) {
        groups.push({id: i+1});
    }

    return groups;
}

getMaxGroup = (items) => {
    let max = 1;

    items.forEach((item) => {
        if (item.group > max) {
            max = item.group;
        }
    });

    return max;
}
  render() {
    return (
      <div>
      <div align="right">
      <button onClick={this.oneMonth}>
      1mo
      </button>

      <button onClick={this.threeMonth}>
      3mo
      </button>

      <button onClick={this.sixMonth}>
      6mo
      </button>

      <button onClick={this.oneYear}>
      1yr
      </button>

      <button onClick={this.fiveYear}>
      5yr
      </button>
      <button onClick={this.beginning}>
      All
      </button>
      </div>
        <Timeline
          groups={this.state.groups}
          items={this.state.items}
          visibleTimeStart={this.state.visibleTimeStart}
          visibleTimeEnd={this.state.visibleTimeEnd}
          rightSidebarWidth={0}
          rightSidebarContent={null}
          sidebarWidth={0}
          sidebarContent={null}
          timeSteps={this.state.timeSteps}
          lineHeight={40}
          lineWidth={40}
          itemHeightRatio={0.7}
          canMove={false}
          canResize={false}
          canSelect={false}
        />
        <Legend
        items={this.state.legendItems}
        />
      </div>
    );
  }
}
