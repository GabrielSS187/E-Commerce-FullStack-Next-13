import { expect, describe, it, vi } from "vitest";

import { UserRepositoryInMemory } from "../../../repositories-in-memory/User-repository-in-memory";
import { UserLoginCase } from "../../../../use-cases/User-cases/User-login-case";
import { CreateUserCase } from "../../../../use-cases/User-cases/Create-user-case";
import { BCryptAdapter } from "../../../../../infra/adapters/Bcrypt-adapter/Bcrypt-adapter";
import { EditInfoUserCase } from "../../../../use-cases/User-cases/Edit-info-user-case";
import { JwtAdapter } from "../../../../../infra/adapters/Jwt-adapter/Jwt-adapter";
import { AwsS3Adapter } from "../../../../../infra/adapters/AwsS3-adapter/AwsS3-adapter";
import { UserError } from "../../../../errors/User-error";
import { usersDbMock } from "../../../database-in-memory/database-mock";

const sutFactory = () => {
  const bcrypt = new BCryptAdapter();
  const jwt = new JwtAdapter();
  const awsS3 = new AwsS3Adapter();
  const userRepositoryInMemory = new UserRepositoryInMemory();

  const sutUserLoginCase = new UserLoginCase(
    userRepositoryInMemory,
    bcrypt,
    jwt
  );

  const sutCreateUserCase = new CreateUserCase(userRepositoryInMemory, bcrypt);
  const sutEditInfoUserCase = new EditInfoUserCase(
    userRepositoryInMemory,
    bcrypt,
    awsS3
  );

  return {
    sutCreateUserCase,
    sutUserLoginCase,
    sutEditInfoUserCase,
    jwt,
    bcrypt,
  };
};

describe("Test in file edit-user-case", async () => {
  const {
    bcrypt,
    jwt,
    sutCreateUserCase,
    sutEditInfoUserCase,
    sutUserLoginCase,
  } = sutFactory();

  const newUser: any = {
    name: "Test Silva",
    email: "test@test.com",
    password: "12345bB/",
    address: "Rua test, 123",
    city: "Cidade Test",
    country: "br",
    phone: "83982715054",
    state: "sp",
    zipCode: "55555555",
  };

  await sutCreateUserCase.create(newUser);
  const user = usersDbMock.find((user) => user.email === newUser.email);

  const resUserLogin = await sutUserLoginCase.login({
    email: newUser.email,
    password: newUser.password,
  });
  const decryptToken = jwt.getToken({ token: resUserLogin.access_token });

  it("must edit user without throwing errors.", async () => {
    const spyBcrypt = vi.spyOn(bcrypt, "hashEncrypt");

    const result = await sutEditInfoUserCase.edit(decryptToken.userId, {
      name: "Edit Test",
      city: "Edite Cidade Teste",
    });

    expect(result).toEqual({
      statusCode: 200,
      message: "Informações editadas com sucesso.",
    });
    expect(user?.name).toBe("Edit Test");
    expect(user?.userMoreInfo?.city).toBe("Edite Cidade Teste");
    expect(spyBcrypt).not.toHaveBeenCalledOnce();

    expect.assertions(4);

    spyBcrypt.mockRestore();
  });

  it("should throw an error if the properties: photo_url, name, email, password exist but have no value.", async () => {
    const spyBcrypt = vi.spyOn(bcrypt, "hashEncrypt");

    try {
      await sutEditInfoUserCase.edit(decryptToken.userId, {
        password: "",
      });
      throw new Error("Teste failed");
      // rome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (error: any) {
      expect(error).instanceOf(UserError);
      expect(error.statusCode).toBe(406);
      expect(error.message).toBe("O mínimo de caracteres da senha é 6.");
    }

    expect(spyBcrypt).not.toHaveBeenCalledOnce();

    expect.assertions(4);

    spyBcrypt.mockRestore();
  });

  it("should throw an error if the properties of obj: userMoreInfo, exist but do not have values.", async () => {
    const spyBcrypt = vi.spyOn(bcrypt, "hashEncrypt");

    try {
      await sutEditInfoUserCase.edit(decryptToken.userId, {
        city: "",
      });
      throw new Error("Teste failed");
      // rome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (error: any) {
      expect(error).instanceOf(UserError);
      expect(error.statusCode).toBe(406);
      expect(error.message).toBe("Cidade no mínimo 2 caracteres.");
    }

    expect(spyBcrypt).not.toHaveBeenCalledOnce();

    expect.assertions(4);

    spyBcrypt.mockRestore();
  });

	it("calls hashEncrypt when a new password is provided", async () => {
		const spyHashEncrypt = vi.spyOn(bcrypt, "hashEncrypt");
	
		const originalUser = { ...user };
		const result = await sutEditInfoUserCase.edit(decryptToken.userId, {
			password: "123bN*/%",
		});
	
		expect(result).toEqual({
			statusCode: 200,
			message: "Informações editadas com sucesso.",
		});
		expect(user?.password).not.toBe(originalUser.password);
		expect(spyHashEncrypt).toHaveBeenCalled();
	
		spyHashEncrypt.mockRestore();
	});

  it("it should throw an error if the new email already exists.", async () => {
    const spyBcrypt = vi.spyOn(bcrypt, "hashEncrypt");

    try {
      await sutEditInfoUserCase.edit(decryptToken.userId, {
        email: "gabriel@gmail.com",
      });
      throw new Error("Teste failed");
      // rome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (error: any) {
      expect(error).instanceOf(UserError);
      expect(error.statusCode).toBe(409);
      expect(error.message).toBe(
        "Já existe um usuário cadastrado com esse email."
      );
    }

    expect(spyBcrypt).not.toHaveBeenCalledOnce();

    expect.assertions(4);

    spyBcrypt.mockRestore();
  });

  it("should throw an error with the cell phone number not following the regex pattern.", async () => {
    const spyBcrypt = vi.spyOn(bcrypt, "hashEncrypt");

    try {
      await sutEditInfoUserCase.edit(decryptToken.userId, {
        phone: "982715054",
      });
      // rome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (error: any) {
      expect(error).instanceOf(UserError);
      expect(error.message).toBe("Esse número de celular não é valido.");
      expect(error.statusCode).toBe(406);
    }

    expect(spyBcrypt).not.toHaveBeenCalledOnce();

    expect.assertions(4);

    spyBcrypt.mockRestore();
  });

  it("should throw an error if the zip code doesn't follow the regex pattern.", async () => {
    const spyBcrypt = vi.spyOn(bcrypt, "hashEncrypt");

    try {
      await sutEditInfoUserCase.edit(decryptToken.userId, {
        zipCode: "cep_invalido",
      });
      // rome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (error: any) {
      expect(error).instanceOf(UserError);
      expect(error.message).toBe("Cep invalido.");
      expect(error.statusCode).toBe(406);
    }

    expect(spyBcrypt).not.toHaveBeenCalledOnce();

    expect.assertions(4);

    spyBcrypt.mockRestore();
  });

  it("Should throw one in case the email doesn't follow the correct pattern.", async () => {
    const spyBcrypt = vi.spyOn(bcrypt, "hashEncrypt");

    try {
      await sutEditInfoUserCase.edit(decryptToken.userId, {
        email: "email_invalido",
      });
      // rome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (error: any) {
      expect(error).instanceOf(UserError);
      expect(error.message).toBe("Email invalido.");
      expect(error.statusCode).toBe(406);
    }

    expect(spyBcrypt).not.toHaveBeenCalledOnce();

    expect.assertions(4);

    spyBcrypt.mockRestore();
  });
});
