import type { NextApiRequest, NextApiResponse } from "next";
import { ConectarMongoDb } from "../../middlewares/ConectarMongoDb";
import type { CadastroResponse } from "../../types/CadastroResponse";
import type { PadraoResponse } from "../../types/PadraoResponse";
import { UsuarioModel } from "../../models/UsuarioModel";
import bcrypt from "bcryptjs";
import { upload, UploadImagemCosmic } from "../../services/UploadImagemCosmic";
import nc from "next-connect";

const handler = nc()
    .use(upload.single('file'))
    .post(async (req: NextApiRequest, res: NextApiResponse<PadraoResponse>) => {
        try {
            const usuario = req.body as CadastroResponse;

            if (!usuario.nome || !usuario.email || !usuario.senha) {
                return res.status(400).json({ error: "Informe todos os dados para prosseguir" })
            }

            if (usuario.senha.length < 5) {
                return res.status(400).json({ error: "A senha deve possuir mais de 5 caracteres" });
            }

            if (usuario.nome.length < 2) {
                return res.status(400).json({ error: "O nome deve possuir no mínimo 2 caracteres" });
            }

            if (!usuario.email.includes('@') || !usuario.email.includes('.')) {
                return res.status(400).json({ error: "O email informado é inválido" });
            }

            if (usuario.email.length < 5) {
                return res.status(400).json({ error: "O email informado é inválido" });
            }

            const userExists = await UsuarioModel.find({ email: usuario.email })

            if (userExists && userExists.length > 0) {
                return res.status(400).json({ error: "O email informado já existe em nosso banco de dados" })
            }

            // Criptografando a senha
            var salt = bcrypt.genSaltSync(10);
            var senhaCriptografada = bcrypt.hashSync(usuario.senha, salt);

            // Enviar a imagem do multer para o cosmic
            const image = await UploadImagemCosmic(req);

            // Usuário que será salvo no BD
            const usuarioASerSalvo = {
                nome: usuario.nome,
                email: usuario.email,
                senha: senhaCriptografada,
                avatar: image.media.url
            }

            await UsuarioModel.create(usuarioASerSalvo);
            return res.status(200).json({ message: "Usuário cadastrado com sucesso" })
        }catch (e:any) {
            return res.status(400).json({ error: e.toString()})
        }
    })


export const config = {
    api: {
        bodyparser: false
    }
}    

export default ConectarMongoDb(handler);