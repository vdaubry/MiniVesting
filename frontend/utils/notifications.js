import { Bell } from "web3uikit";

/**************************************
 *
 * UI Helpers
 *
 **************************************/

export const handleSuccessNotification = (dispatch) => {
  dispatch({
    type: "info",
    message: "Transaction completed !",
    title: "Tx notification",
    position: "topR",
    icon: <Bell fontSize={20} />,
  });
};

export const handleFailureNotification = (dispatch, msg) => {
  dispatch({
    type: "error",
    message: msg,
    title: "Error",
    position: "topR",
    icon: <Bell fontSize={20} />,
  });
};
