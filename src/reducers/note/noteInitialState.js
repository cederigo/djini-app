/* @flow */

import {Record} from 'immutable';
import type {Note} from '../../lib/types'

export const note:Note = {
  id: undefined,
  title: '',
  description: '',
  type: 'reminder',
  done: false,
  dueDate: undefined,
  wish: undefined,
  contact: undefined
}

const InitialState = Record({
  edit: false,
  note
})

export default InitialState;
