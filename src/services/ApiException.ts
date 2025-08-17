import { ValidacaoResult } from "./Interfaces/IValidacaoResult";

export default class ApiException extends Error {
  public readonly message: string = ``;
  public readonly statusCode?: number;
  public readonly validationErrors?: string[];

  constructor(error: any) {
    super();

    console.log("Erro capturado:", error);

    let message = "";
    let statusCode: number | undefined;
    let validationErrors: string[] | undefined;

    // Se o erro tem response (erro HTTP)
    if (error.response) {
      statusCode = error.response.status;

      switch (statusCode) {
        case 400:
          message = this.handleBadRequest(error.response.data);
          break;

        case 401:
          message = this.handleUnauthorized(error.response.data);
          break;

        case 403:
          message = this.handleForbidden(error.response.data);
          break;

        case 404:
          message = "Recurso não encontrado";
          break;

        case 409:
          message = this.handleConflict(error.response.data);
          break;

        case 500:
          {
            const result = this.handleServerError(error.response.data);
            message = result.message;
            validationErrors = result.validationErrors;
            break;
          }
        default:
          message = this.handleGenericHttpError(error.response);
      }
    }
    // Se o erro é de rede
    else if (error.request) {
      message = "Erro de conexão. Verifique sua internet.";
    }
    // Outros tipos de erro
    else {
      message = error.message || "Erro desconhecido";
    }

    // Fallback se não conseguiu definir uma mensagem
    if (!message) {
      message = "Erro interno da aplicação";
    }

    this.message = message;
    this.statusCode = statusCode;
    this.validationErrors = validationErrors;
  }

  private handleBadRequest(data: any): string {
    // Tratar ValidacaoResult
    if (this.isValidacaoResult(data)) {
      const validacaoResult = data as ValidacaoResult;

      // Verificar se tem array de erros
      if (validacaoResult.erros && Array.isArray(validacaoResult.erros) && validacaoResult.erros.length > 0) {
        const errors = validacaoResult.erros.map(erro =>
          `${erro.campo}: ${erro.mensagem}`
        );
        return errors.join('; ');
      }


    }

    // Tratar erros de validação do ASP.NET Core
    if (data?.errors) {
      const errors: string[] = [];
      for (const [key, value] of Object.entries(data.errors)) {
        if (Array.isArray(value)) {
          errors.push(`${key}: ${(value as string[]).join(', ')}`);
        } else {
          errors.push(`${key}: ${value}`);
        }
      }
      return errors.join('; ');
    }

    // Tratar array de erros personalizados
    if (Array.isArray(data)) {
      return data.map((error: any) =>
        `${error.campo}: ${error.mensagem}`
      ).join('; ');
    }

    // Mensagem simples
    if (typeof data === 'string') {
      return data;
    }

    if (data?.message) {
      return data.message;
    }

    return "Dados inválidos fornecidos";
  }

  private handleUnauthorized(data: any): string {
    if (typeof data === 'string' && data.trim()) {
      return data;
    }

    if (data?.message) {
      return data.message;
    }

    return "Não autorizado. Faça login novamente.";
  }

  private handleForbidden(data: any): string {
    if (typeof data === 'string' && data.trim()) {
      return data;
    }

    if (data?.message) {
      return data.message;
    }

    return "Sem permissão para executar esta ação";
  }

  private handleConflict(data: any): string {
    if (typeof data === 'string' && data.trim()) {
      return data;
    }

    if (data?.message) {
      return data.message;
    }

    return "Conflito: recurso já existe ou está sendo usado";
  }

  private handleServerError(data: any): { message: string; validationErrors?: string[] } {
    console.log("Erro 500:", data);

    // Tratar ValidacaoResult
    if (this.isValidacaoResult(data)) {
      const validacaoResult = data as ValidacaoResult;

      // Verificar se tem array de erros
      if (validacaoResult.erros && Array.isArray(validacaoResult.erros) && validacaoResult.erros.length > 0) {
        const errors = validacaoResult.erros.map(erro =>
          `${erro.campo}: ${erro.mensagem}`
        );
        return {
          message: errors.join('; '),
          validationErrors: errors
        };
      }


    }

    // Outros formatos de erro 500
    if (typeof data === 'string' && data.trim()) {
      return { message: data };
    }

    if (data?.message) {
      return { message: data.message };
    }

    return { message: "Erro interno do servidor" };
  }

  private handleGenericHttpError(response: any): string {
    const status = response.status;
    const statusText = response.statusText;

    if (response.data && typeof response.data === 'string') {
      return response.data;
    }

    if (response.data?.message) {
      return response.data.message;
    }

    return `Erro ${status}: ${statusText}`;
  }

  private isValidacaoResult(data: any): boolean {
    return data && (
      (data.erros && Array.isArray(data.erros)) ||
      (data.mensagens && typeof data.mensagens === 'string')
    );
  }

  // Método utilitário para obter apenas as mensagens de validação
  public getValidationMessages(): string[] {
    return this.validationErrors || [];
  }

  // Método utilitário para verificar se é erro de validação
  public isValidationError(): boolean {
    return this.statusCode === 400 || (this.statusCode === 500 && !!this.validationErrors);
  }

  // Método utilitário para verificar se precisa de nova autenticação
  public requiresReauth(): boolean {
    return this.statusCode === 401;
  }
}
