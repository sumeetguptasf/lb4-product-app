import { inject, injectable, LifeCycleObserver } from '@loopback/core';
import { get, param } from '@loopback/rest';
import { getService } from '@loopback/service-proxy';
import { ProductServiceDataSource } from '../datasources/product-service.datasource';
import { OrderServiceDataSource } from '../datasources/order-service.datasource';
import { ProductService } from '../services/product-service.interface';
import { OrderService } from '../services/order-service.interface';
import { Order } from '../models/order.model';
import { Product } from '../models';

@injectable()
export class StoreFacadeController implements LifeCycleObserver {
  private productService!: ProductService;
  private orderService!: OrderService;

  constructor(
    @inject('datasources.productService')
    protected productDataSource: ProductServiceDataSource,
    @inject('datasources.orderService')
    protected orderDataSource: OrderServiceDataSource,
  ) { }

  async init(): Promise<void> {
    this.productService = await getService<ProductService>(this.productDataSource);
    this.orderService = await getService<OrderService>(this.orderDataSource);
  }

  // @get('/facade/products/{productId}/orders')
  // async getOrdersForProduct(
  //   @param.path.string('productId') productId: string,
  // ): Promise<Order[]> {
  //   const orderService = await getService<OrderService>(this.orderDataSource);
  //   return orderService.getOrdersByProductId(productId);
  // }


  @get('/facade/products/{productId}/details')
  async getProductWithOrders(
    @param.path.string('productId') productId: string,
  ): Promise<{ product: Product; orders: Order[] }> {
    const productService = await getService<ProductService>(this.productDataSource);
    const orderService = await getService<OrderService>(this.orderDataSource);

    const product = await productService.getProductById(productId);
    if (!product) {
      throw new Error(`Product with id ${productId} not found`);
    }
    const orders = await orderService.getOrdersByProductId(productId);

    return { product, orders };
  }

  @get('/facade/users/{userId}/orders')
  async getOrdersForUser(
    @param.path.string('userId') userId: string,
  ): Promise<Order[]> {
    const orderService = await getService<OrderService>(this.orderDataSource);
    return orderService.getOrdersByUserId(userId);
  }
}