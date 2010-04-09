function(e) {
  HEADER_OFFSET = 1;
  ROW_OFFSET = 1;
  if (e.topic) {
    emit([e.corpus,e._id],{"topic":e.topic});
  } else {
    emit([e.corpus,e._id], {attribute:["name",e.name]});
    start = e.name.length + HEADER_OFFSET;
    for each (p in e.posts) {
      end = start 
        + p.author.length 
        + p.timestamp.length 
        + p.text.length;
      emit([e.corpus,e._id,start,end], {attribute:["name",p.text]});
      emit([e.corpus,e._id,start,end], {attribute:["agent",p.author]});
      start = end + ROW_OFFSET;  
    }
  }
}