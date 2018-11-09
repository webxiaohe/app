export interface wallet {
    curWallet: {
        address: string;
        author: string;
        walletName: string;
        phaseSeed: string;
        publicKey: string;
        url: string;
        balance: number;
    }
}

export interface curWallet {
    curWallet: wallet
    publicKey: string
    privateKey: string
}
