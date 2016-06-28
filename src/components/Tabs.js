'use strict';

import React, { Component, PropTypes } from 'react'

import WMColors from '../lib/WMColors'
import { StyleSheet, View, TouchableOpacity} from 'react-native'

export default class Tabs extends Component {

  static propTypes = {
    onSelect: PropTypes.func,
    selected: PropTypes.string
  
  }

  onSelect(el){
    if (el.props.onSelect) {
      el.props.onSelect(el);
    } else if (this.props.onSelect) {
      this.props.onSelect(el);
    }
  }

  render(){
    const self = this;
    let selected = this.props.selected
    if (!selected){
      React.Children.forEach(this.props.children.filter(c=>c), el=>{
        if (!selected || el.props.initial){
          selected = el.props.name || el.key;
        }
      });
    }

    return (
      <View style={[styles.tabbarView, this.props.style]}>
        {React.Children.map(this.props.children.filter(c=>c),(el, idx)=>
          <TouchableOpacity key={el.props.name+"touch"}
            style={[styles.iconView, (el.props.name || el.key) == selected ? styles.iconViewSelected : {}, idx === 0 ? styles.iconViewFirst : {} ]}
            onPress={()=>!self.props.locked && self.onSelect(el)}
            onLongPress={()=>self.props.locked && self.onSelect(el)}>
            {el}
          </TouchableOpacity>
          )}
      </View>
    );
  }
}
var styles = StyleSheet.create({
  tabbarView: {
    height:55,
    backgroundColor: WMColors.lightText,
    flexDirection: 'row',
    borderColor: 'white',
    borderBottomWidth: 1,
  },
  iconView: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    paddingLeft: 25,
    backgroundColor: 'rgb(199,199,199)',
    borderColor: 'white',
    borderBottomWidth: 1,
    borderLeftWidth: 1
  },
  iconViewFirst: {
    borderLeftWidth: 0
  },
  iconViewSelected: {
    backgroundColor: WMColors.lightText,
    borderBottomWidth: 0,
  }
});
