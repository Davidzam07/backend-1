import { TicketModel } from "../models/ticket.model.js";

export class TicketDAO {
  create(data) {
    return TicketModel.create(data);
  }

  findByCode(code) {
    return TicketModel.findOne({ code });
  }
}

