
import moment from "moment";

export const getToken = () => {
  const x = localStorage.getItem("user");

  if (x != null) {
    const user = JSON.parse(x);

    if (user && user.accessToken)
      return `Bearer  ${user.accessToken}`;
  }

  return "";
}

export const getUser = () => {
  let user = localStorage.getItem("user");

  if (user != null) {
    user = JSON.parse(user);
    return user;
  }

  return null;
}

export const fdata = (dateString: string | null | undefined | Date) => {
  try {

    if (dateString == undefined || dateString == null || dateString == "") return null;

    const dateParts = dateString.toString().split("/");

    if (dateParts.length === 3) {
      const day = dateParts[0];
      const month = dateParts[1];
      const year = dateParts[2];
      dateString = `${year}-${month}-${day}`;
    }

    const value = moment.utc(new Date(dateString));

    if (value.isValid())
      return moment(dateString).format("DD/MM/YYYY");
    else
      return dateString;
  } catch (error) {
    console.log("Falha em fdata '" + dateString + "' > " + error);
    return dateString;
  }
};

export const fDiaMes = (dateString: string) => {
  try {
    if (dateString == null) return null;
    const value = moment.utc(new Date(dateString));
    return moment(dateString).format("DD/MM");
  } catch (error) {
    console.log("Falha em fdata '" + dateString + "' > " + error);
    return "";
  }
};

export const fMesAno = (data: Date) => {
  let r = moment(data).format("MM/YY");

  if (r == "Invalid date") r = "";

  return r;
};

export const fdataUSS = (dateString: string | null) => {
  try {

    if (dateString == undefined || dateString == null)
      return "";

    const dateParts = dateString.split("/");

    if (dateParts.length === 3) {
      const day = dateParts[0];
      const month = dateParts[1];
      const year = dateParts[2];
      return `${year}-${month}-${day}`;
    } else {
      const value = moment.utc(new Date(dateString));
      if (value.isValid() == false)
        return "Data inválida";
      else
        return value;
    }
  }
  catch (error) {

    return null;
  }
};

export const fdataUS = (data: Date | any) => {
  try {
    if (data == null || data == "") return null;

    data = fStrToDateUS(data);

    const dataBr = moment.utc(data);
    if (dataBr.isValid())
      return moment(dataBr).format("YYYY-MM-DD");
    else
      return data;
  } catch (error) {
    console.log("Falha em fdataUS '" + data + "' > " + error);
    return null;
  }
};

export const fdataHora = (dateString: string) => {
  try {
    if (dateString == undefined || dateString == null || dateString == "") return null;
    const value = moment.utc(new Date(dateString));
    if (value.isValid())
      return moment(dateString).format("DD/MM/YYYY HH:mm:ss");
    else
      return dateString;
  } catch (error) {
    console.log("Falha em fdata '" + dateString + "' > " + error);
    return dateString;
  }
};

export const fStrToDateUS = (data: string | any) => {

  let dataBr = moment.utc(data);
  if (dataBr.isValid())
    return dataBr;

  let sep = "/";

  if (data.indexOf("-") > 0)
    sep = "-";

  const dia = data.toString().split(sep)[0];
  const mes = data.toString().split(sep)[1];
  const ano = data.toString().split(sep)[2];
  data = `${ano}-${mes}-${dia}`;
  dataBr = moment.utc(data);
  if (dataBr.isValid())
    return dataBr;

  return data;

}

export const fhora = (dateString: string) => {
  const value = new Date(dateString);
  return moment(value).format("HH:mm:ss");
};

export const fMilhao = (entrada: any) => {
  const value = entrada ? Number(entrada) : 0;
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
};

export const f2dec = (entrada: any, maximoDigito = 2) => {
  const value = entrada ? Number(entrada) : 0;
  return value.toLocaleString("pt-BR", { useGrouping: true, minimumFractionDigits: 2, maximumFractionDigits: maximoDigito });
};

export const f3dec = (entrada: any, maximoDigito = 3) => {
  const value = entrada ? Number(entrada) : 0;
  return value.toLocaleString("pt-BR", { useGrouping: true, minimumFractionDigits: 3, maximumFractionDigits: maximoDigito });
};

export const fCortar = (texto: string, qtdeCaracteres: number, reticencias?: any) => {
  if (texto != null && texto.length > qtdeCaracteres) {
    texto = texto.substring(0, qtdeCaracteres);
    if (reticencias == undefined || reticencias == true)
      texto += "...";
  }

  return texto;
};

export function SimboloMoeda() {
  return (0)
    .toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    .replace(/\d/g, "")
    .trim();
}

