import type { NextApiRequest, NextApiResponse } from "next";
import type { CadastroResponse } from "../../types/CadastroResponse";
import type { PadraoResponse } from "../../types/PadraoResponse";

const usuarioEndpoint = async(req: NextApiRequest, res: NextApiResponse<PadraoResponse>) => {
    if(req.method === "POST"){
        const {email, senha, nome} = req.body;

        if(!email || !senha || !nome){
            return res.status(400).json({error: "Preencha todos os dados para prosseguir"});
        }

        if(senha.length < 5){
            return res.status(400).json({error: "A senha deve possuir mais de 5 caracteres"});
        }

        if(nome.length < 3){
            return res.status(400).json({error: "O nome deve possuir no mínimo 3 caracteres"});
        }

        if(!email.includes('@') && !email.includes('.') && email.length < 7){
            return res.status(400).json({error: "O email informado é inválido"});
        }

        return res.status(200).json({message: "Usuário cadastrado com sucesso"})
    }
}