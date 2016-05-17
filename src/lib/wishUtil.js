export function allowEdit(wish, user) {
  return wish.fromUserId === user.id
} 

export function allowDelete(wish, user) {
  return allowEdit(wish, user)
}

export function fulfillable(wish, user) {
  return !fulfilled(wish) && !toUser(wish, user) && !fromUser(wish, user)
}

export function fulfilledByUser(wish, user) {
  return wish.fulfillerId === user.id
}

export function fulfilled(wish) {
  return !(!wish.fulfillerId)
}

export function toUser(wish, user) {
  return wish.toUserId === user.id
}

export function fromUser(wish, user) {
  return wish.fromUserId === user.id
}

export function isIdea(wish) {
  return wish.fromUserId !== wish.toUserId
}

export function type(wish) {
  if (isIdea(wish)) {
    return 'Idee'
  } 
  return 'Wunsch'
}