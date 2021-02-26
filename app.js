fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then(response => response.json())
    .then(data => {
        var width = 1000,
            height = 400,
            barWidth = width / 275;

        var tooltip = d3
            .select('#app')
            .append('div')
            .attr('id', 'tooltip')
            .style('opacity', 0);

        var svgContainer = d3
            .select('#app')
            .append('svg')
            .attr('width', width + 100)
            .attr('height', height + 60);

        var yearsDate = data.data.map(function (item) {
            return new Date(item[0]);
        });

        var xMax = new Date(d3.max(yearsDate));
        xMax.setMonth(xMax.getMonth() + 3);
        var xScale = d3
            .scaleTime()
            .domain([d3.min(yearsDate), xMax])
            .range([0, width]);

        var xAxis = d3.axisBottom().scale(xScale);

        svgContainer
            .append('g')
            .call(xAxis)
            .attr('id', 'x-axis')
            .attr('transform', 'translate(60, 400)');

        var GDP = data.data.map(function (item) {
            return item[1];
        });

        var scaledGDP = [];

        var gdpMax = d3.max(GDP);

        var linearScale = d3.scaleLinear().domain([0, gdpMax]).range([0, height]);

        scaledGDP = GDP.map(function (item) {
            return linearScale(item);
        });

        var yAxisScale = d3.scaleLinear().domain([0, gdpMax]).range([height, 0]);

        var yAxis = d3.axisLeft(yAxisScale);

        svgContainer
            .append('g')
            .call(yAxis)
            .attr('id', 'y-axis')
            .attr('transform', 'translate(60, 0)');

        d3.select('svg')
            .selectAll('rect')
            .data(scaledGDP)
            .enter()
            .append('rect')
            .attr('data-date', function (d, i) {
                return data.data[i][0];
            })
            .attr('data-gdp', function (d, i) {
                return data.data[i][1];
            })
            .attr('class', 'bar')
            .attr('x', function (d, i) {
                return xScale(yearsDate[i]);
            })
            .attr('y', function (d) {
                return height - d;
            })
            .attr('width', barWidth)
            .attr('height', function (d) {
                return d;
            })
            .style('fill', 'lightgreen')
            .attr('transform', 'translate(60, 0)')
            .on('mouseover', (d, ) => {             
                tooltip
                    .text(d.srcElement.dataset.date + ' : ' + d.srcElement.dataset.gdp)
                    .attr('data-date', d.srcElement.dataset.date)
                    .style('left', d.clientX + 'px')
                    .style('top', height - 100 + 'px')
                    .style('transform', 'translateX(60px)')
                    .style('opacity', 0.9);
            })
            .on('mouseout', function () {
              tooltip.style('opacity', 0);
            });
    }
    );
