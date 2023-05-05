import {
	expect,
	describe,
	it,
	vi,
	Mocked,
	beforeEach,
	afterEach,
} from "vitest";

import { usersDbMock } from "../../database-in-memory/database-mock";
import { UserRepositoryInMemory } from "../../repositories-in-memory/User-repository-in-memory";
import { CreateUserCase } from "../../../use-cases/User-cases/Create-user-case";
import { BCryptAdapter } from "../../../../infra/adapters/BcryptAdapter/Bcrypt-adapter";
import { UserError } from "../../../errors/User-error";

describe("Tests in the file Create-user-case.", () => {
	const userRepositoryInMemory = new UserRepositoryInMemory();
	let sutCreateUserCase: CreateUserCase;
	let bcryptMock: Mocked<BCryptAdapter>;

	beforeEach(() => {
		bcryptMock = {
			hashEncrypt: vi.fn().mockResolvedValue("hashedPassword"),
		} as unknown as Mocked<BCryptAdapter>;

		sutCreateUserCase = new CreateUserCase(userRepositoryInMemory, bcryptMock);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	const newUser: any = {
		name: "Test Silva",
		email: "test@test.com",
		password: "12345bB/",
	};

	it("should create a user without errors.", async () => {
		const result = await sutCreateUserCase.create(newUser);
		const user = usersDbMock.find((user) => user.email === newUser.email);

		expect(result).toEqual({
			message: "Usuário criado com sucesso.",
			statusCode: 201,
		});
		expect(bcryptMock.hashEncrypt).toHaveBeenCalledOnce();
		expect(usersDbMock).toHaveLength(4)
		expect(user).toBeDefined();
		expect(user).toHaveProperty("_id");
		expect(user).toHaveProperty("photo_url");
		expect(user).toHaveProperty("createdAt");
		expect(user).toHaveProperty("updatedAt");
		expect(user?.photo_url).toBe("https://pt.seaicons.com/wp-content/uploads/2015/06/person-icon.png");
		expect(user).toHaveProperty("role");
		expect(user?.role).toBe("normal");
		expect(user?.password).toBe("hashedPassword");

		expect.assertions(12);
	});

	it("Should throw an error if the email already exists.", async () => {
		newUser["email"] = "gabriel@gmail.com";

		try {
			await sutCreateUserCase.create(newUser);
			throw new Error("Test failed");
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).toBeInstanceOf(UserError);
			expect(error.message).toBe(
				"Já existe um usuário cadastrado com esse email.",
			);
			expect(error.statusCode).toBe(409);
		}

		expect(bcryptMock.hashEncrypt).not.toHaveBeenCalled();
		expect(usersDbMock).toHaveLength(4)
		expect.assertions(5);
	});

	it("should throw an error if a property is missing.", async () => {
		newUser["email"] = undefined;

		try {
			await sutCreateUserCase.create(newUser);
			throw new Error("Test failed");
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).toBeInstanceOf(UserError);
			expect(error.message).toBe("Email obrigatório.");
			expect(error.statusCode).toBe(406);
		}

		expect(bcryptMock.hashEncrypt).not.toHaveBeenCalled();
		expect(usersDbMock).toHaveLength(4)

		expect.assertions(5);
	});

	it("Should throw one in case the email doesn't follow the correct pattern.", async () => {
		newUser["email"] = "testgmail.com";

		try {
			await sutCreateUserCase.create(newUser);
			throw new Error("Test failed");
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).toBeInstanceOf(UserError);
			expect(error.message).toBe("Email invalido.");
			expect(error.statusCode).toBe(406);
		}

		expect(bcryptMock.hashEncrypt).not.toHaveBeenCalled();
		expect(usersDbMock).toHaveLength(4)

		expect.assertions(5);
	});

	it("should throw an error if the password doesn't follow the regex format.", async () => {
		newUser["password"] = "12345678";
		newUser["email"] = "test_2@test.com";

		try {
			await sutCreateUserCase.create(newUser);
			throw new Error("Test failed");
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).instanceOf(UserError);
			expect(error.message).toBe(
				"Senha deve conter no máximo: 1 Letra maiúscula e minúscula, 1 número e 1 carácter especial é sem espaços.",
			);
			expect(error.statusCode).toBe(406);
		}

		expect(bcryptMock.hashEncrypt).not.toHaveBeenCalled();
		expect(usersDbMock).toHaveLength(4)

		expect.assertions(5);
	});

	it("should throw an error if the password is less than 6.", async () => {
		newUser["password"] = "123";
		newUser["email"] = "test_3@test.com";

		try {
			await sutCreateUserCase.create(newUser);
			throw new Error("Test failed");
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).instanceOf(UserError);
			expect(error.message).toBe(
				"O mínimo de caracteres da senha é 6.",
			);
			expect(error.statusCode).toBe(406);
		}

		expect(bcryptMock.hashEncrypt).not.toHaveBeenCalled();
		expect(usersDbMock).toHaveLength(4)

		expect.assertions(5);
	});

	it("should throw an error if the password is greater than 8.", async () => {
		newUser["password"] = "12345bB/********";
		newUser["email"] = "test_4@test.com";

		try {
			await sutCreateUserCase.create(newUser);
			throw new Error("Test failed");
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).instanceOf(UserError);
			expect(error.message).toBe(
				"O máxima de caracteres da senha é 8.",
			);
			expect(error.statusCode).toBe(406);
		}

		expect(bcryptMock.hashEncrypt).not.toHaveBeenCalled();
		expect(usersDbMock).toHaveLength(4)

		expect.assertions(5);
	});

	it("should throw an error if name is less than 5.", async () => {
		newUser["name"] = "Ga"
		newUser["email"] = "test_5@test.com";

		try {
			await sutCreateUserCase.create(newUser);
			throw new Error("Test failed");
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).instanceOf(UserError);
			expect(error.message).toBe(
				"Nome tem que ter no mínimo 5 caracteres.",
			);
			expect(error.statusCode).toBe(406);
		}

		expect(bcryptMock.hashEncrypt).not.toHaveBeenCalled();
		expect(usersDbMock).toHaveLength(4)

		expect.assertions(5);
	});

	it("should throw an error if name is greater than 35.", async () => {
		newUser["name"] = "Gaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa....."
		newUser["email"] = "test_6@test.com";

		try {
			await sutCreateUserCase.create(newUser);
			throw new Error("Test failed");
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			expect(error).instanceOf(UserError);
			expect(error.message).toBe(
				"Nome tem que ter no máximo 35 caracteres.",
			);
			expect(error.statusCode).toBe(406);
		}

		expect(bcryptMock.hashEncrypt).not.toHaveBeenCalled();
		expect(usersDbMock).toHaveLength(4)

		expect.assertions(5);
	});
});
