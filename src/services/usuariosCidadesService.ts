import axios from "axios";

import ApiException from "./ApiException";
import config from "@/app.config.json";
import storeControle from "@/utils/storeControle";
import { ValidacaoResult } from "@/services/Interfaces/IValidacaoResult";
import { Cidade } from "./cidadesService";

const urlBase = `${config.urlApi}/UsuariosCidades`;  //import.meta.env.VITE_URL_API;

const urls = {
  obter: `${urlBase}`,
  obterPorId: `${urlBase}`,
  adicionar: `${urlBase}`,
  alterar: `${urlBase}`,
  excluir: `${urlBase}`,
}

function getToken(): string {

  const x = localStorage.getItem('user');

  if (x != null) {
    const user = JSON.parse(x);

    if (user && user.accessToken) {
      return `Bearer  ${user.accessToken}`;
    } else {
      return "";
    }
  }
  else
    return "";
}


export const ObterCidadesUsuario = (usuarioId: number): Promise<Cidade[]> => {
  return new Promise((resolve, reject) => {

    axios.defaults.headers.common.Authorization = getToken();

    axios
      .get(`${urlBase}/ObterCidadesUsuario?usuarioId=${usuarioId}`)
      .then((r) => {
        return resolve(r.data);
      })
      .catch(error => reject(new ApiException(error || "Falha ao obter cidades")));
  });
};

export async function adicionar(usuario: UsuarioCidade): Promise<UsuarioCidade> {
  try {
    // Configurar token de autorização
    axios.defaults.headers.common.Authorization = getToken();

    return (await axios.post(urls.adicionar, usuario)).data;

  } catch (error: any) {
    throw new ApiException(error || "Falha ao salvar cidade do usuario");
  }
}

export async function excluir(id: number): Promise<void> {
  await axios.delete(`${urls.excluir}/${id}`)
}



export interface UsuarioCidade {
  usuarioId: number;
  cidadeId: number;
  dataCadastro: string | null;
  usuCadastroId: number | null;
  dataAlteracao: string | null;
  usuAlteracaoId: number | null;
  dataExclusao: string | null;
  usuExclusaoId: number | null;
  modelState: ValidacaoResult;
}

