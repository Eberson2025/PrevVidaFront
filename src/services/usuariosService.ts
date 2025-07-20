import axios from "axios";
import { ILoginResultDTO } from "./Interfaces/ILoginResultDTO";
import { IUsuarioDTO } from "./Interfaces/IUsuarioDTO";
import { IUsuarioObterDTO } from "./Interfaces/IUsuarioObterDTO";
import ApiException from "./ApiException";
import config from "@/app.config.json";
import storeControle from "@/utils/storeControle";

const urlBase = config.urlApi;  //import.meta.env.VITE_URL_API;

const urls = {
  login: `${urlBase}/Usuarios/Login`,
  logout: `${urlBase}/Usuarios/Logout`,
  obter: `${urlBase}/Usuarios`,
  obterPorId: `${urlBase}/Usuarios`,
  alterarPropriaSenha: `${urlBase}/Usuarios/AlterarSenhaPropria`,
  recuperarSenhaSolicitacao: `${urlBase}/Usuarios/recuperarSenhaSolicitacao`,
  recuperarSenhaValidacao: `${urlBase}/Usuarios/recuperarSenhaValidacao`,
  recuperarSenhaConfirmacao: `${urlBase}/Usuarios/recuperarSenhaConfirmacao`,
  obterPermissoes: `${urlBase}/Usuarios/obterPermissoes`,
  obterGrupos: `${urlBase}/Pedido/obterGrupos`,
}


export const login = (userName: string, senha: string): Promise<ILoginResultDTO> => {
  return new Promise((resolve, reject) => {

    const params = {
      userName: userName,
      senha: senha
    }

    axios
      .post(urls.login, params)
      .then((response) => {

        if (response.data.accessToken) {
          localStorage.setItem('user', JSON.stringify(response.data));
          storeControle.token = getToken();
          storeControle.usuario = response.data;
        }


        return resolve(response.data);
      })
      .catch(error => reject(new ApiException(error || "Falha ao logar")));
  });
};

export const logout = () => {
  return new Promise((resolve, reject) => {

    localStorage.clear()
    storeControle.token = "";
    storeControle.usuario = null;

    axios
      .post(urls.logout)
      .then((response) => {
        return resolve(response.data);
      })
      .catch(error => reject(new ApiException(error || "Falha ao sair")));

  })
};

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

export const obterPorId = (id: number): Promise<IUsuarioDTO> => {
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


export const obter = (params?: IUsuarioObterDTO | null | any): Promise<IUsuarioDTO[]> => {
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

export const obterGrupos = (id: number): Promise<IUsuarioGrupoDTO[]> => {
  return new Promise((resolve, reject) => {

    const params = {
      usuarioId: id
    }

    axios.defaults.headers.common.Authorization = getToken();

    axios
      .post(urls.obterGrupos, params)
      .then((response) => {
        return resolve(response.data);
      })
      .catch(error => reject(new ApiException(error || "Falha ao obter grupos de usuarios")));
  });
};


export const obterPermissoes = (usuarioId: number, moduloId: number): Promise<IPermissaoUsuarioDto> => {
  return new Promise((resolve, reject) => {

    const params = {
      usuarioId: usuarioId,
      moduloId: moduloId
    }

    axios.defaults.headers.common.Authorization = getToken();

    axios
      .post(urls.obterPermissoes, params)
      .then((response) => {
        return resolve(response.data);
      })
      .catch(error => reject(new ApiException(error || "Falha ao obter permissões")));
  });
};

export const alterarSenhaPropria = (senhaAtual: string, senhaNova: string, conformaNovaSenha: string) => {
  return new Promise((resolve, reject) => {

    const params = {
      senhaAtual: senhaAtual,
      senhaNova: senhaNova,
      conformaNovaSenha: conformaNovaSenha,
    }

    axios.defaults.headers.common.Authorization = getToken();

    axios
      .post(urls.alterarPropriaSenha, params)
      .then((response) => {
        return resolve(response.data);
      })
      .catch(error => reject(new ApiException(error || "Falha ao alterar propria senha")));
  });
};


export const recuperarSenhaSolicitacao = (email: string) => {
  return new Promise((resolve, reject) => {

    const params = {
      email: email
    }

    axios
      .post(urls.recuperarSenhaSolicitacao, params)
      .then((response) => {
        return resolve(response.data);
      })
      .catch(error => reject(new ApiException(error || "Falha ao solicitar senha")));
  });
};

export const recuperarSenhaValidacao = (email: string, codigoValidacao: string) => {
  return new Promise((resolve, reject) => {

    const params = {
      email: email,
      codigoValidacao: codigoValidacao
    }

    axios
      .post(urls.recuperarSenhaValidacao, params)
      .then((response) => {
        return resolve(response.data);
      })
      .catch(error => reject(new ApiException(error || "Falha ao na validação da senha")));
  });
};


export const recuperarSenhaConfirmacao = (email: string, codigoValidacao: string,
  senhaNova: string, senhaNovaConfirmacao: string) => {
  return new Promise((resolve, reject) => {

    const params = {
      email: email,
      codigoValidacao: codigoValidacao,
      senhaNova: senhaNova,
      senhaNovaConfirmacao: senhaNovaConfirmacao
    }

    axios
      .post(urls.recuperarSenhaConfirmacao, params)
      .then((response) => {
        return resolve(response.data);
      })
      .catch(error => reject(new ApiException(error || "Falha na confirmação")));
  });
};

export interface IUsuarioGrupoDTO {
  grupoId: number;
  descricao: string;
}

export interface IPermissaoUsuarioDto {
  moduloI: number;
  descricao: string;
  permissoes: IPermissaoUsuarioModuloDto[];
}

export interface IPermissaoUsuarioModuloDto {
  permissaoId: number;
  descricao: string;
  servico: string;
  funcao: string;
  ordem: number;
}

