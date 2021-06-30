


var token = JSON.parse(localStorage.getItem("token"));
token = "Bearer " + token.accessToken;
var perfil = {"idperfil":0};
var url_seguranca = "paginas/seguranca/";
var url_bingo = "paginas/bingo/";


function alerta_doce(titulo, texto, cor,tempo) {
  var timer = 2000;
  if(tempo){
    timer = tempo;
  }
  swal({
    title: titulo,
    text: texto,
    type: cor,
    timer: timer,
  });
}



function validarlogin() {
  event.preventDefault();
  $("#botao_login").hide();
  $("#botao_login_carregar").show();

  var validacao = "S";
  var loginusuario = $("#txt_loginusuario").val();
  var senha = $("#txt_senha").val();

  if (loginusuario == "") {
    $("#alerta").show();
    $("#textoalerta").html("Usuário e senha precisa ser preenchido");

    validacao = "N";
  }

  if (senha == "") {
    $("#alerta").show();
    $("#textoalerta").html("Usuário e senha precisa ser preenchido");

    validacao = "N";
  }

  if (validacao == "S") {
    var LoginJson = { username: loginusuario, password: senha };

    $.ajax({
      type: "POST",
      url: url_globlal+url_serverside+"api/auth/signin",
      contentType: "application/json",
      data: JSON.stringify(LoginJson),

      success: function (data, status, xhr) {
        var objeto = JSON.stringify(data);
        localStorage.setItem("token", objeto);
        window.location.href = "home.html";
      },
      error: function (xhr, status, error) {
        //console.clear();
        $("#textoalerta").html("Usuário ou senha estão incorretos");
        $("#alerta").show();
        $("#botao_login_carregar").hide();
        $("#botao_login").show();
      },
    });
  }else{
    $("#botao_login").show();
    $("#botao_login_carregar").hide();
  }
}

function Requisicao(url_requisicao, json_requisicao, metodo) {
  if (!metodo || metodo == "") {
    metodo = "POST";
  }
  var json_retorno;

  

  $.ajax({
    type: metodo,
    url: url_globlal+url_serverside+url_requisicao,
    headers: {
      Authorization: "Bearer " + token.accessToken,
    },

    contentType: "application/json",
    data: JSON.stringify(json_requisicao),
    async: false,
    success: function (data, status, xhr) {
      json_retorno = data;
    },
    error: function (xhr, status, error) {},
  });

  return json_retorno;
}

function validar_loginusuario(loginusuario,tipo,idusuario) {
  /*
  TIPO 1 É CRIAR
  TIPO 2 É ALTERAR
  */
  var JsonEmail = { "loginusuario": loginusuario,"tipo":tipo,"idusuario":idusuario };

  var retorno;

  $.ajax({
    type: "POST",
    url: url_globlal+url_serverside + "ValidarLoginUsuario",
    contentType: "application/json",
    data: JSON.stringify(JsonEmail),
    async: false,
    success: function (data, status, xhr) {
      retorno = data.existe;
    },
    error: function (xhr, status, error) {},
  });

  return retorno;
}




function home() {
  exibir_usuario();
  exibir_empresa();

   var retorno_perfil = Requisicao("ListarUsuarioPerfil/IDUSUARIO",'',"GET");
  perfil.idperfil = retorno_perfil.idperfil;
  if(!perfil.idperfil){
    carrega_pagina_div('corpo','paginas/sistema/erro');
    $("#txt_erro_sistema").text("Seu usuário ainda não possui acesso ao sistema");
    $("#drop_idiomas").hide();
    $("#drop_mensagens").hide();
  }else{
  exibir_idiomas();
  exibir_mensagens();
  exibir_menu();

  }

}



function exibir_usuario() {
  var DadosUsuarios = Requisicao("Usuario", "");

  $("#nomeusuario01").html(DadosUsuarios.nomeusuario);
  $("#nomeusuario02").html(DadosUsuarios.nomeusuario);
  $("#cargo01").html(DadosUsuarios.cargo);

  $("#fotousuario01").attr("src", DadosUsuarios.foto);
  $("#fotousuario02").attr("src", DadosUsuarios.foto);
  $("#fotousuario03").attr("src", DadosUsuarios.foto);
}

function exibir_empresa() {
  DadosEmpresa = Requisicao("SecEmpresas/Usuario", "");

  $("#logoempresa01").attr("src", DadosEmpresa.logo);
}

function exibir_idiomas() {
  var listaidiomas = Requisicao("ListarIdiomas", "");
  var looping;
  var fotoidioma = "./assets/img/flags/" + listaidiomas[0].foto;
  $("#idioma").attr("src", fotoidioma);

  for (var i = 0; i < listaidiomas.length; i++) {
    idioma =
      '<a href="#" class="dropdown-item d-flex">' +
      '<span class="avatar mr-3 align-self-center bg-transparent">' +
      '<img src="./assets/img/flags/' +
      listaidiomas[i].foto +
      '" alt="img"/>' +
      "</span>" +
      '<div class="d-flex">' +
      '<span class="mt-2">' +
      listaidiomas[i].nomeidioma +
      "</span>" +
      "</div>" +
      "</a>";
    $("#idiomas").append(idioma);
  }
}

function exibir_mensagens() {
  var mensagens = Requisicao("PortUsuariosMensagens/Usuario", "");
  $("#qtde_mensagens").html("Você tem " + mensagens.length + " mensagens");

  for (var i = 0; i < mensagens.length; i++) {
    var data = mensagens[i].data;

    var dataformatada = new Date(data);

    dataformatada = dataformatada.toLocaleString();

    var mensagem =
      '<a href="#" class="p-3 d-flex border-bottom">' +
      '<svg xmlns="http://www.w3.org/2000/svg" class="header-icon-svgs mt-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>' +
      '<polyline points="22,6 12,13 2,6"></polyline></svg>' +
      '<div class="wd-90p">' +
      '<div class="d-flex">' +
      '<h5 class="mb-1 name">' +
      mensagens[i].titulo +
      "</h5>" +
      "</div>" +
      '<p class="mb-0 desc">' +
      mensagens[i].mensagem +
      "</p>" +
      '<p class="time mb-0 text-left float-left ml-2 mt-2">' +
      dataformatada +
      "</p>" +
      "</div>" +
      "</a>";

    $("#mensagens").append(mensagem);
  }
}



