socket.on("user_name", (username) => {
  let { id, name } = username;
});

///// sender and reciver msg send snd recive
socket.on("send", async (data) => {
  let { id, message } = data;
  socket.broadcast.emit("recive", {
    message: message,
  });
  const saveChat = await Chat({
    sender_id: id,
    message: message,
  });
  await saveChat.save()
});
