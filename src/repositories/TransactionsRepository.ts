import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const incomeArray: number[] = [0];
    const outcomeArray: number[] = [0];

    const transactions = await this.find();

    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        incomeArray.push(transaction.value);
      } else {
        outcomeArray.push(transaction.value);
      }
    });

    const income = incomeArray.reduce(
      (previousValue: number, currentValue: number) =>
        previousValue + currentValue,
    );
    const outcome = outcomeArray.reduce(
      (previousValue: number, currentValue: number) =>
        previousValue + currentValue,
    );

    const total = income - outcome;

    const balance: Balance = {
      income,
      outcome,
      total,
    };

    return balance;
  }
}

export default TransactionsRepository;
