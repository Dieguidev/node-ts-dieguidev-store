




export class AddProductInOrderDto {
  private constructor(
    public readonly productId: number,
    public readonly orderId: number,
    public readonly amount: number,
  ) { }


  static create(object: { [key: string]: any }): [string?, AddProductInOrderDto?] {
    const { productId, orderId, amount } = object;

    if (!productId || isNaN(Number(productId))) return ['ID must be a valid number'];
    if (!orderId || isNaN(Number(orderId))) return ['ID must be a valid number'];
    if (!amount || isNaN(Number(amount))) return ['must be a valid number'];

    return [undefined, new AddProductInOrderDto(+productId, +orderId, +amount)];
  }
}
