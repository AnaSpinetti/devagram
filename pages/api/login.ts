import type { NextApiRequest, NextApiResponse } from "next";
import { ConectarMongoDb } from "../../middlewares/ConectarMongoDb";
import type { PadraoResponse } from "../../types/PadraoResponse";
import bcrypt from "bcryptjs";
import { UsuarioModel } from "../../models/UsuarioModel";

const loginEndPoint = async (req: NextApiRequest, res: NextApiResponse<PadraoResponse>) => {

    if(req.method !== 'POST'){
        return res.status(405).json({error: "O método informado é inválido"})
    }

    const { email, senha } = req.body;

    if(!email || !senha){
        return res.status(400).json({error: "Informe todos os dados para prosseguir"})
    } 

    const usuariolocalizado = await UsuarioModel.findOne({ email: email });

    if (usuariolocalizado) {

      const senhaValida = await bcrypt.compare(senha, usuariolocalizado.senha);

      if (senhaValida) {
        return res.status(200).json({error: "Usuário autenticado com sucesso!"})
      } else {
        return res.status(400).json({error: "Usuário ou senha inválidos"})
      }
    }
    
};

export default ConectarMongoDb(loginEndPoint);