function exibir_menu(){
  var port_menus = Requisicao("PortMenus/Usuario","","GET");
  var menu = '';
  var submenu= '';
  var nivel3= '';
  var url;

  
  for(var a = 0;a<port_menus.length;a++){
    var idmenu = port_menus[a].idmenu;
    
    if(port_menus[a].nivel == 1 && port_menus[a].idacao == 4 && port_menus[a].url){
        menu = menu+'<li class="slide is-expanded">'+
        '<a class="side-menu__item active" href="/home.html"><svg xmlns="http://www.w3.org/2000/svg" class="side-menu__icon" viewBox="0 0 24 24"><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M5 5h4v6H5zm10 8h4v6h-4zM5 17h4v2H5zM15 5h4v2h-4z" opacity=".3"></path><path d="M3 13h8V3H3v10zm2-8h4v6H5V5zm8 16h8V11h-8v10zm2-8h4v6h-4v-6zM13 3v6h8V3h-8zm6 4h-4V5h4v2zM3 21h8v-6H3v6zm2-4h4v2H5v-2z"></path></svg><span class="side-menu__label">'+port_menus[a].nome+'</span></a>'+
'</li>';
     

    
    }

  
      if(port_menus[a].nivel == 1  && !port_menus[a].url){
        


        menu = menu + '<li class="slide" id="'+idmenu+'" >'+
        '<a class="side-menu__item" data-toggle="slide" href="#" onclick="ativarsubmenu(this);"><svg xmlns="http://www.w3.org/2000/svg" class="side-menu__icon" viewBox="0 0 24 24"><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M19 5H5v14h14V5zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" opacity=".3"></path><path d="M3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2zm2 0h14v14H5V5zm2 5h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"></path></svg><span class="side-menu__label">'+
        port_menus[a].nome+'</span><i class="angle fe fe-chevron-down"></i></a>'+
        '<ul class="slide-menu" style="display: none;" id="'+"filho"+a+'">';
        
        for(var b = 0;b<port_menus.length;b++){
          if(port_menus[b].pai == port_menus[a].idmenu && port_menus[b].nivel == 2 && port_menus[b].url){
            
            url = 'paginas/'+normalizar_texto(port_menus[a].nome);
            var url = url+'/'+normalizar_texto(port_menus[b].nome);
            url = url+'/'+port_menus[b].url;
            var funcao =
              "carrega_pagina_div('corpo','" +
              url +
              "');" +
              port_menus[b].url +
              "();";

     

            submenu = submenu  = '<li><a class="slide-item" onclick="'+funcao+'">'+port_menus[b].nome+'</a></li>';
            menu = menu + submenu;         

          }   

          if(port_menus[b].pai == port_menus[a].idmenu && port_menus[b].nivel == 2  && !port_menus[b].url){
            submenu = '<li class="sub-slide">'+
            '<a class="sub-side-menu__item" data-toggle="sub-slide" href="#" onclick="ativarsubmenu(this);"><span class="sub-side-menu__label">'+port_menus[b].nome+'</span><i class="sub-angle fe fe-chevron-down"></i></a>'+
            '<ul class="sub-slide-menu" style="display: none;">';
                for(var c=0;c<port_menus.length;c++){
                  if(port_menus[c].pai == port_menus[b].idmenu && port_menus[c].nivel == 3  && port_menus[c].url){
                    var funcao2 =
                    "carrega_pagina_div('corpo','" +
                    port_menus[c].url +
                    "');" +
                    port_menus[c].url +
                    "();";

                      nivel3 ='<li><a class="sub-slide-item" href="#" onclick="'+funcao2+'">'+port_menus[c].nome+'</a></li>';
                      submenu= submenu+nivel3;
                  }
                }
              
             
              submenu = submenu +'</ul>'+
              '</li>';
            
                
          
            menu = menu + submenu;  
          }
          
         
      }
    } 
            
    menu = menu + '</ul>'+
    '</li>';
    ;
    $("#menu").html(menu);
}
}

function ativarsubmenu(elemento) {
  var item = $(elemento).next();
  if ($(item).attr("style") == "display: block") {
    $(item).attr("style", "display: none");
  } else {
    $(item).attr("style", "display: block");
  }
}

function carrega_pagina_div(div, pagina) {

  $.ajax({
    url: url_globlal+url_clientside+pagina+".html",
    type: "GET",
    async: false,
    headers: {
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "application/json",
    },
    crossDomain: true,
    contentType: "application/json",
    success: function (res) {
      document.getElementById(div).innerHTML = res;
    },
  });
}

function editar_perfil(elemento) {
  $("#alerta").hide();
  var idperfil = $(elemento).parents("tr").attr("id");
  idperfil = parseInt(idperfil);
  const json_requisicao = { IDPERFIL: idperfil };

  var txt_fotperfil = $("#txt_fotoperfil");
  var txt_nomeperfil = $("#txt_nomeperfil");
  var txt_status = $("#txt_status");

  try {
    //BUSCANDO INFORMAÇÕES DO PERFIL, PASSANDO O IDPERFIL
    var resposta = Requisicao("BuscarPerfil", json_requisicao, "POST");

    //Dando valores
    $("#txt_idperfil").val(idperfil);
    $(txt_fotperfil).val(resposta.foto);
    $(txt_nomeperfil).val(resposta.nomeperfil);
    $(txt_status).val(resposta.status);

  } catch (e) {
    alerta_doce("Erro", e, "danger");
  }
}

function editar_usuario(elemento) {
  $("#alerta").hide();
  var idusuario = $(elemento).parents("tr").attr("id");
  idusuario = parseInt(idusuario);
  const json_requisicao = { "IDUSUARIO": idusuario };

  var txt_nomeusuario = $("#txt_nomeusuario");
  var txt_apelido = $("#txt_apelido");
  var txt_cargo = $("#txt_cargo");
  var txt_email = $("#txt_email");
  var txt_loginusuario = $("#txt_loginusuario");
  var txt_ddd = $("#txt_ddd");
  var txt_telefone = $("#txt_telefone");
  var txt_senha = $("#txt_senha");
  var txt_status = $("#txt_status");

  try {
    //BUSCANDO INFORMAÇÕES DO USUARIO, PASSANDO O IDUSUARIO
    var resposta = Requisicao("BuscarUsuario", json_requisicao, "POST");
    //Dando valores
    $("#txt_idusuario").val(resposta.idusuario);
    $(txt_nomeusuario).val(resposta.nomeusuario);
    $(txt_apelido).val(resposta.apelido);
    $(txt_cargo).val(resposta.cargo);
    $(txt_email).val(resposta.email);
    $(txt_loginusuario).val(resposta.loginusuario);
    $(txt_ddd).val(resposta.ddd);
    $(txt_telefone).val(resposta.telefone);
    $(txt_senha).val(resposta.descsenha);
    $(txt_status).val(resposta.status);



  } catch (e) {
    alerta_doce("Erro", e, "danger");
  }
}

function novousuario() {
  $("#alerta").hide();
}
function deletar_usuario(elemento) {
  
  var decisao = confirm("Tem certeza que deseja deletar este usuário ?");

  if (decisao) {
    var idusuario = parseInt($(elemento).parents("tr").attr("id"));

    var envio = {"idusuario":idusuario};
    console.log(envio);
    var retorno = Requisicao("DeletarUsuario", envio, "DELETE");
    console.log(retorno);
    if (retorno.validacao == "S") {
      not6("success",retorno.mensagem);
      carrega_pagina_div("corpo", url_seguranca+"usuarios/listausuarios");
      listausuarios();
    }else if(retorno.validacao == 'N'){
      not6("error",retorno.mensagem);
    }
  }
}


function salvar_usuario() {
  //===============================================
  //CASO FOR EDITAR
  var txt_idusuario = $("#txt_idusuario").val();
  //===============================================

  //capturando campos e seus valores
  var txt_nomeusuario = $("#txt_nomeusuario").val();
  var txt_apelido = $("#txt_apelido").val();
  var txt_cargo = $("#txt_cargo").val();
  var txt_email = $("#txt_email").val();
  var txt_ddd = $("#txt_ddd").val();
  var txt_telefone = $("#txt_telefone").val();
  var txt_loginusuario = $("#txt_loginusuario").val();
  var txt_senha = $("#txt_senha").val();
  //var txt_status = $("#txt_status").val();

  //variavel de validacao
  var validacao = "S";

  //variavel que irá confirmar se o usuário está salvando ou se está editando
  var requisicao_tipo = "EDITAR";

  //estrutura json de envio
  var envio = {"idusuario": txt_idusuario,"nomeusuario": txt_nomeusuario,"apelido":txt_apelido,"cargo":txt_cargo,"email":txt_email,"ddd":txt_ddd,"telefone":txt_telefone,"senha":txt_senha
  ,"status":1,"loginusuario":txt_loginusuario};



  try {

    if(txt_nomeusuario == "") {
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("Nome precisa ser preenchido");
    }

    if(txt_apelido == "") {
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("Apelido precisa ser preenchido");
    }

    if(txt_cargo == "") {
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("Cargo precisa ser preenchido");
    }

    if(txt_email == "") {
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("Email precisa ser preenchido");
    }
    if(txt_loginusuario == "") {
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("Usuário precisa ser preenchido");
    }
    
    if(txt_idusuario){
      txt_idusuario = parseInt(txt_idusuario);
      loginusuario_existe = validar_loginusuario(txt_loginusuario,2,txt_idusuario);
    }else{
      loginusuario_existe = validar_loginusuario(txt_loginusuario,1);
    }

    if(loginusuario_existe == 'S'){
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("Usuário informado já existe");
    }

    
   

    if(txt_ddd == "") {
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("DDD precisa ser preenchido");
    }

    if(txt_telefone == "") {
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("Telefone precisa ser preenchido");
    }

    if(txt_senha == "") {
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("Senha precisa ser preenchida");
    }

  /*  if(txt_status == 0) {
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("Status não foi selecionado");
    }
*/
    if(validacao== "S"){
      $("#alerta").hide();
      txt_idusuario = parseInt(txt_idusuario);
        if(!txt_idusuario){
            txt_idusuario = 0;
            requisicao_tipo = "CRIAR";
        }

        if(requisicao_tipo == "CRIAR"){
         var resposta = Requisicao("SalvarUsuario",envio,"POST");
         console.log(resposta);
         if(resposta.validacao == "S" ){
           
           alerta_doce("Usuários","Novo usuário criado com sucesso !","success");
           setTimeout(function(){carrega_pagina_div("corpo",url_seguranca+"usuarios/listausuarios");listausuarios();},2000);

         }else{
           alerta_doce("Erro",resposta,"danger","listausuarios");
         }
        }else if(requisicao_tipo == "EDITAR"){
          var resposta = Requisicao("SalvarUsuario",envio,"POST");
          console.log(resposta);
            
          
          if(resposta.validacao == "S"){
            alerta_doce("Usuários","Usuário editado com sucesso !","success");
            setTimeout(function(){carrega_pagina_div("corpo",url_seguranca+"usuarios/listausuarios");listausuarios();},2000);
          }else{
            alerta_doce("Erro",resposta,"danger","listausuarios");
          }
    }
    }
  } catch (e) {
    alert("Erro : " + e);
  }
}

