// From https://github.com/leolin0704/RollingBorder/
(function(window, $) {
    $.fn.extend({
        rollingBorder: function(_params) {
            var params = {
                padding: 10,
                color: "",
                width: 2,
                length: "50%"
            };
            $.extend(params, _params);

            var $me = $(this);
            var $offsetParent = $me.offsetParent();
            if ($offsetParent.is("html"))
                $offsetParent = $("body");
            var pos = $me.position();
            var div = $("<div class='rolling-border-box'>" +
                "<div class='rolling-border-line-1'></div>" +
                "<div class='rolling-border-line-2'></div>" +
                "<div class='rolling-border-line-3'></div>" +
                "<div class='rolling-border-line-4'></div>" +
                "</div>");

            div.css({
                left: pos.left - params.padding,
                top: pos.top - params.padding,
                width: $me.outerWidth() + params.padding * 2,
                height: $me.outerHeight() + params.padding * 2
            });

            var hLines = div.children(".rolling-border-line-1,.rolling-border-line-3");
            var vLines = div.children(".rolling-border-line-2,.rolling-border-line-4");

            if (params.color) {
                hLines.css("border-color", params.color);
                vLines.css("border-color", params.color);
            }

            if (params.width) {
                hLines.css("border-width", params.width);
                vLines.css("border-width", params.width);
            }

            if (params.length) {
                hLines.css("width", params.length);
                vLines.css("height", params.length);
            }

            div.appendTo($offsetParent);

            this.destroy = function() {
                div.remove();
            }

            return this;
        }
    });



})(window, jQuery);