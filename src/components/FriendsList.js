import Immutable from 'immutable';
import React, { 
  StyleSheet,
  Component,
  PropTypes,
  View,
  ListView,
  TouchableHighlight,
  TouchableOpacity,
  Text
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingLeft: 10,
    backgroundColor: '#F6F6F6',
    height: 60,
    padding: 10
  },
  rowSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
    marginHorizontal: 10,
  },
  sectionHeader: {
    backgroundColor: '#48D1CC',
    paddingLeft: 10
  },
  sectionHeaderText: {
    fontSize: 16,
    color: 'white',
  },
  text: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold'
  },
  actions: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center'
  }
})



export default class FriendsList extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2,
      sectionHeaderHasChanged: (s1, s2) => s1 != s2
    })

    this._renderRow = this._renderRow.bind(this)

    this.state = {
      dataSource: ds.cloneWithRowsAndSections(this._getListViewData(this.props))
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.filterText !== this.props.filterText 
        || nextProps.favorites != this.props.favorites) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(this._getListViewData(nextProps))
      })
      this.refs.listView.scrollTo({animated: false})
    }
  }

  render() {
    return (
      <ListView
        ref="listView"
        style={styles.container}
        dataSource={this.state.dataSource}
        scrollRenderAheadDistance={2000}
        keyboardShouldPersistTaps={true}
        keyboardDismissMode="on-drag"
        enableEmptySections={true}
        pageSize={5}
        renderRow={this._renderRow}
        renderSeparator={this._renderSeparator}
        renderSectionHeader={this._renderSectionHeader}
      />
    )
  }

  _getFriendFilter(filterText) {
    const r = new RegExp(filterText, 'i')
    return friend => r.test(friend.name)
  }

  _getListViewData(props) {
    const {filterText, favorites, friends} = props
    return {
      'Favoriten': filterText ? favorites.filter(this._getFriendFilter(filterText)).toArray() : favorites.toArray(),
      'Kontakte': filterText ? friends.filter(this._getFriendFilter(filterText)).toArray() : friends.toArray()
    }
  }

  _renderRow (friend) {

    const {actions} = this.props

    return (
      <TouchableHighlight onPress={() => actions.show(friend)}>
        <View style={styles.row}>
          <Text style={styles.text}>
            {friend.name}
          </Text>
          {friend.registered ? null : 
            <TouchableOpacity style={styles.actions} onPress={() => actions.invite(friend)}>
              <Text>Invite</Text>
            </TouchableOpacity>
          }
        </View>
      </TouchableHighlight>
    );
  }

  _renderSectionHeader(data, sectionId) {
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{sectionId}</Text>
      </View>
    );
  }

  _renderSeparator(sectionID, rowID) {
    return (
      <View key={"SEP_" + sectionID + "_" + rowID}  style={styles.rowSeparator}/>
    );
  }
}

FriendsList.propTypes = {
  favorites: PropTypes.instanceOf(Immutable.OrderedMap).isRequired,
  friends: PropTypes.instanceOf(Immutable.OrderedMap).isRequired,
  actions: PropTypes.object.isRequired,
  filterText: PropTypes.string
}
