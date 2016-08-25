
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Actions } from 'react-native-router-flux'
import React, {Component} from 'react'
import { StyleSheet, View, StatusBar } from 'react-native';

import DjiniText from '../components/DjiniText'
import WMButton from '../components/WMButton'
import WMColors from '../lib/WMColors'

export default class Welcome extends Component {
  render() {
    return(
      <View style={ styles.container }>
        <StatusBar translucent={true} barStyle="light-content"/>

        <DjiniText style={ styles.title }>Djini</DjiniText>
        <View style={styles.feature}>
          <Icon style={styles.featureIcon} name="cake" size={40}/>
          <DjiniText style={styles.featureText}>
            Eigene Wünsche teilen
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

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WMColors.darkText,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  title: {
    marginVertical: 70,
    color: 'white',
    fontSize: 50,
  },
  feature: {
    marginHorizontal: 40,
    marginBottom: 10,
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
    color: 'white',
    fontSize: 16,
  },
  button: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20
  }
});
