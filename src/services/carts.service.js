import crypto from "crypto";
import { CartRepository } from "../repositories/cart.repository.js";
import { ProductRepository } from "../repositories/product.repository.js";
import { TicketRepository } from "../repositories/ticket.repository.js";

export class CartsService {
  constructor(
    cartRepository = new CartRepository(),
    productRepository = new ProductRepository(),
    ticketRepository = new TicketRepository()
  ) {
    this.cartRepository = cartRepository;
    this.productRepository = productRepository;
    this.ticketRepository = ticketRepository;
  }

  async createCart() {
    return this.cartRepository.create();
  }

  async getCartById(cid) {
    return this.cartRepository.findById(cid);
  }

  async addProductToCart({ cid, pid, quantity = 1 }) {
    const cart = await this.cartRepository.findById(cid);
    if (!cart) {
      const err = new Error("Carrito no encontrado");
      err.statusCode = 404;
      throw err;
    }

    const product = await this.productRepository.findById(pid);
    if (!product) {
      const err = new Error("Producto no encontrado");
      err.statusCode = 404;
      throw err;
    }

    const q = Number(quantity);
    if (!Number.isFinite(q) || q <= 0) {
      const err = new Error("Cantidad inválida");
      err.statusCode = 400;
      throw err;
    }

    const idx = cart.products.findIndex((p) => String(p.product?._id || p.product) === String(pid));
    if (idx >= 0) {
      cart.products[idx].quantity += q;
    } else {
      cart.products.push({ product: pid, quantity: q });
    }

    const updated = await this.cartRepository.updateById(cid, { products: cart.products });
    return updated;
  }

  async purchase({ cid, purchaserEmail }) {
    const cart = await this.cartRepository.findById(cid);
    if (!cart) {
      const err = new Error("Carrito no encontrado");
      err.statusCode = 404;
      throw err;
    }

    const purchasable = [];
    const notPurchased = [];

    for (const item of cart.products) {
      const product = item.product; // populate
      if (!product) {
        notPurchased.push({ product: item.product, reason: "Producto inexistente" });
        continue;
      }
      if (product.stock >= item.quantity) {
        purchasable.push({ product, quantity: item.quantity });
      } else {
        notPurchased.push({
          product: product._id,
          requested: item.quantity,
          available: product.stock,
          reason: "Stock insuficiente",
        });
      }
    }

    // descontar stock para lo comprable
    let amount = 0;
    const ticketProducts = [];
    for (const p of purchasable) {
      const newStock = p.product.stock - p.quantity;
      await this.productRepository.updateById(p.product._id, { stock: newStock });
      amount += p.product.price * p.quantity;
      ticketProducts.push({
        product: p.product._id,
        quantity: p.quantity,
        unitPrice: p.product.price,
      });
    }

    let ticket = null;
    if (ticketProducts.length > 0) {
      const code = crypto.randomBytes(10).toString("hex");
      ticket = await this.ticketRepository.create({
        code,
        purchase_datetime: new Date(),
        amount,
        purchaser: purchaserEmail,
        products: ticketProducts,
      });
    }

    // dejar en carrito solo los no comprados
    const remainingProducts = cart.products.filter((item) => {
      const prodId = String(item.product?._id || item.product);
      return notPurchased.some((np) => String(np.product) === prodId);
    });
    await this.cartRepository.updateById(cid, { products: remainingProducts });

    return {
      ticket,
      notPurchased,
    };
  }
}

