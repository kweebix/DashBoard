var MailBox = require('../models/mailbox.js')
var inbox = require('inbox');
var MailParser = require("mailparser").MailParser;


module.exports = function(io){

  io.on('connect', function(socket){

    socket.on('mailbox/list', function(callback){
      MailBox.find({},callback);
    });

    socket.on('mailbox/save', function(data, callback){
      if(data._id == null){
        data.user = socket.request.user;
        MailBox.create(data, callback);
      }else{
        var id = data._id
        delete data._id;
        MailBox.update({_id:id}, data, {}, callback);
      }
    });

    socket.on('mailbox/get', function(data, callback){
      MailBox.find(data, function(err, mailboxes){
        callback(err, mailboxes[0]);
      })
    });

    socket.on('mails/request', function(mailbox, callback){
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
      var client = createClientFromMailbox(mailbox)
      if(client == null){
        callback(new Error('Error on creating client'));
        return;
      }

      client.on('connect', function(){
        client.openMailbox("INBOX", function(error, info){
          if(error) throw error;
          client.listMessages(-50, function(err, messages){
            callback(err, messages);
          })
        });
      })

      client.connect();

    });

    socket.on('mailbox/getMailContent', function(mail, callback){
      var uid = mail.UID;

      MailBox.findById(mail.mailbox.id, function(err, mailbox){
        if(err) { callback(err); return }
        var client = createClientFromMailbox(mailbox)
        if(client == null){ callback(new Error('Error on creating client')); return; }
        client.connect();
        client.on('connect', function(){
          client.openMailbox("INBOX", function(error, info){
            var mailparser = new MailParser();

            // console.log('read ' + uid);
            var messageStream = client.createMessageStream(uid).pipe(mailparser);
            mailparser.on('end', function(mail_object){
              // console.log(mail_object);
              callback(err, mail_object.html);
            })
          })
        })

      })

    })


  });

function createClientFromMailbox(mailbox){
  var client = null;
  if(mailbox.type == null || mailbox.type =="imap"){
    client = inbox.createConnection(mailbox.imapPort, mailbox.imap,{
      auth:{
        user:mailbox.username,
        pass: mailbox.password
      }
    });
    
  }else if(mailbox.type == "google"){
    client = inbox.createConnection(false, "imap.gmail.com", {
      secureConnection: true,
      auth:{
        XOAuth2:{
          user: mailbox.email,
          clientId: mailbox.clientId,
          clientSecret: mailbox.clientSecret,
          refreshToken: mailbox.refreshToken,
          accessToken: mailbox.accessToken,
          timeout: 3600
        }
      }
    });
  }
  return client;
}

}