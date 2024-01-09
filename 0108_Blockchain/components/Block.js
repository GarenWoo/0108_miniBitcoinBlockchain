import UTXOPool from "./UTXOPool";
import sha256 from "crypto-js/sha256";
import { map } from "ramda";
import { transactionFromJSON } from "./Transaction";

class Block {
    constructor(opts) {
        const {
          blockchain,
          parentHash,
          height,
          miner,
          nonce,
          utxoPool,
          transactions
        } = {
          utxoPool: new UTXOPool(),
          transactions: {},
          ...opts
        };
        this.blockchain = blockchain;
        this.parentHash = parentHash;
        this.height = height;
        this.miner = miner;
        this.nonce = nonce;
        this.utxoPool = utxoPool;
        this.transactions = map(transactionFromJSON)(transactions);
        this.blockHash = this._calculateBlockHash();
      }

      generateNextBlock() {
        const nextBlock = new Block({
            blockchain: this.blockchain,
            parentHash: this.blockHash,
            height: this.height + 1,
            miner: "",
            nonce: "",
            utxoPool: this.utxoPool.getUTXO(),
            
          });
          nextBlock.utxoPool.addUTXO(miner, _getRewardAmount());
          return nextBlock;
      }

      addTransaction(transaction) {
        if (!this._isValidTransaction(transaction)) {
            return;
        }
        this.transactions[transaction.hash] = transaction;
        this.utxoPool.handleTransaction(transaction, this.miner);
        this.blockHash = this._calculateBlockHash();
      }
    
      addingTransactionErrorMessage(transaction) {
        if (!transaction.hasValidSignature()) {
        return "Signature of Tx is invalid";
        }
        return this.utxoPool.addingTransactionErrorMessage(transaction);
      }

      _isValidTransaction(transaction) {
        return (this.utxoPool.isValidTransaction(transaction) && transaction.hasValidSignature());
      }

      _getRewardAmount() {
        let currentReward;
        initialReward = 50;
        halvingInterval = 210000;
        const numberOfHalvings = Math.floor(blockHeight / halvingInterval);
        for (let i = 0; i < numberOfHalvings; i++) {
            currentReward /= 2;
        }
        return currentReward;
      }
      
      _calculateBlockHash() {
        return sha256(this.nonce + this.parentHash + this.miner + this._combinedTransactionsHash()).toString();
      }

      _combinedTransactionsHash() {
        if (Object.values(this.transactions).length === 0) {
          return "No Transactions in Block";
        }
        return sha256(Object.values(this.transactions).map(tx => tx.hash).join(""));
      }
}

export default Block;

export function blockFromJSON(blockchain, data) {
    return new Block({
      ...data,
      blockchain
    });
  }