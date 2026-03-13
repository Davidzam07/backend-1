import mongoose from "mongoose";

const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, trim: true },
    purchase_datetime: { type: Date, required: true },
    amount: { type: Number, required: true, min: 0 },
    purchaser: { type: String, required: true, trim: true, lowercase: true },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "products", required: true },
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true, min: 0 },
      },
    ],
  },
  { timestamps: true }
);

export const TicketModel = mongoose.model(ticketCollection, ticketSchema);

