


export class UpdateCustomerDto {

  private constructor(
    public readonly id: number,
    public readonly name?: string,
    public readonly lastName?: string,
    public readonly phone?: string,
  ){}

  static create(object: { [key: string]: any }): [string?, UpdateCustomerDto?] {
    const {id, name, lastname, phone } = object;

    if (!id || isNaN(Number(id))) return ['ID must be a valid number'];

    return [undefined, new UpdateCustomerDto(id,
      name, lastname, phone)];
  }
}
