import axios from "axios";

import ApiException from "./ApiException";
import config from "@/app.config.json";
import storeControle from "@/utils/storeControle";
import { ValidacaoResult } from "@/services/Interfaces/IValidacaoResult";
import { Cidade } from "./cidadesService";

const urlBase = `${config.urlApi}/Clientes`;  //import.meta.env.VITE_URL_API;

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

export const obterPorId = (id: number): Promise<Cliente> => {
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

export const obter = (params?: Filtros | null | any): Promise<Cliente[]> => {
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

export async function salvar(model: Cliente): Promise<Cliente> {
  try {
    // Configurar token de autorização
    axios.defaults.headers.common.Authorization = getToken();

    if (model.clienteId && model.clienteId > 0) {
      return (await axios.put(`${urls.alterar}/${model.clienteId}`, model)).data
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


export interface Filtros {
  clienteId: number | null;
  nome: string | null;
  cpf: string | null;
  ativo: boolean | null;
  telefone: string | null;
  cidadeId: number | null;
  usuarioId: number | null;
  cortesia: boolean | null;
  comCidades?: boolean | null;
  comVendedor?: boolean | null;
  paginaAtual: number | null;
  tamanhoPagina: number | null;
}

export interface Cliente {
  clienteId: number;
  usuarioId: number;
  nome: string;
  cpf: string | null;
  rg: string | null;
  rgExpedidor: string | null;
  telefone: string | null;
  celular: string | null;
  logradouro: string | null;
  numero: string;
  bairro: string | null;
  cidadeId: number | null;
  cep: string | null;
  complemento: string | null;
  nomeConjuge: string | null;
  cpfConjuge: string | null;
  cortesia: boolean;
  dataEntregaCartao: string | null;
  dataNascimento: string | null;
  email: string | null;
  observacoes: string | null;
  senha: string | null;
  ativo: boolean;

  dataCadastro: string | null;
  usuCadastroId: number | null;
  dataAlteracao: string | null;
  usuAlteracaoId: number | null;
  dataExclusao: string | null;
  usuExclusaoId: number | null;
  modelState: ValidacaoResult;
}
