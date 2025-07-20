
<script lang="ts" setup>

  //vue
  import { onMounted, reactive } from "vue";
  import { useRouter } from "vue-router";

  //servicos
  import * as serviceUsuario from "@/services/usuariosService";

  //componentes
  import TrataTecla from "@/components/TrataTecla/Index.vue";


  const router = useRouter();

  let controle = reactive({
    userName: "",
    senha: "",
    codigo: "",
    senhaConfirmacao:"",

    pagina: "login",
    status: "",
    erro: ""
  });


  function login() {

    controle.erro = "";
    controle.status = "Autenticando...";

    serviceUsuario.login(controle.userName, controle.senha)
    .then(r=> {
      controle.status = "Logado";

      setTimeout(() => {
        controle.status = "";
        controle.status = "Logado!";
        router.push({ path: "/" });
      }, 2000);

    })
    .catch(erro => {
      console.log(erro);
      controle.status = "";
      controle.erro  = erro;
    })
  }

  function voltar(pagina: string)
  {
    controle.pagina = pagina;
    controle.erro = "";
    controle.status = "";
  }

  function esqueceuSenha() {
    console.log("esqueceu senha");

    controle.pagina = "email";
    
    setTimeout(() => {
      var el = document.getElementById("email2");
      if (el != undefined)
        el.focus();
    }, 500);
  }

  function enviarEmail() {
    console.log("envia email");

    controle.erro = "";
    controle.status = "Enviando email...";

    serviceUsuario.recuperarSenhaSolicitacao(controle.userName)
    .then(r=> {
      controle.status = "Sucesso! Enviamos um código de verificação no seu e-mail";

      setTimeout(() => {
        controle.pagina = "codigoVerificacao";

        setTimeout(() => {
          var el = document.getElementById("codigo");
          if (el != undefined)
            el.focus();
        }, 500);
      }, 3000);
       

    })
    .catch(erro => {
      console.log(erro);
      controle.status = "";
      controle.erro  = erro;
    })

   
  }


  function validarCodigo() {
    console.log("valida codigo")

    controle.erro = "";
    controle.status = "Verificando código...";

    serviceUsuario.recuperarSenhaValidacao(controle.userName, controle.codigo)
    .then(r=> {
      controle.status = "Sucesso! Código verificado";

      setTimeout(() => {
        controle.pagina = "cadastrarSenha";

        setTimeout(() => {
          var el = document.getElementById("senha");
          if (el != undefined)
            el.focus();
        }, 500);
      }, 3000);
       

    })
    .catch(erro => {
      console.log(erro);
      controle.status = "";
      controle.erro  = erro;
    })

  }

  function cadastrarSenha() {
    console.log("cadastra senha")

    controle.erro = "";
    controle.status = "Cadastrando nova senha...";

    serviceUsuario.recuperarSenhaConfirmacao(controle.userName, controle.codigo, controle.senha, controle.senhaConfirmacao)
    .then(r=> {
      controle.status = "Senha cadastrada com sucesso!";

      setTimeout(() => {
        controle.pagina = "login";

        setTimeout(() => {
          var el = document.getElementById("senha");
          if (el != undefined)
            el.focus();
        }, 500);
      }, 5000);
       

    })
    .catch(erro => {
      console.log(erro);
      controle.status = "";
      controle.erro  = erro;
    })
  }

</script>

