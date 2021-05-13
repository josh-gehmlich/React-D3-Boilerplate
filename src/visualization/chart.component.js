import React, { useLayoutEffect, useRef } from "react";
import { Chart } from "./chart.d3";

export const ChartComponent = (
    props,
    ref
) => {
    const d3Container = useRef(null);
    let chart = null;

    // We need to manipulate DOM
    useLayoutEffect(() => {
        if (props.data && d3Container.current) {
            if (!chart) {
                /* eslint-disable */
                chart = new Chart();
            }

            chart
                .container(d3Container.current)
                .data(props.data)
                .svgHeight(window.innerHeight - 20)
                .render();
        }
    }, [props.data, d3Container.current]);

    return (
        <div>
            <div ref={d3Container} />
        </div>
    );
};