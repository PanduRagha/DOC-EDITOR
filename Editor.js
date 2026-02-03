import { useEffect, useState } from "react";
import { socket } from "./socket";

const documentId = "codtech-doc";

function Editor() {
  const [text, setText] = useState("");

  useEffect(() => {
    socket.emit("get-document", documentId);

    socket.on("load-document", (content) => {
      setText(content);
    });

    socket.on("receive-changes", (data) => {
      setText(data);
    });
  }, []);

  const handleChange = (e) => {
    setText(e.target.value);
    socket.emit("send-changes", e.target.value);
    socket.emit("save-document", e.target.value);
  };

  return (
    <textarea
      value={text}
      onChange={handleChange}
      style={{ width: "100%", height: "100vh", fontSize: "18px" }}
    />
  );
}

export default Editor;
