import mongoose from "mongoose";

const ContractSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    contract: [
      {
        contract: String,
        name: String,
        date: String,
        status: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Contract = mongoose.model("Contract", ContractSchema);

export default Contract;
