
import { Actions } from 'react-native-router-flux'
import React, {Component} from 'react'
import { StyleSheet, View, Image, Dimensions} from 'react-native';

import {lamp, group, todo, giftwelcome} from '../../img'
import DjiniLogo from '../components/DjiniLogo'
import DjiniText from '../components/DjiniText'
import DjiniButton from '../components/DjiniButton'

const {height} = Dimensions.get('window')

export default class Welcome extends Component {
  render() {
    console.log('Window.height()', height)
    return(
      <View style={styles.container}>
        <DjiniLogo style={styles.logo}/>
        <View style={styles.feature}>
          <Image resizeMode='contain' style={styles.featureIcon} source={lamp}/>
          <DjiniText style={styles.featureText}>
            Halte Wünsche fest und teile sie mit Freunden
          </DjiniText>
        </View>
        <View style={styles.feature}>
          <Image resizeMode='contain' style={styles.featureIcon} source={group}/>
          <DjiniText style={styles.featureText}>
            Sammle Geschenkideen für Freunde
          </DjiniText>
        </View>
        <View style={styles.feature}>
          <Image resizeMode='contain' style={styles.featureIcon} source={giftwelcome}/>
          <DjiniText style={styles.featureText}>
            Erfülle Wünsche und Geschenkideen
          </DjiniText>
        </View>
        <View style={[styles.feature, {opacity: height > 1200 ? 0 : 1}]}>
          <Image resizeMode='contain' style={styles.featureIcon} source={todo}/>
          <DjiniText style={styles.featureText}>
            Vergiss nie mehr Geburtstage oder Geschenke
          </DjiniText>
        </View>
        <DjiniButton style={styles.button} onPress={Actions.login} caption="Los gehts!"/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  logo: {
    marginTop: 80,
    marginBottom: 50,
  },
  feature: {
    marginHorizontal: 20,
    marginBottom: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch'
  },
  featureIcon: {
    marginRight: 20,
    width: 60,
    height: 30
  },
  featureText: {
    flex: 1,
    fontSize: height > 600 ? 20 : 16,
    fontStyle: 'italic'
  },
  button: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20
  }
});
