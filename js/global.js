/**
 * 
 * @authors Candy
 * @date    2016-05-16 16:39:39
 * @version 1.0.0
 */
(function($) {
	var myJS=function(){
		var jdo={
			init:function(){
				// 清空搜索框文本
				$(document).on('click.search','.close:button',function(){
					$(this).siblings(':text').val('');
				});
				// 加减
				$(document).on('click.increase','.addSubt a',function(){
					var operate = $(this).text();
					var much=$(this).siblings(".much"),val = parseInt(much.val());
					if(operate == '+'){
						val += 1;
						val = (val < 0 ? 0:val);
					}
					else{
						val -= 1;
						val = (val < 1 ? 1:val);
					}
					much.val(val);
				});
				$(document).on('change.increase,keypress.increase','.addSubt :text',function(){
					var val = parseInt($(this).val());
					if(val < 0){
						$(this).val(0);
					}
				});
				// 底部弹出层
				$(document).on('click.multi','.j_bpopSelect', function () {
					var that = $(this), value = that.attr('data-val').split(','),
						item, tipTit = that.attr('data-title'), html = '',
						multi = that.attr('data-multi'), selectText = that.text().split(',');
						if(value && value.length > 0){
							html = '<span class="db tipTit">' + tipTit + '</span><ul class="selectPro">';
							for (var i = 0, len = value.length; i < len; i++) {
								item = value[i];
								html += '<li';
								for(var j = 0, selectLen = selectText.length;j < selectLen;j++){
									var selectItem = selectText[j];
									html += (item == selectItem ? ' class="on"' : '');
								}
								html += '>' + item + '</li>';
							}
							html += '</ul>';
							html += '<div class="clearfix pad375">\
												<a href="javascript:void(0);" class="fl selBtn delSel">取消</a>\
												<a href="javascript:void(0);" class="fl selBtn">确定</a>\
											</div>';
							$('<div class="pop_bg">').show().appendTo('body');
							$('<div class="multi-select">').html(html).show().appendTo('body');
							// 按钮
							$(document).off('click.multi', '.multi-select li').on('click.multi', '.multi-select li', function () {
								if (!$(this).hasClass('on')) {
									multi == 1 ? $(this).addClass('on') : $(this).addClass('on').siblings().removeClass('on');
								}
								else {
									$(this).removeClass('on');
								}
							});
							// 按钮
							$(document).off('click.multi', '.multi-select a').on('click.multi', '.multi-select a', function () {
								var values = [];
								if (!$(this).hasClass('delSel')) {
									$('.multi-select li').each(function () {
										$(this).hasClass('on') && values.push($(this).text());
									});
									values && values.length > 0 && that.text(values.join());
								}
								$('.pop_bg').remove();
								$('.multi-select').remove();
							});
							$(this).addClass('colorR').removeClass('color92');
						}else{
							$(this).addClass('color92');
						}
				});
			},
			// 图片比例
			imgScale:function(scaleClass,scaleW,scaleH){
				$(scaleClass).each(function(){
				    var w=$(this).width();
				    var h=scaleH*w/scaleW;
				    $(this).height(h);
				});
			},
			// 字数
			keypress:function(count, obj) {  //textarea输入长度处理
				//判断是否有obj，没有则获取赋值
				if(obj == undefined)	
					obj = document.getElementById('textArea');
					
			    var text = $(obj).val();
				
			    var len = text.length; //记录输入字符串的长度
			    if (text.length >= count) { //textarea控件不能用maxlength属性，就通过这样显示输入字符数了
			    	$(obj).val(text.substr(0, count));
			        len = count;
			    }
			    $(obj).siblings('.fontNum').find('.num').text(len);
			},
			// 预加载
			imgReady:function(url, ready, load, error){//图片预加载
				var list = [], intervalId = null,
				// 用来执行队列
				tick = function () {
					var i = 0;
					for (; i < list.length; i++) {
						list[i].end ? list.splice(i--, 1) : list[i]();
					};
					!list.length && stop();
				},
				// 停止所有定时器队列
				stop = function () {
					clearInterval(intervalId);
					intervalId = null;
				};
				var onready, width, height, newWidth, newHeight,img = new Image();
				img.src = url;
				// 如果图片被缓存，则直接返回缓存数据
				if (img.complete) {
					ready.call(img);
					load && load.call(img);
					return;
				};
		 
				width = img.width;
				height = img.height;
		 
				// 加载错误后的事件
				img.onerror = function () {
					error && error.call(img);
					onready.end = true;
					img = img.onload = img.onerror = null;
				};
		 
				// 图片尺寸就绪
				onready = function () {
					newWidth = img.width;
					newHeight = img.height;
					if (newWidth !== width || newHeight !== height ||
						// 如果图片已经在其他地方加载可使用面积检测
						newWidth * newHeight > 1024
					) {
						ready.call(img);
						onready.end = true;
					};
				};
				onready();
		 
				// 完全加载完毕的事件
				img.onload = function () {
					// onload在定时器时间差范围内可能比onready快
					// 这里进行检查并保证onready优先执行
					!onready.end && onready();
		 
					load && load.call(img);
		 
					// IE gif动画会循环执行onload，置空onload即可
					img = img.onload = img.onerror = null;
				};
		 
				// 加入队列中定期执行
				if (!onready.end) {
					list.push(onready);
					// 无论何时只允许出现一个定时器，减少浏览器性能损耗
					if (intervalId === null) intervalId = setInterval(tick, 40);
				};
			},
			/**/
			ImgCenter:function(itemOjb,errorImg,overflow){//图片相对父容器垂直居中，注:父容器必须为定高定宽的块元素.并保证有text-align:center的天赋属性
				$(itemOjb).each(function(){
					var pannelwidth=$(this).parent().width(),pannelheight=$(this).parent().height(),_w,_h,_this=$(this),url=$(this).attr('data-src'),pad,set;
					if(pannelwidth>pannelheight) set=1;
					else if(pannelwidth<pannelheight) set=2;
					else set=0;
					jdo.imgReady(url,function(){
						switch(set){
							case 1:
								if(this.width>this.height){
									var i=this.width/this.height,
									j=pannelwidth/pannelheight;
									if(i>j){
										_w=pannelwidth;
										_h=this.height*pannelwidth/this.width;
										var p=(pannelheight-_h)/2;
										pad=p+'px 0';
									}else{
										_w=this.width*pannelheight/this.height;
										_h=pannelheight;
										pad='0';
									}
								}else{
									_w=this.width*pannelheight/this.height;
									_h=pannelheight;
									pad='0';
								}
							break;
							case 2:
								if(this.width>this.height){
									_w=pannelwidth;
									_h=this.height*pannelwidth/this.width;
									var p=(pannelheight-_h)/2;
									pad=p+'px 0';
								}else{
									var i=this.height/this.width,
									j=pannelheight/pannelwidth;
									if(i>j){
										_w=this.width*pannelheight/this.height;
										_h=pannelheight;
										pad='0';																	
									}else{
										_w=pannelwidth;
										_h=this.height*pannelwidth/this.width;
										var p=(pannelheight-_h)/2;
										pad=p+'px 0';
									}
								}
							break;
							default:
								if(this.width>this.height){
									_w=pannelwidth;
									_h=this.height*pannelwidth/this.width;
									var p=(pannelheight-_h)/2;
									pad=p+'px 0';
								}else{
									_w=this.width*pannelheight/this.height;
									_h=pannelheight;
									pad='0';
								}		
						}						
					},function(){
						if(_this.hasClass('loading')) _this.removeClass('loading');
						_this.attr('src',url).css({width:_w+'px',height:_h+'px',padding:pad});
					},function(){
						if(_this.hasClass('loading')) _this.removeClass('loading');
						_this.attr('src',errorImg).css({width:pannelwidth+'px',height:pannelheight+'px',padding:'0'});
					});
				});
			},
			ImgFull:function(itemOjb,errorImg,overflow){//图片相对父容器垂直居中，注:父容器必须为定高定宽的块元素.并保证有text-align:center的天赋属性
				$(itemOjb).each(function(){
					var pannelwidth=$(this).parent().width(),pannelheight=$(this).parent().height(),_w,_h,_this=$(this),url=$(this).attr('data-src'),pad,set;
					if(pannelwidth>pannelheight) set=1;
					else if(pannelwidth<pannelheight) set=2;
					else set=0;
					jdo.imgReady(url,function(){
						switch(set){
							case 1:
								if(this.width>this.height){
									var i=this.width/this.height,
									j=pannelwidth/pannelheight;
									if(i>j){
										_h=pannelheight;
										_w=this.width*pannelheight/this.height;
										var p=-(_w-pannelwidth)/2;
										pad='0 '+p+'px';
									}else{
										_h=this.height*pannelwidth/this.width;
										_w=pannelwidth;
										var p=-(_h-pannelheight)/2;
										pad=p+'px 0';
									}
								}else{
									_h=this.height*pannelwidth/this.width;
									_w=pannelwidth;
									var p=-(_h-pannelheight)/2;
									pad=p+'px 0';
								}
							break;
							case 2:
								if(this.width>this.height){
									_h=pannelheight;
									_w=this.width*pannelheight/this.height;
									var p=-(_w-pannelwidth)/2;
									pad='0 '+p+'px';
								}else{
									var i=this.height/this.width,
									j=pannelheight/pannelwidth;
									if(i>j){
										_h=this.height*pannelwidth/this.width;
										_w=pannelwidth;
										var p=-(_w-pannelwidth)/2;
										pad=p+'px 0';																	
									}else{
										_h=pannelheight;
										_w=this.width*pannelheight/this.height;
										var p=-(_w-pannelwidth)/2;
										pad='0 '+p+'px';
									}
								}
							break;
							default:
								if(this.width>this.height){
									_h=pannelwidth;
									_w=this.width*pannelwidth/this.height;
									var p=-(_w-pannelwidth)/2;
									pad='0 '+p+'px';
								}else{
									_h=this.height*pannelwidth/this.width;
									_w=pannelwidth;
									var p=-(_h-pannelwidth)/2;
									pad=p+'px 0';
								}		
						}						
					},function(){
						if(_this.hasClass('loading')) _this.removeClass('loading');
						_this.attr('src',url).css({width:_w+'px',height:_h+'px',margin:pad});
					},function(){
						if(_this.hasClass('loading')) _this.removeClass('loading');
						_this.attr('src',errorImg).css({width:pannelwidth+'px',height:pannelheight+'px',margin:'0'});
					});
				});
			},
			/**
             * 公告板
             * @param $boardBox 装着列表的box
             * @param speed 动画速度
             */
            Board:function ($boardBox, speed) {//公告板效果
                var $list = $boardBox.find(".animate-list");
                var $listHeight = parseInt($list.outerHeight());
                if ($listHeight < parseInt($boardBox.height())) return;
                var $listCopy = $list.clone(false).insertAfter($list);
                var $animateList1 = $list;
                var $animateList2 = $listCopy;
                var marginTop = 0;

                var autoPlayInterval = null;
                var autoPlayStart = function () {
                    if (autoPlayInterval) return false;
                    autoPlayInterval = setInterval(function () {
                        if (marginTop <= -$listHeight) {
                            var temp = $animateList1.remove().clone();
                            temp.css("margin-top", 0).insertAfter($animateList2);
                            marginTop = 0;
                            $animateList1 = $animateList2;
                            $animateList2 = temp;
                        }
                        $animateList1.css("margin-top", --marginTop + "px");
                    }, speed / 10);
                }
                var autoPlayStop = function () {
                    if (autoPlayInterval) {
                        clearInterval(autoPlayInterval);
                        autoPlayInterval = null;
                    }
                }

                $boardBox.mouseenter(function () {
                    autoPlayStop();
                }).mouseleave(function () {
                        autoPlayStart();
                    });

                autoPlayStart();
                return{
                    autoPlayStart:autoPlayStart,
                    autoPlayStop:autoPlayStop
                }
            },
			// tab
			tab:function(){
				$('.tabCont').eq(0).show();
				$('.j_tab').bind('click', function() {
					var index = $('.j_tab').index(this);
					$('.tabCont').eq(tab).show().siblings().hide();
				    $(this).addClass('on').siblings().removeClass('on')
				});
			}
		}
		return jdo;
	}();
	window.myJS=myJS;
})(jQuery)