import { injectable, /* inject, */ BindingScope } from '@loopback/core';
import {repository} from '@loopback/repository';
import { OrderRepository } from '../repositories';
import { OrderItemRepository } from '../repositories';

@injectable({ scope: BindingScope.TRANSIENT })
export class OrderService {
  // orderItemRepository: OrderItemRepository;
  // orderRepository: OrderRepository;
  constructor(
    @repository(OrderItemRepository)
    public orderItemRepository: OrderItemRepository,

    @repository(OrderRepository)
    public orderRepository: OrderRepository,
  ) {}

  async addItemToOrder(orderId: string, data: {
    productId: string;
    productName: string;
    unitPrice: number;
    quantity: number;
  }): Promise<void> {
    const { productId, productName, unitPrice, quantity } = data;

    // 1. Create OrderItem
    await this.orderItemRepository.create({
      orderId,
      productId,
      productName,
      unitPrice,
      quantity,
    });

    // 2. Recalculate total
    await this.recalculateOrderTotal(orderId);
  }

  async updateItemQuantity(itemId: string, newQuantity: number): Promise<void> {
    const item = await this.orderItemRepository.findById(itemId);

    // 1. Update quantity
    await this.orderItemRepository.updateById(itemId, {
      quantity: newQuantity,
    });

    // 2. Recalculate order total
    await this.recalculateOrderTotal(item.orderId);
  }

  async removeItemFromOrder(itemId: string): Promise<void> {
    const item = await this.orderItemRepository.findById(itemId);

    // 1. Delete the item
    await this.orderItemRepository.deleteById(itemId);

    // 2. Recalculate order total
    await this.recalculateOrderTotal(item.orderId);
  }


  // Common method to recalculate the order total
  private async recalculateOrderTotal(orderId: string): Promise<void> {
    const items = await this.orderItemRepository.find({
      where: { orderId },
    });

    const total = items.reduce((sum, item) => {
      return sum + Number(item.unitPrice) * item.quantity;
    }, 0);

    await this.orderRepository.updateById(orderId, {
      totalAmount: Number(total.toFixed(2)),
    });
  }
}
