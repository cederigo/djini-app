import {Actions} from 'react-native-router-flux';

import React, { 
  StyleSheet,
  Component,
  View,
  TouchableOpacity,
  Text
} from 'react-native';

export class NavBar extends Component {
  render() {
    return (
      <View style={styles.navbar}>
         <NavButton enabled={true} onPress={Actions.pop} text="Zurück" style={styles.backButton}/>
         <Text style={styles.title}></Text>
         {this.props.children}
      </View>
    )
  }
}

export class NavButton extends React.Component {
  render() {
    const {enabled, onPress, text, style} = this.props
    return (
      <TouchableOpacity
        activeOpacity={enabled ? 0 : 1}
        style={[styles.navButton, style]}
        onPress={() => { if (enabled) { onPress() }}}>
        <Text style={[styles.buttonText, {color: enabled ? 'rgb(0, 122, 155)' : 'grey'}]}>{text}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  navbar: {
    marginTop: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#CDCDCD',
    flexDirection: 'row',
    alignSelf: 'stretch',
  },
  navButton: {
    padding: 15,
  },
  title: {
    flex: 1,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '500',
  }
})