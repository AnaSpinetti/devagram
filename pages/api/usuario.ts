import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { ValidarJWT } from "../../middlewares/ValidarJWT";
import type { PadraoResponse } from "../../types/PadraoResponse";

const usuarioEndpoint = async(req: NextApiRequest, res: NextApiResponse<PadraoResponse>) => {
    return res.status(200).json({message: "Usuário autenticado com sucesso"})
}

export default ValidarJWT(usuarioEndpoint);