function listausuarios() {
  var listausuario = Requisicao("SecUsuarios", "", "GET");

  var funcaoeditarusuario =
    "carrega_pagina_div('corpo','paginas/seguranca/usuarios/editarusuario');editar_usuario(this);";
  var elemento = "";
  var textostatus = "";

  var botoes =
    '<div class="btn-icon-list">' +
    '<i class="typcn typcn-edit" onclick="' +
    funcaoeditarusuario +
    '"></i>' +
    '<i class="far fa-trash-alt pl-2 " onclick="deletar_usuario(this)"></i>' +
    "</div>";

    if(listausuario.length == 0){
      DadosNaoEncontrados("tr_usuarios","listausuarios","Nenhum usuário foi encontrado");
    }else{

      for (var i = 0; i < listausuario.length; i++) {
        if (listausuario[i].status == 1) {
          textostatus = "Ativo";
        } else {
          textostatus = "Inativo";
        }
    
        elemento =
          '<tr id="' +
          listausuario[i].idusuario +
          '">' +
          "<td>" +
          listausuario[i].idusuario +
          "</td>" +
          "<td>" +
          listausuario[i].nomeusuario +
          "</td>" +
          "<td>" +
          listausuario[i].apelido +
          "</td>" +
          "<td>" +
          listausuario[i].cargo +
          "</td>" +
          "<td>" +
          textostatus +
          "</td>" +
          "<td>" +
          botoes +
          "</td>" +
          "</tr>";
        $("#listausuarios").append(elemento);
      }
    }

}

function sec_perfis() {
  listaperfis();
  deletar_perfil();
  salvar_perfil();
}


function listaperfis(param) {
   pagina = 0;
   inicio_paginabotao = 0;
   classes = new Array();
   if(param){
    pagina = param;
   }else{
     pagina = pagina;
   }
   paginacao_perfis(pagina);
 
}

function paginacao_perfis(param,qtde_param){
  var quantidade = parseInt($("#paginacao_quantidade").val());
  

  paginacao_paginativa(param);

  var paginacao = {"PAGINA":pagina,"TAMANHO":quantidade};
  var SecPerfis = Requisicao("SecPerfis", paginacao, "POST");
  var listaperfil = SecPerfis.lista;
  var registros = SecPerfis.quantidade;
  console.log(SecPerfis);

  var funcaoeditarperfil =
    "carrega_pagina_div('corpo','paginas/seguranca/perfis/editarperfil');editar_perfil(this);";
    var visualizarusuariosperfil =
    "carrega_pagina_div('corpo','paginas/seguranca/perfis/visualizarusuariosperfil');listausuariosperfis(this);";
  var elemento = "";
  var textostatus = "";

  var botoes =
    '<div class="btn-icon-list">' +
    '<i class="fa fa-users" onclick="'+visualizarusuariosperfil+'"></i>'+
    '<i class="typcn typcn-edit pl-2" onclick="' +
    funcaoeditarperfil +
    '"></i>' +
    '<i class="far fa-trash-alt pl-2 " onclick="deletar_perfil(this)"></i>' +
    "</div>";

    if(listaperfil.length == 0){
      DadosNaoEncontrados("tr_perfis","listaperfis","Nenhum perfil foi encontrado");
    }else{
      for (var i = 0; i < listaperfil.length; i++) {
        if (listaperfil[i].status == 1) {
          textostatus = "Ativo";
        } else {
          textostatus = "Inativo";
        }
    
        elemento = elemento+
          '<tr id="' +
          listaperfil[i].idperfil +
          '">' +
          "<td>" +
          listaperfil[i].idperfil +
          "</td>" +
          "<td>" +
          listaperfil[i].nomeperfil +
          "</td>" +
          "<td>" +
          textostatus +
          "</td>" +
          "<td>" +
          botoes +
          "</td>" +
          "</tr>";
        $("#listaperfis").html(elemento);
      }
    }

    
    paginacao_orelhas(SecPerfis.total,quantidade,registros);
    
}




function novoperfil() {
  $("#alerta").hide();
}
function deletar_perfil(elemento) {
  var decisao = confirm("Tem certeza que deseja deletar este perfil ?");

  if (decisao) {
    var idperfil = parseInt($(elemento).parents("tr").attr("id"));
    var envio = {"idperfil":idperfil};

    var retorno = Requisicao("DeletarPerfil", envio, "DELETE");

    if (retorno.mensagem == "OK") {
      not6("success","Perfil deletado com sucesso");
      carrega_pagina_div("corpo", url_seguranca+"perfis/listaperfis");
      listaperfis();
    }
  }
}

function salvar_perfil() {
  var txt_idperfil = $("#txt_idperfil").val();
  var txt_fotoperfil = $("#txt_fotoperfil").val();
  var txt_nomeperfil = $("#txt_nomeperfil").val();
  var txt_status = $("#txt_status").val();
  var validacao = "S";
  var requisicao_tipo = "EDITAR";
  var envio = {
    idperfil: txt_idperfil,
    nomeperfil: txt_nomeperfil,
    foto: txt_fotoperfil,
    status: txt_status,
  };

  try {
    if (txt_fotoperfil == "") {
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("Foto precisa ser preenchida");
    }

    if (txt_nomeperfil == "") {
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("Nome precisa ser preenchido");
    }

    if (txt_status == 0) {
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("Status não foi informado");
    }

    if (validacao == "S") {
      $("#alerta").hide();
      txt_idperfil = parseInt(txt_idperfil);
      if (!txt_idperfil) {
        txt_idperfil = 0;
        requisicao_tipo = "CRIAR";
      }

      if (requisicao_tipo == "CRIAR") {
        var resposta = Requisicao("SalvarPerfil", envio, "POST");
        console.log(resposta);
        if (resposta.validacao == "S") {
          alerta_doce("Perfis", "Novo perfil criado com sucesso !", "success");
          setTimeout(function () {
            carrega_pagina_div("corpo", url_seguranca+"perfis/listaperfis");
            listaperfis();
          }, 2000);
        } else {
          alerta_doce("Erro", resposta, "danger", url_seguranca+"perfis/listaperfis");
        }
      } else if (requisicao_tipo == "EDITAR") {
        var resposta = Requisicao("SalvarPerfil", envio, "POST");
        console.log(resposta);

        if (resposta.validacao == "S") {
          alerta_doce("Perfis", "Perfil editado com sucesso !", "success");
          setTimeout(function () {
            carrega_pagina_div("corpo", url_seguranca+"perfis/listaperfis");
            listaperfis();
          }, 2000);
        } else {
          alerta_doce("Erro", resposta, "danger", "listaperfis");
        }
      }
    }
  } catch (e) {
    alerta_doce("Erro no sistema", e, "danger");
  }
}

function caixa_confirmacao(mensagem_confirmacao, mensagem_sucesso) {
	var myCallback = function(choice){
		if(choice){
			notif({
				'type': 'success',
				'msg': mensagem_sucesso,
				'position': 'center'
			})
		}else{
			notif({
				'type': 'error',
				'msg': '<i class="far fa-sad-tear"></i>',
				'position': 'center'
			})
		}
	}

	notif_confirm({
		'textaccept': 'Sim',
		'textcancel': 'Cancelar',
		'message': mensagem_confirmacao,
		'callback': myCallback
	})
}


function listar_ufs(){
  var sec_ufs;
  var lista = '';

  $.ajax({
    type: 'GET',
    url: url_globlal+url_serverside + "SecUfs",
    contentType: "application/json",
    async: false,
    success: function (data, status, xhr) {
     console.log(data);
     sec_ufs = data;
    },
    error: function (xhr, status, error) {},
  });


  for(var a = 0;a<sec_ufs.length;a++){
    lista = lista +'<option value='+sec_ufs[a].iduf+'>'+sec_ufs[a].sigla+'</option>';
  }

  $("#txt_iduf").html(lista);

  console.log(sec_ufs)

}

function listar_cidades(parametro){
  var iduf;
  if(!parametro){
    var select = document.getElementById("txt_iduf");

     iduf = select.options[select.selectedIndex].value;
  
  }else{
    iduf = parametro;
  }
  var lista = '';
 
  var envio = {"iduf":iduf};

  var sec_cidades = Requisicao("SecCidades/UF",envio,'POST');
  console.log(sec_cidades);
  for(var i = 0;i<sec_cidades.length;i++){
    lista = lista +'<option value='+sec_cidades[i].idcidade+'>'+sec_cidades[i].nome+'</option>';
  }
  $("#txt_idcidade").html(lista);


        
}


function editar_cliente(elemento) {
  $("#alerta").hide();
  var idcliente = $(elemento).parents("tr").attr("id");
  idcliente = parseInt(idcliente);

  var txt_nomecliente = $("#txt_nomecliente");
  var txt_ddd = $("#txt_ddd");
  var txt_telefone = $("#txt_telefone");
  var txt_cep = $("#txt_cep");
  var txt_iduf = $("#txt_iduf");
  var txt_idcidade = $("#txt_idcidade");
  var txt_bairro = $("#txt_bairro");
  var txt_endereco = $("#txt_endereco");
  var txt_numero = $("#txt_numero");
  var txt_complemento = $("#txt_complemento");
  var txt_email = $("#txt_email");
  var txt_loginusuario = $("#txt_loginusuario");
  var txt_senha = $("#txt_senha");
  var txt_idusuario = $("#txt_idusuario");

  //JSON DE ENVIO PASSANDO O IDCLIENTE PARA CAPTURAR AS INFORMAÇÕES DO CLIENTE
  var json_requisicao = {"IDCLIENTE":idcliente};


  try {
    //BUSCANDO INFORMAÇÕES DO USUARIO, PASSANDO O IDUSUARIO
    var resposta = Requisicao("BuscarCliente/IDCLIENTE", json_requisicao, "POST");
    console.log(resposta);
    //Dando valores
    $("#txt_idcliente").val(resposta.IDCLIENTE);
    $(txt_nomecliente).val(resposta.NOMECLIENTE);
    $(txt_ddd).val(resposta.DDD);
    $(txt_telefone).val(resposta.TELEFONE);
    $(txt_cep).val(resposta.CEP);
    $(txt_idcidade).val(resposta.IDCIDADE);
    $(txt_bairro).val(resposta.BAIRRO);
    $(txt_endereco).val(resposta.ENDERECO);
    $(txt_numero).val(resposta.NUMERO);
    $(txt_complemento).val(resposta.COMPLEMENTO);
    $(txt_email).val(resposta.EMAIL);
    $(txt_loginusuario).val(resposta.LOGINUSUARIO);
    $(txt_senha).val(resposta.SENHA);
    $(txt_idusuario).val(resposta.IDUSUARIO);
    listar_ufs();
    $(txt_iduf).val(resposta.IDUF);
    listar_cidades(resposta.IDUF);

  } catch (e) {
    //alerta_doce("Erro", e, "danger");
    alert("Erro : "+e);
  }
}

function carregar_usuarios_select(url_parametro,json_parametro){
  var lista = '<option value="0"></option>';
  var url_usuarios;
  var metodo_requisicao;
  if(!url_parametro){
    url_usuarios = "SecUsuarios";
  }else{
    url_usuarios = url_parametro;
  }
  if(json_parametro){
    metodo_requisicao = "POST";
  }else{
    metodo_requisicao = "GET";
  }
  var sec_usuarios = Requisicao(url_usuarios, json_parametro, metodo_requisicao);

  if(url_usuarios == "ListarUsuariosDestePerfil" && sec_usuarios.length == 0){
    $("#alerta").show();
    $("#textoalerta").text("Não existe nenhum usuário com o perfil de cliente no sistema !");
    $("#botao_salvar_cliente").attr('disabled','disabled');
  }

  for(var i = 0;i<sec_usuarios.length;i++){
    lista = lista +'<option value='+sec_usuarios[i].idusuario+'>'+sec_usuarios[i].nomeusuario+'</option>';
  }

  $("#txt_idusuario").html(lista);
}

function novocliente() {
  
  $("#alerta").hide();
  //ESCONDO O ALERTA ELE SÓ SERÁ MOSTRADO ASSIM QUE NECESSÁRIO
  listar_ufs();
  //LISTO OS ESTADOS PARA QUE O USUÁRIO ESCOLHA UM ESTADO E ASSIM QUE FOR SELECIONADO NO SELECT
  //DE CIDADES MOSTRARÁ AS CIDADES QUE ESTÁ AMARRADO COM AQUELE ESTADO

  //ESTE BLOCO NÃO EXISTE MAIS POIS AGORA O CLIENTE SERÁ CRIADO JUNTO COM O USUÁRIO
  /*var existe_perfil_cliente = Requisicao("ListarUsuariosPerfilCliente/NAOCLIENTE",'','GET');
  if(existe_perfil_cliente == 0){
    $("#alerta").show();
    $("#textoalerta").text("Não existe nenhum usuário com acesso ao perfil de cliente no sistema");
    $("#botao_salvar_cliente").attr('disabled','disabled');
  }

  carregar_usuarios_select("ListarUsuariosPerfilCliente/NAOCLIENTE",'',"GET");*/

 
}



function listaclientes() {
  var listacliente = Requisicao("BingoClientes", "", "GET");
  
  var funcaoeditarcliente =
    "carrega_pagina_div('corpo','paginas/bingo/clientes/editarcliente');editar_cliente(this);";
  var tabela = '';
  var textostatus = '';
  
  var botoes =
    '<div class="btn-icon-list">' +
    '<i class="typcn typcn-edit" onclick="' +
    funcaoeditarcliente +
    '"></i>' +
    '<i class="far fa-trash-alt pl-2 " onclick="deletar_cliente(this)"></i>' +
    "</div>";

    if(listacliente == 0){
     DadosNaoEncontrados("tr_clientes","listaclientes","Nenhum cliente foi encontrado");
    }else{
      for (var i = 0; i < listacliente.length; i++) {
        if (listacliente[i].status == 1) {
          textostatus = "Ativo";
        } else {
          textostatus = "Inativo";
        }
     
        tabela =
          '<tr id="' +
          listacliente[i].idcliente +
          '">' +
          "<td>" +
          listacliente[i].nomecliente +
          "</td>" +
          "<td>" +
          "("+listacliente[i].ddd+")"+" "+listacliente[i].telefone +
          "</td>" +
          "<td>" +
          listacliente[i].endereco + " "+listacliente[i].numero + " "+listacliente[i].complemento + " - "+
          listacliente[i].bairro+ 
          "</td>" +
          "<td>" +
          textostatus +
          "</td>" +
          "<td>" +
          botoes +
          "</td>" +
          "</tr>";
        $("#listaclientes").append(tabela);
      }
    }

  
}


