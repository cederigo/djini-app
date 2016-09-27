
import { Actions } from 'react-native-router-flux'
import React, {Component} from 'react'
import { StyleSheet, View, Image } from 'react-native';

import {lamp, group, todo, giftwhite} from '../../img'
import DjiniLogo from '../components/DjiniLogo'
import DjiniText from '../components/DjiniText'
import DjiniButton from '../components/DjiniButton'

export default class Welcome extends Component {
  render() {
    return(
      <View style={styles.container}>
        <DjiniLogo style={styles.logo}/>
        <View style={styles.feature}>
          <Image resizeMode='contain' style={styles.featureIcon} source={lamp}/>
          <DjiniText style={styles.featureText}>
            Wünsche festhalten &
            mit Freunden teilen
          </DjiniText>
        </View>
        <View style={styles.feature}>
          <Image resizeMode='contain' style={styles.featureIcon} source={group}/>
          <DjiniText style={styles.featureText}>
            Geschenkideen für Freunde merken
          </DjiniText>
        </View>
        <View style={styles.feature}>
          <Image resizeMode='contain' style={styles.featureIcon} source={giftwhite}/>
          <DjiniText style={styles.featureText}>
            Wünsche & Ideen erfüllen
          </DjiniText>
        </View>
        <View style={styles.feature}>
          <Image resizeMode='contain' style={styles.featureIcon} source={todo}/>
          <DjiniText style={styles.featureText}>
            Nie mehr Geburtstage & Geschenke vergessen
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
    fontSize: 17,
    fontStyle: 'italic'
  },
  button: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20
  }
});
