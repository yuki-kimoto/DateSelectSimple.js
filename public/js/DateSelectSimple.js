(
  function () {
    
    if (window.DateSelectSimple) { return }
    var proto = window.DateSelectSimple = {};

    // Attributes
    var attrs = ["change", "caption_format", "days", "empty_item",
      "name", "size", "text_format", "value_format"];
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
    proto.month = function (month) {
      if (arguments.length) {
        var month = arguments[0];
        if (typeof month === "String") {
          month = parseInt(month);
        }
        this["_month"] = parseInt(month);
      }
      return this["_month"]
    };
    
    proto.year = function (year) {
      if (arguments.length) {
        var year = arguments[0];
        if (typeof year === "String") {
          year = parseInt(year);
        }
        this["_year"] = parseInt(year);
      }
      return this["_year"]
    };
    
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
      this.name("date");
      this.change(function () {});
      this.size(1);
      this.empty_item(false);
      this.caption_format("%Y-%m");
      this.text_format("%Y-%m-%d(%a)");
      this.value_format("%Y-%m-%d");
      this.days(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
      this._date_select = $("<select/>");
      var today = new Date();
      this.year(today.getFullYear());
      this.month(today.getMonth() + 1);
      for (name in args) { this[name](args[name]) }
    };
    
    proto._add_month = function (add_month) {
      this.month(this.month() + add_month);
      if (this.month() < 1) {
        this.month(12);
        this.year(this._year - 1);
      }
      else if (this.month() > 12) {
        this.month(1);
        this.year(this._year + 1);
      }
      return this;
    };
    
    proto._navi_effect = function () {
      return {
        into: function () {
          $(this).css("text-decoration", "underline")
            .css("cursor", "hand");
          return false;
        },
        out: function () {
          $(this).css("text-decoration", "none");
          return false;
        }
      }
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

    proto._caption = function () {
      return this._format(this.caption_format(), this.year(), this.month());
    };
    
    proto._create_component = function () {
      var that = this;
      
      // Container
      var container = $("<div/>");
      container.css("text-align", "center")
        .css("width", "180px");
      
      // Display year and display
      var table = $('<table align="center"/>');
      table.css("width", "90%")
        .css("border", "none");
      var tr = $('<tr/>');
      tr.css("border", "none");
      var td_year_prev = $('<td/>');
      var td_month_prev = $('<td/>');
      var td_caption = $('<td/>');
      var td_month_next = $('<td/>');
      var td_year_next = $('<td/>');
      td_caption.text(this._caption())
      td_caption.css("text-align", "center")
        .css("border", "none");
      tr.append(td_year_prev);
      tr.append(td_month_prev);
      tr.append(td_caption);
      tr.append(td_month_next);
      tr.append(td_year_next);
      table.append(tr);
      
      // Event
      var month_forward = function(add) {
          that._add_month(add);
          td_caption.text(that._caption());
          that._update_date_select();
          return false;
      };

      var year_forward = function(add) {
          that.year(that.year() + add);
          td_caption.text(that._caption());
          that._update_date_select();
          return false;
      };

      // Privious year
      var navi_effect = this._navi_effect();
      
      td_year_prev.html('<a href="#">&lt&lt</a>');
      td_year_prev.css("text-align", "left")
        .css("border", "none");
      td_year_prev.children("a").css("text-decoration", "none")
        .hover(navi_effect.into, navi_effect.out)
        .click(function () { return year_forward(-1) });
      
      // Privious month
      td_month_prev.html('<a href="#">&lt</a>');
      td_month_prev.css("text-align", "left")
        .css("border", "none");
      td_month_prev.children("a").css("text-decoration", "none")
        .hover(navi_effect.into, navi_effect.out)
        .click(function () { return month_forward(-1) });
      
      // Next month
      td_month_next.html('<a href="#">&gt</a>');
      td_month_next.css("text-align", "right")
        .css("border", "none");
      td_month_next.children("a").css("text-decoration", "none")
        .hover(navi_effect.into, navi_effect.out)
        .click(function () { return month_forward(1) });
      container.append(table);

      // Next year
      td_year_next.html('<a href="#">&gt&gt</a>');
      td_year_next.css("text-align", "right")
        .css("border", "none");
      td_year_next.children("a").css("text-decoration", "none")
        .hover(navi_effect.into, navi_effect.out)
        .click(function () { return year_forward(1) });
      container.append(table);
      
      // Date selection
      container.append(this._date_select);
      var date_select = this._date_select;
      date_select
        .attr("name", this.name())
        .attr("size", this.size())
        .change(function () { that.change()($(this)) });
      this._update_date_select();
      
      return container;
    };

    proto._day = function (year, month, mday) {
      var days = this.days();
      var date = new Date(year, month - 1, mday);
      var day = days[date.getDay()];
      return day;
    }
    
    proto._format = function (format, year, month, mday) {
      var date = format;
      if (year) {date = date.replace(/%Y/, year) }
      if (month) {
        var fmonth = String(month).length === 1 ? "0" + month : "" + month;
        date = date.replace(/%m/, fmonth);
      }
      if (mday) {
        var fmday = String(mday).length == 1 ? "0" + mday : "" + mday;
        date = date.replace(/%d/, fmday);
        date = date.replace(/%a/, this._day(year, month, mday));
      }
      return date;
    };
    
    proto._option_text = function (mday) {
      return this._format(this.text_format(), this.year(), this.month(), mday);
    };
    
    proto._option_value = function (mday) {
      return this._format(this.value_format(), this.year(), this.month(), mday);
    };
    
    proto.popup = function (args) {
      var popup = $("<div/>");
      popup.css("background-color", "white")
        .css("border", "1px solid #999999")
        .css("position", "absolute")
        .css("left", args.x)
        .css("top", args.y)
        .css("width", "180px");
      popup.append(this._create_component());

      var div_remove_button = $("<div/>");
      div_remove_button.css("text-align", "right");
      var a_remove_button = $('<a href="#">×</a>');
      a_remove_button.css("font-size", "75%")
        .hover(this._navi_effect().into, this._navi_effect().out)
        .click(function () {
          popup.remove();
          return false;
        });
      div_remove_button.append(a_remove_button);
      popup.append(div_remove_button);
      
      return popup;
    };

    proto._update_date_select = function () {
      var date_select = this._date_select;
      
      date_select.empty();
      if (this.empty_item()) { date_select.append('<option value=""/>') }
      var last_mday  = this._last_mday(this.year(), this.month());
      for (var mday = 1; mday <= last_mday; mday++) {
        var date = new Date(this.year(), this.month() - 1, mday);
        var day = this.days()[date.getDay()];
        
        var option = $("<option/>");
        option.val(this._option_value(mday));
        option.text(this._option_text(mday));
        date_select.append(option);
      }
    };
    
  }
)();
