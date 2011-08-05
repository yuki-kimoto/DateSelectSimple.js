use Mojolicious::Lite;
use utf8;

get '/' => 'index';

app->start;

__DATA__

@@ index.html.ep
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>DateSelectSimple.js Example1</title>
    
    %= javascript '/js/jquery.js'
    %= javascript '/js/DateSelectSimple.js';
    
    <%= javascript begin %>
      $(document).ready(function () {
        
        // Simple
        var dss1 = DateSelectSimple.create();
        $("#date_select1").append(dss1.component());
        
        // Customize1
        var dss2 = DateSelectSimple.create({
          size: 5, name: "due_date", year: 2008, month: 12});
        $("#date_select2").append(dss2.component());
        
        // Customize2
        var dss3 = DateSelectSimple.create({size: 5, empty_item: true});
        $("#date_select3").append(dss3.component());

        // Customize3
        var dss4 = DateSelectSimple.create({
          caption_format: "%Y/%m",
          text_format: "%Y/%m/%d(%a)",
          value_format: "%Y/%m/%d",
          year: "2009",
          month: "12"
        });
        $("#date_select4").append(dss4.component());

        // Japanese
        var dss_jp = DateSelectSimple.create({
          days: ["日", "月", "火", "水", "木", "金", "土"],
          caption_format: "%Y月%m日",
          text_format: "%Y/%m/%d(%a)",
          value_format: "%Y/%m/%d"
        });
        $("#date_select_jp").append(dss_jp.component());

        // Change callback
        var dss_cb = DateSelectSimple.create({size: 5});
        dss_cb.change(function (select) {
          var selected = select.children(":selected");
          alert(selected.val());
        });
        $("#date_select_cb").append(dss_cb.component());

        // Popup
        var dss_popup = DateSelectSimple.create();
        var popup = $("<div/>");
        popup.css("width", "180px")
          .css("position", "absolute")
          .css("border", "1px black solid")
          .css("background-color", "white");
        dss_popup.change(function (select) {
          var selected = select.children(":selected");
          $('input[name="date_input"]').val(selected.val());
          popup.hide();
        });
        var popup_exists;
        $('input[name="date_button"]').click(function (event) {
          if (!popup_exists) {
            $(this).parent().append(popup);
            popup_exists = true;
          }
          popup.css("left", event.pageX)
            .css("top", event.pageY)
            .show();
        });
        popup.append(dss_popup.component());
      });
    <% end %>
    
  </head>
  <body>
    <h3>Simple</h3>
    <p>default setting</p>
    <div id="date_select1"></div>

    <h3>Castamize1</h3>
    <p>Set select field size and name, and default year and month</p>
    <div id="date_select2"></div>

    <h3>Castamize2</h3>
    <p>Added empty_item</p>
    <div id="date_select3"></div>

    <h3>Castamize3</h3>
    <p>Change date format</p>
    <div id="date_select4"></div>

    <h3>Japanese</h3>
    <p>Change date format</p>
    <div id="date_select_jp"></div>

    <h3>Callback</h3>
    <p>Register item change callback</p>
    <div id="date_select_cb"></div>

    <h3>Popup</h3>
    <p>Popup date selection</p>
    <div><input name="date_input"><input type="button" name="date_button"value="..."></div>
    
    <br>
    <br>
    <br>
    
  </body>
</html>
