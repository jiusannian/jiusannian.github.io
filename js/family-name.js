/**
 * 
 * @authors Riche
 * @date    2018-02-20 10:39:22
 * @version 1.1.0
 */

new Vue({
    el: "#app",
    data: {
        imgLink: '',
        inputText:'',
        origin:'',
        showName: 0,
        originText: '',
        nameText:'',
        TA:'她',
        rand:{
            distanceNum: 5,
            peopleNum: 8
        }
        
    },
    created: function() {
        var _self = this;
        //var num = parseInt(10*Math.random());
        //_self.imgLink = 'images/surname/' + num + '.jpg';
        $(document).on('change.inputText', '.fillInput', function() {
            _self.inputText = $(this).val();
        });
        $(document).on('click.radioInput', '.radioInput', function() {
            $(this).siblings().removeClass('on');
            _self.TA = $(this).html()==='男' ? '她' : '他';
            $(this).addClass('on');
        });
        //this.startBtn();
        //_self.nameText = '吴';
        //_self.originText = '吴吴吴吴吴';
    },
    methods:{
        startBtn: function(){
            var _self = this;
            alert({
                close: false,
                fillInput: true,
                sexInput: true,
                placeholder:'请输入您的姓氏',
                kind: 2,
                onOk: '确认',
                okEvent: function() {
                    if(!_self.inputText){ 
                        alert('请输入您的姓氏');
                        return;
                    }
                    
                    Common.ajaxCall({ url: "family-name", datatype: 'json', type: 'get'}, function (data) {
                        if(data.error_code==0){
                            console.log(data.data);
                            var count = 0;
                            data.data.forEach(function(index,val){
                                if(index.familyName == _self.inputText){
                                    _self.rand = {
                                        distanceNum: Math.floor(Math.random()*26+5),
                                        peopleNum: Math.floor(Math.random()*99+2)
                                    }
                                    _self.nameText = index.familyName;
                                    _self.originText = index.description;
                                    _self.showName = 1;
                                }else{
                                    count++;
                                }
                            })
                            
                            if(data.data.length == count){
                                _self.showName = 2;
                                console.log('您输入的姓氏我们暂未收录');
                            }
                        }else{
                            alert(data.msg);
                        }
                    });
                }
            });
        },
        reInputBtn:function(){
            this.showName = 0;
            this.inputText = "";
            this.rand = {
                distanceNum: Math.floor(Math.random()*26+5),
                peopleNum: Math.floor(Math.random()*99+2)
            }
        },
        contact:function(){
            this.showName = 3;
        },
        alcoholTest:function(){
            window.location.href = 'alcoholTest.html';
        }
    }
})