function(req2) {
  var path = req2.path.slice(4),
      logged = req2.userCtx.name,
      query = req2.query,
      reply = {};
  if (logged != null) logged = '"'+logged+'"';
  switch(path[0]) {
    case 'activity_chart':
      var diary = path[1];
      reply.path = "_list/activity_chart/memo_attribute";
      reply.query = {
        "startkey": '["'+diary+'", "Z"]',
        "endkey":   '["'+diary+'", "Z", {}]',
        "include_docs": "true"
      };
    break;
    case 'activity':
      switch (path.length) {
        case 3:
          var diary = path[1];
          var start = path[2];
          reply.path = "_list/activity/memo_attribute";
          reply.query = {
            "startkey": '["'+diary+'", "Z", "'+start+'"]',
            "endkey":   '["'+diary+'", "Z"]',
            "descending": "true",
            "limit": "30",
            "include_docs": "true"
          };
        break;
        case 2:
          reply.path = "_show/activity/"+path[1];
        break;
      }
    break;
    case 'memo_attribute':
      var diary = path[1];
      reply.path = "_view/memo_attribute";
      reply.query = {
        "startkey": '["'+diary+'", "name", '+logged+', "M"]',
        "endkey":   '["'+diary+'", "name", '+logged+', "M", {}]'
      };
    break;
    case 'memo_type':
      var diary = path[1],
          type = path[2];
      reply.path = "_view/memo_type";
      reply.query = {
        "startkey": '["'+diary+'", '+logged+', "'+type+'"]',
        "endkey":   '["'+diary+'", '+logged+', "'+type+'", {}]'
      };
    break;
    case 'memo':
      if (path[2]) {
        var memo = path[2];
        reply.path = "_list/memo/memo";
        reply.query = {
          "startkey": '["'+memo+'"]',
          "endkey":   '["'+memo+'", {}]',
          "include_docs": "true"
        };
      } else if (path[1]) {
        var diary = path[1];
        reply.path = "_list/diary/diary";
        reply.query = {
          "startkey": '["'+diary+'"]',
          "endkey":   '["'+diary+'", {}]'
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
    case 'memos':
      var reply = {};
      if (path[4]) {
        logged = 'null';
        var end = path[4];
      }
      if (path[3]) {
        var diary = path[1],
            order = path[2],
            start = path[3];
        reply.path = "_list/memos/memo_attribute";
        switch (order) {
          case 'date':
          case 'update':
            reply.query = {
              "startkey": '["'+diary+'", "'+order+'", '+logged+', "M", "'+start+'"]',
              "endkey":   '["'+diary+'", "'+order+'", '+logged+', "M"]',
              "descending": 'true',
              "limit": '30',
              "include_docs": 'true'
            };
          break;
          default:
            reply.query = {
              "startkey": '["'+diary+'", "'+order+'", '+logged+', "M", "'+start+'"]',
              "endkey":   '["'+diary+'", "'+order+'", '+logged+', "M", {}]',
              "limit": '30',
              "include_docs": 'true'
            };
          break;
        }
      }
      if (path[4]) {
        if (start !== end) {
          if (end !== '{}') end = '"'+end+'"';
          reply.query.endkey = '["'+diary+'", "'+order+'",'+logged+', "M", '+end+']';
          delete reply.query.limit;
        }
      }
    break;
    case 'old-memo':
      if (path[2]) {
        var memo = path[2];
        reply.path = "_list/memo/memo";
        reply.query = {
          "startkey": '["'+memo+'"]',
          "endkey":   '["'+memo+'", {}]',
          "include_docs": "true"
        };
      } else if (path[1]) {
        var diary = path[1],
            [by] = req2.raw_path.split('=').slice(-1);
        reply.path = "_list/diary/memo_attribute";
        if (by == 'update') {
          reply.query = {
            "startkey": '["'+diary+'", "'+by+'",'+logged+', "M", {}]',
            "endkey":   '["'+diary+'", "'+by+'",null, "D"]',
            "by": by,
            "descending": "true",
            "include_docs": "true"
          };
        } else {
          reply.query = {
            "startkey": '["'+diary+'", "'+by+'",null, "D"]',
            "endkey":   '["'+diary+'", "'+by+'",'+logged+', "M", {}]',
            "by": by,
            "include_docs": "true"
          };
        }
      } else {
        reply.path = "_list/diaries/diaries";
        reply.query = {
          "startkey": '[null]',
          "endkey":   '[null, {}]',
          "include_docs": "true"
        };
      }
    break;
    case 'export':
      reply.path = "_list/export/memo_attribute";
      reply.query = {
        "startkey": '["'+path[1]+'", "date", '+logged+', "M"]',
        "endkey":   '["'+path[1]+'", "date", '+logged+', "M", {}]',
        "by": "date",
        "in": ""+path[2],
        "include_docs": "true"
      };
      if (path[3]) reply.query.diary_name = path[3];
    break;
    case 'diaries':
      if (path[2]) {
        reply.path = "_list/user_memo/diary";
        reply.query = {
          "startkey": '["'+logged+'", "'+path[1]+'", "D"]',
          "endkey":   '["'+logged+'", "'+path[1]+'", "Mdate", {}]',
          "include_docs": "true"
        };
      } else {
        reply.path = "_list/diaries/diaries";
        reply.query = {
          "startkey": '["'+path[1]+'"]',
          "endkey":   '["'+path[1]+'", {}]',
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
        "endkey":   '["'+path[1]+'", {}]',
        "group": "true"
      };
    break;
    case 'editable_text':
      reply.path = "_show/editable_text/"+path[1];
    break;
    case 'memo_update_seq':
      reply.path = "_show/memo_update_seq/"+path[1];
    break;
    case 'editable_memo':
      reply.path = "_list/editable_memo/memo";
      reply.query = {
        "startkey": '["'+path[1]+'"]',
        "endkey":   '["'+path[1]+'", {}]',
        "include_docs": "true"
      };
    break;
    case 'graph':
      reply.path = "_list/graph/memo";
      reply.query = {
        "startkey": '["'+path[2]+'"]',
        "endkey":   '["'+path[2]+'", {}]',
        "include_docs": "true"
      };
    break;
    case 'diagram':
      reply.path = "_list/diagram/memo";
      reply.query = {
        "startkey": '["'+path[2]+'"]',
        "endkey":   '["'+path[2]+'", {}]',
        "include_docs": "true"
      };
    break;
    case 'statements':
      reply.path = "_list/statements/statements";
      reply.query = {
        "startkey": '["'+path[1]+'", '+logged+']',
        "endkey":   '["'+path[1]+'", '+logged+', {}]',
        "include_docs": "true"
      };
    break;
    case 'table':
      reply.path = "_list/table/memo";
      reply.query = {
        "startkey": '["'+path[2]+'"]',
        "endkey":   '["'+path[2]+'", {}]',
        "include_docs": "true"
      };
    break;
    case 'text_attributes':
      reply.path = "_list/text_attributes/attribute";
      reply.query = {
        "startkey": '["'+path[1]+'"]',
        "endkey":   '["'+path[1]+'", {}]',
        "group_level": "2"
      };
    break;
    case 'corpus_words':
      reply.path = "_view/word";
      reply.query = {
        "startkey": '["'+path[1]+'"]',
        "endkey":   '["'+path[1]+'", {}]',
        "group": "true"
      };
    break;
    case 'text_words':
      reply.path = "_view/word";
      reply.query = {
        "startkey": '["'+path[1]+'"]',
        "endkey":   '["'+path[1]+'", {}]',
        "reduce": "false"
      };
    break;
    case 'kwic':
      switch (path.length) {
        case 2:
          reply.path = '_list/patterns/corpus_pattern';
          reply.query = {
            "key": toJSON(path[1])
          };
        break;
        case 3:
          reply.path = '_list/kwic/kwic';
          reply.query = {
            "startkey": toJSON([path[1], path[2]]),
            "endkey":   toJSON([path[1], path[2]+'\ufff0']),
            "include_docs": 'true'
          };
        break;
      }
    break;
    case 'news':
      reply.path = "_list/news/news";
      reply.query = {
        "group": "false",
        "reduce": "false"
      };
    break;
    case 'save_diary_order':
    case 'save_diary_collection':
    case 'edit_name':
    case 'start_editing_memo':
    case 'update_memo_content':
    case 'adapt_memo':
    case 'checking_comment':
    case 'update_comment_content':
    case 'rename_diagram':
    case 'adapt_diagram':
    case 'adapt_graph':
    case 'track_memo':
    case 'modify_rights':
    case 'reader_unsubscribe':
      reply.path = '_update/'+path[0]+'/'+path[1];
    break;
    case 'user':
      reply.path = "_list/user/user";
      reply.query = {
        "startkey": '["'+path[1]+'", {}]',
        "endkey":   '["'+path[1]+'"]',
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
        "startkey": '["'+path[1]+'", '+logged+']',
        "endkey":   '["'+path[1]+'", '+logged+', {}]',
        "include_docs": "true"
      };
    break;
    case 'comments':
      reply.path = "_list/comments/tasklist";
      reply.query = {
        "startkey": '["'+path[1]+'", null, "C", {}]',
        "endkey":   '["'+path[1]+'", null, "B"]',
        "descending": "true",
        "include_docs": "true"
      };
    break;
    case 'todo':
      reply.path = "_view/tasklist";
      reply.query = {
        "startkey": '["'+path[1]+'"]',
        "endkey":   '["'+path[1]+'", {}]'
      };
    break;
    case 'userlist':
      reply.path = "_view/userid/";
      reply.query = {
        "startkey": '"'+path[1]+'"',
        "limit": '5'
      };
    break;
    case 'network':
      var diary = path[1];
      reply.path = "_list/network/memo_attribute";
      reply.query = {
        "startkey": '["'+diary+'", "date", '+logged+', "M"]',
        "endkey":   '["'+diary+'", "date", '+logged+', "M", {}]'
      };
    break;
    case 'changes':
      reply.path = "../../_changes";
      reply.query = {
        "filter": 'cassandre/'+path[1],
        "id": path[2],
        "feed": 'longpoll',
        "since": path[3]
      };
    break;
    case 'script':
    case 'style':
      reply.path = path[path.length-1];
    break;
    case '_session':
      reply.path = '../../../_session';
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
