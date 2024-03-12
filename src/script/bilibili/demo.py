# 爬取B站的视频 Bilibili
# B站的视频地址是直接存储在源网页中的，因此只需要从源网页中解析即可

import requests
import json
import re
from pprint import pprint

import os

# 选择一个视频 ，只需要前半部分就可以啦
url=r'https://www.bilibili.com/video/BV1Tz421X7EX/'

# 设置请求头
header={
    "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.2088.76",
    "Referer":"https://www.bilibili.com/", #设置防盗链
}

resp=requests.get(url=url,headers=header)
# print(resp.text) #成功获取

# 这个baseUrl就是视频的地址

obj=re.compile(r'window.__playinfo__=(.*?)</script>',re.S)
html_data=obj.findall(resp.text)[0] #从列表转换为字符串
# print(html_data)
# 转化为字典的形式
json_data=json.loads(html_data)
# 格式化输出
# pprint(json_data)
# video 和 audio分别是视频和音频 因此爬取下来以后，还需要将两个合并

videos=json_data['data']['dash']['video']  #这里得到的是一个列表
# 只需要baseUrl即可
# print(videos)
video_url=videos[0]['baseUrl'] #视频地址

# 同理，音频地址为

audios=json_data['data']['dash']['audio']
audio_url=audios[0]['baseUrl']

resp1=requests.get(url='https://cn-jlcc-cu-03-05.bilivideo.com/upgcxcode/02/85/1449708502/1449708502-1-100047.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1710256867&gen=playurlv2&os=bcache&oi=1929102422&trid=00001d39fdf4659943fe946bbec409ed3673u&mid=0&platform=pc&upsig=52cc3f1906acec1b2aab76bf4e235316&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&cdnid=3274&bvc=vod&nettype=0&orderid=0,3&buvid=&build=0&f=u_0_0&agrr=0&bw=53931&logo=80000000',headers=header)

with open('test.mp4',mode='wb') as f:
    f.write(resp1.content)

resp2=requests.get(url=audio_url,headers=header)

with open('test.mp3',mode='wb') as f:
    f.write(resp2.content)

# print("爬取完成")
# 现在需要将视频和音频合并 需要模块ffmpeg 可以在网上看教程

# command=r'ffmpeg -i test.mp4 -i test.mp3 -acodec copy -vcodec copy testout.mp4'

# os.system(command=command)

# 做到这一步即成功了！！！！

