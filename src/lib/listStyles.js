import {StyleSheet} from 'react-native'

// styles
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  emptyList: {
    textAlign: 'center',
  },
  row: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    paddingLeft: 25,
    paddingRight: 10
  },
  col: {
    flex: 1,
  },
  rowText: {
    flex: 1,
    fontSize: 20,
  },
  rowDescription: {
    fontSize: 14,
  },
  rowIcon: {
    color: 'white',
    fontSize: 28 
  },
  rowIconFavorite: {
    color: 'rgb(244, 230, 56)',
    fontSize: 28 
  },
  rowButton: {
    backgroundColor: 'transparent',
    marginLeft: 10,
    marginRight: -10,
    width: 50,
    height: 50
  },
  rowButtonIcon: {
    color: 'white'
  },
  swipeout: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderColor: 'white',
    borderLeftWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  swipeoutIcon: {
    backgroundColor: 'transparent',
    color: 'white',
  }
})
