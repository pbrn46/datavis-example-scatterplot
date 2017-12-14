class App extends React.Component {
  makeChart() {
    var margin = {
      top: 70,
      right: 100,
      bottom: 50,
      left: 100,
    }
    var fullWidth = 800
    var fullHeight = 600
    var circleRadius = 5
    var textLeftPadding = 5

    var width = fullWidth - margin.left - margin.right
    var height = fullHeight - margin.top - margin.bottom

    var svg = d3.select("#ChartContainer").append("svg")
      .attr("width", fullWidth)
      .attr("height", fullHeight)

    svg.append("rect")
      .attr("class", "Background")
      .attr("width", fullWidth)
      .attr("height", fullHeight)
      .attr("rx", 10)
      .attr("ry", 10)

    // Chart title
    svg.append("text")
      .attr("class", "ChartTitle")
      .attr("x", 10)
      .attr("y", 10)
      .attr("dy", "1em")
      .text("Doping in Professional Bycycle Racing")

    // Chart sub-title
    svg.append("text")
      .attr("class", "ChartSubTitle")
      .attr("x", 10)
      .attr("y", 50)
      .attr("dy", "1em")
      .text("35 fastest times up Alpe d'Huez")

    var x = d3.scaleTime()
        .range([0, width])
    var y = d3.scaleLinear()
      .range([0, height])

    var g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    var timeParser = d3.utcParse("%M:%S")
    var timeFormatter = d3.timeFormat("%M:%S")

    d3.json(
      "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json",
      (error, data) => {
        if (error) throw error
        console.log(data)
        var fastestTime = d3.min(data, item => timeParser(item.Time))
        x.domain([
          d3.max(data, item => timeParser(item.Time)) - fastestTime + 10000,
          0 - 10000
        ])
        y.domain([0 - 2, d3.max(data, item => item.Place) + 2])

        var genTooltip = item => {
            // HTML tooltip
            var diff = timeFormatter(timeParser(item.Time) - fastestTime)
            return ('<div class="text-left">'
              + `<b>${item.Name}</b>, ${item.Nationality}<br />`
              + `<b>Year</b>: ${item.Year}<br />`
              + `<b>Time</b>: ${item.Time}<br />`
              + `<b>Doping</b>: ${item.Doping}<br />`
              + `<b>Minutes Behind Fastest</b>: ${diff}<br />`
              + '</div>'
            )
        }

        g.selectAll(".Circle")
          .data(data)
          .enter().append("circle")
          .attr("class", item => "Circle HasTooltip" + (item.Doping === "" ? "" : " Doping"))
          .attr("cx", item => x(timeParser(item.Time) - fastestTime))
          .attr("cy", item => y(item.Place))
          .attr("r", circleRadius)
          .attr("data-toggle", "tooltip")
          .attr("title", genTooltip)

        g.selectAll(".NamePlate")
          .data(data)
          .enter().append("text")
          .attr("class", "NamePlate HasTooltip")
          .attr("x", item => x(timeParser(item.Time) - fastestTime) + circleRadius + textLeftPadding)
          .attr("y", item => y(item.Place))
          .attr("alignment-baseline", "middle")
          .attr("font-size", "9px")
          .text(item => `${item.Name}, ${item.Year}`)
          .attr("data-toggle", "tooltip")
          .attr("title", genTooltip)


        // Initialize the tooltips
        g.selectAll(".HasTooltip").each(function (data, item) {
          $(this).tooltip({html: true})
        })

        // x-axis
        var xAxis = g.append("g")
          .attr("class", "axis axis-x")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x)
            .ticks(5)
            .tickFormat(timeFormatter)
          )

        // x-axis Label
        g.append("text")
          .attr("class", "AxisLabel")
          .attr("x", (width / 2))
          .attr("y", height + margin.bottom - 10)
          .attr("text-anchor", "middle")
          .attr("alignment-baseline", "baseline")
          .text("Minutes Behind Fastest Time")

        // y-axis
        var yAxis = g.append("g")
          .attr("class", "axis axis-y")
          .call(d3.axisLeft(y)
          )

        // y-axis Label
        g.append("text")
          .attr("class", "AxisLabel")
          .attr("transform", "rotate(-90)")
          .attr("x", 0 - (height / 2))
          .attr("y", 0 - margin.left + 10)
          .attr("dy", "1.0em")
          .attr("text-anchor", "middle")
          .text("Ranking")

        // Legend
        g.append("circle")
          .attr("class", "Circle")
          .attr("cx", 500)
          .attr("cy", 300)
          .attr("r", circleRadius)
        g.append("circle")
          .attr("class", "Circle Doping")
          .attr("cx", 500)
          .attr("cy", 320)
          .attr("r", circleRadius)
        g.append("text")
          .attr("class", "NamePlate")
          .attr("x", 500 + circleRadius + textLeftPadding)
          .attr("y", 300)
          .attr("alignment-baseline", "middle")
          .attr("font-size", "10px")
          .text("No Alleged Doping")
        g.append("text")
          .attr("class", "NamePlate")
          .attr("x", 500 + circleRadius + textLeftPadding)
          .attr("y", 320)
          .attr("alignment-baseline", "middle")
          .attr("font-size", "10px")
          .text("Alleged Doping")

      }
    )
  }
  componentDidMount() {
    this.makeChart()
  }
  render() {
    return (
      <div className="container App">
        <div className="card">
          <div className="card-body">
            <h3>
              Data Visualization Example - Scatter Plot
              {' '}<button
                type="button"
                className="btn btn-info btn-sm"
                data-toggle="modal"
                data-target="#InfoModal">Info</button>
            </h3>


            <div className="modal fade" id="InfoModal" aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-body">
                    <p>
                      An example of data visualization of a scatter plot using
                      D3.js.
                    </p>
                    <div>Showcase Features</div>
                    <ul>
                      <li>Time parsing, formatting, and scaling in D3.js over SVG</li>
                      <li>Bootstrap tooltips</li>
                    </ul>
                    <div>Libraries used in this example:</div>
                    <ul>
                      <li>D3.js</li>
                      <li>Bootstrap</li>
                      <li>React</li>
                    </ul>
                    <p className="small">Written by Boris Wong, December 2017. MIT license.</p>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div id="ChartContainer"></div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
