var ScanProgressChartModule = function () {

    var component = {};
  
    var container = null;
    var values = [];
    var selectedRange = [];
    var threshold =  [50, 80];

    var grayDefault = "rgb(229,229,229)";
    var yellowDefault = "rgb(248,207,29)";
    var pinkDefault = "rgb(228,80,80)";
    var greenDefault = "rgb(76,170,168)";
    
    var yellowRunningDefault = "rgb(233,221,168)"
    var yellowBorderDefault = "rgb(255,207,0)"
    var greenRunningDefault = "rgb(217,222,200)"
    var greenBorderDefault = "rgb(195,209,138)"
    var pinkRunningDefault = "rgb(227,183,183)"
    var pinkBorderDefault = "rgb(228,82,82)"

    component.container = function (_) {
      if (!arguments.length) return container;
      container = _;
      return component;
    };
  
    var svg = null;
    var $container = null;
    var width = 300;
    var height = 300;
    var margin = {
      left: 5,
      right: 5,
      top: 5,
      bottom: 5
    };
    var chartWidth = 0;
    var chartHeight = 0;

    var gap = 5;
    var innerWidth = 25;
    
    component.init = function () {
      if (container) {
        d3.select("#" + container).selectAll("*").remove(); 
        $container = $("#" + container);
        width = $container.width();
        height = $container.height();
  
        chartWidth = width - margin.left - margin.right;
        chartHeight = height - margin.top - margin.bottom;
        
        svg = d3.select("#" + container).append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      }
      return component;
    }
    component.update = function(progress) {
        updateProgressArc(progress);
    }
    component.render = function(progresses, running) {
        /**
         * progresses 接受2个参数 [x, y]
         * 如果 x = -1, 表示初始化, 反之将和threshold比较
         * 
         */
        console.log("Start Render");
        let flag;
        if (progresses[0] == -1)
            flag = -1;
        if (progresses[0] < threshold[0]){
            flag = 0;
        } else if (progresses[0] >= threshold[0] && progresses[0] <= threshold[1]) {
            flag = 1;
        } else if (progresses[0] > threshold[1]) {
            flag = 2;
        }
        if (running)
            createRunningOuterArc(flag, progresses[0]);
        else
            createStaticOuterArc(flag, progresses[0]);
        createInnerArc(progresses[1], running)
    }
    function createRunningOuterArc(flag, progress) {
        /**
         * -1 , INITIALIZED
         * 0  , ALERT
         * 1  , WARNING
         * 2  , ERROR
         */
        if (flag == -1)
            return;
        
        let runningbackground;
        let runningborder;
        if (flag == 0) {
            runningbackground = pinkRunningDefault;
            runningborder = pinkBorderDefault;
        } else if (flag == 1) {
            runningbackground = yellowRunningDefault;
            runningborder = yellowBorderDefault;
        } else if (flag == 2) {
            runningbackground = greenRunningDefault;
            runningborder = greenBorderDefault;
        }
        svg
        .append("path")
        .attr("transform", "translate(200,200)")
        .attr("d", d3.arc()
            .innerRadius( chartWidth/2-innerWidth )
            .outerRadius( chartWidth/2 )
            .startAngle( -120 * (Math.PI/180) )
            .endAngle( 120 * (Math.PI/180) )
            .cornerRadius(15)
          )
          .attr('fill', grayDefault);
        
        svg
        .append("path")
        .attr("transform", "translate(200,200)")
        .attr("d", d3.arc()
            .innerRadius( chartWidth/2-innerWidth )
            .outerRadius( chartWidth/2 )
            .startAngle( -120 * (Math.PI/180) )
            .endAngle( (-120+240/100*progress) * (Math.PI/180) )
            .cornerRadius(15)
          )
        .attr('fill', runningbackground)
        .attr('stroke', runningborder)
        .attr("stroke-width", 2);  
      }
    function createStaticOuterArc(flag, progress) {
        if (flag == -1)
            return;
        
        let runningbackground;
        if (flag == 0) {
            runningbackground = pinkDefault;
        } else if (flag == 1) {
            runningbackground = yellowDefault;
        } else if (flag == 2) {
            runningbackground = greenDefault;
        }
    
        svg
        .append("path")
        .attr("transform", "translate(" + width/2 + "," + height/2 + ")")
        .attr("d", d3.arc()
          .innerRadius( chartWidth/2-innerWidth )
          .outerRadius( chartWidth/2 )
          .startAngle( -120 * (Math.PI/180) )
          .endAngle( 120 * (Math.PI/180) )
          .cornerRadius(15)
          )
          .attr('fill', grayDefault)
        svg
        .append("path")
        .attr("transform", "translate(" + width/2 + "," + height/2 + ")")
        .attr("d", d3.arc()
          .innerRadius( chartWidth/2-innerWidth )
          .outerRadius( chartWidth/2 )
          .startAngle( -120 * (Math.PI/180) )
          .endAngle( (-120+240/100*progress) * (Math.PI/180) )
          .cornerRadius(15)
          )
        .attr('fill', runningbackground);  
      }

      function updateProgressArc(progress) {
        old_path = svg.selectAll("path:last-child");

        svg
        .append("path")
        .attr("transform", "translate(" + width/2 + "," + height/2 + ")")
        .transition()
        .duration(1000)
        .attr("d", d3.arc()
        .innerRadius( chartWidth/2-30 )
        .outerRadius( chartWidth/2-35 )
        .startAngle( -120 * (Math.PI/180) )
        .endAngle( (-120+240/100*progress) * (Math.PI/180) )
        .cornerRadius(15)
        )

        .attr('stroke', grayDefault)
        .attr('fill', greenDefault);

        old_path.remove();
      }
      function createProgressArc(progress) {
        svg
        .append("path")
        .attr("transform", "translate(" + width/2 + "," + height/2 + ")")
        .attr("d", d3.arc()
        .innerRadius( chartWidth/2-30 )
        .outerRadius( chartWidth/2-35 )
        .startAngle( -120 * (Math.PI/180) )
        .endAngle( (-120+240/100*progress) * (Math.PI/180) )
        .cornerRadius(15)
        )
        .attr('stroke', grayDefault)
        .attr('fill', greenDefault);
      }
      function createInnerArc(progress, running) {
        svg
        .append("path")
        .attr("transform", "translate(" + width/2 + "," + height/2 + ")")
        .attr("d", d3.arc()
          .innerRadius( chartWidth/2-30 )
          .outerRadius( chartWidth/2-35 )
          .startAngle( -120 * (Math.PI/180) )
          .endAngle( 120 * (Math.PI/180) )
          .cornerRadius(15)
          )
        .attr('stroke', grayDefault)
        .attr('fill', grayDefault);
      
        if (running) {
          createProgressArc(progress);
        }
      }
    component.initThreshold = function(threshold) {
        default_threshold = threshold;
        return component;
    }
    component.destroy = function () {
        if(container){
            chartContainer.selectAll("*").remove();
        }else{
            console.log(printText + "container");
        }
        return component;
    };
    return component;
  }
  
