




export class CreateOrderDto {
  private constructor(
    public readonly customerId: number,

  ) { }


  static create(object: { [key: string]: any }): [string?, CreateOrderDto?] {
    const { customerId } = object;

    if (!customerId) return ['customer id is required'];

    return [undefined, new CreateOrderDto(customerId)];
  }
}
