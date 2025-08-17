<script setup lang="ts">
  import { reactive, watch, onMounted, nextTick, defineEmits, defineProps } from 'vue'
  import { fdata, addDays, curUs } from '@/utils/funcoes';

  const emit = defineEmits(['alteraValor', 'focusout', "keyup", "update:modelValue",])

  export type iFormato = "Texto" | "Numero" | "DoisDecimais" | "TresDecimais" | "Data" | "CpfCnpj" | "Telefone" | "Cep" | "Maiusculo" | "Minusculo" | 'email' | 'password' | 'text' ;

  interface iProps {
    modelValue?: any,
    value?: any,
    formato?: iFormato;
  }

  var props = defineProps<iProps>();

  var controle = reactive({
    valor: props.modelValue != undefined ? props.value : "",
    formato: props.formato,
    type: "text",
    classe: "",
    valorAntigo: "" as any,
  })

  onMounted(async () => {
    var valor = props.modelValue != null ? props.modelValue : props.value;

    if (props.formato == 'Data') {
      controle.type = "text";
      controle.valor = fdata(valor)
    }
    else if (props.formato == 'DoisDecimais') {
      controle.type = "text";
      controle.valor = curUs(valor, 2);
    }
    else if (props.formato == 'TresDecimais') {
      controle.type = "text";
      controle.valor = curUs(valor, 3);
    }
    else if (props.formato == 'Numero') {
      controle.type = "number";
      controle.valor = valor;
    }
    else if (props.formato == 'Texto') {
      controle.type = "text";
      controle.valor = valor;
    }
    else if (props.formato == 'CpfCnpj') {
      controle.type = "text";
      controle.classe = "cnpj";

      controle.valor = formatarCpfCnpj(valor);
      nextTick(() => {
        var el = document.querySelector(".cnpj");
        el?.setAttribute('minlength', "11");
        el?.setAttribute('maxlength', "18");
      })
    }
    else if (props.formato == 'Telefone') {
      controle.type = "text";
      controle.classe = "telefone";

      controle.valor = formatarTelefone(valor);
      nextTick(() => {
        var el = document.querySelector(".cnpj");
        el?.setAttribute('minlength', "10");
        el?.setAttribute('maxlength', "15");
      })
    }
    else if (props.formato == 'Cep') {
      controle.type = "text";
      controle.classe = "cep";

      controle.valor = formatarCep(valor);
      nextTick(() => {
        var el = document.querySelector(".cep");
        el?.setAttribute('minlength', "8");
        el?.setAttribute('maxlength', "9");
      })
    }
    else if (props.formato == 'Maiusculo') {
      controle.type = "text";
      controle.classe = "text-uppercase";
    }
    else if (props.formato == 'Minusculo') {
      controle.type = "text";
      controle.classe = "text-lowercase";
    }
    else {
      controle.type = props.formato || "text";
      controle.valor = valor;
    }

  })

  watch(() => props.modelValue, async (novo: any) => {
    controle.valor = novo;

    // console.log("alterou")

    if (props.formato == 'Data') {
      controle.valor = fdata(controle.valor)
    }
    else if (props.formato == 'DoisDecimais')
      controle.valor = curUs(controle.valor, 2);
    else if (props.formato == 'TresDecimais')
      controle.valor = curUs(controle.valor, 3);
    else if (props.formato == 'CpfCnpj')
      controle.valor = formatarCpfCnpj(controle.valor);
    else if (props.formato == 'Telefone')
      controle.valor = formatarTelefone(controle.valor);

  })

  watch(() => props.value, async (novo: any) => {

    controle.valor = novo != null ? novo : controle.valor;


    if (props.formato == 'DoisDecimais')
      controle.valor = curUs(controle.valor, 2)
    else if (props.formato == 'TresDecimais')
      controle.valor = curUs(controle.valor, 3);
    else if (props.formato == 'Data')
      controle.valor = fdata(controle.valor)
    else if (props.formato == 'CpfCnpj')
      controle.valor = formatarCpfCnpj(controle.valor);
    else if (props.formato == 'Telefone')
      controle.valor = formatarTelefone(controle.valor);
    else if (props.formato == 'Cep')
      controle.valor = formatarCep(controle.valor);
  })

  const confereValor = () => {
    var alterouValor = false;

    if (props.formato == 'DoisDecimais') {
      controle.valor = curUs(controle.valor, 2);
      alterouValor = controle.valor != curUs(controle.valorAntigo, 2)
    }
    else if (props.formato == "TresDecimais") {
      controle.valor = curUs(controle.valor, 3);
      alterouValor = controle.valor != curUs(controle.valorAntigo, 3)
    }
    else if (props.formato == "Data") {
      controle.valor = formatarData(controle.valor);
      alterouValor = controle.valor != controle.valorAntigo;
    }
    else
      alterouValor = controle.valor != controle.valorAntigo;

    emit("update:modelValue", controle.valor);

    if (alterouValor) {
      emit("alteraValor", controle.valor);
    }
  }

  function formatarInput() {


    if (props.formato == 'CpfCnpj')
      controle.valor = formatarCpfCnpj(controle.valor);
    else if (props.formato == 'Telefone')
      controle.valor = formatarTelefone(controle.valor);
    else if (props.formato == 'Cep')
      controle.valor = formatarCep(controle.valor);

  }

  function formatarData(valor: any) {
    try {
      var dias = 0;
      var data: string;
      var idx: number;
      var dia: string;
      var mes: string;
      var ano: string;

      if (valor.toString().includes("h")) {
        idx = (valor.toString().indexOf("+"));
        if (idx > 0) {
          dias = parseInt(valor.substring(idx));
        }
        else {
          idx = (valor.toString().indexOf("-"));
          if (idx > 0) {
            dias = parseInt(valor.substring(idx));
          }
        }
        valor = fdata(addDays(new Date(Date.now()), dias))?.toString();
      }
      else if (valor.toString().includes("a")) {
        valor = fdata(addDays(new Date(Date.now()), 1))?.toString();
      }
      else if (valor.toString().includes("o")) {
        valor = fdata(addDays(new Date(Date.now()), -1))?.toString();
      }
      else if (valor.toString().length == 4) {
        dia = valor.substring(0, 2);
        mes = valor.substring(2);
        ano = new Date().getFullYear().toString();
        data = `${ano}-${mes}-${dia}`;
        valor = fdata(data)?.toString();
      }
      else if (valor.toString().length == 6) {
        dia = valor.substring(0, 2);
        mes = valor.substring(2, 4);
        ano = `${new Date().getFullYear().toString().substring(0, 2)}${valor.substring(4)}`;
        data = `${ano}-${mes}-${dia}`;
        valor = fdata(data)?.toString();
      }
      else if (valor.toString().length == 8) {
        dia = valor.substring(0, 2);
        mes = valor.substring(2, 4);
        ano = valor.substring(4).toString();
        data = `${ano}-${mes}-${dia}`;
        valor = fdata(data)?.toString();
      }

      return valor;
    } catch (error) {
      console.log("erro em TextBox:", error);
    }
  }

  function formatarCpfCnpj(valor: any) {
    
    if (valor != null)
    {
      valor = valor.replace(/\D/g, "");

      if (valor.length <= 11) {
        // Formatar CPF
        return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
      } else {
        // Formatar CNPJ
        return valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
      }
    }
    else
      return valor;
    
  }

  function formatarTelefone(valor: any) {

    if (valor?.length <= 10) {
      // Formatar telefone: (XX) XXXX-XXXX
      return valor?.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    } else {
      // Formatar celular: (XX) 9XXXX-XXXX
      return valor?.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
  }

  function formatarCep(valor: any) {

    // Formatar cep: XXXXX-XXXX
    if (valor != null) {
      valor = valor.replace("-", "");
      if (valor.length > 8)
        valor = valor.substring(0, 8);

      return valor?.replace(/(\d{5})(\d{3})/, "$1-$2");
    }
    else
      return valor;

  }

  function focusin(ev: FocusEvent) {
    if (ev != null && ev.target != null) {
      controle.valorAntigo = (ev.target as HTMLInputElement)?.value;
      (ev.target as HTMLInputElement).select();
    }
  }

  function focusOut(ev: FocusEvent) {
    confereValor();
    emit('focusout')
  }

  function onKeyUp(ev: KeyboardEvent) {
    emit('keyup', ev)
  }
</script>

<template>
  <input :type="controle.type" v-model="controle.valor" class="form-control form-control-sm" :class="controle.classe" v-bind="$attrs"
    @focusin="ev => focusin(ev)" @focusout="ev => focusOut(ev)" @input="formatarInput" @keyup="ev => onKeyUp(ev)" />
</template>

<style scoped>
input {
  width: 100%;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}
</style>