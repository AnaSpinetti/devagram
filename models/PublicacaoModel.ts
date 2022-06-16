import mongoose, {Schema} from "mongoose";

const PublicacaoSchema = new Schema({
    imagem: { type: String, required: true }
})

export const PublicacaoModel = (mongoose.models.publicacoes || mongoose.model("publicacoes", PublicacaoSchema))