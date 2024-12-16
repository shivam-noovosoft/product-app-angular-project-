export interface Users{
  limit:number;
  skip:number;
  total:number;
  users:User
}
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  email: string;
  username: string;
  password: string;
  gender: string;
  birthDate: string;
  age: number;
  bloodGroup: string;
  eyeColor: string;
  hair: Hair;
  height: number;
  weight: number;
  image: string;
  address: Address;
  bank: Bank;
  company: Company;
  crypto: Crypto;
  ein: string;
  ssn: string;
  macAddress: string;
  ip: string;
  phone: string;
  university: string;
  userAgent: string;
  role: string;
}

interface Address {
  address: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
}

interface Bank {
  cardExpire: string;
  cardNumber: string;
  cardType: string;
  currency: string;
  iban: string;
}

interface Company {
  department: string;
  name: string;
  title: string;
  address: Address;
}

interface Crypto {
  coin: string;
  wallet: string;
  network: string;
}

interface Hair {
  color: string;
  type: string;
}
