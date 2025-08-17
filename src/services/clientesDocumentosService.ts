import axios from "axios";

import ApiException from "./ApiException";
import config from "@/app.config.json";
import storeControle from "@/utils/storeControle";
import { ValidacaoResult } from "@/services/Interfaces/IValidacaoResult";

const urlBase = `${config.urlApi}/Documentos`;  //import.meta.env.VITE_URL_API;

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

export const obterPorId = (id: number): Promise<Documento> => {
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

export const obter = (params?: Filtros | null | any): Promise<Documento[]> => {
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

export async function salvar(model: Documento): Promise<Documento> {
  try {
    // Configurar token de autorização
    axios.defaults.headers.common.Authorization = getToken();


    if (model.documentoId && model.documentoId > 0) {
      return (await axios.put(`${urls.alterar}/${model.documentoId}`, model)).data
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

export const uploadDocumento = (docto: UploadArquivo): Promise<string> => {
  return new Promise((resolve, reject) => {

    const formData = new FormData();
    formData.append('clienteId', docto.clienteId.toString());
    formData.append('tipo', docto.tipo);
    formData.append('arquivo', docto.arquivo);

    axios.defaults.headers.common.Authorization = getToken();

    axios
      .post(`${urlBase}/UploadDocumento?id=${docto.clienteId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => {
        return resolve(response.data);
      })
      .catch(error => reject(new ApiException(error || "Falha ao fazer upload do arquivo")));
  });
};



export interface Filtros {
  documentoId: number | null;
  clienteId: number | null;
  tipo: string | null;
  paginaAtual: number | null;
  tamanhoPagina: number | null;
}


export interface Documento {
  documentoId: number;
  tipo: string | null;
  clienteId: number | null;
  arquivo: File | null;

  dataCadastro: string | null;
  usuCadastroId: number | null;
  dataAlteracao: string | null;
  usuAlteracaoId: number | null;
  dataExclusao: string | null;
  usuExclusaoId: number | null;
  modelState: ValidacaoResult;
}


export interface UploadArquivo {
  clienteId: number;
  documentoId: number;
  tipo: string;
  arquivo: File;
}
