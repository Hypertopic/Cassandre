function(o) {
  // !code lib/shared.js
  var diary = o.diary || o.corpus || o._id;
  var type = o.type || 'transcript';
  var name = o.name || '...';
  var date = o.date;
  var update = o.date;
  if (o.history) {
    date = o.history[0].date;
    update = o.history[o.history.length-1].date;
    for (var id in o.history) {
      var value = {
        _id: o.history[id].user
      }
      if (id < 1) {
        value.created = 1;
      } else {
        value.modified = 1;
      }
      if (o.diary_name) {
        value.diary_label = o.diary_name;
      } else {
        value.modified_id = o._id;
        value.modified_name = name;
        value.modified_type = type;
      }
      if (o.comment) {
        value.comment = 1;
      }
      emit([diary, 'Z', o.history[id].date], value);
    }
  }
  if (o.commented) {
    emit([diary, 'Z', date], {
      _id: o.user,
      comment: o.text,
      modified_id: o.commented
    });
  }

  if (o.diary_name) {
    ['name', 'date', 'update', 'type'].forEach(function(order) {
      emit([o._id, order, null, 'D'], { diary_name: o.diary_name });
    });
  } else if (!o.commented) {
    var type = o.type || 'transcript';
    var groundings = o.groundings || [];
    if (o.body) {
      var preview = o.body.replace(/\s/g, ' ');
    } else {
    if (o.speeches) {
      var preview = o.speeches.map(function(a) {
        var turn = a.text;
        if (a.actor) turn = '**'+a.actor.trim()+'** '+turn;
        return turn;
      });
      preview = preview.join('\n \n');
      } else {
      var preview = ' ';
      }
    }
    var contributors = [].concat(o.readers, o.contributors).sort();
    var users = contributors.filter(function(item, pos, ary) {return !pos || item != ary[pos - 1];} );
    if (o.readers == undefined || o.readers.length == 0) users.push(null);
    for (var i in users) {
      var user = users[i];
      var obj = {
        id: o._id,
        rev: o._rev,
        name: name,
        type: type,
        date: date,
        update: update,
        groundings: groundings,
        preview: preview.substr(0,3000)
      };
      emit([diary, 'name', user, 'M', name], obj);
      emit([diary, 'date', user, 'M', date], obj);
      emit([diary, 'update', user, 'M', update], obj);
      var sortkey = replaceDiacritics(name.substr(0,10)).toLowerCase().replace(/\W/g, '_');
      emit([diary, 'type', user, 'M', type+sortkey+o._id], obj);
    }
  }
}
