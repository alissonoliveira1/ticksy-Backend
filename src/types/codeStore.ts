export interface CodeStore {
  [email: string]: {
    code: string;
    expiresAt: number;
  };
}
