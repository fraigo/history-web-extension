
function historySort(stats){
    var list=Object.values(stats);
    list.sort(function(a,b){
        if (a.count>b.count) return -1;
        if (a.count<b.count) return 1;
        return 0;
    })
    return list;
}

var app = new Vue({
    el: '#app',
    data: {
      title: "",
      items: [],
      stats: [],
      minvisits: 1
    },
    methods:{
        dateFormat:function(time){
            var date=new Date(time);
            var month=(date.getMonth()+1);
            var day=""+(date.getDay());
            if (month<10){
                month="0"+month;
            }
            if (day<10){
                day="0"+day;
            }
            return date.getFullYear()+"-"+month+"-"+day;
        },
        replaceByDefault:function(e){
            e.target.src='./icons/favicon.png'
        }
    },
    computed:{
        filteredList:function(){
            var self=this;
            return this.stats.filter(function(item){
                return item.count>=self.minvisits
            })
        }
    }
  })

function loadHistory(title, startTime, endTime){
    chrome.history.search({
        text: '',
        maxResults: 100000,
        startTime: startTime,
        endTime: endTime
    }, function(rawData) {
        console.log("History items",rawData.length);
        console.log(rawData[0]);
        var items=[];
        var stats={};
        for(var idx in rawData){
            var item=rawData[idx];
            var url=new URL(item.url);
            var time=new Date(item.lastVisitTime);
            var count=item.visitCount;
            if (url.protocol.indexOf("http")==0){
                //console.log(url,time,count);
                items.push({
                    url: url,
                    time: time,
                    count: count
                })
                if (!stats[url.host]){
                    stats[url.host]={
                        host: url.host,
                        count: 0, 
                        last: time
                    };
                }
                stats[url.host].count+=count;
                stats[url.host].last=Math.max(item.lastVisitTime,stats[url.host].last);
            }
        }
    
        app.title=title;
        app.items=items;
        app.stats=historySort(stats);

    });
    
}

var d=new Date();
var startTime=new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0).getTime();
var endTime=d.getTime();
var days=0;

loadHistory("Today", startTime-1000*60*60*24*0,endTime);

function selectRange(range,name){
    loadHistory(name, startTime-1000*60*60*24*range,endTime);
}


document.getElementById("range").addEventListener("change",function(ev){
    var opt=this.options[this.selectedIndex];
    console.log(opt);
    selectRange(this.value,opt.text);
})