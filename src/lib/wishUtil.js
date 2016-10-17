export function allowEdit(wish, user) {
  return wish.fromUserId === user.id
} 

export function fulfillable(wish, user) {
  return (!fulfilled(wish) || fulfilledByUser(wish, user)) && !toUser(wish, user)
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