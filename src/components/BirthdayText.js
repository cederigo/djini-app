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
    return (
      <Text {...this.props}>
        {date ? `${text}${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}` : ''}
      </Text>
    )
  }
}
