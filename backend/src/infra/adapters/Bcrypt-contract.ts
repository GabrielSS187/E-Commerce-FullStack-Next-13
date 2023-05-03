export type TBcryptPassword = {
	password: string;
};

export interface TBcryptComparePassword {
	password: string;
	passwordDatabase: string;
}

export abstract class BCryptContract {
	abstract hashEncrypt(params: TBcryptPassword): Promise<string>;
	abstract compareHash(params: TBcryptComparePassword): Promise<boolean>;
}
