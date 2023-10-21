export interface ISendMessage {
  groupId: number
  text: string
}

export interface IStartChating {
  userId: number
}

export interface IGetMessagesInGroup {
  groupId: string
}

export interface IGetMyGroups {}
