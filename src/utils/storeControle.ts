import { reactive } from "vue";
import { ILoginResultDTO } from "@/services/usuariosService";


interface IControleStore {
  token: string,
  usuario?: ILoginResultDTO | null
}

const stateControle: IControleStore = reactive({
  token: "",
  usuario: null
});


export default stateControle;
