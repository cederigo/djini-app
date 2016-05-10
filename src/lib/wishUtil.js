export function allowEdit(wish, user) {
  return wish.fromUserId === user.id
} 

export function allowDelete(wish, user) {
  return allowEdit(wish, user)
}

export function fullfillable(wish, user) {
  return !fullfilled(wish) && !toUser(wish, user) && !fromUser(wish, user)
}

export function fullfilledByUser(wish, user) {
  return wish.fullfillerId === user.id
}

export function fullfilled(wish) {
  return !(!wish.fullfillerId)
}

export function toUser(wish, user) {
  return wish.toUserId === user.id
}

export function fromUser(wish, user) {
  return wish.fromUserId === user.id
}