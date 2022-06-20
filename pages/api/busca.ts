import type { NextApiRequest, NextApiResponse } from "next";
import type { PadraoResponse } from "../../types/PadraoResponse";
import { ValidarJWT } from "../../middlewares/ValidarJWT";
import { ConectarMongoDb } from "../../middlewares/ConectarMongoDb";
import { UsuarioModel } from "../../models/UsuarioModel";
import { PoliticaCors } from "../../middlewares/PoliticaCors";

export const buscaEndPoint = async (req: NextApiRequest, res: NextApiResponse<PadraoResponse | any[]>) => {
    try {
        if (req.method === 'GET') {
            if (req?.query?.id) {
                const usuarioEncontrado = await UsuarioModel.findById(req?.query?.id)

                if(!usuarioEncontrado){
                    return res.status(400).json({ error: 'Nenhum usuário localizado' })
                }

                usuarioEncontrado.senha=null;
                return res.status(200).json(usuarioEncontrado);

            } else {

                const { filtro } = req.query;

                if (!filtro || filtro.length < 2) {
                    return res.status(405).json({ error: 'Informe pelo menos 2 caracteres para a busca' })
                }

                // Realizando a busca sem ser pelo valor exato 
                const usuarioslocalizados = await UsuarioModel.find({
                    $or: [{ nome: { $regex: filtro, $options: 'i' } },
                    { email: { $regex: filtro, $options: 'i' } }]
                })

                usuarioslocalizados.forEach(element => {
                    element.senha=null;
                });

                if (!usuarioslocalizados) {
                    return res.status(400).json({ error: 'Nenhum usuário localizado' })
                }

                return res.status(200).json(usuarioslocalizados);
            }
        }

        return res.status(405).json({ error: 'O método informado é inválido' })

    } catch (error: any) {
        console.log(error)
        return res.status(500).json({ error: 'Não foi possível realizar a busca: ' + error.toString() })
    }
}

export default PoliticaCors(ValidarJWT(ConectarMongoDb(buscaEndPoint)));