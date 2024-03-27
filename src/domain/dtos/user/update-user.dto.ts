import { regularExps } from "../../../config";



export class UpdateUserDto {

  private constructor(
    public readonly id: number,
    public readonly email: string,
    public readonly password: string,
  ) {}


  static create(object: { [key: string]: any }): [string?, UpdateUserDto?] {
    const {id, email, password } = object;

    if (!id || isNaN(Number(id))) return ['ID must be a valid number'];

    //evalua que sea un correo valido
    if (email){
      if (!regularExps.email.test(email)) return ['Invalid email'];
    }

    if(password){
      if (password.length < 6) return ['Password must be at least 6 characters'];
    }

    return [undefined, new UpdateUserDto(id,
      email, password)];
  }


}
