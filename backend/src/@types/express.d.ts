declare namespace Express {
  export interface Request{
    idUser: string;
    userRole: "admin" | "normal";
  }
}