function salvar_cliente() {
  //===============================================
  //CASO FOR EDITAR
  var txt_idcliente = $("#txt_idcliente").val();
  //===============================================
  //capturando campos e seus valores
  var txt_nomecliente = $("#txt_nomecliente").val();
  var txt_ddd = $("#txt_ddd").val();
  var txt_telefone = $("#txt_telefone").val();
  var txt_cep = $("#txt_cep").val();
  var txt_iduf = $("#txt_iduf").val();
  var txt_idcidade = $("#txt_idcidade").val();
  var txt_bairro = $("#txt_bairro").val();
  var txt_endereco = $("#txt_endereco").val();
  var txt_numero = $("#txt_numero").val();
  var txt_complemento = $("#txt_complemento").val();
  var txt_email = $("#txt_email").val();
  var txt_loginusuario = $("#txt_loginusuario").val();
  var txt_senha = $("#txt_senha").val();
  var txt_idusuario = $("#txt_idusuario").val();
  var loginusuario_existe;

  //variavel de validacao
  var validacao = "S";

  //variavel que irá confirmar se o usuário está salvando ou se está editando
  var requisicao_tipo = "EDITAR";

  //estrutura json de envio
  var envio = {
    "idcliente": txt_idcliente,
    "nome": txt_nomecliente,
    "ddd":txt_ddd,
    "telefone":txt_telefone,
    "cep":txt_cep,
    "iduf":txt_iduf,
    "idcidade":txt_idcidade,
    "bairro":txt_bairro,
    "endereco":txt_endereco,
    "numero":txt_numero,
    "complemento":txt_complemento,
    "loginusuario":txt_loginusuario,
    "email":txt_email,
    "senha":txt_senha
  };

  try {

    if(txt_nomecliente == "") {
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("Nome precisa ser preenchido");
    }

    if(txt_ddd.length == 0) {
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("DDD precisa ser preenchido");
    }
    if(txt_telefone.length == 0) {
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("Telefone precisa ser preenchido");
    }

    if(txt_cep == 0) {
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("Cep precisa ser informado");
    }

    if(txt_iduf == 0) {
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("UF precisa ser informado");
    }

    if(txt_idcidade == 0) {
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("Cidade precisa ser informada");
    }

 
    if(txt_bairro.length == 0) {
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("Bairro precisa ser informado");
    }

    if(txt_endereco.length == 0) {
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("Endereço precisa ser preenchido");
    }

    if(txt_numero.length == 0) {
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("Número precisa ser informado");
    }

    if(txt_complemento.length == 0) {
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("Complemento precisa ser informado");
    }

    if(txt_email.length == 0){
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("E-mail precisa ser informado");
    }

    if(txt_loginusuario.length == 0){
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("Login do usuário precisa ser informado");
    }


    if(txt_idcliente){
      txt_idusuario = parseInt(txt_idusuario);
      loginusuario_existe = validar_loginusuario(txt_loginusuario,2,txt_idusuario);
    }else{
      loginusuario_existe = validar_loginusuario(txt_loginusuario,1,0);
    }

    if(loginusuario_existe == 'S'){
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("Usuário informado já existe");
    }

    if(txt_senha.length == 0){
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("Senha precisa ser informada");
    }

    


    if(validacao== "S"){
      $("#alerta").hide();
      txt_idcliente = parseInt(txt_idcliente);
        if(!txt_idcliente){
          txt_idcliente = 0;
            requisicao_tipo = "CRIAR";
        }

        if(requisicao_tipo == "CRIAR"){
         var resposta = Requisicao("SalvarCliente",envio,"POST");
         console.log(resposta);
         if(resposta.validacao == "S" ){
           
           alerta_doce("Clientes","Novo cliente criado com sucesso !","success");
           setTimeout(function(){carrega_pagina_div("corpo",url_bingo+"clientes/listaclientes");listaclientes();},2000);
         }
   
        }else if(requisicao_tipo == "EDITAR"){
        var resposta = Requisicao("SalvarCliente",envio,"POST");
         console.log(resposta);
         if(resposta.validacao == "S" ){
           
           alerta_doce("Clientes","Cliente editado com sucesso !","success");
           setTimeout(function(){carrega_pagina_div("corpo",url_bingo+"clientes/listaclientes");listaclientes();},2000);
         }
        }
    }
  } catch (e) {
    alert("Erro : " + e);
  }
}

function deletar_cliente(elemento) {
  var decisao = confirm("Tem certeza que deseja deletar este cliente ?");

  if (decisao) {
    var idcliente = parseInt($(elemento).parents("tr").attr("id"));
    var envio = {"idcliente":idcliente};

    var retorno = Requisicao("DeletarCliente", envio, "DELETE");
    console.log(retorno);
    if (retorno.validacao == 'S') {
      not6("success",retorno.mensagem);
      carrega_pagina_div("corpo", url_bingo+"clientes/listaclientes");
      listaclientes();
    }else if(retorno.validacao == 'N'){
      not6("error",retorno.mensagem);
     //alerta_doce("Clientes",retorno.mensagem,"error",4000);
    }
  }
}


function carregar_clientes_select(){
  var lista = '<option value="0"></option>';

  var bingo_clientes = Requisicao("BingoClientes", "", "GET");

  for(var i = 0;i<bingo_clientes.length;i++){
    lista = lista +'<option value='+bingo_clientes[i].idcliente+'>'+bingo_clientes[i].nomecliente+'</option>';
  }
  $("#txt_idcliente").html(lista);

}

function novaunidade(){
  var linhas;
  $("#alerta").hide();

  if(perfil.idperfil==1){
    linhas ='<div class="col-3">'+
    '<div class="form-group">'+
      '<label>Nome do estabelecimento</label>'+
      '<input class="form-control" placeholder="" type="text" id="txt_nomeestabelecimento" required="true"/>'+
    '</div>'+
  '</div>'+
  '<div class="col-3">'+
    '<div class="form-group">'+
      '<label>Cliente responsável</label>'+
      '<select class="form-control" placeholder="" type="select" required="true" id="txt_idcliente">'+
    '</select>'+
  '</div>'+
'</div>'+
'<div class="col-2">'+
  '<div class="form-group">'+
    '<label>DDD</label>'+
    '<input class="form-control" placeholder="" type="number" id="txt_ddd" required="true" />'+
  '</div>'+
'</div>'+
'<div class="col-4">'+
  '<div class="form-group">'+
    '<label>Telefone</label>'+
    '<input class="form-control" placeholder="" type="text" id="txt_telefone" required="true" />'+
  '</div>'+
'</div>';

    $("#unidade_linha01").html(linhas);

    carregar_clientes_select();

  }else if(perfil.idperfil==2){

    
    linhas = '<div class="col-4">'+
    '<div class="form-group">'+
      '<label>Nome do estabelecimento</label>'+
      '<input class="form-control" placeholder="" type="text" id="txt_nomeestabelecimento" required="true"/>'+
    '</div>'+
  '</div>'+
  '<div class="col-3">'+
  '<div class="form-group">'+
    '<label>DDD</label>'+
    '<input class="form-control" placeholder="" type="number" id="txt_ddd" required="true" />'+
  '</div>'+
'</div>'+
'<div class="col-5">'+
  '<div class="form-group">'+
    '<label>Telefone</label>'+
    '<input class="form-control" placeholder="" type="text" id="txt_telefone" required="true" />'+
  '</div>'+
'</div>';

  

    $("#unidade_linha01").html(linhas);
  }



  listar_ufs();
}

