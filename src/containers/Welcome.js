
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Actions } from 'react-native-router-flux'
import React, {Component} from 'react'
import { StyleSheet, View, Image } from 'react-native';

import DjiniBackground from '../components/DjiniBackground'
import DjiniText from '../components/DjiniText'
import WMButton from '../components/WMButton'
import WMColors from '../lib/WMColors'

export default class Welcome extends Component {
  render() {
    return(
      <DjiniBackground style={styles.container} animated={true}>
        <Image style={styles.logo} source={require('../../img/djini_logo.png')}/>
        <View style={styles.feature}>
          <Icon style={styles.featureIcon} name="cake" size={40}/>
          <DjiniText style={styles.featureText}>
            Wünsche festhalten und teilen
          </DjiniText>
        </View>
        <View style={styles.feature}>
          <Icon style={styles.featureIcon} name="group" size={40}/>
          <DjiniText style={styles.featureText}>
            Geschenkideen für Freunde merken
          </DjiniText>
        </View>
        <View style={styles.feature}>
          <Icon style={styles.featureIcon} name="folder-shared" size={40}/>
          <DjiniText style={styles.featureText}>
            Geschenke in Gruppen organisieren
          </DjiniText>
        </View>
        <WMButton style={styles.button} onPress={Actions.login} caption="Los gehts!"/>
      </DjiniBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  logo: {
    marginTop: 100,
    marginBottom: 70,
    width: 142,
    height: 87 
  },
  feature: {
    marginHorizontal: 40,
    marginBottom: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch'
  },
  featureIcon: {
    marginRight: 10,
    flex: 1,
    color: 'white'
  },
  featureText: {
    flex: 4,
    fontSize: 20,
  },
  button: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20
  }
});
