declare namespace Express {
  export interface Request{
    idUser: string;
    userRole: string | "admin" | "normal";
  }
}