function salvar_unidade() {
 
  //===============================================
  //CASO FOR EDITAR
  //Esta variável é a que valida o tipo de ação que será feita, se for salvar está variável virá como nulo, se for editar
  // a variável virá com o id que deseja editar
  var txt_idunidade = $("#txt_idunidade").val();
  //===============================================
  //capturando campos e seus valores
  var txt_nomeestabelecimento = $("#txt_nomeestabelecimento").val();
  var txt_idcliente = $("#txt_idcliente").val();
  var txt_cep = $("#txt_cep").val();
  var txt_iduf = $("#txt_iduf").val();
  var txt_idcidade = $("#txt_idcidade").val();
  var txt_bairro = $("#txt_bairro").val();
  var txt_rua = $("#txt_rua").val();
  var txt_numero = $("#txt_numero").val();
  var txt_complemento = $("#txt_complemento").val();
  var txt_ddd = $("#txt_ddd").val();
  var txt_telefone = $("#txt_telefone").val();
  var txt_nomeusuario = $("#txt_nomeusuario").val();
  var txt_email = $("#txt_email").val();
  var txt_loginusuario = $("#txt_loginusuario").val();
  var txt_senha = $("#txt_senha").val();
  var loginusuario_existe;
  
  //variavel de validacao
  var validacao = "S";

  //variavel que irá confirmar se o usuário está salvando ou se está editando
  var requisicao_tipo = "EDITAR";

  if(txt_idcliente && perfil.idperfil == 1){
    txt_idcliente = txt_idcliente;
  }else if(!txt_idcliente && perfil.idperfil == 2){
    var BingoClientes = Requisicao("BuscarCliente/IDUSUARIO",'',"GET");
    txt_idcliente = BingoClientes.idcliente;
  }

  //estrutura json de envio
  var envio = {
                "idunidade":txt_idunidade,
                "nomeestabelecimento":txt_nomeestabelecimento,
                "idcliente":txt_idcliente,
                "cep":txt_cep,
                "iduf":txt_iduf,
                "idcidade":txt_idcidade,
                "bairro":txt_bairro,
                "rua":txt_rua,
                "numero":txt_numero,
                "complemento":txt_complemento,
                "ddd":txt_ddd,
                "telefone":txt_telefone,
                "nome":txt_nomeusuario,
                "email":txt_email,
                "loginusuario":txt_loginusuario,
                "senha":txt_senha
  };



  try {

     if(txt_nomeestabelecimento.length == 0) {
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("Nome do estabelecimento precisa ser preenchido");
    }

    if(txt_idcliente && perfil.idperfil == 1){
      if(txt_idcliente == 0) {
        validacao = "N";
        $("#alerta").show();
        $("#textoalerta").text("O cliente responsável precisa ser informado");
      }  
    }

    if(txt_cep.length == 0) {
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("Cep precisa ser informado");
    }

    if(txt_iduf == 0) {
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("UF precisa ser informado");
    }

    if(txt_idcidade == 0) {
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("Cidade precisa ser informada");
    }

 
    if(txt_bairro.length == 0) {
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("Bairro precisa ser informado");
    }

    if(txt_rua.length == 0) {
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("Rua precisa ser preenchido");
    }

    if(txt_numero.length == 0) {
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("Número precisa ser informado");
    }

    if(txt_complemento.length == 0) {
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("Complemento precisa ser informado");
    }

    if(txt_ddd.length == 0) {
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("DDD precisa ser preenchido");
    }
    if(txt_telefone.length == 0) {
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("Telefone precisa ser preenchido");
    }

    if(txt_nomeusuario.length == 0) {
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("Nome do usuário precisa ser preenchido");
    }

    if(txt_loginusuario.length==0){
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("Usuário precisa ser preenchido");
   
    }

    if(txt_idunidade){
      txt_idusuario = parseInt(txt_idusuario);
      loginusuario_existe = validar_loginusuario(txt_loginusuario,2,txt_idusuario);
    }else{
      loginusuario_existe = validar_loginusuario(txt_loginusuario,1);
    }

    if(loginusuario_existe == 'S'){
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("Usuário informado já existe");
    }

   if(txt_email.length == 0) {
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("E-mail precisa ser preenchido");
    }

    if(txt_senha.length == 0) {
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("Senha precisa ser preenchida");
    }


    if(validacao== "S"){
      //SE TODOS OS CAMPOS ESTIVEREM VALIDADOS E PREENCHIDOS
      $("#alerta").hide();
      //ESCONDA O ALERTA
      txt_idunidade = parseInt(txt_idunidade);
      //CONVERTA O ID DE TEXTO PARA INT..
        
        if(!txt_idunidade){
          //SE NÃO IDENTIFICAR NENHUM ID
          txt_idunidade = 0;
          //A VARIAVEL RESPONSAVEL POR ARMAZENAR O ID RECEBERÁ O VALOR DE ZERO
            requisicao_tipo = "CRIAR";
            //E A VARIAVEL QUE VALIDA O TIPO DA ACAO SERÁ IGUAL A "CRIAR"
            //SE CASO AO CONTRÁRIO NÃO PASSAR POR ESTA CONDIÇÃO, A VARIÁVEL DE VALIDAR A AÇÃO SERÁ IGUAL A "EDITAR"
        }

        if(requisicao_tipo == "CRIAR"){
          
          //SE O TIPO DA AÇÃO FOR CRIAR 
         var resposta = Requisicao("SalvarUnidade",envio,"POST");
         //ENTÃO O ROBÔ IRÁ FAZER A REQUISIÇÃO PARA O BACKEND SALVANDO ASSIM OS CAMPOS PREENCHIDOS 
         if(resposta.validacao == "S" ){
            //SE A RESPOSTA DO BACKEND VIR COMO VERDADEIRO  
           alerta_doce("Unidades","Nova unidade criada com sucesso !","success");
           // ENTÃO O ROBÔ IRÁ EXIBIR NA TELA UM ALERTA PARABENIZANDO O SUCESSO DA INCLUSÃO
           setTimeout(function(){carrega_pagina_div("corpo",url_bingo+"unidades/listaunidades");listaunidades();},2000);
           //O ROBÔ IRÁ REDIRECIONAR O USUÁRIO PARA A TELA ANTERIOR DEPOIS DE EXATAMENTE 2 SEGUNDOS
         }
   
        }else if(requisicao_tipo == "EDITAR"){
          //SE O TIPO DA AÇÃO FOR EDITAR
         
        var resposta = Requisicao("SalvarUnidade",envio,"POST");
        //ENTÃO O ROBÔ FARÁ UMA REQUISIÇÃO COM OS DADOS PREENCHIDOS, PASSANDO O ID PARA A ALTERAÇÃO DO OBJETO
        
        if(resposta.validacao == "S" ){
            // SE A RESPOSTA VIR COMO TRUE   
           alerta_doce("Unidades","Unidade editada com sucesso !","success");
           //ENTÃO O ROBÔ EXIBIRÁ NA TELA UMA MENSAGEM PARABENIZANDO A ALTERAÇÃO FEITA PELO USUÁRIO
           setTimeout(function(){carrega_pagina_div("corpo",url_bingo+"unidades/listaunidades");listaunidades();},2000);
           //O ROBÔ IRÁ REDIRECIONAR O USUÁRIO PARA A TELA ANTERIOR DEPOIS DE EXATAMENTE 2 SEGUNDOS
         }
        }
    }
  } catch (e) {
    alert("Erro : " + e);
  }
}

