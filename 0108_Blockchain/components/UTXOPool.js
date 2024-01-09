import UTXO from './UTXO';
import { hasValidSignature } from './Transaction';

export default class UTXOPool {
    constructor() {
        this.UTXOPool = {};
    }

    addUTXO(_publicKey, _amount) {
        // Check if the publickey's UTXO exists and execute amount change.
        if (this.UTXOPool[_publicKey] != undefined) {
            this.UTXOPool[_publicKey].amount += _amount;
        } else {
            const utxo = new UTXO(_publicKey, _amount);
            this.UTXOPool[_publicKey] = utxo;
        }
    }

    isValidTransaction(_transaction) {
        const { inputPublicKey, amount, fee } = _transaction;
        return this.UTXOPool[inputPublicKey].amount >= (amount + fee) && amount > 0;
    }

    handleTransaction(_transaction, _feeReceiver) {
        const _hasValidSignature = _transaction.hasValidSignature();
        if (!this.isValidTransaction(_transaction) || !_hasValidSignature) {
            return;
        }
        const _inputPublicKey = _transaction.inputPublicKey;
        const _outputPublicKey = _transaction.outputPublicKey;
        const _amountTransferred = _transaction.amount;
        const _fee = _transaction.fee;
        this.UTXOPool[publicKey].amount -= (_amountTransferred + _fee);
        this._hasZeroAmountInUTXO(_inputPublicKey);
        this.addUTXO(_outputPublicKey, _amountTransferred);
        this.addUTXO(_feeReceiver, _fee);
    }

    addingTransactionErrorMessage(_transaction) {
        const { inputPublicKey, amount, fee } = _transaction;
        if (this.UTXOPool[inputPublicKey] == undefined) {
            return "The UTXO amount of this public key is 0";
        }
        if (amount <= 0) {
            return "Amount of Tx has to be more than 0";
        }
        if (this.UTXOPool[inputPublicKey].amount < amount + fee) {
            return `The balance of PublicKey ${inputPublicKey} in UTXO is ${this.UTXOPool[inputPublicKey]}, which is less than the sum of amount (${amount}) and fee (${fee})`;
        }
    }

    getUTXO() {
        return this.UTXOPool;
    }

    _hasZeroAmountInUTXO(_publicKey) {
        if (this.UTXOPool[_publicKey].amount == 0) {
            delete this.UTXOPool[_publicKey];
        }
    }
}
