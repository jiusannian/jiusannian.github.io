/**
 * 
 * @authors Riche
 * @date    2018-02-20 10:39:22
 * @version 1.1.0
 */
var SECOND = 3;//题目倒计时

new Vue({
    el: "#app",
    data: {
        questionList: [],
        answers:'',
        showName: 0,
        count:0,
        score:0,
        second:SECOND,
        intervalTimer: null,
        timeoutTimer: null,
        isMask:[true,true,true]
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
},
    methods:{
        startBtn: function(){
            var _self = this;
            Common.ajaxCall({ url: "alcoholTest", datatype: 'json', type: 'get'}, function (data) {
                if(data.error_code==0){
                    var questionNum = data.data.length;
                    _self.showName = 1;

                    //创建原始数组
                    var arr1 = new Array(questionNum);
                    for(var i=0;i<arr1.length;i++){
                        arr1[i] = i;
                    }
                    console.log(arr1); //原始数组

                    //打乱原始数组
                    for(var i=0;i<arr1.length-1;i++){
                        var random = Math.floor((Math.random()*questionNum-i)+i);
                        var temp;
                        temp = arr1[i];
                        arr1[i] = arr1[random];
                        arr1[random] = temp;
                    }
                    console.log(arr1); //乱序后数组

                    //取乱序后前三个
                    for(var i=0;i<3;i++){
                        _self.questionList.push(data.data[arr1[i]]);
                    }
                    
                    _self.countDown();
                }else{
                    alert(data.msg);
                }
            });
        },
        reInputBtn:function(){
            this.showName = 0;
            this.count = 0;
            this.score = 0;
            this.second = SECOND;
            this.isMask = [true,true,true];
            this.questionList = [];
        },
        backBtn:function(){
            window.history.go(-1);
        },
        selected:function(isRight,answers,index){
            var _self = this;
            //console.log(answers[index].isRight);
            _self.isMask.splice(index, 1, false);
            
            if(isRight){
                this.score++;
            }else{
                answers.forEach(function(val,item){
                    if(val.isRight){
                        _self.isMask.splice(item, 1, false);
                    }
                })
            }
            
            clearInterval(this.intervalTimer);
            this.timeoutTimer = setTimeout(function(){
                clearInterval(_self.timeoutTimer);
                _self.nextQuestion();
            },2000);
            
        },
        countDown:function(){
            var _self = this;
            clearInterval(_self.intervalTimer);
            _self.intervalTimer = setInterval(function(){
                _self.second--;
                if(_self.second===0){
                    _self.nextQuestion();
                }
            },1000);

        },
        nextQuestion:function(){
            var _self = this;
            _self.count++;
            _self.second = SECOND;
            _self.isMask = [true,true,true];

            if(_self.count >= 3){
                _self.getScore();
            }else{
                _self.countDown();
            }
        },
        getScore:function(){
            this.showName = 2;
        }
    }
})