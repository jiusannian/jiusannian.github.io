var PAGESIZE = 10; //每次页面加载数量

(function($) {
    var Common = function() {
        var common = {
            url: 'http://120.76.78.245/default/@zopen.lbapi:',

            getRadioBoxValue: function(name) { //获取指定name的单选框
                return $(':radio[name=' + name + ']:checked').val()
            },
            setRadioBoxValue: function(name, value) { //设置单选框
                value = value == null ? "" : value;
                name = name || "";
                var rodio = null;
                $("input[name=" + name + "]").each(function() {
                    $(this).removeAttr('checked');
                    if (value == $(this).attr('value')) {
                        rodio = $(this);
                    }
                });
                rodio.click();
            },
            getCheckBoxValue: function(name) { //获取指定name的选择框值集，用,隔开
                var value = [];
                $(":checkbox[name='" + name + "']").each(function() {
                    if ($(this).is(":checked")) {
                        value.push($(this).attr('value'));
                        value.push(',');
                    }
                });
                return value.join('');
            },
            setCheckBoxValue: function(name, value) { //设置选择框
                value = value == null ? "" : value;
                name = name || "";
                var values = value.split(',');
                $("input[name=" + name + "]").each(function() {
                    if (values.indexOf($(this).attr('value')) != -1) {
                        if ($(this).is(":checked")) {} else {
                            $(this).click();
                        }
                        $(this).prop('checked', 'checked');
                    } else {
                        if ($(this).is(":checked")) {
                            $(this).click();
                        }
                        $(this).removeAttr('checked');

                    }
                });
            },
            jumpUrl: function(url) {
                location.href = url;
            },
            pager: function(pageIndex, pageSize, totalCount, functionName, divPage) {
                //functionName = functionName | "applist";
                if (pageIndex) {
                    var html = [];
                    var array = [];
                    var showCount = 5;
                    var pageCount = parseInt(totalCount / pageSize);
                    if (totalCount % pageSize > 0) {
                        pageCount++;
                    }
                    array = common.pageArray(pageIndex, pageCount, showCount);
                    html.push('共 ' + totalCount + '条记录<div class="am-fr"><ul class="am-pagination">');
                    if (pageIndex == 1) {
                        html.push('<li class="am-disabled"><a href="#">«</a></li>');
                    } else {
                        html.push('<li><a href="javascript:void(0)" onclick="' + functionName + '(' + (pageIndex - 1) + ')">«</a></li>');
                    }
                    $.each(array, function() {
                        if (this == pageIndex) {
                            html.push('<li class="am-active"><a href="javascript:void(0)">' + this + '</a></li>');
                        } else {
                            html.push('<li><a href="javascript:void(0)" onclick="' + functionName + '(' + this + ')">' + this + '</a></li>');
                        }
                    });
                    if (pageIndex == pageCount) {
                        html.push('<li class="am-disabled"><a href="javascript:void(0)">»</a></li>');
                    } else {
                        html.push('<li><a href="javascript:void(0)" onclick="' + functionName + '(' + (pageIndex + 1) + ')">»</a></li>');
                    }
                    html.push('</ul></div>');

                    if (divPage) {
                        $("#" + divPage).html(html.join(''));
                    }
                    return html.join('');
                } else {
                    if (divPage) {
                        $("#" + divPage).html("暂无记录");
                    }
                    return "暂无记录";
                }
            },
            pageArray: function(pageIndex, totalCount, showCount) { //pageIndex第几页；totalCount:总页数；showCount：前后各显示记录数
                var result = [];
                for (var i = 1; i <= totalCount; i++) {
                    if (i == 2 && pageIndex - showCount > 1) {
                        i = pageIndex - showCount;
                    } else if (i == pageIndex + showCount && pageIndex + showCount < totalCount) {
                        i = totalCount - 1;
                    } else {
                        result.push(i);
                    }
                }
                return result;
            },
            //对内容进行编码
            getEncodeURI: function(content) {

                content = encodeURI(content); //已把%号转为%25

                content = content.replace(/\+/g, "%2B");
                content = content.replace(/\ /g, "%20");
                content = content.replace(/\//g, "%2F");

                content = content.replace(/\#/g, "%23");
                content = content.replace(/\&/g, "%26");
                content = content.replace(/\=/g, "%3D");
                content = content.replace(/\?/g, "%3F");
                return content;
            },
            inputTextByHtml: function(content) {
                content = content.replace(/\&/g, "&amp;");
                content = content.replace(/\'/g, "&apos;");
                content = content.replace(/\"/g, "&quot;");
                content = content.replace(/\</g, "&lt;");
                return content;
            },
            jsonToHtml: function(data) {
                return common.jsonEncodeInOut(data, common.inputTextByHtml);
            },
            jsonEncode: function(data) {
                return common.jsonEncodeInOut(data, common.getEncodeURI);
            },
            jsonEncodeInOut: function(data, process) {
                if (typeof(data) == "string") { //字符串
                    data = process(data);
                } else {
                    if (data && data.length) { //表示数组
                        $.each(data, function(i, item) {
                            item = common.jsonEncodeInOut(item, process);
                        })
                    } else { //对象
                        if (typeof(data) == "object") {
                            for (var key in data) {
                                data[key] = common.jsonEncodeInOut(data[key], process);
                            }
                        }
                    }
                }
                return data;
            },
            ajaxCall: function(ajaxdata, callback) { //ajax调用{url,datatype,type,data}
                if(window.location.hostname.indexOf('120.76.78.245')>-1){
                    var url = 'http://120.76.78.245/default/@zopen.lbapi:' + ajaxdata.url;
                }else{
                    var url = '/json/'+ajaxdata.url+'.js';   //测试本地数据
                }
                
                type = 'post';

                if (ajaxdata.type && ajaxdata.type.length > 0) {
                    type = ajaxdata.type;
                }
                var data = {};
                if (ajaxdata.data && typeof(ajaxdata.data) != 'undefined') {
                    data = ajaxdata.data;
                }

                $.ajax({
                    url: url,
                    cache: false,
                    dataType: ajaxdata.datatype,
                    type: type,
                    data: data,
                    timeout: 30000,
                    success: function(data) {
                        try {
                            callback(data);
                        } catch (e) {
                            alert(e);
                        }
                    },
                    error: function(error) {
                        //alert('请求服务器超时，请重试！谢谢');
                        console.log('请求服务器超时，请重试！谢谢');
                    }
                });
            },
            ajaxSubmit: function(ajaxdata, callback) { //ajax调用{url,datatype,type,data}
                var url = this.url + ajaxdata.url,
                    type = 'get';
                if (ajaxdata.type && ajaxdata.type.length > 0) {
                    type = ajaxdata.type;
                }
                var data = {};
                if (ajaxdata.data && typeof(ajaxdata.data) != 'undefined') {
                    data = ajaxdata.data;
                }
                //var url = '/json/'+ajaxdata.url+'.js';   //测试本地数据
                $(ajaxdata.target).ajaxSubmit({
                    type: type,
                    data: data,
                    url: url,
                    dataType: 'json',
                    success: function(data) {
                        try {
                            callback(data);
                        } catch (e) {
                            alert(e);
                        }
                    },
                    error: function(XmlHttpRequest, textStatus, errorThrown) {
                        console.log('请求服务器超时，请重试！谢谢');
                    }
                });
            },
            ajaxSubmitPic: function(ajaxdata, callback) { //ajax调用{url,datatype,type,data}
                var url = this.url + ajaxdata.url + "?__disable_frs4wsgi=1";
                var data = {};
                if (ajaxdata.data && typeof(ajaxdata.data) != 'undefined') {
                    data = ajaxdata.data;
                }
                $.ajax({
                    url: url,
                    type: 'POST',
                    contentType: false,
                    processData: false,
                    data: data,
                    success: function(data) {
                        try {
                            callback(JSON.parse(data));
                        } catch (e) {
                            alert(e);
                        }
                    },
                    error: function(XmlHttpRequest, textStatus, errorThrown) {
                        console.log('请求服务器超时，请重试！谢谢');
                    }
                });
            },
            /*
            *  修改补全图片地址
            *  isdoc是文档类型下才有值true
            */
            wordIcon: function(value,isdoc) {
                if (isdoc) {
                    if (!!value) { //将类型标识转化为大写
                        value = value.toUpperCase();
                    }
                    return "images/icon/type/" + value + ".png";
                }else{
                    var firstImg  = this.getFirstImg(value);
                    if(firstImg && firstImg.length>0){
                        return firstImg;
                    }else{
                        return "images/icon/viewIcon.png";
                    }
                    
                }
                
            },
            getFirstImg: function(value) { //取内容中的图片信息
                if (value && typeof(value) === 'string') {
                    var regx = /<img[^>]*src[=\'\"\s]+([^\"\']*)[\"\']?[^>]*>/gm;
                    var images = regx.exec(value);
                    
                    return images ? images[1] : images;
                }
                return [];
            }
        };
        return common;
    }();
    window.Common = Common;
})(jQuery);

$.extend({
    getUrlVars: function() {
        var vars = [],
            hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    },
    getUrlVar: function(name) {
        return $.getUrlVars()[name];
    },
    getCookie: function(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    },
    setCookie: function(name, value, time) {
        document.cookie = name + "=" + escape(value) + ";"
    },
    delCookie: function(name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = getCookie(name);
        if (cval != null)
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    },
    getsec: function(str) {
        var str1 = str.substring(1, str.length) * 1;
        var str2 = str.substring(0, 1);
        if (str2 == "s") {
            return str1 * 1000;
        } else if (str2 == "h") {
            return str1 * 60 * 60 * 1000;
        } else if (str2 == "d") {
            return str1 * 24 * 60 * 60 * 1000;
        }
    },
});

function search(url) {
    if (jQuery.trim($("#searchword").val()) == "") {
        alert("请输入关键字");
    } else {
        $("#header2,.cateBoxBg").hide();
        $("#header1").show();

        var strKeyword = $("#searchword").val();
        $("#searchword").val('');
        window.location = url + "?s=" + encodeURIComponent(strKeyword);
    }
}

//获取上传图片所用的accessToken
function getaccessToken(callback) {
    //先从cookie取，如果没有或过期，那么就再重新获取
    var expire = $.getCookie('expire');
    var expiretime = $.getCookie('expiretime');
    var accessToken = $.getCookie('accessToken');
    var getaccessToken = true;
    //判断是否是过期了
    if (expire && expiretime) {
        var nowtime = new Date().getTime();
        //有效时间内
        if (parseInt(expire) > (nowtime - parseInt(expiretime)) / 1000) {
            getaccessToken = false;
        }
    }
    //获取新的accessToken
    if (getaccessToken) {
        //var uid = "user.admin";
        //再由个人信息获取accessToken
        Common.ajaxCall({
            url: "get_access_token",
            datatype: 'json',
            type: 'get',
        }, function(data) {
            if (data.error_code == 0) {
                accessToken = data.data[0].accessToken;
                expire = data.data[0].expire;
                $.setCookie('expire', expire);
                $.setCookie('accessToken', accessToken);
                $.setCookie('expiretime', new Date().getTime());
            }
            if (callback && typeof(callback) === "function") {
                callback(accessToken);
            }
        });
    } else {
        if (callback && typeof(callback) === "function") {
            callback(accessToken);
        }
    }
};

//取内容中的图片信息
function getimages(value) {
    if (value && typeof(value) === 'string') {
        var images = [];
        var regx = /<img.*?src=*?[\s\S]*?>/gm
        var matchs = regx.exec(value);
        while (matchs) {
            var src = matchs[0];
            images.push(src);
            matchs = regx.exec(value);
        }
        return images;
    }
    return [];
}

//初始化过滤器
Vue.filter('decodeURIComponent', function(value) {
    return decodeURIComponent(value);
});

Vue.filter('path', function(value) {
    /*var pngArr = ['doc','pptx'];  //有多少个图标写多少个
    if(pngArr.indexOf(value) === -1){
        return "images/icon/type/OTHER.png";
    }else{
        return "images/icon/type/"+value+".png";
    }*/
    if (!!value) { //将类型标识转化为大写
        value = value.toUpperCase();
    }
    return "images/icon/type/" + value + ".png";

});

Vue.filter('sharePic', function(value) {
    if (!!value) {
        value = value;
    }else{
        value = "images/icon/tips.png";
    }
    return value;

});

Vue.filter('href', function(value, id) {
    var page;
    switch (value) {
        case 1: //问题评论
            page = 'askDetail';
            break;
        case 2: //问题回复
            page = 'chatView';
            break;
        case 3: //文档评论
            page = 'articleDetail';
            break;
        case 4: //文档回复
            page = '';
            break;
        case 5: //话题评论
            page = 'circleDetail';
            break;
        case 6: //话题回复
            page = '';
            break;
        case 7: //圈子
            page = 'circleList';
            break;
        case 8: //活动
            page = '';
            break;
    }
    if (page.length > 0) {
        return page + ".html?id=" + id;

    } else {
        return "javascript:void(0);";
    }
});

//过滤HTML标签
Vue.filter('delhtml', function(value) {
    if (value && typeof(value) === 'string') {
        var reg = /<[^<>]+>/g;
        value = value.replace(reg, '');
    }
    return value;
});

//过滤掉内容中的图片
Vue.filter('delimages', function(value) {
    var images = getimages(value);
    if (images && images.length > 0) {
        images.forEach(function(v) {
            value = value.replace(v, "");
        });
    }
    return value;
});

//从内容中过滤出图片组信息
Vue.filter('images', function(value, count) {
    var images = getimages(value);
    if (count && typeof(count) === 'number' && images.length > count) {
        images = images.slice(0, count);
    }
    return images;
});

//从内容中过滤出图片组信息
Vue.filter('imageurls', function(value, count) {
    var images = getimages(value);
    if (images && images.length > 0) {
        var rimages = [];
        images.forEach(function(v) {
            var url = /src=\"[^\"]*?\"/gm
            var src = url.exec(v);
            if (src) {
                var srcurl = src[0].replace("src=\"", "").replace("\"", "");
                rimages.push(srcurl);
            }
        });

        if (count && typeof(count) === 'number' && rimages.length > count) {
            rimages = rimages.slice(0, count);
        }

        return rimages;
    }
    return [];
});

//购物车数量加减
Vue.filter('countNum',{
  read: function(val) {
    return val
  },
  write: function(val, oldVal) {
    // value=value.replace(/[^0-9]+/,'');
    // return value;
    var number = +val.replace(/[^\d.]/g, '')
    return isNaN(number) ? 1 : parseInt(number)
  }
    
});

//分享组件
Vue.component('share', {
    template: '#share-template',
    props: {
        show: {
            type: Boolean,
            replace: true,
            required: true,
            twoWay: true
        },
        users: [],
        userList: '',
        query: ''
    },
    created: function() {

    },
    compiled: function() {
        var _self = this;
        _self.loadlist('');
    },
    methods: {
        checked: function(event) {
            //选择
            if ($(event.currentTarget).hasClass('on')) {
                $(event.currentTarget).removeClass('on');
            } else {
                $(event.currentTarget).addClass('on');
            }
        },
        cancel: function() {
            var _self = this;
            _self.$parent.showModal = false;
        },
        ok: function() {
            //确定
            var _self = this;
            var arr = [];
            $('#uluser li.on').each(function() {
                arr.push($(this).attr('dataid'));
            });
            _self.userList = arr.join(',');
            _self.$parent.showModal = false;
            $('#uluser li').removeClass("on");
            _self.query = '';
            _self.$parent.shareReg(_self.userList);
            //_self.$dispatch('share-list',_self.userList);

        },
        search: function() {
            //搜索
            /*var val = $("#searchwordShare").val();
            if(val=="") return;
            var _self = this;
            _self.loadlist(val);*/
        },
        loadlist: function(uname) {
            //列表
            var _self = this;
            var udata = {
                uname: uname
            };
            udata = Common.jsonEncode(udata);
            Common.ajaxCall({
                url: 'look_getShareUsers',
                datatype: 'json',
                type: 'get',
                data: udata
            }, function(data) {
                if (data.error_code == 0) {
                    var obj = data.data;
                    _self.users = obj;
                } else {
                    alert(data.msg);
                }
            });
        }
    }
});

Vue.component('back', {
    template: '<a href="javascript:void(0);" title="返回" class="icon back" @click="back(toback);"></a>',
    props: ['toback'],
    methods: {
        back: function(toback) {
            //添加返回的标志
            $.setCookie('backoperation', toback && toback === 'true' ? 'backoperation' : "");

            var _self = this,
                back;

            back = $.getUrlVar('back');

            if (!back) {
                if (history.length > 0) { //是否有历史记录，有则返回上一页，没有则返回主页;
                    history.back(-1);
                } else {
                    back = 'index.html';
                }
            }

            location.href = decodeURIComponent(back);
        }
    }
});

//登出
Vue.component('logout', {
    template: '<li><a href="javascript:void(0);" class="db sideDate szIcon" @click="logout(username);">退出</a></li>',
    props: ['username'],
    methods: {
        logout: function(username) {
            //调用相关的登出接口
            var explorer = navigator.userAgent.toLowerCase();
            if (explorer.indexOf ("iphone")>-1) {
                location.href = "exit.html";
            } else {
                console.log("logout(" + username + ")");
                $RP.logout(username);
            }
        }
    }
});
