/**
 * Thanks to https://github.com/nlt2390/react-native-view-more-text
 * One minor change: Allow to pass style prop to wrapped text element.
 * TODO: Pull request -> Remove this file
 */
import React from 'react';
import { Text, View } from 'react-native';

export default ViewMoreText = React.createClass({
  propTypes: {
    renderViewMore: React.PropTypes.func,
    renderViewLess: React.PropTypes.func,
    numberOfLines: React.PropTypes.number.isRequired
  },
  isTruncated: false,
  originalHeight: 0,
  shouldShowMore: false, 
  contentHeight: 0,

  getInitialState(){
    this.resetData();
    return {
      numberOfLines: null,
      opacity: 0
    }
  },

  resetData(){
    this.isTruncated = false;
    this.originalHeight = 0;
    this.shouldShowMore = false;
  },

  componentWillReceiveProps(){
    this.resetData();

    this.setState({
      numberOfLines: null,
      opacity: 0
    })
  },

  onLayout(event){
    const {x, y, width, height} = event.nativeEvent.layout;

    if(height === 0 || this.state.opacity === 1) return false;

    this.setOriginalHeight(height);
    this.checkTextTruncated(height);
    if(this.state.numberOfLines === this.props.numberOfLines){
      this.setState({
        opacity: 1
      })
    }
  },
  
  setOriginalHeight(height){
    if(this.originalHeight === 0){
      this.originalHeight = height;

      this.setState({
        numberOfLines: this.props.numberOfLines
      })
    }
  },

  checkTextTruncated(height){
    if(height < this.originalHeight){
      this.shouldShowMore = true;
    }
  },

  onPressMore(){
    this.setState({
      numberOfLines: null
    });
  },

  onPressLess(){
    this.setState({
      numberOfLines: this.props.numberOfLines
    })
  },

  renderViewMore(){
    return (
      <Text onPress={this.onPressMore}>
        View More
      </Text>
    )
  },
  
  renderViewLess(){
    return (
      <Text onPress={this.onPressLess}>
        View Less
      </Text>
    )
  },

  renderFooter(){
    let {
      numberOfLines
    } = this.state;

    if (this.shouldShowMore === true){
      if(numberOfLines > 0) {
        return (this.props.renderViewMore || this.renderViewMore)(this.onPressMore);
      } else {
        return (this.props.renderViewLess || this.renderViewLess)(this.onPressLess);
      }
    }
  },

  render(){

    return (
      <View onLayout={this.onLayout} style={{opacity: this.state.opacity}}>
        <Text
          style={this.props.style}
          numberOfLines={this.state.numberOfLines}>
          {this.props.children}
        </Text>
        {this.renderFooter()}
        
        {
          this.state.numberOfLines &&
          <View style={{width: 1, height: 1}}></View>
        }

      </View>
    )
  }

})
