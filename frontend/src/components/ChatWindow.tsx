import React from "react";
import {
  Dialog,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  Button,
} from "@mui/material";

interface ChatWindowProps {
  isOpen: boolean;
  chats: any[];
  onClose: () => void;
  currentUser: string; // Assume this is provided by the parent component
}

const ChatWindow: React.FC<ChatWindowProps> = ({ isOpen, chats, onClose }) => {
  const currentUser = localStorage.getItem("userId");
  const sortedChats = chats.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <List>
        {sortedChats.map((chat, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <ListItemText
                primary={chat.fromUser === currentUser ? "You" : "Manager"}
                secondary={
                  <React.Fragment>
                    <span style={{ marginRight: "20px" }}>{chat.message}</span>
                    <small>{new Date(chat.createdAt).toLocaleString()}</small>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider orientation="horizontal" />
          </React.Fragment>
        ))}
      </List>

      <form onSubmit={(e) => e.preventDefault()}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Send a message..."
          variant="outlined"
          margin="normal"
          name="message"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ marginTop: "10px" }}
        >
          Send
        </Button>
      </form>
    </Dialog>
  );
};

export default ChatWindow;
