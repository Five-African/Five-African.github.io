# Five-African.github.io
## 实现功能
* 1.音乐播放器(仿网易UI)
![](https://github.com/Five-African/Five-African.github.io/raw/master/pic/player.png)
* 2.成员简介
![](https://github.com/Five-African/Five-African.github.io/raw/master/pic/intro.png)

-------
## 文件结构
* index.html
* members.json
* audio
	* 成员展示音乐 
* content
	* 成员简介页面
* css
	* container.css
	* 成员简介页面css
* js
	* firebase.js
	* audiocontrol.js
	* jquery-1.10.2.min.js

-------
## members.json格式
* Array[object]
	* membername:成员昵称,展示页面id
	* soundsrc:歌曲地址
	* soundtitle:歌曲名称
	* soundartist:歌曲歌手名
	* soundtime:歌曲时长(仅用于在播放列表中显示)(暂)
	* memberintro:成员介绍页面
