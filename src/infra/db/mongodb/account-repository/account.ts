import { IAddAccountModel } from '@/domain/usecases/add-account'
import { IAccountModel } from '@/domain/models/account'
import { IAddAccountRepository } from '@/data/protocols/add-account-repository'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements IAddAccountRepository {
  async add (accountData: IAddAccountModel): Promise<IAccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)

    const accountRawData = result.ops[0]

    const { _id, ...accountWithoutId } = accountRawData

    const account = Object.assign({}, accountWithoutId, { id: _id })

    return account
  }
}
