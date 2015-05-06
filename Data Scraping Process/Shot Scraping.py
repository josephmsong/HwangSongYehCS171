
# coding: utf-8

# In[6]:

from bs4 import BeautifulSoup
from selenium import webdriver
import os
import urllib2
import pandas as pd
import numpy as np

df = pd.read_csv("tempo.csv")

namelist = []
for name in df['name']:
    if name not in namelist:
        namelist.append(name)
        
print len(namelist)

url = "http://www.basketball-reference.com/players/"

pages = []

soup = BeautifulSoup(urllib2.urlopen(url).read())
table = soup.find_all("div", {"id":"page_content"})[0].find("table").find_all("a")
for link in table:
    if len(link.get("href")) == 11:
        pages.append("http://www.basketball-reference.com"+link.get("href"))

temp = []
letterlinks = []
for page in pages:
    if page not in temp:
        letterlinks.append(page)
        temp.append(page)

players = []
playerlinks = []

os.environ["SELENIUM_SERVER_JAR"] = "selenium-server-standalone-2.45.0.jar"
driver = webdriver.Safari()

for link in letterlinks:
    driver.get(link)
    html = driver.page_source
    soup2 = BeautifulSoup(html, 'html.parser')
    table2 = soup2.find_all("table", {"id":"players"})[0].find_all("a")
    for player in table2:
        if player.text in namelist:
            players.append(player.text)
            playerlinks.append("http://www.basketball-reference.com"+player.get("href"))

driver.quit()

print len(players)
print len(playerlinks)


# In[41]:

import numpy as np

gone = []

haventplayed = ["Jarell Eddie", "Joel Embiid", "Tony Gaffney", "Clint N'Dumba-Capela", "Willie Reed", "Ronald Roberts", "Patric Young"]

for player in namelist:
    if player not in players:
        gone.append(player)
        if player not in haventplayed:
            players.append(player)

gonelinks = ["http://www.basketball-reference.com/players/a/amundlo01.html","http://www.basketball-reference.com/players/d/dedmode01.html",
             "http://www.basketball-reference.com/players/d/drewla02.html","http://www.basketball-reference.com/players/h/hardati02.html",
             "http://www.basketball-reference.com/players/h/hicksjj01.html","http://www.basketball-reference.com/players/m/masonro01.html",
             "http://www.basketball-reference.com/players/m/mcadoja01.html", "http://www.basketball-reference.com/players/m/mccalra01.html",
             "http://www.basketball-reference.com/players/m/mccolcj01.html","http://www.basketball-reference.com/players/m/millspa02.html",
             "http://www.basketball-reference.com/players/m/mbahalu01.html","http://www.basketball-reference.com/players/n/ndiayha01.html",
             "http://www.basketball-reference.com/players/r/ricegl02.html"]

for link in gonelinks:
    playerlinks.append(link)
    
print len(players)
print len(playerlinks)



# In[49]:

shotlinks = []

for link in playerlinks:
    shotlinks.append(link[:-5]+"/shooting/2015/")


# In[70]:

#os.environ["SELENIUM_SERVER_JAR"] = "selenium-server-standalone-2.45.0.jar"
driver = webdriver.Safari()

top = []
left = []
nm = []
made = []

counter = 0

for link in shotlinks:
    driver.get(link)
    html = driver.page_source
    soup3 = BeautifulSoup(html, 'html.parser') 
    try:
        table3 = soup3.find_all("div",{"id":"shot-area"})[0].find_all("div")
        print counter
        counter = counter+1
        for div in table3:
            arr = div['style'].split(";")
            top.append(arr[1][4:-2])
            left.append(arr[2][5:-2])
            nm.append(link)
            made.append(div.string)
    except:
        pass

print len(top)
print len(left)
print len(nm)

driver.quit()



# In[109]:

import pandas as pd
import numpy as np

temp = {"name": players, "link": shotlinks}

temp = pd.DataFrame(temp)

final_names = []

for n in nm:
    index = np.where(temp['link']==n)
    final_names.append(temp['name'][index[0]])

print len(final_names)


# In[167]:

dic = {"top": top, "left": left, "name": final_names, "made": made}

final_df = pd.DataFrame(dic)

make = final_df['made'][0]
miss = final_df['made'][1]

print make
print miss

temp = []

for x in range(0, len(final_df['made'])):
    if final_df['made'][x] == make:
        temp.append(1)
    if final_df['made'][x] == miss:
        temp.append(0)
    final_df['name'][x] = final_df['name'][x][final_df['name'][x].index.tolist()[0]]
        
final_df['made'] = temp
print type(final_df['made'][0])
print final_df['name'][0]
    
final_df.to_csv("shotchart.csv", index = False)


# In[3]:

class Player(object):
    name = ""
    shots = []
    
class Shot(object):
    left = 0
    top = 0
    made = 0


# In[4]:

def make_player(name):
    person = Player()
    person.name = name
    person.shots = []
    data = final_df.loc[final_df['name'] == name]
    index = np.where(final_df['name'] == name)
    for x in index[0]:
        p = data.ix[x,:]
        shot = make_shot(p['left'],p['top'],p['made'])
        person.shots.append(shot)
    return person
    
def make_shot(left,top,made):
    shot = Shot()
    shot.left = left
    shot.top = top
    shot.made = made
    return shot.__dict__


# In[22]:

import pandas as pd

final_df = pd.read_csv("shotchart.csv")

import numpy as np

objlist = []
counter = 0

check = []

for x in range(0,len(final_df)):
    d = final_df.ix[x,:]
    if d["name"] not in check:
        check.append(d["name"])
        ply = make_player(d["name"])
        objlist.append(ply)
    if counter%5000 == 0:
        print counter
    counter=counter+1

print len(objlist)


# In[23]:

import json

json_string = json.dumps([ob.__dict__ for ob in objlist], indent=4, sort_keys=True)

text_file = open("shotchart.json", "w")
text_file.write(json_string)
text_file.close()


# In[ ]:



