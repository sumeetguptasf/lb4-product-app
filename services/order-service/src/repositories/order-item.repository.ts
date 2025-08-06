import { Getter, inject } from '@loopback/core';
import { DataObject, DefaultCrudRepository, juggler, Options, repository } from '@loopback/repository';
import { OrderItem, OrderItemRelations } from '../models';
import { OrderRepository } from './order.repository';

export class OrderItemRepository extends DefaultCrudRepository<OrderItem, typeof OrderItem.prototype.id, OrderItemRelations> {
  constructor(
    @inject('datasources.db') dataSource: juggler.DataSource,
    @repository(OrderRepository)
    protected orderRepository: OrderRepository,
    @repository.getter('OrderItemRepository')
    protected getOrderItemRepository: Getter<OrderItemRepository>,
  ) {
    super(OrderItem, dataSource);
  }

  async create(entity: DataObject<OrderItem>, options?: Options): Promise<OrderItem> {
    const item = await super.create(entity, options);
    await this.updateOrderTotal(item.orderId);
    return item;
  }

  async deleteById(id: string, options?: Options): Promise<void> {
    const item = await this.findById(id);
    await super.deleteById(id, options);
    await this.updateOrderTotal(item.orderId);
  }

  async updateOrderTotal(orderId: string): Promise<void> {
    const items = await this.find({ where: { orderId } });
    const total = items.reduce((sum, item) => {
      return sum + Number(item.unitPrice) * item.quantity;
    }, 0);
    await this.orderRepository.updateById(orderId, { totalAmount: total });
  }
}