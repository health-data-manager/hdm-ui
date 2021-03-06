import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import getDisplayString from '../../../utils/getDisplayString';
import getProperty from '../../../utils/getProperty';
import isValid from '../../../utils/isValid';
import isValidAndNotEmpty from '../../../utils/isValidAndNotEmpty';

import LineGraph from '../shared/LineGraph';
import VerticalTimeline from '../shared/VerticalTimeline';

export default class Labs extends Component {
  labs = () => {
    return this.props.labs.map((lab) => {
      return { date: lab.effectiveDateTime, text: this.labDescription(lab), icon: 'flask' };
    });
  }

  labDescription = (lab) => {
    let text = getDisplayString(lab, 'code');
    if (lab.valueQuantity) text = `${text} ${_.round(lab.valueQuantity.value, 2)} ${lab.valueQuantity.unit}`;
    return text;
  }

  groupLabs() {
    let grouped = {};
    this.props.labs.forEach((lab) => {
      const code = getProperty(lab, 'code.coding.firstObject.code');
      const referenceRange = getProperty(lab, 'referenceRange');
      const value = getProperty(lab, 'valueQuantity');
      if (isValidAndNotEmpty(code) && isValid(value)) {
        let group = grouped[code];
        if (!isValid(group)) {
          group = {
            values: [],
            title: getProperty(lab, 'code.text') || getProperty(lab, 'code.coding.firstObject.display')
          };
          grouped[code] = group;
        }

        if (referenceRange) {
          group['referenceRanges'] = referenceRange.map((refRange) => {
            return { high: refRange.high, low: refRange.low, assessment: refRange.text };
          });
        }
        if (isValid(value.unit) && !isValid(group.unit)) {
          group.title += ` (${value.unit})`;
          group.unit = value.unit;
        }
        group.values.push({ value: value.value, date: lab.effectiveDateTime });
      }
    });
    return grouped;
  }

  renderLabGraphs() {
    const groups = this.groupLabs();
    let graphs = [];
    for (const index in groups) {
      let group = groups[index];
      graphs.push(
        <LineGraph
          key={index}
          title={group.title}
          data={group.values}
          referenceRanges={group.referenceRanges}
          unit={group.unit}
          chartWidth={this.props.chartWidth} />
      );
    }
    return graphs.length > 0 ? graphs : null;
  }

  render() {
    if (this.props.labs.length === 0) return <div className="labs no-entries">No entries.</div>;

    return (
      <div className="labs">
        {this.renderLabGraphs()}
        <VerticalTimeline items={this.labs()} />
      </div>
    );
  }
}

Labs.propTypes = {
  labs: PropTypes.array,
  chartWidth: PropTypes.number
};

Labs.defaultProps = {
  labs: []
};
