import { UserContract } from "../../repositories/User-contract";

export class CreateUserCase {
  constructor(
    private userContract: UserContract
  ){};
};