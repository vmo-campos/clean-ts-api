import { IHttpRequest, IHttpResponse, IController, IAddAccount } from './signup-controller-protocols'
import { badRequest, serverError, ok, forbiden } from '@/presentation/helpers/http/http-helpers'
import { IValidation } from '@/presentation/protocols/validation'
import { IAuthentication } from '@/domain/usecases/authentication'
import { EmailAlreadyInUse } from '@/presentation/errors'

export class SignUpController implements IController {
  constructor (
    private readonly addAccount: IAddAccount,
    private readonly authentication: IAuthentication,
    private readonly validation: IValidation
  ) {}

  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const { name, email, password } = httpRequest.body

      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      if (!account || account === null) {
        return forbiden(new EmailAlreadyInUse())
      }

      const accessToken = await this.authentication.auth({ email, password })

      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