<template>
  <TrataTecla>
    <div class="limiter" v-if="controle.pagina == 'login'">
      <div class="container-login100">
          <div class="wrap-login100">

            <div class="login100-form validate-form text-center">

              <span class="login100-form-title mb-3">
                  <img src="@/assets/images/logoLogin.png" width="300">
              </span>

              <div class="form-floating mb-3">
                  <input id="email" type="text" class="form-control" name="email" v-model="controle.userName" required="true" autocomplete="email" autofocus="true">
                  <label for="email">Email</label>
              </div>

              <div class="form-floating input-group mb-3">
                    <input id="senha" type="password" class="form-control" name="senha" v-model="controle.senha"  required="true" autocomplete="current-password">
                    <label for="senha">Informe a senha</label>
                  <span class="input-group-text" id="basic-addon1"><i class="icon ion-md-eye" id="eye"></i></span>
              </div>

              <div class="row mb-2">
                  <div class="col-md-12 text-center">
                      <button type="submit" class="btn btn-primary" @click="login()">
                          Login
                      </button>
                  </div>
              </div>

               <div class="row mb-2">
                  <div class="col-md-12 text-center">
                      <a class="btn btn-link" @click="esqueceuSenha()">
                          Esqueceu sua senha?
                      </a>
                    </div>
              </div>

              <div class="row">
                <div class="col-md-12 fw-bold text-center" v-if="controle.status != ''">
                  <i class="fa fa-cog fa-spin"></i>  {{ controle.status }}
                </div>

                <div class="col-md-12 fw-bold text-danger text-center" v-if="controle.erro != ''">
                  {{ controle.erro }}
                </div>
              </div>
            </div>

              <div class="login100-more img-login" >
                <img src="@/assets/images/bglogin.png" >
              </div>
          </div>
    </div>
  </div>

  <div class="limiter" v-if="controle.pagina == 'email'">
      <div class="container-login100">
          <div class="wrap-login100">

            <div class="login100-form validate-form text-center">

              <span class="login100-form-title mb-3">
                  <img src="@/assets/images/logoLogin.png" width="300">
              </span>

               <div class="row mb-2">
                  <div class="col-md-12 fw-bold fs-6">
                      Esqueceu a sua senha?
                    </div>
              </div>

              <div class="row mb-2">
                  <div class="col-md-12 ">
                      Informe seu e-mail abaixo para iniciar o procedimento de cadastro de uma nova senha
                    </div>
              </div>

              <div class="form-floating mb-3">
                  <input id="email2" type="text" class="form-control" name="email" v-model="controle.userName" required="true" autocomplete="email" autofocus="true">
                  <label for="email2">Email</label>
              </div>

               <div class="row mb-2">
                  <div class="col-md-12 text-center">
                      <button type="submit" class="btn btn-primary" @click="enviarEmail()">
                          Enviar
                      </button>
                  </div>
              </div>

               <div class="row mb-2">
                  <div class="col-md-12 text-center">
                      <a class="btn btn-link" @click="voltar('login')">
                         <i class="fa fa-arrow-left"></i> Voltar
                      </a>
                  </div>
              </div>

          
              <div class="row">
                <div class="col-md-12 fw-bold text-center" v-if="controle.status != ''">
                  <i class="fa fa-cog fa-spin"></i>  {{ controle.status }}
                </div>

                <div class="col-md-12 fw-bold text-danger text-center" v-if="controle.erro != ''">
                  {{ controle.erro }}
                </div>
              </div>
            </div>

              <div class="login100-more img-login" >
                <img src="@/assets/images/bglogin.png" >
              </div>
          </div>
    </div>
  </div>

  <div class="limiter" v-if="controle.pagina == 'codigoVerificacao'">
      <div class="container-login100">
          <div class="wrap-login100">

            <div class="login100-form validate-form  text-center">

              <span class="login100-form-title">
                  <img src="@/assets/images/logoLogin.png" width="300">
              </span>

              <div class="row mb-2">
                  <div class="col-md-12 fw-bold fs-6">
                       Código de verificação
                    </div>
              </div>

              <div class="row mb-2">
                  <div class="col-md-12 ">
                       Informe o código de verificação que enviamos em seu e-mail
                    </div>
              </div>

              <div class="form-floating mb-3">
                  <input id="codigo" type="text" class="form-control" name="codigo" v-model="controle.codigo" required="true" autocomplete="codigo" autofocus="true">
                  <label for="codigo">Código de verificação</label>
              </div>

              <div class="row mb-2">
                  <div class="col-md-12 text-center">
                      <button type="submit" class="btn btn-primary" @click="validarCodigo()">
                          Validar
                      </button>
                  </div>
              </div>

               <div class="row mb-2">
                  <div class="col-md-12 text-center">
                      <a class="btn btn-link" @click="voltar('login')">
                         <i class="fa fa-arrow-left"></i> Voltar
                      </a>
                  </div>
              </div>

              <div class="row">
                <div class="col-md-12 fw-bold text-center" v-if="controle.status != ''">
                  <i class="fa fa-cog fa-spin"></i>  {{ controle.status }}
                </div>

                <div class="col-md-12 fw-bold text-danger text-center" v-if="controle.erro != ''">
                  {{ controle.erro }}
                </div>
              </div>
            </div>

              <div class="login100-more img-login" >
                <img src="@/assets/images/bglogin.png" >
              </div>
          </div>
    </div>
  </div>

  <div class="limiter" v-if="controle.pagina == 'cadastrarSenha'">
      <div class="container-login100">
          <div class="wrap-login100">

            <div class="login100-form validate-form  text-center">

              <span class="login100-form-title">
                  <img src="@/assets/images/logoLogin.png" width="300">
              </span>

              <div class="row mb-2">
                  <div class="col-md-12 fw-bold fs-6">
                       Cadastrar Nova Senha
                    </div>
              </div>

              <div class="row mb-2">
                  <div class="col-md-12 ">
                       Informe a senha e reconfirme a senha
                    </div>
              </div>

              <div class="form-floating mb-2">
                  <input id="senha" type="password" class="form-control" name="senha" v-model="controle.senha" required="true"  autofocus="true">
                  <label for="senha">Senha</label>
                  <span class="input-group-text" id="basic-addon1"><i class="icon ion-md-eye" id="eye"></i></span>
              </div>

              <div class="form-floating input-group mb-2">
                  <input id="senha2" type="password" class="form-control" name="senha2" v-model="controle.senhaConfirmacao"  required="true" >
                  <label for="senha2">Confirme a senha</label>
                  <span class="input-group-text" id="basic-addon1"><i class="icon ion-md-eye" id="eye"></i></span>
              </div>

              <div class="row mb-2">
                  <div class="col-md-12 text-center">
                      <button type="submit" class="btn btn-primary" @click="cadastrarSenha()">
                           Cadastrar senha
                      </button>
                  </div>
              </div>

               <div class="row mb-2">
                  <div class="col-md-12 text-center">
                      <a class="btn btn-link" @click="voltar('login')">
                         <i class="fa fa-arrow-left"></i> Voltar
                      </a>
                  </div>
              </div>

              <div class="row">
                <div class="col-md-12 fw-bold text-center" v-if="controle.status != ''">
                  <i class="fa fa-cog fa-spin"></i>  {{ controle.status }}
                </div>

                <div class="col-md-12 fw-bold text-danger text-center" v-if="controle.erro != ''">
                  {{ controle.erro }}
                </div>
              </div>
            </div>

              <div class="login100-more img-login" >
                <img src="@/assets/images/bglogin.png" >
              </div>
          </div>
    </div>
  </div>
</TrataTecla>

</template>


<style lang="css" scoped>


.limiter {
    width: 100%;
    margin: 0 auto;
}

.container-login100 {
    width: 100%;
    min-height: 100vh;
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flexbox;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    background: #f2f2f2;
}

.wrap-login100 {
    width: 100%;
    background: #fff;
    overflow: hidden;
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flexbox;
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    flex-direction: row-reverse;
}

.login100-form {
    width: 560px;
    min-height: 100vh;
    display: block;
    background-color: #f7f7f7;
    padding: 173px 55px 55px 55px;
}

.login100-more {
    width: calc(100% - 560px);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    position: relative;
    z-index: 1;
}
</style>