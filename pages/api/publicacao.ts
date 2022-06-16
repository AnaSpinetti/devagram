import type { NextApiRequest, NextApiResponse } from "next";
import type { PadraoResponse } from "../../types/PadraoResponse";
import type { PublicacaoModel } from "../../models/PublicacaoModel";
import { ConectarMongoDb } from "../../middlewares/ConectarMongoDb";
import { upload, UploadImagemCosmic } from "../../services/UploadImagemCosmic";

