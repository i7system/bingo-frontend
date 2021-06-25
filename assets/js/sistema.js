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