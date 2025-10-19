import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const ModalDelete = ({ children, ...props }) => {
  return (
    <>
      <Dialog open={props.open} onClose={props.onClose}>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>{props.content}</DialogContent>
        <DialogActions
          style={{
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {children}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalDelete;
