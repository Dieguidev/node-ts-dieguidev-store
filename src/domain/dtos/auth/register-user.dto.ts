import { regularExps } from "../../../config";




export class RegisterUserDto {
  //private contructor solo se puede llamar dentro de un metodo estatico
  private constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly role: string,

  ) { }

  static create(object: { [key: string]: any }): [string?, RegisterUserDto?] {
    const {email, password, role = 'customer' } = object;



    if (!email) return ['Missing email'];
    //evalua que sea un correo valido
    if (!regularExps.email.test(email)) return ['Invalid email'];
    if (!password) return ['Missing password'];
    if (password.length < 6) return ['Password must be at least 6 characters'];



    return [undefined, new RegisterUserDto(email, password, role)];
  }
}
