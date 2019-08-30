function(req2) {
  var path = req2.path.slice(4),
      logged = req2.userCtx.name || null,
      query = req2.query,
      reply = {};
  switch(path[0]) {
    case 'activity':
      if (path[2]) {
        var diary = path[1];
        var start = path[2];
        reply.path = "_list/activity/memo_attribute";
        reply.query = {
          "startkey": '["'+diary+'", "Z", "'+start+'"]',
          "endkey": '["'+diary+'", "Z"]',
          "descending": "true",
          "limit": "30",
          "include_docs": "true"
        };
      } else if (path[1]) {
        var diary = path[1];
        reply.path = "_list/activity/memo_attribute";
        reply.query = {
          "startkey": '["'+diary+'"]',
          "endkey": '["'+diary+'", {}]',
          "include_docs": "true"
        };
      }
    break;
    case 'memo_attribute':
      var diary = path[1];
      reply.path = "_view/memo_attribute";
      reply.query = {
        "startkey": '["'+diary+'", "M"]',
        "endkey": '["'+diary+'", "M", {}]'
      };
    break;
    case 'memo':
      if (path[2]) {
        var memo = path[2];
        reply.path = "_list/memo/memo";
        reply.query = {
          "startkey": '["'+memo+'"]',
          "endkey": '["'+memo+'", {}]',
          "include_docs": "true"
        };
      } else if (path[1]) {
        var diary = path[1],
            [by] = req2.raw_path.split('=').slice(-1);
        reply.path = "_list/diary/memo_attribute";
        reply.query = {
          "startkey": '["'+diary+'", "D"]',
          "endkey": '["'+diary+'", "M", {}]',
          "by": by,
          "include_docs": "true"
        };
      } else {
        reply.path = "_list/diaries/diaries";
        reply.query = {
          "startkey": '[null]',
          "endkey": '[null, {}]',
          "include_docs": "true"
        };
      }
    break;
    case 'export':
      reply.path = "_list/export/memo_attribute";
      reply.query = {
        "startkey": '["'+path[1]+'", "D"]',
        "endkey": '["'+path[1]+'", "M", {}]',
        "by": "date",
        "in": ""+path[2],
        "include_docs": "true"
      };
    break;
    case 'diaries':
      if (path[2]) {
        reply.path = "_list/user_memo/diary";
        reply.query = {
          "startkey": '["'+logged+'", "'+path[1]+'", "D"]',
          "endkey": '["'+logged+'", "'+path[1]+'", "Mdate", {}]',
          "include_docs": "true"
        };
      } else {
        reply.path = "_list/diaries/diaries";
        reply.query = {
          "startkey": '["'+path[1]+'"]',
          "endkey": '["'+path[1]+'", {}]',
          "include_docs": "true"
        };
      }
    break;
    case 'item':
      reply.path = "_list/resource/resource";
    break;
    case 'phrase':
      reply.path = "_list/phrase/phrase";
      reply.query = {
        "startkey": '["'+path[1]+'"]',
        "endkey": '["'+path[1]+'", {}]',
        "group": "true"
      };
    break;
    case 'editable_text':
      reply.path = "_show/editable_text/"+path[1];
    break;
    case 'editable_memo':
      reply.path = "_list/editable_memo/memo";
      reply.query = {
        "startkey": '["'+path[1]+'"]',
        "endkey": '["'+path[1]+'", {}]',
        "include_docs": "true"
      };
    break;
    case 'graph':
      reply.path = "_list/graph/memo";
      reply.query = {
        "startkey": '["'+path[2]+'"]',
        "endkey": '["'+path[2]+'", {}]',
        "include_docs": "true"
      };
    break;
    case 'diagram':
      reply.path = "_list/diagram/memo";
      reply.query = {
        "startkey": '["'+path[2]+'"]',
        "endkey": '["'+path[2]+'", {}]',
        "include_docs": "true"
      };
    break;
    case 'table':
      reply.path = "_list/table/memo";
      reply.query = {
        "startkey": '["'+path[2]+'"]',
        "endkey": '["'+path[2]+'", {}]',
        "include_docs": "true"
      };
    break;
    case 'text_attributes':
      reply.path = "_list/text_attributes/attribute";
      reply.query = {
        "startkey": '["'+path[1]+'"]',
        "endkey": '["'+path[1]+'", {}]',
        "group_level": "2"
      };
    break;
    case 'corpus_words':
      reply.path = "_view/word";
      reply.query = {
        "startkey": '["'+path[1]+'"]',
        "endkey": '["'+path[1]+'", {}]',
        "group": "true"
      };
    break;
    case 'text_words':
      reply.path = "_view/word";
      reply.query = {
        "startkey": '["'+path[1]+'"]',
        "endkey": '["'+path[1]+'", {}]',
        "reduce": "false"
      };
    break;
    case 'kwic':
      if (path[1].length > 0) {
        reply.path = "_list/patterns/corpus_pattern";
        reply.query = {
          "key": path[1]
        };
      } else {
        reply.path = "_list/kwic/kwic";
        reply.query = {
          "include_docs": "true"
        };
      }
    break;
    case 'news':
      reply.path = "_list/news/news";
      reply.query = {
        "group": "false",
        "reduce": "false"
      };
    break;
    case 'user':
      reply.path = "_list/user/user";
      reply.query = {
        "startkey": '["'+path[1]+'", {}]',
        "endkey": '["'+path[1]+'"]',
        "descending": "true",
        "include_docs": "true"
      };
      if (path[2]) {
        reply.query.startkey = '["'+path[1]+'", "'+path[2]+'"]';
        reply.query.limit = "30";
      }
    break;
    case 'tasklist':
      reply.path = "_list/tasklist/tasklist";
      reply.query = {
        "startkey": '["'+path[1]+'"]',
        "endkey": '["'+path[1]+'", {}]',
        "include_docs": "true"
      };
    break;
    case 'todo':
      reply.path = "_view/tasklist";
      reply.query = {
        "startkey": '["'+path[1]+'"]',
        "endkey": '["'+path[1]+'", {}]'
      };
    break;
    case 'userlist':
      reply.path = "_view/userid/";
      reply.query = {
        "startkey": '"'+path[1]+'"',
        "limit": '5'
      };
    break;
    case 'change':
      reply.path = "../../_changes";
      reply.query = {
        "filter": 'cassandre/'+path[1],
        "id": '"'+path[2]+'"',
        "feed": 'langpoll',
        "since": '"'+path[3]+'"'
      };
    break;
    case 'script':
    case 'style':
      reply.path = reply.path = path[path.length-1];
    break;
    case undefined:
      if (req2.method == 'GET') reply.path = '_show/index';
      if (req2.method == 'POST') reply.path = '../../';
    break;
    default:
      if (req2.method == 'GET') {
        reply.path = "_show/object/"+path.join("/");
      }  else {
        reply.path = '../../'+path.join("/");
      }
    break;
  }
  return reply;
}