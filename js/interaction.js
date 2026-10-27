const populateFilters = (data) => {
    d3.select("#filters_screen")
    .selectAll("button")
    .data(filters_screen)
    .join("button")
        .attr("class", d=> `filter ${d.isActive ? "active" : ""}`)
        .text(d => d.label)
        
        .on("click", (e, d) => {
            console.log("Clicked filter:", e);
            console.log("Clicked filter data:", d);

            if(!d.isActive){

                filters_screen.forEach(filter => {
                    filter.isActive = d.id === filter.id ? true : false;
                });
                
                d3.selectAll("#filter_screen .filter")
                    .classed("active", filter => filter.id === d.id ? true : false);
                
                updateHistogram(d.id, data);
            }
        });
    const updateHistogram = (filterId, data) => {
        
        const updatedData = filterId === "all"
            ? data
            : data.filter(tv => tv.screenTech === filterId);

        const updatedBins = binGenerator(updatedData);

        d3.selectAll("#histogram rect")
            .data(updatedBins)
            .transition()
                .duration(500)
                .ease(d3.easeCubicInOut)
                .attr("y", d => yScale(d.length))
                .attr("height", d => innerHeight - yScale(d.length));
    }
};

const createTooltip = (data) => {
    const tooltip = innerChartS
        .append("g")
        .attr("class", "tooltip")
        .style("opacity", 0);

    tooltip
        .append("rect")
            .attr("width", tooltipWidth)
            .attr("height", tooltipHeight)
            .attr("rx", 3)
            .attr("ry", 3)
            .attr("fill", barColor)
            .attr("fill-opacity", 0.75);

    tooltip
        .append("text")
            .text("NA")
            .attr("x", tooltipWidth/2)
            .attr("y", tooltipHeight/2 + 2)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .attr("fill", "white")
            .style("font-weight", 900);
}

const handleMouseEvents = () => {
    innerChartS.selectAll("circle")

    .on("mouseenter", (e, d) => {
        console.log("Mouse entered circle", d);

        d3.select(".tooltip text")
        .text(d.screenSize);

        const cx = e.target.getAttribute("cx");
        const cy = e.target.getAttribute("cy");

        d3.select(".tooltip")
            .attr("transform", `translate(${cx - 0.5*tooltipWidth}, ${cy - 1.5*tooltipHeight})`)
            .transition()
                .duration(200)
                .style("opacity", 1);
    })


    .on("mouseleave", (e, d) => {
        console.log("Mouse left circle", d);

        d3.select(".tooltip")
        .style("opacity", 0)
        .attr("transform", `translate(0, 500)`);
    });
};



