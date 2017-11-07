<template>
    <div>
    	<ul>
    		<li v-for="i in arr">
    			<a :href="i.url">
    				<img :src="i.coverImgUrl" alt="">
    				<p v-if="i.type==1"><span class="vip" v-if="i.isPay">VIP</span>{{i.name}}</p>
    				<p v-if="i.type==2"><span class="vip" v-if="i.isPay">VIP</span>{{i.company}}</p>
    			</a>
    			<span v-if="i.status == 2" class="s1">直播中</span>
				
    		</li>
    	</ul>
    </div>
</template>

<script>
export default {
  data() {
    return {
      arr: []
    };
  },
  mounted: function() {
    let that = this;
    $.post(
      "http://live.ofweek.com/api/room/listInfoInLive",
      {
        roomId: userLogin.roomId
      },
      function(res) {
        let val = res.data;
        //				$.each(val,function(){
        //					if(this.status == 0)
        //						this.url = 'javascript:alert("展会尚未开始，开始时间为：'+this.startTime+'，期待您的到来");';
        //				});
        that.arr = val;
      },
      "json"
    );
  }
};
</script>

<style scoped="">
div {
  padding: 0 0 1.2rem 0;
  background: #f3f4f8;
  height: 100%;
}
div:after {
  content: "";
  clear: both;
  display: block;
  height: 0;
}
ul {
  height: 100%;
  overflow-y: auto;
  padding-left: 0.24rem;
  padding-top: 0.3rem;
}
li {
  margin-bottom: 0.3rem;
  float: left;
  padding-right: 0.24rem;
  text-align: center;
  width: 50%;
  position: relative;
}
a {
  display: block;
}
p {
  color: #666;
  font-size: 0.28rem;
  line-height: 0.34rem;
  height: 0.68rem;
  background: #fff;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
img {
  max-width: 100%;
  height: 2rem;
}
a + span {
  display: block;
  position: absolute;
  left: -0.06rem;
  top: 0;
  width: 1.2rem;
  height: 0.3rem;
  line-height: 0.3rem;
  text-align: center;
  color: #fff;
  background-size: 100% 100%;
  font-size: 0.24rem;
}
span.s1 {
  background-image: url(../assets/tlt.png);
}
.vip {
  background: #666;
  font-size: 0.24rem;
  color: #fff;
  display: inline-block;
  width: 0.6rem;
  line-height: 0.32rem;
  border-radius: 0.1rem;
  text-align: center;
  margin-right: .05rem;
}
</style>