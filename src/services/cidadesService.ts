import axios from "axios";

import ApiException from "./ApiException";
import config from "@/app.config.json";
import storeControle from "@/utils/storeControle";

const urlBase = `${config.urlApi}/Cidades`;  //import.meta.env.VITE_URL_API;

const urls = {
  obter: `${urlBase}`,
  obterPorId: `${urlBase}`,
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

export const obterPorId = (id: number): Promise<Cidade> => {
  return new Promise((resolve, reject) => {

    const params = {
      id: id
    }

    axios.defaults.headers.common.Authorization = getToken();

    axios
      .get(urls.obterPorId, { params })
      .then((response) => {
        return resolve(response.data);
      })
      .catch(error => reject(new ApiException(error || "Falha ao obter usuario por id")));
  });
};

export const obter = (params?: CidadesFiltro | null | any): Promise<Cidade[]> => {
  return new Promise((resolve, reject) => {

    axios.defaults.headers.common.Authorization = getToken();

    axios
      .get(urls.obter, { params })
      .then((r) => {
        return resolve(r.data);
      })
      .catch(error => reject(new ApiException(error || "Falha ao obter usuario")));
  });
};


export interface CidadesFiltro {
  cidadeId?: number
  nome?: string
  estado?: string
  ativo?: boolean
  paginaAtual?: number
  tamanhoPagina?: number
}

export interface Cidade {
  cidadeId: number
  nome: string
  estado: string
}
