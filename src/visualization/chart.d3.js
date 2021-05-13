import { select, selectAll, selection } from 'd3';

const d3 = { select, selectAll, selection };

export class Chart {
    // Define state getters and setters
    getState() { return this.state; }
    setState(d) { return Object.assign(this.state, d) };
    createId() { return Date.now().toString(36) + Math.random().toString(36).substr(2); }

    state = {
        id: this.createId(),
        svgWidth: 400,
        svgHeight: 400,
        marginTop: 5,
        marginBottom: 5,
        marginRight: 5,
        marginLeft: 5,
        container: 'body',
        defaultTextFill: '#2C3E50',
        defaultFont: 'Helvetica',
        ctx: document.createElement('canvas').getContext('2d'),
        data: null
    };

    constructor() {
        // Define handful d3 enter, exit, update pattern method
        this.initializeEnterExitUpdatePattern();
    }

    container(container) {
        this.setState({ container });
        return this;
    }

    data(data) {
        this.setState({ data });
        return this;
    }

    svgHeight(svgHeight) {
        this.setState({ svgHeight });
        return this;
    }

    svgWidth(svgWidth) {
        this.setState({ svgWidth });
        return this;
    }

    // Define enter exit update pattern shorthand
    initializeEnterExitUpdatePattern() {
        d3.selection.prototype.patternify = function (params) {
            var container = this;
            var selector = params.selector;
            var elementTag = params.tag;
            var data = params.data || [selector];

            // Pattern in action
            var selection = container.selectAll('.' + selector).data(data, (d, i) => {
                if (typeof d === 'object' && d.id) return d.id;
                return i;
            });
            selection.exit().remove();
            selection = selection.enter().append(elementTag).merge(selection);
            selection.attr('class', selector);
            return selection;
        };
    }

    // Render Chart
    render() {
        // Define containers and set SVG width based on container size
        this.setDynamicContainer();

        // Calculate some properties
        this.calculateProperties();

        // Draw SVG and its wrappers
        this.drawSvgAndWrappers();

        //TODO - REMOVE THIS SNIPPET AFTER YOU START THE DEVELOPMENT
        this.drawContent();

        // listen for resize event and reRender accordingly
        this.reRenderOnResize();

        // Allow chaining
        return this;
    }

    // TODO - REMOVE THIS SNIPPET AFTER YOU START THE DEVELOPMENT
    drawContent() {
        const { chart, data } = this.getState();
        console.log(data)
        chart
            .patternify({ tag: 'text', selector: 'example-text', data: [data] })
            .text(d => { return d.name })
            .attr('x', 10)
            .attr('y', 20);
    }

    // Listen resize event and resize on change
    reRenderOnResize() {
        const { id, d3Container, svgWidth } = this.getState();
        d3.select(window).on('resize.' + id, () => {
            const containerRect = d3Container.node().getBoundingClientRect();
            const newSvgWidth = containerRect.width > 0 ? containerRect.width : svgWidth;
            this.setState({ svgWidth: newSvgWidth });
            this.render();
        });
    }

    // Draw SVG and g wrapper
    drawSvgAndWrappers() {
        const { d3Container, svgWidth, svgHeight, defaultFont, calc } = this.getState();
        const { chartLeftMargin, chartTopMargin } = calc;

        // Draw SVG
        const svg = d3Container
            .patternify({ tag: 'svg', selector: 'svg-chart-container' })
            .attr('width', svgWidth)
            .attr('height', svgHeight)
            .attr('font-family', defaultFont);

        // Add container g element
        var g = svg
            .patternify({ tag: 'g', selector: 'inner-wrapper' })
            .attr('transform', 'translate(' + chartLeftMargin + ',' + chartTopMargin + ')');

        // Add container g element
        var chart = g
            .patternify({ tag: 'g', selector: 'chart' })

        this.setState({ chart, svg });
    }

    // Calculate some properties
    calculateProperties() {
        const { marginTop, marginLeft, marginRight, marginBottom, svgWidth, svgHeight } = this.getState();

        // Calculated properties
        var calc = {
            id: this.createId(), // id for event handlings,
            chartTopMargin: marginTop,
            chartLeftMargin: marginLeft,
            chartWidth: svgWidth - marginRight - marginLeft,
            chartHeight: svgHeight - marginBottom - marginTop
        };

        this.setState({ calc })
    }

    // Set dynamic width for chart
    setDynamicContainer() {
        const { container, svgWidth } = this.getState();

        // Drawing containers
        const d3Container = d3.select(container);
        var containerRect = d3Container.node().getBoundingClientRect();
        let newSvgWidth = containerRect.width > 0 ? containerRect.width : svgWidth;
        this.setState({ d3Container, svgWidth: newSvgWidth });
    }

}