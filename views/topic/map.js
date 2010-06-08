function(o) {
  if (o.notion) {
    emit([o.viewpointId, o._id], {topic: o.notion});
  } 
}
