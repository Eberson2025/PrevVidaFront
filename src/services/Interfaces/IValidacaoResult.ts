export interface ValidacaoResult {
    erros: Erro[];
    isValid: boolean;
}

export interface Erro {
    campo: string;
    mensagem: string;
}