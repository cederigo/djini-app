export function listString(entries) {
  if (entries.length === 1) {
    return entries[0]
  }
  return `${entries.slice(0, entries.length - 1).join(', ')} und ${entries[entries.length - 1]}`
}

export function quantityString(quantity, one, many) {
  return quantity === 1 ? one : many
}
