import mongoose from "mongoose";

const ContractSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    contract: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

const Contract = mongoose.model("Contract", ContractSchema);

export default Contract;