export function SimNao(valor?: boolean) {
  return valor == true ? "SIM" : "NAO";
}

export const round = (entrada: any, maximoDigito = 2) => {
  const value = entrada ? parseFloat(entrada.toFixed(maximoDigito)) : 0;
  return value;
};

export const primeiroDiaMes = () => {
  const date = new Date();
  const ano = date.getFullYear();
  const mes = date.getMonth();
  const r = new Date(ano, mes, 1);
  return moment(r).format("YYYY-MM-DD");
};

export const ultimoDiaMes = () => {
  const date = new Date();
  const ano = date.getFullYear();
  const mes = date.getMonth();
  const r = new Date(ano, mes + 1, 0);
  return moment(r).format("YYYY-MM-DD");
};

export const fDifData = (dataMaior: Date, dataMenor: Date) => {
  const date1 = new Date(dataMenor).getTime();
  const date2 = new Date(dataMaior).getTime();
  const diffDays = (date2 - date1) / (1000 * 60 * 60 * 24);
  return Math.trunc(diffDays);
};

export const fDifMinutos = (dataMaior: Date, dataMenor: Date) => {
  const date1 = new Date(dataMenor).getTime();
  const date2 = new Date(dataMaior).getTime();
  const dif = (date2 - date1) / (1000 * 60);
  return dif;
};

export function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export const imprimir = (nomeElemento: string) => {
  if (nomeElemento != undefined) {
    const printableContent = document.getElementById(nomeElemento);
    const printWindow = window.open("", "", "height=1000,width=1000");
    if (printWindow != null && printableContent != null) {
      printWindow.document.write(printableContent.innerHTML);
      printWindow.print();
    }
  } else window.print();
};

export function isNumber(val: string | undefined | null | any) {
  if (val == undefined || val == null || val == "") return false;

  return !isNaN(parseFloat(val));
}

export function curBr(num: any, decimais?: any) {
  //descricao: converte um texto de americano para portugues
  //           trocando o ponto pela virgula
  //exemplo: 0.00 > 0,00
  //utilizacao: ao colocar o valor numa caixa de texto

  num = isNaN(num) || num === "" || num === null ? 0.0 : num;
  if (decimais == null || decimais == "undefined") decimais = 2;
  const aux = parseFloat(num).toFixed(decimais).toString();
  return aux.replace(".", ",");
}

export function verificaNumero(str: string): boolean {

  // Remove espaços em branco da string (se necessário)
  str = str.toString().replace(/\s/g, "");

  // Verifica se a string contém apenas dígitos
  return /^\d+$/.test(str);
}

export function curUs(num: any, decimais?: any) {
  //descricao: converte um texto de portugues para americado
  //           trocando a virgula pelo ponto, utilizado para capturar
  //           os valores dos campos antes de fazer calculos
  //exemplo: 0,00 > 0.00
  //utilizacao: para capturar
  //           os valores dos campos antes de fazer calculos

  if (num == undefined || num == "") return 0.0;

  if (decimais == null || decimais == "undefined") decimais = 2;

  if (num.toString().includes(",")) num = parseFloat(parseFloat(num.replaceAll(".", "").replace(",", ".")).toFixed(decimais));
  else num = parseFloat(parseFloat(num).toFixed(decimais));

  return num;
}

export function ordenarTabela(tabela: [], coluna: string, ordem: "asc") {
  if (ordem == undefined || ordem == "asc")
    tabela = tabela.sort((a, b) => (a[coluna] > b[coluna]) ? 1 : ((b[coluna] > a[coluna]) ? -1 : 0));
  else
    tabela = tabela.sort((a, b) => (a[coluna] < b[coluna]) ? 1 : ((b[coluna] < a[coluna]) ? -1 : 0));
  return tabela;
}

export function usuarioLogado(): ILoginResultDTO | null {
  const x = localStorage.getItem("user");

  if (x != null) {
    const user = JSON.parse(x);

    if (user) {
      return user;
    } else {
      return null;
    }
  } else return null;
}

export interface ILoginResultDTO {
  userName: string;
  role: string;
  accessToken: string;
  refreshToken: string;
  usuarioId: number;
  nomeUsuario: string;
}

export function salvarFiltros(titulo: string, objetoFiltros: object) {
  localStorage.setItem(titulo, JSON.stringify(objetoFiltros));
}

export function carregarFiltros(titulo: string): object | null {
  const filtros = localStorage.getItem(titulo);
  if (filtros != null) return JSON.parse(filtros);
  else return null;
}


export function isDate(data: any) {
  return data instanceof Date && !isNaN(data.valueOf());
}
