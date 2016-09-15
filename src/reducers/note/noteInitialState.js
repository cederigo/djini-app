/* @flow */

import {Record} from 'immutable';
import type {Note} from '../../lib/types'

const note:Note = {
  id: undefined,
  title: '',
  description: '',
  type: 'reminder',
  done: false,
  dueDate: new Date(),
  contactName: '',
  wish: undefined,
  reminders: []
}

const InitialState = Record({
  edit: false,
  note
})

export default InitialState;
