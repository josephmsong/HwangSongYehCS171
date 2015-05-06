
# coding: utf-8

# In[1]:

from bs4 import BeautifulSoup
import urllib2

url = "http://www.basketball-reference.com/teams/"

soup = BeautifulSoup(urllib2.urlopen(url).read())
table = soup.find_all("table", {"class":"sortable  stats_table"})[0].find_all("a")


teams = []

for link in table:
    teams.append("http://www.basketball-reference.com"+link.get("href")+"stats_per_game.html")
    
print teams


# In[34]:

from selenium import webdriver
import os

season = []
tm = []
win = []
loss = []
age = []
height = []
weight = []
gp = []
minutes = []
fg = []
fga = []
fgperc = []
threep = []
threepa = []
threeperc = []
ft = []
rpg = []
ast = []
stl = []
blk = []
turnovers = []
pf = []
ppg = []

os.environ["SELENIUM_SERVER_JAR"] = "selenium-server-standalone-2.45.0.jar"
driver = webdriver.Safari()

for team in teams:
    print team
    driver.get(team)
    html = driver.page_source
    soup2 = BeautifulSoup(html, 'html.parser')
    table2 = soup2.find_all("div", {"id":"franchise_stats_per_game"})[0].find("table").find_all("tr")[1:]
    table3 = filter(lambda x: len(x("td"))==34, table2)
    for row in table3:
        try:
            tds = row("td")
            if tds[0].text == "1978-79":
                break
            season.append(tds[0].string) # season
            tm.append(team[-23:-20]) # team
            win.append(tds[3].string) # win
            loss.append(tds[4].string) # loss
            age.append(tds[7].string) # age
            height.append(int(tds[8].string[0])*12+int(tds[8].string[-1])) # height
            weight.append(tds[9].string) # weight
            gp.append(tds[11].string) # gp
            minutes.append(tds[12].string) # minutes
            fg.append(tds[13].string) # fg
            fga.append(tds[14].string) # fga
            fgperc.append(tds[15].string) # fg%
            threep.append(tds[16].string) # 3p
            threepa.append(tds[17].string) # 3pa
            threeperc.append(tds[18].string) # 3p%
            ft.append(tds[24].string) # ft
            rpg.append(tds[27].string) # rpg
            ast.append(tds[28].string) # ast
            stl.append(tds[29].string) # stl
            blk.append(tds[30].string) # blk
            turnovers.append(tds[31].string) # turnovers
            pf.append(tds[32].string) # pf
            ppg.append(tds[33].string) # ppg
        except:
            pass

driver.quit()

print len(season)
print len(tm)
print len(win)
print len(loss)
print len(age)
print len(height)
print len(weight)
print len(gp)
print len(minutes)
print len(fg)
print len(fga)
print len(fgperc)
print len(threep)
print len(threepa)
print len(threeperc)
print len(ft)
print len(rpg)
print len(ast)
print len(stl)
print len(blk)
print len(turnovers)
print len(pf)
print len(ppg)


# In[55]:

import pandas as pd

dic = {'season':season, 'team':tm, 'win':win, 'loss':loss, 'age':age, 'height':height, 'weight':weight, 'gp':gp,
       'minutes':minutes, 'fg':fg, 'fga':fga, 'fgperc':fgperc, 'fg3':threep, 'fg3a':threepa, 'fg3perc':threeperc, 'ftperc': ft,
       'rpg': rpg, 'apg': ast, 'spg':stl, 'bpg': blk, 'to':turnovers, 'pf':pf, 'ppg':ppg}

df = pd.DataFrame(dic, index = tm)
df.to_csv("df_final.csv")


# In[36]:

class Team(object):
    name = ""
    years = []
    
class Year(object):
    year = ""
    win = 0
    loss = 0
    age = 0
    height = 0
    weight = 0
    gp = 0
    minutes = 0
    fg = 0
    fga = 0
    fgperc = 0
    fg3 = 0
    fg3a = 0
    fg3perc = 0
    ftperc = 0
    rpg = 0
    apg = 0
    spg = 0
    bpg = 0
    to = 0
    pf = 0
    ppg = 0


# In[135]:

def make_year(year,win,loss,age,height,weight,gp,minutes,fg,fga,fgperc,fg3,fg3a,fg3perc,ftperc,rpg,apg,spg,bpg,to,pf,ppg):
    nyear = Year()
    nyear.year = year
    nyear.win = int(win)
    nyear.loss = int(loss)
    nyear.age = float(age)
    nyear.height = int(height)
    nyear.weight = float(weight)
    nyear.gp = float(gp)
    nyear.minutes = float(minutes)
    nyear.fg = float(fg)
    nyear.fga = float(fga)
    nyear.fgperc = float(fgperc)
    nyear.fg3 = float(fg3)
    nyear.fg3a = float(fg3a)
    nyear.fg3perc = float(fg3perc)
    nyear.ftperc = float(ftperc)
    nyear.rpg = float(rpg)
    nyear.apg = float(apg)
    nyear.spg = float(spg)
    nyear.bpg = float(bpg)
    nyear.to = float(to)
    nyear.pf = float(pf)
    nyear.ppg = float(ppg)
    return nyear.__dict__

def make_team(name):
    new_team = Team()
    new_team.name = name
    new_team.years = []
    data = df.loc[df['team'] == name]
    index = np.where(df['team'] == name)
    for x in index[0]:
        p = data.ix[x-index[0][0],:]
        new_year = make_year(p["season"],p["win"],p["loss"],p["age"],p["height"],p["weight"],p["gp"],p["minutes"],
                             p["fg"],p["fga"],p["fgperc"],p["fg3"],p["fg3a"],p["fg3perc"],p["ftperc"],
                             p["rpg"],p["apg"],p["spg"],p["bpg"],p["to"],p["pf"],p["ppg"])
        new_team.years.append(new_year)
    return new_team


# In[136]:

import numpy as np

objlist = []


for x in range(0,len(df)):
    d = df.ix[x,:]
    team = make_team(d["team"])
    objlist.append(team)

print len(objlist)


# In[137]:

# removing duplicates of objects

namelist = []
finalist = []
for obj in objlist:
    if obj.name not in namelist:
        finalist.append(obj)
        namelist.append(obj.name)

print len(finalist)


# In[138]:

# exporting as JSON

import json

json_string = json.dumps([ob.__dict__ for ob in finalist], indent=4, sort_keys=True)

text_file = open("nbateams.json", "w")
text_file.write(json_string)
text_file.close()

