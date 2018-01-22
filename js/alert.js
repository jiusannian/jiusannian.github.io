/*! Project: alert
 *  Version: 1.0.0
 *  Date: 2016-06-07 04:44:43 PM
 *  Author: Candy
 */
// alert
var flag = 0;
window.alert = function (options) {
    var text, description, fillInput = false, textArea = false, close = true, sureText, cancelText, callback, noCallback, kind, closetime , closeEvent;
    if (typeof (options) == 'object') {
        text = options.text, description = options.description, sureText = options.onOk, cancelText = options.onCancel, callback = options.okEvent, noCallback = options.noEvent, kind = options.kind, closetime = options.closetime, closeCallback = options.closeEvent ;
    } else {
        text = options;
    }
    fillInput = (typeof(options.fillInput) === "undefined" ? false : options.fillInput);
    textArea = (typeof(options.textArea) === "undefined" ? false : options.textArea);
    close = (typeof(options.close) === "undefined" ? true : options.close);
    if (cancelText == "" || cancelText == "undefined" || cancelText == null) {
        cancelText = "取消";
    };
    if (sureText == "" || sureText == "undefined" || sureText == null) {
        sureText = "确定";
    };

    //toast
    var alertFram = document.createElement("DIV");
    alertFram.id = "alertFram";
    strHtml = "<ul>\n";
    strHtml += " <li class=\"fill_tip\">" + text + "</li>\n";
    strHtml += " <li class=\"alert_btn\" style=\"display:none\"><input id=\"okbtn\" type=\"button\" value=\"确定\" onclick=\"doOk()\"/></li>\n";
    strHtml += "</ul>\n";
    //pop
    var popbg = document.createElement("div");
    popbg.setAttribute("className", "pop_bg");
    popbg.setAttribute("class", "pop_bg");
    popbg.style.display = "block";
    var popbox = document.createElement("div");
    popbox.setAttribute("className", "pop_box");
    popbox.setAttribute("class", "pop_box");
    popbox.style.display = "block"
    pop = "<div class=\"clearfix pop_button\">\n";
    pop += " <a id=\"cancelbtn\" class=\"pop_cancel pop_btn j_cancel\" title=\"" + cancelText + "\" onclick=\"doCancle()\">" + cancelText + "</a>\n";
    pop += " <a id=\"okbtn\" class=\"pop_sure pop_btn j_sure\" title=\"" + sureText + "\" onclick=\"doOk(this)\">" + sureText + "</a>\n";
    pop += "</div>\n";
    p = text ? "<p class='pop_text'>" + text + "</p>\n" : "";
    span = description ? "<span class='pop_desc'>" + description +"</span>\n" : "";
    fillInput =  fillInput ? "<input class='fillInput' />\n" : "";
    textArea = textArea ? "<textarea class='textArea'></textarea>\n" : "";
    close = close ? "<i class='close j_closePop'></i>\n" : "";

    //两个按钮
    if (kind == 2) {
        popbox.innerHTML = close + p + span + fillInput + textArea + pop;
        document.body.appendChild(popbox);
        document.body.appendChild(popbg);
        
        doOk = function (obj) {
            if (hasClass(obj,'not')) {
                return;
            }else{
                document.body.removeChild(popbox);
                document.body.removeChild(popbg);
                if (callback != undefined && typeof (callback) == 'function') {
                    callback();
                }  
            }
            
        }
        doCancle = function () {
            document.body.removeChild(popbox);
            document.body.removeChild(popbg);
            if (noCallback != undefined && typeof (noCallback) == 'function') {
                noCallback();
            }
        }
        popbox.focus();
        //alert(2);

    } else if (kind == 1) { //1个按钮
        popbox.innerHTML = close + p + span + fillInput + textArea + pop;
        document.body.appendChild(popbox);
        document.body.appendChild(popbg);
        $(".j_cancel").hide();
        $('.pop_button').addClass('oneBtn');
        doOk = function () {
            document.body.removeChild(popbox);
            document.body.removeChild(popbg);
            if (callback != undefined && typeof (callback) == 'function') {
                callback();
            }
        }
        popbox.focus();
        //alert(1);

    } else if (kind == 0) { //0个按钮
        popbox.innerHTML = close + p + span + fillInput + textArea + pop;
        document.body.appendChild(popbox);
        document.body.appendChild(popbg);
        $(".pop_button").hide();

        // $('.pop_box,.pop_bg').fadeIn("slow");
        // setTimeout("$('.pop_box,.pop_bg').fadeOut(2000).remove();",2000);

        popbox.focus();

        //alert(0);

    } else {
        alertFram.innerHTML = strHtml;
        flag++;
        //console.log(flag);
        if (flag == 1) {
            document.body.appendChild(alertFram);
            setTimeout(function () {
                document.getElementById("okbtn").click();
            }, 2000);
            this.doOk = function () {
                document.body.removeChild(alertFram);
                if (callback != undefined && typeof (callback) == 'function') {
                    callback();
                }
                flag = 0;
            }
        } else {
            return false;
        }
        alertFram.focus();
    }
    if (closetime) {
        setTimeout("$('.pop_box,.pop_bg').fadeOut(2000).remove();",closetime);
    };

    $(document).on('click','.j_closePop',function(){
        if (closeCallback != undefined && typeof (closeCallback) == 'function') {
            closeCallback();
        }
        $('.pop_box,.pop_bg').hide();
    });

    function hasClass(elem, cls){
        cls = cls || '';
        if(cls.replace(/\s/g, '').length == 0) return false;
        return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
    }
}

// alert_tips
function alert_tips (content) {
    var tip = $("<div class='fill_tip'>" + content + "</div>"), s = 0, time = setInterval(times,1000);;
    tip.appendTo($("body"));
    function times (argument) {
        if (s<2) {
            s++;
            tip.fadeIn("slow");
        } else{
            tip.fadeOut(2000);
            clearInterval(times);
        };
    }
}

// 登录弹窗
function alertlogin() {
    var popbg = document.createElement("div");
    popbg.setAttribute("class", "pop_bg");
    popbg.style.display = "block";
    var popbox = document.createElement("div");
    popbox.setAttribute("class", "pop_box");
    popbox.style.display = "block"
    pop = "<div class=\"pop_button\">\n";
    pop += " <a class=\"pop_btn j_cancel\" title=\"取消\" onclick=\"doCancle()\">取消</a>\n"
    pop += " <a class=\"pop_sure pop_btn j_sure\" title=\"确定\" onclick=\"doOk()\">马上登录</a>\n";
    pop += "</div>\n";
    loginP = "<p class='pop_text'>您还未登录哦~</p>\n";

    popbox.innerHTML = loginP + pop;
    document.body.appendChild(popbox);
    document.body.appendChild(popbg);

    this.doOk = function () {
        //popbox.style.display = "none";
        //popbg.style.display = "none";
        sso.Login();
        document.body.removeChild(popbox);
        document.body.removeChild(popbg);
    }
    this.doCancle = function () {
        /*popbox.style.display = "none";
        popbg.style.display = "none";*/
        document.body.removeChild(popbox);
        document.body.removeChild(popbg);
    }
    popbox.focus();
    document.body.onselectstart = function () { return false; };
}
