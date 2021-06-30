
var pagina;
var inicio_paginabotao;
var classes;
var paginacao_contador;

function paginacao_paginativa(parametro){
  if(parametro == '>' ){
    pagina++;
  }else if(parametro == '<'){
    pagina--;
  }else{
    pagina = parametro;
  }
  
 
  classes[pagina] = " active ";
  classes[pagina-1] ="";
  classes[pagina-2] ="";
  classes[pagina+1] = "";
  classes[pagina+2] = "";

  if(pagina>inicio_paginabotao+1){
    inicio_paginabotao = inicio_paginabotao+2;
  }else if(pagina <= inicio_paginabotao && pagina != 0){
    inicio_paginabotao = inicio_paginabotao-2;
  }
  
}

function paginacao_orelhas(total_registros,quantos_registros,qtde_registros){
  var paginas = '';
  var texto;
  paginacao_contador = pagina+1;
  paginacao_contador = paginacao_contador*qtde_registros; 
 
  var paginacao_botoes = total_registros / quantos_registros;

  for(var i = inicio_paginabotao;i<paginacao_botoes;i++){

    classes.push("");
    var texto = i+1;
    var idpagina = "pagina"+i;
    paginas = paginas +'<li class="page-item'+classes[i]+'" id="'+idpagina+'" onclick="paginacao_perfis('+i+');"><button class="page-link" href="#">'+texto+'</button></li>';
    if(i>inicio_paginabotao+2){
    break;
    }
    $("#numerospagina").html(paginas);
    console.log("pagina : "+pagina+" botao : "+parseInt(paginacao_botoes)+" total registros : "+total_registros+" qtde_registros : "+qtde_registros);
    if(pagina == parseInt(paginacao_botoes) || pagina == parseInt(paginacao_botoes)-1){
      if(qtde_registros != quantos_registros || paginacao_contador == total_registros){
        $('#'+idpagina).addClass("disabled");
        $('#'+idpagina).prop("onclick",null);
        $(".pagina_proximo").attr('disabled','disabled');  
      }else{
        $(".pagina_proximo").attr('disabled',false);
      }
    }

    if(pagina == 0){
      $(".pagina_anterior").attr('disabled','disabled');
      $("#idpagina0").addClass("disabled");
      $("#idpagina0").prop("onclick",null);
    }else{
      $(".pagina_anterior").attr('disabled',false);

    }
  
  }


}













function DadosNaoEncontrados(tr_id_param,tbody_id_param,texto_param){
  var tr_id = "#"+tr_id_param;
  var tbody_id = "#"+tbody_id_param;
  var componente = '<div class="main-error-wrapper">' +           
  '<h4 class="mg-b-20 ">'+texto_param+'</h4>'+   
  '</div>';
  try{
    $(tr_id).hide();
    $(tbody_id).html(componente);
  
  }catch(e){
      alerta_doce("Erro no sistema",e,"danger");
  }
 }

 function Carregando(){
  $("#pagina").hide();
  var carregar = '<div class="row" style="margin-top: 25%;">'+
  '<div class="col-12">'+
    '<div class="text-center mg-b-20">'+
      '<div class="spinner-border" role="status">'+
        '<span class="sr-only">Carregando o sistema...</span>'+
     '</div>'+
    '</div>'+
  '</div>'+
'</div>';

  $("#corpo").append(carregar);

 }


 