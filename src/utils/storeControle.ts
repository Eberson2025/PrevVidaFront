import { reactive } from "vue";
import * as serviceUsuario from "@/services/usuariosService";
import { ILoginResultDTO } from "@/services/Interfaces/ILoginResultDTO";


interface IControleStore {
  token: string,
  usuario?: ILoginResultDTO | null
}

const stateControle: IControleStore = reactive({
  token: "",
  usuario: null
});


export default stateControle;
