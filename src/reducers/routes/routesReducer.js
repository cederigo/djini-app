
/**
 * Thanks to https://github.com/aksonov/react-native-router-flux/issues/717
 * Hopefully this behaviour will be supported officially some day ;-)
 *
 */

import { ActionConst, Reducer } from 'react-native-router-flux';

let defaultReducer

const inTabMenu = (state) => {
  if (state && state.children && state.children.length > 0) {
    return state.children[0].name = "tabbar";
  }
  return false;
};

const getActiveTabName = (state) => {
  if (state && state.children && state.children.length > 0) {
    let cbase, parent = null, base = state;
    while((cbase = base.children)) { parent = base; base = cbase[base.index];  }
    if (parent && parent.children.length) {
       return parent.name;
    }
  }
  return undefined;
};

const getTabTreeIndex = (state) => {
  if (state && state.children && state.children.length > 0) {
    let cbase, parent = null, base = state;
    while((cbase = base.children)) { parent = base; base = cbase[base.index];  }
    return parent.index;
  }
  return undefined;
};

const getTabRootName = (state) => {
  if (state && state.children && state.children.length > 0) {
    let cbase, parent = null, base = state;
    while((cbase = base.children)) { parent = base; base = cbase[base.index];  }
    return parent.children[0].name;
  }
  return undefined;
};

const routesReducer = (state, action) => {
  // this part makes sure that when a menuIcon is pressed AND you are already in that menu tree,
  // it goes back to the root of that tree
  if (action.type === ActionConst.JUMP && inTabMenu(state)) {
    let activeTabName = getActiveTabName(state);
    // We only want to reset if the icon is tapped when we're already in the view
    if (activeTabName === action.key) {
      // if we're already at root, do not do anything.
      if (getTabTreeIndex(state) === 0) {
        return state;
      }
      // snap to root.
      let rootName = getTabRootName(state);
      if (rootName) {
        return defaultReducer(state, {key:rootName, type: 'reset'});
      }
    }
  }
  return defaultReducer(state, action);
}

export const createReducer = (params) => {
  defaultReducer = Reducer(params);
  return routesReducer;
}
