function(head, req) {
  send('{"rows":[')
  var row = getRow()
  var first = true
  while (row) {
    if (row.value>1) { // phrase is repeated
      if (!first) send(',\n')
      send(toJSON(row))
      first = false
    }
    row = getRow()
  }
  send(']}')
}
