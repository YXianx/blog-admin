<template>
  <div id="wrap">
    <div class="tags">
      <template v-for="tag in tags">
        <a :href="tag.href" class="tag">{{ tag.tagName }}</a>
      </template>
    </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

type tagsType = { tagName: string, href: string }
const tags: tagsType[] = [
  { tagName: 'Vue初体验', href: '#' },
  { tagName: '凯宝我的超人', href: '#' },
  { tagName: 'TypeScript', href: '#' },
  { tagName: 'Pinia', href: '#' },
  { tagName: '生活瞬间', href: '#' },
  { tagName: '数据结构', href: '#' },
  { tagName: '面试八股文', href: '#' },
  { tagName: 'Element-UI', href: '#' },
  { tagName: 'Echarts', href: '#' },
  { tagName: '咕咕咕', href: '#' },
]

/**
 * 标签云实现
 */
type optionType = { container: HTMLElement, data: HTMLElement[] }
const  _baseAngle = Math.PI /  360,
        R = 130;
let speed = 0.3,
    angleX = speed * _baseAngle,
    angleY = -speed * _baseAngle,
    _focalLength = R * 1.5;

class Initialization {
  options: optionType
  container: HTMLElement
  dataArr: HTMLElement[]
  data: HTMLElement | null = null
  newTags: any[] = []


  constructor(options: optionType) {
    this.options = options;
    this.container = options.container;
    this.dataArr = options.data;
    this.init();
  }

  init(){
    let len = this.dataArr.length;
    let newTags = [];

    for(let i = 0; i < len; i++) {
        var angleA =  Math.acos((2*(i+1) - 1)/len - 1);
        var angleB = angleA * Math.sqrt(len * Math.PI);
        var z = R * Math.cos(angleA);
        var y = R * Math.sin(angleA) * Math.sin(angleB);
        var x = R * Math.sin(angleA) * Math.cos(angleB);
        var color = '#' + Math.floor(Math.random()* 0xffffff).toString(16);
        this.dataArr[i].style.color = color;
        var newtag = new Tag(this.dataArr[i], x, y, z, this.options);
        newtag.move();
        newTags.push(newtag);
        this.animate();
    }
    this.newTags = newTags;
  }



  rotateX() {
    let cos = Math.cos(angleX),
        sin = Math.sin(angleX);
    this.newTags.forEach((tag: Tag) => {
        let y = tag.y * cos - tag.z * sin,
            z = tag.z*cos + tag.y * sin;
        tag.y = y;
        tag.z = z;
    });

  }

  rotateY() {
    let cos = Math.cos(angleY),
        sin = Math.sin(angleY);
    this.newTags.forEach((tag: Tag) => {
        let x = tag.x * cos - tag.z * sin,
            z = tag.z*cos + tag.x * sin;
        tag.x = x;
        tag.z = z;
    });
  }

  animate() {
    var that = this;
    setInterval(() => {
        that.rotateX();
        that.rotateY();
        that.newTags.forEach((tag: Tag)=> {
            tag.move();
        })
    }, 20);
  }
}

class Tag {
  options: optionType
  dataArr: HTMLElement[]
  data: HTMLElement
  x: number = 0
  y: number = 0
  z: number = 0
  constructor(data: HTMLElement, x: number, y: number, z: number, options: optionType) {
    this.options = options;
    this.dataArr = options.data;
    this.data = data;
    this.x = x;
    this.y = y;
    this.z = z;
  }
  move() {
    var len = this.dataArr.length;
    var scale = _focalLength /(_focalLength  - this.z);
    var alpha = (this.z +  R)/(2 * R);
    this.data!.style.left =  this.x + 'px';
    this.data!.style.top =  this.y + 'px';
    this.data!.style.fontSize = 10 * scale + 'px';
    this.data!.style.opacity = alpha + 0.5 + '';
  }
}




onMounted(() => {
  let tags: any = document.getElementsByTagName('a');
  let wrap = document.getElementById('wrap');

  let options: optionType = {
    data: tags,
    container: wrap!
  }
  let tagCloud = new Initialization(options);
  wrap!.addEventListener('mousemove', function(e) {
      angleY = 2 * (e.clientX/ document.body.getBoundingClientRect().width- 0.5) * speed  * _baseAngle;
      angleX = 2 * (e.clientY/ document.body.getBoundingClientRect().height - 0.5) * speed  * _baseAngle;
  })
  for (let i = 0; i < tags.length; i++) {
    tags[i].addEventListener('mouseenter', () => {
      speed = 0.05
    })
    tags[i].addEventListener('mouseleave', () => {
      speed = 0.3
    })
  }
})
</script>

<style lang="less" scoped>
  #wrap{
    width: 100%;
    height: 100%;
    /* 相对定位 */
    .tags {
      position: relative;
      left: 40%;
      top: 45%;
      .tag{
        /* 来处理行内非替换元素的高宽问题的 */
        display: inline-block;
        /* 绝对定位 */
        position: absolute;
        /* 高度跟行高一直文字会垂直居中 */
        height: 50px;
        line-height: 50px;
        font-size: 20px;
        text-decoration: none;
      }
    }
  }
</style>
