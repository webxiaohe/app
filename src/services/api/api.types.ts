import { GeneralApiProblem } from "./api-problem"

export interface Account {
  username: string
  address: string
  unconfirmedSignature: boolean
  secondSignature: boolean
  secondPublicKey: string
  multisignatures: []
  u_multisignatures: []
  lockHeight: number
  unconfirmedBalance: number
  balance: number
  publicKey: string
}

export interface Transfer {
  
}

export interface Transactions {
  transactions: [],
  count: number
}

export type GetAccountsResult = { kind: "ok"; accounts: Account[] } | GeneralApiProblem
export type GetAccountResult = { kind: "ok"; account: Account } | GeneralApiProblem
export type TransferAccount = { kind: "ok"; transfer: Transfer } | GeneralApiProblem
export type GetTransactionsResult = { kind: "ok", transactions: Transactions } | GeneralApiProblem