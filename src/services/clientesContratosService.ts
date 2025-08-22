import axios from "axios";

import ApiException from "./ApiException";
import config from "@/app.config.json";
import storeControle from "@/utils/storeControle";
import { ValidacaoResult } from "@/services/Interfaces/IValidacaoResult";

const urlBase = `${config.urlApi}/Contratos`;  //import.meta.env.VITE_URL_API;

const urls = {
  obter: `${urlBase}`,
  obterPorId: `${urlBase}`,
  adicionar: `${urlBase}`,
  alterar: `${urlBase}`,
  excluir: `${urlBase}`,

  obterStatus: `${urlBase}/ObterStatus`,
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

export const obterPorId = (id: number): Promise<Contrato> => {
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

export const obter = (params?: Filtros | null | any): Promise<Contrato[]> => {
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

export async function salvar(model: Contrato): Promise<Contrato> {
  try {
    // Configurar token de autorização
    axios.defaults.headers.common.Authorization = getToken();

    if (model.contratoId && model.contratoId > 0) {
      return (await axios.put(`${urls.alterar}/${model.contratoId}`, model)).data
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

export const obterStatus = (): Promise<ContratoStatus[]> => {
  return new Promise((resolve, reject) => {

    axios.defaults.headers.common.Authorization = getToken();

    axios
      .get(urls.obterStatus)
      .then((r) => {
        return resolve(r.data);
      })
      .catch(error => reject(new ApiException(error || "Falha ao obter ")));
  });
};


export const SalvarAssinaturaBase64 = (docto: UploadAssinaturaDto): Promise<string> => {
  return new Promise((resolve, reject) => {

    const formData = new FormData();
    formData.append('contratoId', docto.contratoId.toString());
    formData.append('arquivoBase64', docto.arquivoBase64);

    axios.defaults.headers.common.Authorization = getToken();

    axios
      .post(`${urlBase}/SalvarAssinaturaBase64?id=${docto.contratoId}`, formData, {
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

export interface Filtros {
  clienteId: number | null;
  contratoId: number | null;
  vendedorId: number | null;
  supervisorId: number | null;
  empresaId: number | null;
  status: string | null;
  paginaAtual: number | null;
  tamanhoPagina: number | null;
}

export interface Contrato {
  contratoId: number;
  planoId: number;
  plano: plano;
  vendedorId: number | null;
  vendedor: Usuario | null;
  investidorId: number | null;
  investidor: Usuario | null;
  supervisorId: number | null;
  supervisor: Usuario | null;
  clienteId: number | null;
  empresaId: number | null;
  preContrato: boolean | null;
  dataPriParcela: Date | null;
  statusId: number;
  status: ContratoStatus;
  dataInicio: string | null;
  dataFim: string | null;
  assinatura: string | null;
  dataAssinatura: string | null;
  arquivo: string | null;
  texto: string | null;
  observacoes: string | null;

  dataCadastro: string | null;
  usuCadastroId: number | null;
  dataAlteracao: string | null;
  usuAlteracaoId: number | null;
  dataExclusao: string | null;
  usuExclusaoId: number | null;
  modelState: ValidacaoResult;
}

export interface ContratoStatus {
  statusId: number;
  descricao: string;
}

export interface plano {
  planoId: number;
  nome: string;
}

export interface Usuario {
  usuarioId: number;
  nomeCompleto: string;
}

export interface UploadAssinaturaDto {
  contratoId: number;
  arquivoBase64: string;
}