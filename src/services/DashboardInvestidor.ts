import axios from "axios";
import { getToken } from "@/utils/funcoes";
import ApiException from "./ApiException";
import config from "@/app.config.json";

const urlBase = config.urlApi;  //import.meta.env.VITE_URL_API;

const urls = {
  obterDashboard: `${urlBase}/DashboardInvestidor/Dashboard`,
}


export interface FiltroMensalidades {
  investidoresId: number[] | null;
  vendedoresId: number[] | null;
  cidadesIds: number[] | null;
  clientesIds: number[] | null;
  dataPagtoInicial: string | null;
  dataPagtoFinal: string | null;
  dataVencInicial: string | null;
  dataVencFinal: string | null;
}

export interface RelMensDTO {
  id: number;
  contratoId: number | null;
  dataInicio: string | null;
  clienteId: number | null;
  cidadeId: number | null;
  cidadeNome: string;
  investidorId: number | null;
  investidorNome: string;
  vendedorId: number | null;
  vendedorNome: string;
  dataVencimento: string | null;
  dataPagamento: string | null;
  valor: number;
  valorPago: number;
}

export interface ResumoCidadeDto {
  cidadeId: number;
  nomeCidade: string;
  qtdeContratos: number;
  qtdePessoas: number;
  totalRecebido: number;
  qtdeParcelasRecebidas: number;
  totalReceber: number;
  qtdeParcelasReceber: number;
  investidorId: number;
  totalContratos: number;
  qtdeParcelasAtrasadas: number;
  totalAtrasado: number;
}

export interface PrevisaoDTO {
  mes: string,
  valor: number,
  qtde: number,
  qtdeAcum: number,
  valorAcum: number
}

export interface Dashboard {
  mensalidades: RelMensDTO[],
  resumoCidades: ResumoCidadeDto[],
  qtdeContratos: number,
  totalContratos: number,
  totalRecebido: number,
  totalAtrasado: number,
  totalReceber: number,
  qtdeParcelasMes: number,
  totalParcelasMes: number,
  totalParcelasRecebidasMes: number,
  previsao: PrevisaoDTO[]
}

export const obterDashboard = (params?: FiltroMensalidades): Promise<Dashboard> => {
  return new Promise((resolve, reject) => {

    axios.defaults.headers.common.Authorization = getToken();

    axios
      .post(urls.obterDashboard, params)
      .then((r) => {
        return resolve(r.data);
      })
      .catch((error) => {
        return reject(new ApiException(error || "Erro ao buscar dashboard"));
      });
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

// export const obterPermissoes = (
//   params?: Interface.ObterPermissoes | any
// ): Promise<Interface.IRetornoPermissoesDTO> => {
//   return new Promise((resolve, reject) => {
//     axios.defaults.headers.common.Authorization = getToken();

//     axios
//       .post(urls.obterPermissoes, params)
//       .then((r) => {
//         return resolve(r.data);
//       })
//       .catch((error) => {
//         return reject(error?.message);
//       });
//   });
// };
