function grafico(parametros) {

    var svg = d3.select(parametros.seletor)
                .attr('width', parametros.largura)
                .attr('height', parametros.altura);

    var margem = {
        esquerda: 20,
        direita: 20,
        superior: 50,
        inferior: 20
    }

    var plotagem = svg.append('g')
                .attr('transform', 'translate('+margem.esquerda+', '+margem.superior+')');

    var larguraPlotagem = parametros.largura - margem.esquerda - margem.direita;
    var alturaPlotagem = parametros.altura - margem.superior - margem.inferior;

    var x = d3.scaleBand()
            .domain(parametros.dados.map(d => d.chave))
            .range([0, larguraPlotagem])
            .padding(0.1);
    var y = d3.scaleLinear()
            .domain([0, d3.max(
                parametros.dados.map(d=>d.valor))])
            .range([alturaPlotagem, 0]);
    var cores = d3.scaleOrdinal()
                .domain([0,parametros.dados.length])
                .range(['#8c510a', '#d8b365', '#f6e8c3', '#f5f5f5', '#c7eae5', '#5ab4ac', '#01665e']);

    plotagem.selectAll('.barra')
        .data(parametros.dados)
        .enter()
            .append('rect')
            .classed('barra', true)
            .attr('x', d => x(d.chave))
            .attr('y', d => y(d.valor))
            .attr('width', x.bandwidth())
            .attr('height', d => alturaPlotagem - y(d.valor))
            .attr('fill', (d,i) => cores(i));

    plotagem.selectAll('.rotulo')
        .data(parametros.dados)
        .enter()
            .append('text')
            .classed('rotulo', true)
            .text(d => d.valor)
            .attr('x', d => x(d.chave))
            .attr('y', d => y(d.valor))
            .attr('dx', d => x.bandwidth()*0.5)
            .attr('dy', -5);
}