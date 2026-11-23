import { IUser } from "../models/User";

// Shape of the user object safe to send to clients and store in the
// frontend Redux state. Never includes the password hash.
export interface PublicUser {
  _id: string;
  email: string;
  likes: string[];
  cart: { productId: string; quantity: number }[];
  purchases: string[];
  moreInfo: {
    name: string;
    lastName: string;
    address: string;
    showName: string;
  };
}

export function toPublicUser(user: IUser): PublicUser {
  const obj = user.toObject();
  const { password, ...rest } = obj as IUser & { password?: string };
  void password;
  return rest as unknown as PublicUser;
}
