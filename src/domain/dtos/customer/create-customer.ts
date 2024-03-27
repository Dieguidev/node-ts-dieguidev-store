import { regularExps } from "../../../config";




export class CreateCustomerDto {

  private constructor(
    public readonly name: string,
    public readonly lastName: string,
    public readonly phone: string,
    public readonly email: string,
    public readonly password: string,
    public readonly role: string = 'customer'
  ) { }

  static create(object: { [key: string]: any }): [string?, CreateCustomerDto?] {
    const { name, lastname, phone = '', email, password } = object;

    if (!name) return ['Name is required'];
    if (!lastname) return ['Lastname is required'];
    if (!email) return ['Missing email'];
    //evalua que sea un correo valido
    if (!regularExps.email.test(email)) return ['Invalid email'];
    if (!password) return ['Missing password'];
    if (password.length < 6) return ['Password must be at least 6 characters'];


    return [undefined, new CreateCustomerDto(
      name, lastname, phone, email, password)];
  }
}
