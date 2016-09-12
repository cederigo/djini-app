import React, {Component, PropTypes} from 'react';
import DjiniText from './DjiniText'

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
      <DjiniText {...this.props}>
        {date ? `${text}${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}` : ''}
      </DjiniText>
    )
  }
}
