import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Order } from '../entity/order.entity';
import { User } from '../entity/user.entity';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateOrderDto, UpdateOrderDto } from '../dto/order.dto';

const orderRepo = AppDataSource.getRepository(Order);
const userRepo = AppDataSource.getRepository(User);
// getall 
export class OrderController {
  static async getAll(req: Request, res: Response)  {
    const orders = await orderRepo.find({ relations: ['user'] });
    res.json(orders);
  }

  static async getById(req: Request, res: Response){
    const order = await orderRepo.findOne({
      where: { id: req.params.id },
      relations: ['user'],
    });

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
     return;}
    res.json(order);
  }

  static async create(req: Request, res: Response) {
    

    const user = await userRepo.findOneBy({ id: req.body.userId });
    if (!user) {
       res.status(404).json({ message: 'User not found' });
       return;}

    const order = orderRepo.create({
      name: req.body.name,
      address: req.body.address,
      phone: req.body.phone,
      user,
    });

    const result = await orderRepo.save(order);
    res.status(201).json(result);
  }

  static async update(req: Request, res: Response) {
    
    const order = await orderRepo.findOneBy({ id: req.params.id });
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
     return;}

    orderRepo.merge(order, req.body);
    const result = await orderRepo.save(order);
    res.json(result);
  }

  static async delete(req: Request, res: Response) {
    const order = await orderRepo.findOneBy({ id: req.params.id });
    if (!order) {
       res.status(404).json({ message: 'Order not found' });
     return;
  }

    await orderRepo.remove(order);
    res.json({ message: 'Order deleted successfully' });
  }
}