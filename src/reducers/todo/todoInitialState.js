/* @flow */

import {Record} from 'immutable';
import {Todo} from '../../lib/types'

const todo:Todo = {
  id: undefined,
  title: '',
  description: '',
  type: 'find-gift', // One of 'find-gift', 'buy-gift'
  done: false,
  dueDate: new Date(),
  contactName: '',
  wish: undefined,
  reminders: []
}

const InitialState = Record({
  edit: false,
  todo
})

export default InitialState;
