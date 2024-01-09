import { verifySignature } from "./utils/crypto";
import sha256 from "crypto-js/sha256";

export default class Transaction{
    constructor(_inputPublicKey, _outputPublicKey, _amount, _fee, _signature) {
        this.inputPublicKey = _inputPublicKey;
        this.outputPublicKey = _outputPublicKey;
        this.amount = _amount;
        this.fee = _fee;
        this.signature = _signature;
        this.TxHash = _getTxHash();
    }

    _getTxHash() {
        return sha256(this.inputPublicKey + this.outputPublicKey + this.amount + this.fee).toString();
    }

    hasValidSignature() {
        return (this.signature != undefined) && verifySignature(this.TxHash, this.signature, this.inputPublicKey);
    }
}

export function transactionFromJSON(transaction) {
    return new Transaction(
      transaction.inputPublicKey,
      transaction.outputPublicKey,
      transaction.amount,
      transaction.fee,
      transaction.signature
    );
  }