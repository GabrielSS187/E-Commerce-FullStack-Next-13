import { ZodError } from "zod";
import { UserContract } from "../../repositories/User-contract";
import { BCryptContract } from "../../../infra/adapters/Bcrypt-contract";
import { createUserSchema } from "./schemas";
import { UserError } from "../../errors/User-error";

type TRequest = {
  name: string;
  email: string;
  password: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  state: string;
  zipCode: string;
};

export class CreateUserCase {
  constructor(
    private readonly userContract: UserContract,
    private readonly bcrypt: BCryptContract
  ) {}

  async create(request: TRequest) {
    try {
      const {
        photo_url,
        name,
        email,
        password,
        role,
        address,
        city,
        country,
        phone,
        state,
        zipCode,
      } = createUserSchema.parse(request);

      const userEmail = await this.userContract.findUser({ email });
      if (userEmail) {
        throw new UserError(
          "Já existe um usuário cadastrado com esse email.",
          409
        );
      }

      const hashPassword = await this.bcrypt.hashEncrypt({ password });

      await this.userContract.create({
        photo_url,
        name,
        email,
        password: hashPassword,
        role,
      });

      const newUserEmail = await this.userContract.findUser({ email });

      await this.userContract.createMoreInfo({
        // rome-ignore lint/style/noNonNullAssertion: <explanation>
        userId: newUserEmail!._id,
        address,
        city,
        country,
        phone,
        state,
        zipCode,
      });

      return {
        message: "Usuário criado com sucesso.",
        statusCode: 201,
      };
      // rome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (error: any) {
      if (error instanceof ZodError) {
        throw new UserError(error.issues[0].message, 406);
      }
      if (error instanceof UserError) {
        throw new UserError(error.message, error.statusCode);
      }
      throw new Error(error.message);
    }
  }
}
