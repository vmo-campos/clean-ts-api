import {
  ILoadAccountByToken,
  AccessDeniedError,
  forbiden, ok, serverError,
  IHttpRequest, IHttpResponse, IMiddleware
} from './authentication-middleware-protocols'

export class AuthenticationMiddleware implements IMiddleware {
  constructor (
    private readonly loadAccountByToken: ILoadAccountByToken,
    private readonly role = 'default'
  ) {}

  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']
      if (accessToken) {
        const account = await this.loadAccountByToken.load(accessToken, this.role)
        if (account) {
          return ok({ accountId: account.id })
        }
      }
      return forbiden(new AccessDeniedError())
    } catch (error) {
      return serverError(error)
    }
  }
}
