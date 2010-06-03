function(doc) {
  function preview(text,position) {
  }

  const CUTTER = /[\s\.;:\-,\!\?\)\(\]\[\{\}\«\»\'\`\\]/gi;
  var tokens;
  token = "";
  blank = "";
  w = "";
  debut = 0;
  for each (p in doc.posts){
	position = 0;
	for each (d in p.text){
	position++;
        if (!d.match(CUTTER))
		{w += d}
	else
		{
//
	begin = 0;
	begin = position - (w.length + 35);
	end = begin + 80;
	preview = "";
	preblank = "";
	postblank = "";
	if (begin < 0) {
		for (var i=0;i>begin;i--) {preblank += '_';}
		begin = 0;
		}
	if (end > p.text.length) {
		suppl = end - p.text.length; 
		for (var i=0;i<suppl;i++) {postblank += '_';}
		end = p.text.length;
		}
	preview = p.text.substring(begin,end);
	preview = preblank+preview+postblank;
//
		if (w != "") emit ([w,preview]);
		w = "";
		}
	}
   }
}
