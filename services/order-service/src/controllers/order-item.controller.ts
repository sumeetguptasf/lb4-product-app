import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Order,
  OrderItem,
} from '../models';
import { OrderRepository } from '../repositories';

export class OrderItemController {
  constructor(
    @repository(OrderRepository) protected orderRepository: OrderRepository,
  ) { }

  
  @get('/orders/{orderId}/order-items', {
    responses: {
      '200': {
        description: 'Array of Order has many OrderItem',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(OrderItem) },
          },
        },
      },
    },
  })
  async find(
    @param.path.string('orderId') orderId: string,
    @param.query.object('filter') filter?: Filter<OrderItem>,
  ): Promise<OrderItem[]> {
    return this.orderRepository.items(orderId).find(filter);
  }

  @post('/orders/{orderId}/order-items', {
    responses: {
      '200': {
        description: 'Order model instance',
        content: { 'application/json': { schema: getModelSchemaRef(OrderItem) } },
      },
    },
  })
  async create(@param.path.string('orderId') orderId: typeof Order.prototype.id, @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OrderItem, {
            title: 'NewOrderItemInOrder',
            exclude: ['id', 'orderId'],
            optional: ['orderId']
          }),
        },
      },
    }) orderItem: Omit<OrderItem, 'orderId'>,
  ): Promise<OrderItem> {
    return this.orderRepository.items(orderId).create(orderItem);
  }

  @patch('/orders/{orderId}/order-items', {
    responses: {
      '200': {
        description: 'Order.OrderItem PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async patch(@param.path.string('orderId') orderId: string, @requestBody({
    content: {
      'application/json': {
        schema: getModelSchemaRef(OrderItem, { partial: true }),
      },
    },
  })
  orderItem: Partial<OrderItem>,
    @param.query.object('where', getWhereSchemaFor(OrderItem)) where?: Where<OrderItem>,
  ): Promise<Count> {
    return this.orderRepository.items(orderId).patch(orderItem, where);
  }

  @del('/orders/{orderId}/order-items', {
    responses: {
      '200': {
        description: 'Order.OrderItem DELETE success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async delete(
    @param.path.string('orderId') orderId: string,
    @param.query.object('where', getWhereSchemaFor(OrderItem)) where?: Where<OrderItem>,
  ): Promise<Count> {
    return this.orderRepository.items(orderId).delete(where);
  }
}
