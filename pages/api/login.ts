import type { NextApiRequest, NextApiResponse } from "next";
import { ConectarMongoDb } from "../../middlewares/ConectarMongoDb";
import type { PadraoResponse } from "../../types/PadraoResponse";
import bcrypt from "bcryptjs";
import { UsuarioModel } from "../../models/UsuarioModel";
import Jwt from "jsonwebtoken";
import { loginResponse } from "../../types/LoginResponse";
import { PoliticaCors } from "../../middlewares/PoliticaCors";

const loginEndPoint = async (req: NextApiRequest, res: NextApiResponse<PadraoResponse | loginResponse>) => {
  const { CHAVE_JWT } = process.env;
  if (!CHAVE_JWT) {
    return res.status(500).json({ error: "ENV chave jwt não infomada" })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "O método informado é inválido" })
  }

  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "Informe todos os dados para prosseguir" })
  }

  // TODO - VERIFICAR COMO COMPARAR A SENHA CRIPTOGRAFADA
  const usuarioslocalizados = await UsuarioModel.find({ email: email });

  if (usuarioslocalizados && usuarioslocalizados.length > 0) {
    const usuarioEncontrado = usuarioslocalizados[0];

    const senhaDecoded = await bcrypt.compare(senha, usuarioEncontrado.senha)

    if(senhaDecoded === true){
      const token = Jwt.sign({ _id: usuarioEncontrado._id }, CHAVE_JWT)

      return res.status(200).json({
        nome: usuarioEncontrado.nome,
        email: usuarioEncontrado.email,
        token
      })
    }
  }

return res.status(400).json({ error: "Usuário não localizado" })
    
};

export default PoliticaCors(ConectarMongoDb(loginEndPoint));