function listaunidades() {
  var url_unidade;
  var colunas;
  var nome_cliente;
  var validacao ='S';
  var usuario_cliente;
  var funcaoeditarunidade ="carrega_pagina_div('corpo','paginas/bingo/unidades/editarunidade');editar_unidade(this);";
  var tabela = '';
  var textostatus = '';

  var botoes ='<div class="btn-icon-list">'+'<i class="typcn typcn-edit" onclick="' +funcaoeditarunidade +'"></i>'+
    '<i class="far fa-trash-alt pl-2 " onclick="deletar_unidade(this)"></i>' +'</div>';

  //ANTES DE LISTAR AS UNIDADES PRECISO VERFIFICAR SE O USUÁRIO JÁ É UM CLIENTE

  
  

  if(perfil.idperfil == 2){
    url_unidade = "ListarUnidades/IDCLIENTE";
    usuario_cliente = Requisicao("BuscarCliente/IDUSUARIO",'',"GET");
    if(!usuario_cliente){
      validacao = 'N';
    }
  }else if(perfil.idperfil == 1){
    url_unidade = "ListarUnidades";
    colunas = '<th style="width: 12,5%">ESTABELECIMENTO</th>'+
              '<th style="width: 12,5%">RESPONSÁVEL</th>'+
              '<th style="width: 12,5%">CLIENTE</th>'+
              '<th style="width: 38,75%">ENDEREÇO</th>'+
              '<th style="width: 13,75%">TELEFONE</th>'+
              '<th style="width: 10%">AÇÕES</th>';
              $("#tr_unidades").html(colunas);
  }

  if(validacao == 'S'){
    var listaunidade = Requisicao(url_unidade, "", "GET");


    if(listaunidade.length == 0){
      DadosNaoEncontrados("tr_unidades","listaunidades","Nenhuma unidade foi encontrada");
    }else{
      
      for (var i = 0; i < listaunidade.length; i++) {
        if (listaunidade[i].STATUS == 1) {
          textostatus = "Ativo";
        } else {
          textostatus = "Inativo";
        }
    
        if(perfil.idperfil == 1){
         nome_cliente="<td>" +
          listaunidade[i].NOMECLIENTE+
          "</td>";
        }else if(perfil.idperfil==2){
          nome_cliente = "";
        }
        
        tabela =
          '<tr id="' +
          listaunidade[i].IDUNIDADE +
          '">' +
          "<td>" +
          listaunidade[i].NOMEESTABELECIMENTO +
          "</td>" +
          "<td>" +
          listaunidade[i].NOMEUSUARIO+
          "</td>" +
          nome_cliente+
          "<td>" +
        listaunidade[i].RUA+" "+listaunidade[i].NUMERO+" "+listaunidade[i].COMPLEMENTO+" - "+listaunidade[i].BAIRRO+", "
        +listaunidade[i].NOMECIDADE+" - "+listaunidade[i].SIGLA+
          "</td>" +
          "<td>" +
          "("+listaunidade[i].DDD+")"+" "+listaunidade[i].TELEFONE +
          "</td>" +
          "<td>" +
          botoes
          "</td>" +
          "</tr>";
        $("#listaunidades").append(tabela);
      }
    }
  }else{
    carrega_pagina_div("corpo","paginas/sistema/erro");
    $("#txt_erro_sistema").text("Você ainda não é um cliente !");

  }

 




}

function editar_unidade(elemento) {

var linhas;
$("#alerta").hide();

if(perfil.idperfil==1){
  linhas ='<div class="col-3">'+
  '<div class="form-group">'+
    '<label>Nome do estabelecimento</label>'+
    '<input class="form-control" placeholder="" type="text" id="txt_nomeestabelecimento" required="true"/>'+
  '</div>'+
'</div>'+
'<div class="col-3">'+
  '<div class="form-group">'+
    '<label>Cliente responsável</label>'+
    '<select class="form-control" placeholder="" type="select" required="true" id="txt_idcliente">'+
  '</select>'+
'</div>'+
'</div>'+
'<div class="col-2">'+
'<div class="form-group">'+
  '<label>DDD</label>'+
  '<input class="form-control" placeholder="" type="number" id="txt_ddd" required="true" />'+
'</div>'+
'</div>'+
'<div class="col-4">'+
'<div class="form-group">'+
  '<label>Telefone</label>'+
  '<input class="form-control" placeholder="" type="text" id="txt_telefone" required="true" />'+
'</div>'+
'</div>';

  $("#unidade_linha01").html(linhas);

  carregar_clientes_select();

}else if(perfil.idperfil==2){

  
  linhas = '<div class="col-4">'+
  '<div class="form-group">'+
    '<label>Nome do estabelecimento</label>'+
    '<input class="form-control" placeholder="" type="text" id="txt_nomeestabelecimento" required="true"/>'+
  '</div>'+
'</div>'+
'<div class="col-3">'+
'<div class="form-group">'+
  '<label>DDD</label>'+
  '<input class="form-control" placeholder="" type="number" id="txt_ddd" required="true" />'+
'</div>'+
'</div>'+
'<div class="col-5">'+
'<div class="form-group">'+
  '<label>Telefone</label>'+
  '<input class="form-control" placeholder="" type="text" id="txt_telefone" required="true" />'+
'</div>'+
'</div>';



  $("#unidade_linha01").html(linhas);
}

  var txt_idunidade = $(elemento).parents("tr").attr("id");
  txt_idunidade = parseInt(txt_idunidade);
  const json_requisicao = { "IDUNIDADE": txt_idunidade };


  $("#txt_idunidade").val(txt_idunidade);
  var txt_idusuario = $("#txt_idusuario");
  var txt_nomeestabelecimento = $("#txt_nomeestabelecimento");
  var txt_idcliente = $("#txt_idcliente");
  var txt_cep = $("#txt_cep");
  var txt_iduf = $("#txt_iduf");
  var txt_idcidade = $("#txt_idcidade");
  var txt_bairro = $("#txt_bairro");
  var txt_rua = $("#txt_rua");
  var txt_numero = $("#txt_numero");
  var txt_complemento = $("#txt_complemento");
  var txt_ddd = $("#txt_ddd");
  var txt_telefone = $("#txt_telefone");
  var txt_nomeusuario = $("#txt_nomeusuario");
  var txt_email = $("#txt_email");
  var txt_loginusuario = $("#txt_loginusuario");
  var txt_senha = $("#txt_senha");

 // var txt_status = $("#txt_status");

  try {
    //BUSCANDO INFORMAÇÕES DO USUARIO, PASSANDO O IDUSUARIO
    var resposta = Requisicao("BuscarUnidade", json_requisicao, "POST");
    console.log(resposta);
    //Dando valores
    $("#txt_idunidade").val(resposta.IDUNIDADE);
   
    $(txt_idusuario).val(resposta.IDUSUARIO);
    $(txt_nomeestabelecimento).val(resposta.NOMEESTABELECIMENTO);
    carregar_clientes_select();
    $(txt_idcliente).val(resposta.IDCLIENTE);
    $(txt_cep).val(resposta.CEP);
    listar_ufs();
    $(txt_iduf).val(resposta.IDUF);
    listar_cidades(resposta.IDUF);
    $(txt_idcidade).val(resposta.IDCIDADE);
    $(txt_bairro).val(resposta.BAIRRO);
    $(txt_rua).val(resposta.RUA);
    $(txt_numero).val(resposta.NUMERO);
    $(txt_complemento).val(resposta.COMPLEMENTO);
    $(txt_ddd).val(resposta.DDD);
    $(txt_telefone).val(resposta.TELEFONE);
    $(txt_nomeusuario).val(resposta.NOMEUSUARIO);
    $(txt_email).val(resposta.EMAIL);
    $(txt_loginusuario).val(resposta.LOGINUSUARIO);
    $(txt_senha).val(resposta.SENHA);

  } catch (e) {
    alerta_doce("Erro", e, "danger");
  }
}

function deletar_unidade(elemento) {
  var decisao = confirm("Tem certeza que deseja deletar esta unidade ?");

  if (decisao) {
    var idunidade = parseInt($(elemento).parents("tr").attr("id"));
    var envio = {"idunidade":idunidade};

    var retorno = Requisicao("DeletarUnidade", envio, "DELETE");

    if (retorno.mensagem == "OK") {
      not6("success","Unidade deletada com sucesso");
      carrega_pagina_div("corpo", url_bingo+"unidades/listaunidades");
      listaunidades();
    }
  }
}

function listaparametros() {
  var listaparametro = Requisicao("BingoParametros", "", "GET");

  var funcaoeditarparametro =
    "carrega_pagina_div('corpo','paginas/bingo/parametros/editarparametro');editar_parametro(this);";
  var elemento = "";
  var textostatus = "";

  var botoes =
    '<div class="btn-icon-list">' +
    '<i class="typcn typcn-edit" onclick="' +
    funcaoeditarparametro +
    '"></i>' +
    '<i class="far fa-trash-alt pl-2 " onclick="deletar_parametro(this)"></i>' +
    "</div>";

  if(listaparametro.length == 0){
    DadosNaoEncontrados("tr_parametros","listaparametros","Nenum parâmetro foi encontrado");
  }else{

    for (var i = 0; i < listaparametro.length; i++) {
      if (listaparametro[i].status == 1) {
        textostatus = "Ativo";
      } else {
        textostatus = "Inativo";
      }
  
      elemento =
        '<tr id="' +
        listaparametro[i].idparametro +
        '">' +
        "<td>" +
        listaparametro[i].nomeparametro +
        "</td>" +
        "<td>" +
        listaparametro[i].valorpadrao +
        "</td>" +
        "<td>" +
        textostatus +
        "</td>" +
        "<td>" +
        botoes +
        "</td>" +
        "</tr>";
      $("#listaparametros").append(elemento);
    }
  }

}

