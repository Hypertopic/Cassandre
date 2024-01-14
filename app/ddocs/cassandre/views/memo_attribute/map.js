function(o) {
  var diary = o.diary || o.corpus || o._id,
      type = o.type || 'transcript',
      name = o.name || '...',
      date = o.date,
      update = o.date,
      contributors = [],
      users = [];
  if (typeof o.readers === "undefined" || o.readers.length == 0) {
    contributors.push(null);
  } else {
    contributors = o.readers;
  }
  if (typeof o.contributors !== "undefined") contributors = contributors.concat(o.contributors);
  contributors = contributors.sort();
  users = contributors.filter(function(item, pos, ary) {return !pos || item != ary[pos - 1];} );
  if (o.history) {
    date = o.history[0].date;
    update = o.history[o.history.length-1].date;
    for (var [id, h] of Object.entries(o.history)) {
      var value = {
        user: h.user,
        _id: h.user
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
      emit([diary, 'Z', h.date], value);
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
  } else if (!o.commented && !o.user_activity) {
    var groundings = o.groundings || [],
        preview = ' ';
    if (o.statement) {
      preview = o.statement;
    }
    if (o.body) {
      preview = o.body.replace(/[ \f\r\t\v\u00A0\u2028\u2029]/g, ' ');
    } else {
      if (o.speeches) {
        preview = o.speeches.map(function(a) {
          var turn = a.text;
          if (a.actor) turn = '**'+a.actor.trim()+'** '+turn;
          return turn;
        });
        preview = preview.join('\n \n');
      }
    }
    for (var user of users) {
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
      if (o.initial) obj.initial = true;
      emit([diary, 'name', user, 'M', name], obj);
      emit([diary, 'date', user, 'M', date], obj);
      emit([diary, 'update', user, 'M', update], obj);
      let sortkey = name.substr(0,10)
        .normalize('NFD').replace(/\p{Diacritic}/gu, '')
        .toLowerCase().replace(/\W/g, '_');
      emit([diary, 'type', user, 'M', type+sortkey+o._id], obj);
      if (o.statement) {
        var ov = {
          id: diary,
          rev: 'statement',
          name: 'P³',
          type: 'statement',
          date: date,
          update: update,
          groundings: groundings,
          preview: o.statement
        };
        emit([diary, 'name', user, 'M', 'P³'], ov);
        emit([diary, 'date', user, 'M', date], ov);
        emit([diary, 'update', user, 'M', update], ov);
        emit([diary, 'type', user, 'M', 'storyline'+sortkey], ov);
      }
    }
  }
}
