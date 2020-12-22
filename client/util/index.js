const formatFilter = playload => {
  let where = ''
  let limit = ''
  let offset = ''
  let order = ''
  if (playload.where) {
    where = playload.where
  }
  if (playload.limit) {
    limit = playload.limit
  }
  if (playload.offset) {
    offset = playload.offset
  }
  if (playload.order) {
    order = playload.order
  }

  let filter = {
    where: where,
    limit: limit,
    offset: offset,
    order: order
  }

  return filter
}

export default {
  formatFilter
}
