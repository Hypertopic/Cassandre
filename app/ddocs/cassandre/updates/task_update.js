function (doc, req) {
  if (!doc.deadlines) doc.deadlines = []
  let update = JSON.parse(req.body)
  if (update.id) {
    let i = doc.deadlines.map(t => t.id).indexOf(update.id)
    if (i > -1) {
      let existing_task = doc.deadlines[i]
      if (update.completed) {
        existing_task.completed = update.completed
      } else {
        if (doc.deadlines[i].completed) {
          delete existing_task.completed
        } else {
          existing_task = update
        }
      }
      if (existing_task.user && existing_task.date && existing_task.action) doc.deadlines.splice(i, 1, existing_task)
    }
  } else if (update.user && update.date && update.action) {
    update.id = doc.deadlines.length+'-'+Math.floor(Math.random() * 10)+Math.floor(Math.random() * 10)
    doc.deadlines.push(update)
  }
  return [doc, 'Task updated']
}
