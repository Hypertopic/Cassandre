function(o) {
  // !code lib/shared.js
  var diary = o.diary || o.corpus || o._id,
      type = o.type || 'transcript',
      name = o.name || '...',
      date = o.date,
      update = o.date,
      contributors = [].concat(o.readers, o.contributors).sort(),
      users = [];
  if (typeof o.readers === "undefined" || o.readers.length == 0) contributors.push(null);
  users = contributors.filter(function(item, pos, ary) {return !pos || item != ary[pos - 1];} );
  if (o.history) {
    date = o.history[0].date;
    update = o.history[o.history.length-1].date;
    for (var id in o.history) {
      var value = {
        user: o.history[id].user,
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
      value.users = users;
      emit([diary, 'Z', o.history[id].date], value);
    }
  }
  if (o.commented && o.text != "") {
    emit([diary, 'Z', date], {
      _id: o.commented,
      comment: o.text,
      modified_id: o.commented,
      user: o.user
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
      var preview = o.body.replace(/[ \f\r\t\v\u00A0\u2028\u2029]/g, ' ');
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
