(
  function () {
    if (window.DateSelectSimple) { return }
    var proto = window.DateSelectSimple = {};

    // Attributes
    var attrs = ["change", "caption_format", "empty_item", "month", "name",
      "size", "text_format", "year", "value_format"];
    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];
      proto[attr] = (function () {
        var attr = attrs[i];
        return function () {
          if (arguments.length) {
            this["_" + attr] = arguments[0];
            return this;
          }
          return this["_" + attr];
        }
      }());
    }
     
    // Methods
    proto.component = function () {
        if (!this._component) { this._component = this._create_component() }
        return this._component;
    };

    proto.create = function (args) {
      var obj = {}
      for (var name in proto) { obj[name] = proto[name] }
      obj._init(args);
      return obj;
    };
    
    proto._init = function (args) {
      var today = new Date();
      this.name("date");
      this.year(today.getFullYear());
      this.month(today.getMonth() + 1);
      this.change(function () {});
      this._date_select = $("<select/>");
      this.size(1);
      this.empty_item(true);
      this.caption_format("%Y年%m月");
      this.text_format("%Y/%m/%d(%a)");
      this.value_format("%Y/%m/%d");
      for (name in args) { this["_" + name] = args[name] }
    };
    
    proto._add_month = function (add_month) {
      this.month(this.month() + add_month);
      if (this.month() < 1) {
        this.month(12);
        this.year(this.year() - 1);
      }
      else if (this.month() > 12) {
        this.month(1);
        this.year(this.year() + 1);
      }
      return this;
    };

    proto._last_mday = function (year, month) {
    	var next_year;
    	var next_month;
    	if (month == 12){
    		next_year = year + 1;
    		next_month = 1;
    	}
    	else{
    		next_year = year;
    		next_month = month + 1;
    	}
    	var last_date = new Date(next_year, next_month - 1, 0);
    	return last_date.getDate();
    };

    proto._create_component = function () {
      var that = this;
      
      // Container
      var container = $("<div/>");
      container.css("text-align", "center")
        .css("width", "140px");
      
      // Display year and display
      var table = $('<table align="center"/>');
      table.css("width", "90%")
        .css("border", "none");
      var tr = $('<tr/>');
      tr.css("border", "none");
      var td_left = $('<td/>');
      var td_center = $('<td/>');
      var td_right = $('<td/>');
      td_center.text(this._caption())
      td_center.css("text-align", "center")
        .css("border", "none");
      tr.append(td_left);
      tr.append(td_center);
      tr.append(td_right);
      table.append(tr);
      
      // Event
      var navi_effect = {
        in: function() {
          $(this).css("text-decoration", "underline")
           .css("cursor", "hand")
        },
        out: function () {
          $(this).css("text-decoration", "none");
        }
      };
      var month_forward = function(add) {
          that._add_month(add);
          td_center.text(that._caption());
          that._update_date_select();
          return false;
      };
      
      // Privious month
      td_left.html('<a href="#">&lt&lt</a>');
      td_left.css("text-align", "left")
        .css("border", "none");
      td_left.children("a").css("text-decoration", "none")
        .hover(navi_effect.in, navi_effect.out)
        .click(function () { return month_forward(-1) });
      
      // Next month
      td_right.html('<a href="#">&gt&gt</a>');
      td_right.css("text-align", "right")
        .css("border", "none");
      td_right.children("a").css("text-decoration", "none")
        .hover(navi_effect.in, navi_effect.out)
        .click(function () { return month_forward(1) });
      container.append(table);
      
      // Date selection
      container.append(this._date_select);
      var date_select = this._date_select;
      date_select.attr("name", this.name());
      date_select.attr("size", this.size());
      date_select.change(function () { that.change()($(this)) });
      this._update_date_select();
      
      return container;
    };

    proto._day = function (year, month, mday) {
      var days = ["日", "月", "火", "水", "木", "金", "土"];
      var date = new Date(year, month - 1, mday);
      var day = days[date.getDay()];
      return day;
    }
    
    proto._caption = function () {
      return this._format(this.caption_format(), this.year(), this.month());
    };
    
    proto._option_value = function (mday) {
      return this._format(this.value_format(), this.year(), this.month(), mday);
    };

    proto._option_text = function (mday) {
      return this._format(this.text_format(), this.year(), this.month(), mday);
    };
    
    proto._update_date_select = function () {
      var date_select = this._date_select;
      
      date_select.empty();
      if (this.empty_item()) { date_select.append('<option value=""/>') }
      var last_mday  = this._last_mday(this.year(), this.month());
      var days = ["日", "月", "火", "水", "木", "金", "土"];
      for (var mday = 1; mday <= last_mday; mday++) {
        var date = new Date(this.year(), this.month() - 1, mday);
        var day = days[date.getDay()];
        
        var option = $("<option/>");
        option.val(this._option_value(mday));
        option.text(this._option_value(mday) + "(" + day + ")");
        date_select.append(option);
      }
    };
    
    proto._format = function (format, year, month, mday, day) {
      var date = format;
      if (year) {date = date.replace(/%Y/, year) }
      if (month) {
        var fmonth = String(month).length === 1 ? "0" + month : "" + month;
        date = date.replace(/%m/, fmonth);
      }
      if (mday) {
        var fmday = String(mday).length == 1 ? "0" + mday : "" + mday;
        date = date.replace(/%d/, fmday);
      }
      if (day) { date = date.replace(/%a/, this._day(day)) }
      return date;
    };
  }
)();
