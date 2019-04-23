function GraficoDeColunas(parametros) {

    //Seleção do elemento SVG
    var svg = d3.select(parametros.seletor)
                .attr('width', parametros.largura)
                .attr('height', parametros.altura);

    //Definição das margens da área de plotagem e cálculo de altura e largura
    var margem = {
        esquerda: 70,
        direita: 20,
        superior: 40,
        inferior: 100
    }

    this.larguraPlotagem = parametros.largura - margem.esquerda - margem.direita;
    this.alturaPlotagem = parametros.altura - margem.superior - margem.inferior;
    
    //Criação da área de plotagem
    svg.select('#plotagem').remove() //Remoção da área de plotagem atual caso exista
    this.plotagem = svg.append('g')
                        .attr('id', 'plotagem')
                        .attr('width', this.larguraPlotagem)
                        .attr('height', this.alturaPlotagem)
                        .attr('transform', 'translate('+margem.esquerda+', '+margem.superior+')');

    //Criação das escalas horizontais, verticais e cores
    this.x = d3.scaleBand()
            .range([0, this.larguraPlotagem])
            .padding(0.1);
    this.y = d3.scaleLinear()
            .range([this.alturaPlotagem, 0]);
    this.cores = d3.scaleOrdinal()
                .range(d3.schemeCategory10);

    //Preparação das linhas de grade
    this.grade = d3.axisRight(this.y)
                .tickSize(this.larguraPlotagem)
                .tickFormat('');
    this.plotagem.append('g')
            .attr('id', 'grade');

    //Preparação dos eixos X e Y
    this.eixoX = d3.axisBottom(this.x);
    
    this.plotagem.append('g')
            .attr('id', 'eixoX')
            .attr('transform', 'translate(0,' + this.alturaPlotagem +')');

    this.eixoY = d3.axisLeft(this.y);

    this.plotagem.append('g')
            .attr('id', 'eixoY');

    //Criação dos títulos dos eixos
    this.plotagem.append('text')
            .attr('x', 0)
            .attr('y', 0)
            .style('text-anchor', 'middle')
            .attr('transform', 'translate(-40,'+this.alturaPlotagem/2+') rotate(-90)')
            .text(parametros.tituloY)
            .classed('tituloeixo', true);

    this.plotagem.append('text')
            .attr('x', 0)
            .attr('y', 0)
            .style('text-anchor', 'middle')
            .attr('transform', 'translate('+this.larguraPlotagem/2+', '+ (this.alturaPlotagem + 80) +')')
            .text(parametros.tituloX)
            .classed('tituloeixo', true);

    this.callback = parametros.callback;

    //---------------------------
    //Função para atualização dos dados do gráfico
    //---------------------------
    this.atualize = function(dados) {

        //Atualização de escalas de acordo com novos dados
        this.x.domain(dados.map(d => d.chave));
        this.y.domain([0, d3.max(dados.map(d=>d.valor))]);
        this.cores.domain([0,dados.length]);

        //Criação dos elementos SVG dos eixos e das linhas de grade
        this.plotagem.select('#eixoX')
                    .transition()
                    .duration(this.duracaoAnimacao)
                    .call(this.eixoX); 
        this.plotagem.select('#eixoY')
                     .transition()
                     .duration(this.duracaoAnimacao)
                     .call(this.eixoY); 
        this.plotagem.select('#grade')
                     .transition()
                     .duration(this.duracaoAnimacao)
                     .call(this.grade); 

        //Ajuste da quantidade de retângulos dos dados com criação ou remoção dos retângulos conforme necessário
        var retangulos = this.plotagem.selectAll('.barra').data(dados);
        var self = this;
        retangulos.enter()
                    .append('rect')
                    .on('mouseover', function(d) {
                        d3.select(this).style('fill', 'black')
                    })
                    .on('mouseout', function(d) {
                        d3.select(this).style('fill', self.cores(d.chave))
                    })
                    .on('click', function(d) {
                        self.callback(d);
                    })
                    .classed('barra', true);
        retangulos.exit()
                    .remove();
        this.plotagem.selectAll('.barra')
            .transition()
            .duration(this.duracaoAnimacao)
            .attr('x', d => this.x(d.chave))
            .attr('y', d => this.y(d.valor))
            .attr('width', this.x.bandwidth())
            .attr('height', d => this.alturaPlotagem - this.y(d.valor))
            .attr('fill', d => this.cores(d.chave));

        //Ajuste da quantidade de rótulos dos dados com criação ou remoção dos rótulos conforme necessário
        var rotulos = this.plotagem.selectAll('.rotulo').data(dados);
        rotulos.enter()
                    .append('text')
                    .classed('rotulo', true);
        rotulos.exit()
                    .remove();

        this.plotagem.selectAll('.rotulo')
                    .transition()
                    .duration(this.duracaoAnimacao)
                    .text(d => d.valor)
                    .attr('x', d => this.x(d.chave))
                    .attr('y', d => this.y(d.valor))
                    .attr('dx', d => this.x.bandwidth()*0.5)
                    .attr('dy', -5);

        //Definição do tempo da animação
        this.duracaoAnimacao = 500;

    }

    this.atualize(parametros.dados);

}

