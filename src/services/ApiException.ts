export default class ApiException extends Error {
  public readonly message: string = ``;

  constructor(error: any) {
    super();

    let message = "";
    if (error.response != undefined && error.response != null && error.response.data != undefined) {
      if (error.response.data.message != undefined)
        message = error.response?.data?.message;
      else {
        if (error.response.data != undefined) {

          if ((error.response?.data?.errors != undefined)) {
            for (const [key, value] of Object.entries(error.response?.data?.errors)) {
              console.log(value);
              message += (`${key}: ${value}`);
            }
          }
          else if (Array.isArray(error.response?.data)) {
            error.response?.data.forEach((a: any) => {
              message += `Campo ${a.campo} : ${a.mensagem}, `;
            });
          }
          else {
            message = error.response.data;
          }

        }
      }
    } else {
      if (error.message != undefined && error.message != null) message = error.message;
    }

    if (!message && error.message == "Network Error") message = "Erro de rede/internet!";

    if (!message && error.message == "Network Error") message = "Erro de rede/internet!";

    if (!message && error?.response?.status == "404") message = "Não encontrado";

    if ((!message && error?.response?.status == "401") || (!message && error?.response?.status == "405"))
      if (error?.response?.data != '')
        message = error?.response?.data;
      else
        message = "Sem permissão!";

    this.message = message;

  }
}
