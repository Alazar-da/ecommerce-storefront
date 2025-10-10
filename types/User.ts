export interface User {
  _id: string;
  username: string;
  phone?: string;
  email: string;
  role: "customer" | "admin";
  createdAt: string;
}
