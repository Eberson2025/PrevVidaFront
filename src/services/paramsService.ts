import axios from "axios";

import ApiException from "./ApiException";
import config from "@/app.config.json";
import storeControle from "@/utils/storeControle";
import { ValidacaoResult } from "@/services/Interfaces/IValidacaoResult";

const urlBase = `${config.urlApi}/Parametros`;  //import.meta.env.VITE_URL_API;

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

export const obterPorId = (id: number): Promise<Param> => {
  return new Promise((resolve, reject) => {

    const params = {
      id: id
    }

    console.log("obterPorId", id);
    axios.defaults.headers.common.Authorization = getToken();

    axios
      .get(`${urls.obterPorId}/${id}`, { params })
      .then((response) => {
        return resolve(response.data);
      })
      .catch(error => reject(new ApiException(error || "Falha ao obter por id")));
  });
};

export const obter = (params?: Filtros | null | any): Promise<Param[]> => {
  return new Promise((resolve, reject) => {

    axios.defaults.headers.common.Authorization = getToken();

    axios
      .get(urls.obter, { params })
      .then((r) => {
        return resolve(r.data);
      })
      .catch(error => reject(new ApiException(error || "Falha ao obter ")));
  });
};

export async function salvar(model: Param): Promise<Param> {
  try {
    // Configurar token de autorização
    axios.defaults.headers.common.Authorization = getToken();

    if (model.paramId && model.paramId > 0) {
      return (await axios.put(`${urls.alterar}/${model.paramId}`, model)).data
    } else {
      return (await axios.post(urls.adicionar, model)).data
    }
  } catch (error: any) {
    throw new ApiException(error || "Falha ao salvar ");
  }
}

export async function excluir(id: number): Promise<void> {
  await axios.delete(`${urls.excluir}/${id}`)
}


export const SalvarAssinaturaBase64 = (docto: UploadAssinaturaDto): Promise<string> => {
  return new Promise((resolve, reject) => {

    const formData = new FormData();
    formData.append('paramId', docto.paramId.toString());
    formData.append('arquivoBase64', docto.arquivoBase64);

    axios.defaults.headers.common.Authorization = getToken();

    axios
      .post(`${urlBase}/SalvarAssinaturaBase64?id=${docto.paramId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => {
        return resolve(response.data);
      })
      .catch(error => reject(new ApiException(error || "Falha ao fazer upload da assinatura")));
  });
};

export const uploadFoto = (usuarioId: number, arquivo: File): Promise<string> => {
  return new Promise((resolve, reject) => {

    const formData = new FormData();
    formData.append('id', usuarioId.toString());
    formData.append('arquivo', arquivo);

    axios.defaults.headers.common.Authorization = getToken();

    axios
      .post(`${urlBase}/UploadFoto?id=${usuarioId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => {
        return resolve(response.data);
      })
      .catch(error => reject(new ApiException(error || "Falha ao fazer upload da foto")));
  });
};

export interface UploadAssinaturaDto {
  paramId: number;
  arquivoBase64: string;
}

export interface Filtros {
  paramId: number | null;
  paginaAtual: number | null;
  tamanhoPagina: number | null;
}

export interface Param {
  paramId: number;
  nomeEmpresa: string;
  path: string | null;
  urlApi: string | null;
  contratoParceiro: string | null;
  contratoEmpresa: string | null;
  politicaPrivacidade: string | null;
  termosDeUso: string | null;
  chaveValor: string | null;
  assinaturaContratada: string | null;
  fundoCartao: string | null;

  dataCadastro: string | null;
  usuCadastroId: number | null;
  dataAlteracao: string | null;
  usuAlteracaoId: number | null;
  dataExclusao: string | null;
  usuExclusaoId: number | null;
  modelState: ValidacaoResult;
}
