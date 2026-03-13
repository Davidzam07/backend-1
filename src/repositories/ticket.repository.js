import { TicketDAO } from "../dao/ticket.dao.js";

export class TicketRepository {
  constructor(dao = new TicketDAO()) {
    this.dao = dao;
  }

  create(data) {
    return this.dao.create(data);
  }

  findByCode(code) {
    return this.dao.findByCode(code);
  }
}

