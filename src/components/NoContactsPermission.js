import { connect } from 'react-redux';
import React, {
  Component,
  View, Text,
  StyleSheet,
} from 'react-native';

class NoContactsPermission extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Kein Zugriff auf dein Adressbuch</Text>
        <Text style={styles.text}>Gehe zu Settings > Wishmaster</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
})

export default connect()(NoContactsPermission)
