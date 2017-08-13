$(function () {
    $('.collection-item').on('click', function () {
        var $badge = $('.badge', this);
        if ($badge.length === 0){
            $badge = $('<span class="badge brown-text">0</span>').appendTo(this);
        }

        $badge.text(parseInt($badge.text()) + 1);
    });

    $('#confirmar').on('click', function () {
        var texto = '';
        $('.badge').parent().each(function () {
            var produto = this.firstChild.textContent;
            var quantidade = this.lastChild.textContent;

            texto += produto + ': ' + quantidade + ', ';
        });
        $('#resumo').text(texto);
    });

    $('.collection').on('click', '.badge', function () {
        $(this).remove();
        return false;
    });

    $('.acao-limpar').on('click', function () {
        $('#numero-mesa').val('');
        $('.badge').remove();
    });

    $('.modal-trigger').leanModal();

    $('.scan-qrcode').on('click', function(){
        cordova.plugins.barcodeScanner.scan(
            function (resultado) {
                if (resultado.text) {
                    Materialize.toast('Mesa ' + resultado.text, 2000);
                    $('#numero-mesa').val(resultado.text);
                }
            },
            function (error) {
                Materialize.toast('Erro: ' + error, 3000, 'red-text');
            }
        );
    });

    $('.acao-finalizar').on('click', function() {
        var array = [];
        var cont = 0;
        var mesa = $('#numero-mesa').val();
        $('.badge').parent().each(function () {
            var produto = this.firstChild.textContent;
            var quantidade = this.lastChild.textContent;

            array[cont] = {mesa: mesa, produto: produto, quantidade: quantidade};
            cont++;
        });
        var json = JSON.stringify(array).toString();
        console.log(json);
        $.ajax({
            //url: 'http://cozinhapp.sergiolopes.org/novo-pedido',
            //url: 'http://192.168.0.18:8282/FazendaWebService/webresources/fazenda/Usuario/list',
            //url: 'http://192.168.0.18:8282/FazendaWebService/webresources/fazenda/Usuario/inserir',
            url: 'http://localhost:8888/api/default/create',
            crossDomain: true,
            method: 'POST',
            dataType: 'application/json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: json,
            error: function(erro) {
                Materialize.toast(erro.responseText, 3000, 'red-text');
            },
            success: function(dados) {
                Materialize.toast('Inserido com Sucesso!!', 2000);

                /*$('#numero-mesa').val('');
                $('.badge').remove();*/
                //Materialize.toast(dados[0].login, 2000);
                //console.log(dados);
            }
        });
    });
});

