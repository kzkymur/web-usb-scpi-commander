export const SetSendMsgSp = (id: string, sendMessage: (text: string) => Promise<boolean>) => ({
  type: 'SET_SEND_MSG_SP',
  payload: {
    id,
    sendMessage
  }
});