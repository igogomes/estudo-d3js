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