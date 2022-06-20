import type { NextApiResponse } from "next";
import type { PadraoResponse } from "../../types/PadraoResponse";
import nc from "next-connect";

import { PublicacaoModel } from "../../models/PublicacaoModel";
import { UsuarioModel } from "../../models/UsuarioModel";

import { upload, UploadImagemCosmic } from "../../services/UploadImagemCosmic";
import { ConectarMongoDb } from "../../middlewares/ConectarMongoDb";
import { ValidarJWT } from "../../middlewares/ValidarJWT";
import { PoliticaCors } from "../../middlewares/politicaCors";

const handler = nc()
    .use(upload.single('file'))
    .post(async (req: any, res: NextApiResponse<PadraoResponse>) => {
        try {
            const {userId} = req.query;
            const usuario = await UsuarioModel.findById(userId);
            if(!usuario){
                return res.status(400).json({error: 'usuário não localizado'})
            }

            // Não coloquei o req.body como obrigatório, deixei a descrição da publicação opcional como no instagram
            if(!req){
                return res.status(400).json({error: 'Parâmetros de entrada não informados'});
            }

            const {descricao} = req?.body;
            

            if(!req.file || !req.file.originalname){
                return res.status(400).json({error: `A imagem é obrigatória`});
            }

            const image = await UploadImagemCosmic(req);

            const publicacao = {
                idUsuario: usuario._id,
                descricao: descricao,
                imagem: image.media.url,
                data: new Date(),
            }

            usuario.publicacoes++
            await UsuarioModel.findByIdAndUpdate({_id: usuario._id}, usuario)

            await PublicacaoModel.create(publicacao)

            return res.status(200).json({message: 'Publicação criada com sucesso'})

        } catch (e: any) {
            console.log(`Ocorreu um erro inesperado ${e}`)
            return res.status(400).json(e.toString())
        }
    })
    
    export const config = {
        api: {
            bodyParser: false
        }
    }

export default PoliticaCors(ValidarJWT(ConectarMongoDb(handler)));