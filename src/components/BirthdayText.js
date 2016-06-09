import React, {Component, PropTypes} from 'react';
import {Text} from 'react-native';

export default class BirthdayText extends Component {

  static propTypes = {
    date: PropTypes.instanceOf(Date),
    text: PropTypes.string,
  }

  static defaultProps = {
    text: ''
  }

  render() {
    const {date, text} = this.props
    if (!date) {
      return //nothing to render
    }
    return (
      <Text {...this.props}>
        {`${text}${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`}
      </Text>
    )
  }
}