function normalizar_texto(texto){
  var textoconvertido;
  textoconvertido = texto.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  textoconvertido = textoconvertido.toLowerCase();
  return textoconvertido;
}


function novoparametro() {
  $("#alerta").hide();
}

function salvar_parametro() {
  var txt_idparametro = $("#txt_idparametro").val();
  var txt_nomeparametro = $("#txt_nomeparametro").val();
  var txt_valorpadrao = $("#txt_valorpadrao").val();
  var txt_status = $("#txt_status").val();
  var validacao = "S";
  var requisicao_tipo = "EDITAR";
  var envio = {
    idparametro: txt_idparametro,
    nomeparametro: txt_nomeparametro,
    valorpadrao: txt_valorpadrao,
    status: txt_status,
  };

  try {
    if (txt_nomeparametro == "") {
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("Nome do parâmetro precisa ser preenchido");
    }

    if (txt_valorpadrao == "") {
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("Valor padrão precisa ser preenchido");
    }

    if (txt_status == 0) {
      validacao = "N";
      $("#alerta").show();
      $("#textoalerta").text("Status não foi informado");
    }

    if (validacao == "S") {
      $("#alerta").hide();
      txt_idparametro = parseInt(txt_idparametro);
      if (!txt_idparametro) {
        txt_idparametro = 0;
        requisicao_tipo = "CRIAR";
      }

      if (requisicao_tipo == "CRIAR") {
        var resposta = Requisicao("SalvarParametro", envio, "POST");
        console.log(resposta);
        if (resposta.validacao == "S") {
          alerta_doce("Parâmetros", "Novo parâmetro criado com sucesso !", "success");
          setTimeout(function () {
            carrega_pagina_div("corpo", url_bingo+"parametros/listaparametros");
            listaparametros();
          }, 2000);
        } else {
          alerta_doce("Erro", resposta, "danger","novoparametro");
        }
      } else if (requisicao_tipo == "EDITAR") {
        var resposta = Requisicao("SalvarParametro", envio, "POST");
        console.log(resposta);

        if (resposta.validacao == "S") {
          alerta_doce("Parâmetros", "Parâmetro editado com sucesso !", "success");
          setTimeout(function () {
            carrega_pagina_div("corpo", url_bingo+"parametros/listaparametros");
            listaparametros();
          }, 2000);
        } else {
          alerta_doce("Erro", resposta, "danger", "listaparametros");
        }
      }
    }
  } catch (e) {
    alerta_doce("Erro no sistema", e, "danger");
  }
}


function editar_parametro(elemento) {
  $("#alerta").hide();
  var idparametro = $(elemento).parents("tr").attr("id");
  idparametro = parseInt(idparametro);
  const json_requisicao = { IDPARAMETRO: idparametro };

  var txt_nomeparametro = $("#txt_nomeparametro");
  var txt_valorpadrao = $("#txt_valorpadrao");
  var txt_status = $("#txt_status");

  try {
    //BUSCANDO INFORMAÇÕES DO PERFIL, PASSANDO O IDPERFIL
    var resposta = Requisicao("BuscarParametro", json_requisicao, "POST");

    //Dando valores
    $("#txt_idparametro").val(idparametro);
    $(txt_nomeparametro).val(resposta.nomeparametro);
    $(txt_valorpadrao).val(resposta.valorpadrao);
    $(txt_status).val(resposta.status);

  } catch (e) {
    alerta_doce("Erro", e, "danger");
  }
}

function deletar_parametro(elemento) {
  var decisao = confirm("Tem certeza que deseja deletar este parametro ?");

  if (decisao) {
    var idparametro = parseInt($(elemento).parents("tr").attr("id"));
    var envio = {"idparametro":idparametro};

    var retorno = Requisicao("DeletarParametro", envio, "DELETE");

    if (retorno.mensagem == "OK") {
      not6("success","Parâmetro deletado com sucesso");
      carrega_pagina_div("corpo", url_bingo+"parametros/listaparametros");
      listaparametros();
      }
    } 
  }

  function listausuariosperfis(elemento){
    var idperfil = parseInt($(elemento).parents("tr").attr("id"));
    idperfil = parseInt(idperfil);
    if(!idperfil){
      idperfil = elemento;
      idperfil = parseInt(idperfil);
    }
    var json_requisicao = {"IDPERFIL":idperfil};
    var usuariosperfil = Requisicao("VisualizarUsuariosPerfis/IDPERFIL",json_requisicao,"POST");
    console.log(usuariosperfil);
    var tabela = '';
    $("#titulo").html("Lista de usuários do perfil "+idperfil);
    $("#txt_idperfil").val(idperfil)

    if(usuariosperfil.length == 0){
      DadosNaoEncontrados("tr_usuarios_perfis","listausuariosperfis","Nenhum usuário com esse perfil foi encontrado");
    }else{
      for(var i = 0;i<usuariosperfil.length;i++){
        tabela ='<tr id="'+
        usuariosperfil[i].IDUSUARIOPERFIL+
        '">' +
        "<td>" +
        usuariosperfil[i].IDUSUARIO +
        "</td>" +
        "<td>" +
        usuariosperfil[i].NOMEUSUARIO +
        "</td>" +
        "<td>" +
        usuariosperfil[i].EMAIL +
        "</td>" +
        "<td>" +
        '<div class="btn-icon-list">' +
        '<i class="far fa-trash-alt pl-2 " onclick="deletar_usuarioperfil(this)"></i>' +
        "</div>"+
        "</td>" +
        '<tr/>';
        
        $("#listausuariosperfis").append(tabela);
    }
    }

 

  }

  function listausuarios_semperfil(){
        var option;
        var usuariosperfis = Requisicao("ListarUsuariosSemPerfil",'',"GET");
        
        for(var i = 0;i<usuariosperfis.length;i++){
          option = option + '<option value="'+usuariosperfis[i].idusuario+'">'+usuariosperfis[i].nomeusuario+'</option>';
          
        }
        $("#txt_usuariosperfis").html('<option value="0"></option>'+option);
  }

  function salvar_usuarioperfil(){
      var txt_idperfil = $("#txt_idperfil").val();
      var txt_idusuario = $("#txt_usuariosperfis").val();
      var envio = {"idusuarioperfil":0,"idusuario":txt_idusuario,"idperfil":txt_idperfil,"status":1};
      var resposta = Requisicao("SalvarUsuarioPerfil",envio,"POST");
      if(resposta.mensagem == "OK"){
        alerta_doce("Usuarios perfis","Parabéns, o usuário "+txt_idusuario+" agora tem acesso a este perfil","success");
        setTimeout(function(){carrega_pagina_div('corpo',url_seguranca+"/perfis/visualizarusuariosperfil");
        listausuariosperfis(txt_idperfil);},1000);
        $("#modaldemo8 .close").click()

      }
  }

  function deletar_usuarioperfil(elemento) {
    var decisao = confirm("Tem certeza que deseja deletar este usuário perfil ?");
    var idperfil = $("#txt_idperfil").val();
    idperfil = parseInt(idperfil);
    if (decisao) {
      var idusuarioperfil = parseInt($(elemento).parents("tr").attr("id"));
      var envio = {"idusuarioperfil":idusuarioperfil};
  
      var retorno = Requisicao("DeletarUsuarioPerfil", envio, "DELETE");
  
      if (retorno.mensagem == "OK") {
        not6("success","Usuário perfil deletado com sucesso");
        carrega_pagina_div("corpo", url_seguranca+"perfis/visualizarusuariosperfil");
        listausuariosperfis(idperfil);
      }
    }
  }