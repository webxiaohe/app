import { Api } from "./api"
import * as Types from "./api.types"
import { ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import ddn from "ddn-js"

ddn.options.set("nethash", "b11fa2f2")
class DdnApi extends Api {
    async getUser(address: string): Promise<Types.GetAccountResult> {
        // make the api call
        const response: ApiResponse<any> = await this.apisauce.get(`/api/accounts?address=${address}`)
        // the typical ways to die when calling an api
        if (!response.ok) {
            const problem = getGeneralApiProblem(response)
            if (problem) return problem
        }
        // transform the data into the format we are expecting
        try {
            const { account, success, error } = response.data
            const resultAccount: Types.Account = account
            if (success) {
                return { kind: "ok", account: resultAccount }
            } else {
                return { kind: "error-result", response: {success, error}}
            }
        } catch {
            return { kind: "bad-data" }
        }
    }

    async postTransfer(params: Object): Promise<Types.TransferAccount> {
        // make the api call
        const response: ApiResponse<any> = await this.apisauce.post(`/peer/transactions`, 
            {...params},
            {headers: { 
                Accept: "application/json",
                "Content-Type": "application/json",
                nethash: ddn.options.get("nethash"),
                version: "",
            }})
        // the typical ways to die when calling an api
        if (!response.ok) {
            const problem = getGeneralApiProblem(response)
            if (problem) return problem
        }
        // transform the data into the format we are expecting
        try {
            const { success, error, transactionId} = response.data
            const transferResult: Types.Transfer = transactionId
            if (success) {
                return { kind: "ok", transfer: transferResult }
            } else {
                if (error.indexOf("Insufficient balance") !== -1) {
                    return { kind: "error-result", response: {success, error: __i18n("余额不足")}}
                }
                return { kind: "error-result", response: {success, error}}
            }
        } catch {
            return { kind: "bad-data" }
        }
    }
    async GetTransactions (sendAddress: string, recipientAddress: string, offset: number, limit: number):Promise<Types.GetTransactionsResult> {
        const response: ApiResponse<any> = await this.apisauce.get(`/api/transactions?senderId=${sendAddress}&recipientId=${recipientAddress}&offset=${offset}&limit=${limit}`)
        if(!response.ok) {
            const problem = getGeneralApiProblem(response)
            if (problem) return problem
        }
        try {
            const { transactions, count, success } = response.data
            const transactionsResult: Types.Transactions = {transactions, count }
            if (success) {
                return { kind: "ok", transactions: transactionsResult}
            } else {
                return { kind: "bad-data" }
            }
        } catch {
            return { kind: "bad-data" }
        }
    }
}

const ddnApi = new DdnApi({
    url: "http://47.94.93.132:8000",
    timeout: 10000,
})
ddnApi.setup()

export default ddnApi