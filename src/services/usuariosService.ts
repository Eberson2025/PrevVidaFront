import axios from "axios";

import ApiException from "./ApiException";
import config from "@/app.config.json";
import storeControle from "@/utils/storeControle";
import { ValidacaoResult } from "@/services/Interfaces/IValidacaoResult";
import { Cidade } from "./cidadesService";

const urlBase = `${config.urlApi}/Usuarios`;  //import.meta.env.VITE_URL_API;

export const urlImagem = `${config.urlApi}/Imagens`; //import.meta.env.VITE_URL_API + "/Imagens";
const urls = {
  obter: `${urlBase}`,
  obterPorId: `${urlBase}`,
  adicionar: `${urlBase}`,
  alterar: `${urlBase}`,
  excluir: `${urlBase}`,

  obterTipos: `${urlBase}/ObterTipos`,

  login: `${urlBase}/Login`,
  logout: `${urlBase}/Logout`,

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

export const obterPorId = (id: number): Promise<Usuario> => {
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
      .catch(error => reject(new ApiException(error || "Falha ao obter usuario por id")));
  });
};

export const obter = (params?: UsuarioFiltros | null | any): Promise<Usuario[]> => {
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

export const obterTipos = (): Promise<UsuarioTipo[]> => {
  return new Promise((resolve, reject) => {

    axios.defaults.headers.common.Authorization = getToken();

    axios
      .get(urls.obterTipos)
      .then((r) => {
        return resolve(r.data);
      })
      .catch(error => reject(new ApiException(error || "Falha ao obter tipos de usuario")));
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

export interface Usuario {
  usuarioId?: number
  cidadeId?: number
  cpfCnpj: string
  nomeCompleto: string
  senha?: string
  email?: string
  telefone?: string
  observacoes?: string
  tipoId?: number
  ativo: boolean
  referenciaId?: number
  modelState?: ValidacaoResult
}

export interface UsuarioTipo {
  tipoId: number
  descricao: string
}

export async function salvar(usuario: Usuario): Promise<Usuario> {
  try {
    // Configurar token de autorização
    axios.defaults.headers.common.Authorization = getToken();

    if (usuario.usuarioId) {
      return (await axios.put(`${urls.alterar}/${usuario.usuarioId}`, usuario)).data
    } else {
      return (await axios.post(urls.adicionar, usuario)).data
    }
  } catch (error: any) {
    throw new ApiException(error || "Falha ao salvar usuario");
  }
}

export async function excluir(id: number): Promise<void> {
  await axios.delete(`${urls.excluir}/${id}`)
}

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

export interface UsuarioFiltros {
  usuarioId?: number | null;
  nome?: string;
  tipoId?: string;
  ativo?: boolean | null;
  paginaAtual?: number;
  tamanhoPagina?: number
}

export interface ILoginResultDTO {
  userName: string;
  role: string;
  accessToken: string;
  refreshToken: string;
  usuarioId: number;
  nomeUsuario: string;
}

export interface IUsuarioDTO {
  usuarioId: number;
  empresaId: number;
  login: string;
  nomeCompleto: string;
  senha: string;
  email: string;
  ativo: boolean;
  telefone: string;
  tokenRecSenha: string;
  foto: string;
  referenciaId: string;

}


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