//---------------------------------



function GraficoDeLinhas(parametros) {

    //Preparação dos dados
    var svg = d3.select(parametros.seletor)
                .attr('width', parametros.largura)
                .attr('height', parametros.coluna);

    var margem = {

        esquerda: 70,
        direita: 20,
        superior: 40,
        inferior: 100

    };

    this.larguraPlotagem = parametros.largura - margem.esquerda - margem.direita;
    this.alturaPlotagem = parametros.altura - margem.superior - margem.inferior;

    svg.select('#plotagem').remove(); //Remoção da área de plotagem caso a mesma exista

    this.plotagem = svg.append('g')
                        .attr('id', 'plotagem')
                        .attr('width', this.larguraPlotagem)
                        .attr('height', this.alturaPlotagem)
                        .attr('transform', 'translate(' + margem.esquerda + ', ' + margem.superior + ')');

    this.x = d3.scaleLinear()
                .range([0, this.larguraPlotagem]);

    this.y = d3.scaleLinear()
                .range([this.alturaPlotagem, 0]);


    //Preparação das linhas de grade
    this.grade = d3.axisRight(this.y)
                    .tickSize(this.larguraPlotagem)
                    .tickFormat('');

    this.plotagem.append('g')
                 .attr('id', 'grade');

    //Preparação dos eixos X e Y
    this.eixoX = d3.axisBottom(this.x)
    this.plotagem.append('g')
                .attr('transform', 'translate(0' + this.alturaPlotagem+')')
                .attr('id', 'eixoX');

    this.eixoY = d3.axisLeft(this.y)
    this.plotagem.append('g')
                .attr('id', 'eixoY');

    //Criação dos títulos dos eixos
    this.plotagem.append('text')
                 .attr('x', 0)
                 .attr('y', 0)
                 .style('text-anchor', 'middle')
                 .attr('transform',
                       'translate(-40, ' + this.alturaPlotagem/2+') rotate(-90)')
                 .text(parametros.tituloY)
                 .classed('tituloeixo', true);
    this.plotagem.append('text')
                  .attr('x', 0)
                  .attr('y', 0)
                  .style('text-anchor', 'middle')
                  .attr('transform',
                        'translate(' + this.larguraPlotagem/2 + ', ' + (this.alturaPlotagem + 80) + ')')
                  .text(parametros.tituloX)
                  .classed('tituloeixo', true);

    //Geração de linhas
    var converteData = d3.timeParse('%Y-%m-%d');
    this.linha = d3.line()
                    .x(d => this.x(converteData(d.data)))
                    .y(d => this.y(d.valor))
                    .curve(d3.curveCardinal);

    //---------------------------
    //Função para atualização dos dados do gráfico
    //---------------------------
    this.atualize = function(dados, periodo) {

        //Criação de referência não ambígua para o objeto do gráfico
        var self = this;

        //Atualização das escalas de acordo com os novos dados
        var converteData = d3.timeParse('%Y-%m-%d');
        self.x.domain(periodo.map(i=>converteData(i)));
        self.y.domain([0, d3.max(dados[0].valores.map(i=>i.valor))]);

        //Criação dos elementos SVG dos eixos e das linhas de grade
        var inicio = converteData(periodo[0]);
        var fim = converteData(periodo[1]);
        self.eixoX.tickValues(d3.timeDay.range(inicio, ++fim))
                  .tickFormat(d3.timeFormat('%d/%m'));
        self.plotagem.select('#eixoX')
                     .call(self.eixoX);
        self.eixoY.ticks(8);
        self.plotagem.select('#eixoY')
                     .call(self.eixoY);
        self.grade.ticks(8);
        self.plotagem.select('#grade')
                     .call(self.grade);

        //Criação de linha que conecta pontos do gráfico
        self.plotagem.select('.linha').remove();
        self.plotagem.append('path')
            .datum(dados[0].valores)
            .classed('linha', true)
            .attr('d', self.linha);

        //Ajuste da quantidade de pontos dos dados, com criação e remoção conforme necessário
        var pontos = self.plotagem.selectAll('.ponto')
                                    .data(dados[0].valores);
        pontos.enter()
                .append('circle')
                .classed('ponto', true)
                .attr('r', 2);
        pontos.exit()
                .remove();

        //Formatação dos pontos de acordo com os dados
        self.plotagem.selectAll('.ponto')
                    .attr('cx', d => self.x(converteData(d.data)))
                    .attr('cy', d=> self.y(d.valor));

    }

    this.atualize(parametros.dados, parametros.periodo);

}