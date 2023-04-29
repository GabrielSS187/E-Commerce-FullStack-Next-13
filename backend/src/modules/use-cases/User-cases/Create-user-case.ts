import { ZodError } from "zod";
import { UserContract } from "../../repositories/User-contract";
import { JwtContract } from "../../../infra/adapters/Jwt-contract";
import { BCryptContract } from "../../../infra/adapters/Bcrypt-contract";
import { UserError } from "../../../errors/User-error";

export class CreateUserCase {
  constructor(
    private userContract: UserContract,
    private jwt: JwtContract,
    private bcrypt: BCryptContract,
  ){};

  async create () {
    
  };
};