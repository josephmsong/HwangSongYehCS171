
# coding: utf-8

# In[66]:

# import necessary libraries
import pandas as pd
import requests
import json

# scrape player names, basic information, and ID from CBS Sports API
url = 'http://api.cbssports.com/fantasy/players/list?version=3.0&SPORT=basketball&response_format=JSON'
r = requests.get(url)
r = json.loads(r.text)['body']['players']

identification = [];
firstname = [];
lastname = [];
photo = [];
position = [];
proteam = [];

for player in r:
    identification.append(player['id'])
    firstname.append(player['firstname'])
    lastname.append(player['lastname'])
    photo.append(player['photo'])
    position.append(player['position'])
    proteam.append(player['pro_team'])

dic = {'firstname': firstname, 'lastname': lastname, 'photo': photo, 'position': position, 'team': proteam}
players = pd.DataFrame(dic, index = identification)
players.index.name = 'id'
players.to_csv("players.csv")


# In[68]:

# import necessary libraries
import pandas as pd
import requests0 as requests
import urllib2
from bs4 import BeautifulSoup
import re

df = pd.read_csv("players.csv")

BASE_URL = "http://http://sports.cbsimg.net//nba/players/playerpage/{0}/{1}-{2}"

number_of_players = sum(1 for row in df['id'])

# all the different statistics scraped
identification = []
identification2 = []
identification3 = []
season = []
season2 = []
gamesplayed = []
minutes = []
fg = []
fga = []
fgperc = []
fg3 = []
fg3a = []
fg3perc = []
ftperc = []
ppg = []
bodysize = []
age = []
currentteam = []
experience = []
reb = []
rpg = []
assist = []
apg = []
steal = []
spg = []
blks = []
bpg = []
to = []

# checking to see if it follows this format
r = re.compile('....-..')
q = re.compile('.....')

for x in range(0, number_of_players):
    url = BASE_URL.format(df['id'][x], df['firstname'][x], df['lastname'][x])
    try:
        soup = BeautifulSoup(urllib2.urlopen(url).read())
        # accounting for Jermaine O'Neal's player page to be a little bit different from everyone else's
        table = soup.find_all("table", {"class":"data"})[4 if x != 507 else 3].find_all("tr")[2:]
        for row in table:
            tds = row("td")
            if r.match(tds[0].string) or q.match(tds[0].string):
                identification.append(df['id'][x])
                season.append(tds[0].string)
                gamesplayed.append(tds[2].string)
                minutes.append(tds[3].string)
                fg.append(tds[4].string)
                fga.append(tds[5].string)
                fgperc.append(tds[6].string)
                fg3.append(tds[7].string)
                fg3a.append(tds[8].string)
                fg3perc.append(tds[9].string)
                ftperc.append(tds[12].string)
                ppg.append(tds[14].string)
        table2 = soup.find_all("div", {"class" : "featureComponent stdPad mBottom10"})
        for row in table2:
            tds = row("dd")
            identification2.append(df['id'][x])
            bodysize.append(tds[0].text)
            age.append(tds[2].text)
            currentteam.append(tds[4].text)
            experience.append(tds[6].text)
        table3 = soup.find_all("table", {"class":"data"})[5 if x !=507 else 4].find_all("tr")[2:]
        for row in table3:
            tds = row("td")
            if r.match(tds[0].string) or q.match(tds[0].string):
                identification3.append(df['id'][x])
                season2.append(tds[0].string)
                reb.append(tds[4].string)
                rpg.append(tds[5].string)
                assist.append(tds[6].string)
                apg.append(tds[7].string)
                steal.append(tds[8].string)
                spg.append(tds[9].string)
                blks.append(tds[10].string)
                bpg.append(tds[11].string)
                to.append(tds[12].string)  
    except:
        pass

number_of_rows = sum(1 for row in season)


# In[69]:

# creating dictionaries out of the arrays
dic = {'id': identification, 'year': season,'gamesplayed': gamesplayed, 'minutes': minutes, 'fg': fg, 'fga':fga, 'fgperc':fgperc, 'fg3': fg3, 'fg3a':fg3a, 'fg3perc': fg3perc, 'ftperc':ftperc, 'ppg':ppg }

dic2 = {'id': identification2, 'bodysize': bodysize, 'age': age, 'currentteam': currentteam, 'experience': experience}

dic3 = {'id': identification3, 'year': season2, 'reb': reb, 'rpg' : rpg, 'assists': assist, 'apg': apg, 'steals': steal, 'spg': spg, 'blocks': blks, 'bpg': bpg, 'turnovers':to}


# separating body size to have individual height and weight stats
bodysize = dic2['bodysize']
weight = []
height = []

for player in bodysize:
    arr = player.split('/')
    weight.append(int(arr[1]))
    h = arr[0].split('-')
    inches = int(h[0])*12+int(h[1])
    height.append(inches)

# creating data frames out of our dictionaries
shooting = pd.DataFrame(dic, index = season)
shooting.index.name = 'year'
shooting.to_csv("shooting.csv")

dic2["weight"] = weight
dic2["height"] = height
info = pd.DataFrame(dic2, index = identification2)
info.index.name = 'id'
playerinfo = pd.merge(df, info)
playerinfo.to_csv("playerinfo.csv")

additional = pd.DataFrame(dic3, index = season2)
additional.index.name = 'year'
additional.to_csv("additional.csv")


# In[81]:

# salary data
df = pd.read_csv("salaries.csv")

names = []
team = []
salary = []

for row in df['Player']:
    names.append(row)
    
for row in df['Tm']:
    team.append(row)
    
for row in df['2014-15']:
    salary.append(row)

salarydic = {'name': names, 'salary': salary}
salaries = pd.DataFrame(salarydic, index = names)

# joining all of our data frames 
df = pd.merge(shooting, additional, how='left', on=['year','id'])
df = pd.merge(df, playerinfo, how='left', on=['id'])
df['name'] = df['firstname'] + " " + df['lastname']
df = df[['year','name','photo','position','team','age','height','weight','experience','gamesplayed','minutes','fg','fga', 'fgperc','fg3','fg3a', 'fg3perc','ftperc', 'ppg','rpg','reb','apg','assists','bpg','blocks','spg','steals','turnovers']]
df = pd.merge (df, salaries, how='left', on=['name'])
df.to_csv("tempo.csv")


# In[1]:

# defining object classes
class Player(object):
    name = ""
    photo = ""
    position = ""
    team = ""
    age = 0
    height = 0
    weight = 0
    experience = 0
    current_salary = 0
    seasons = []
    
class Season(object):
    year = ""
    gamesplayed = 0
    minutes = 0
    fg = 0
    fga = 0
    fgperc = 0.0
    fg3 = 0
    fg3a = 0
    fg3perc = 0.0
    ftperc = 0.0
    ppg = 0.0
    rpg = 0.0
    reb = 0
    apg = 0.0
    assists = 0
    bpg = 0.0
    blocks = 0
    spg = 0.0
    steals = 0
    turnovers = 0


# In[2]:

# function to create a season
def make_season(year,gamesplayed,minutes,fg,fga,fgperc,fg3,fg3a,fg3perc,ftperc,ppg,rpg,reb,apg,assists,bpg,blocks,spg,steals,turnovers):
    season = Season()
    season.year = year
    season.gamesplayed = gamesplayed
    season.minutes = minutes
    season.fg = fg
    season.fga = fga
    season.fgperc = fgperc
    season.fg3 = fg3
    season.fg3a = fg3a
    season.fg3perc = fg3perc
    season.ftperc = ftperc
    season.ppg = ppg
    season.rpg = rpg
    season.reb = reb
    season.apg = apg
    season.assists = assists
    season.bpg = bpg
    season.blocks = blocks
    season.spg = spg
    season.steals = steals
    season.turnovers = turnovers
    return season.__dict__ 
    
# function to create a player object with an array of dictionaries for each season that they play
def make_player_object(name,photo,position,team,age,height,weight,experience,salary):
    player = Player()
    player.name = name
    player.photo = photo
    player.position = position
    player.team = team
    player.age = age
    player.height = height
    player.weight = weight
    player.experience = experience
    player.current_salary = salary
    player.seasons = []
    data = df.loc[df['name'] == name]
    index = np.where(df['name'] == name)
    for x in index[0]:
        p = data.ix[x,:]
        season = make_season(p["year"],p["gamesplayed"],p["minutes"],p["fg"],p["fga"],p["fgperc"],p["fg3"],p["fg3a"],p["fg3perc"],p["ftperc"],p["ppg"],p["rpg"],p["reb"],p["apg"],p["assists"],p["bpg"],p["blocks"],p["spg"],p["steals"],p["turnovers"])
        player.seasons.append(season)
    return player


# In[12]:

# creating player objects

import pandas as pd
import numpy as np

objlist = []

df = pd.read_csv("tempo.csv")

for x in range(0,len(df)):
    d = df.ix[x,:]
    play = make_player_object(d["name"],d["photo"],d["position"],d["team"],d["age"],d["height"],d["weight"],d["experience"],d["salary"])
    objlist.append(play)

print len(objlist)


# In[13]:

# removing duplicates of objects

namelist = []
finalist = []
for obj in objlist:
    if obj.name not in namelist:
        finalist.append(obj)
        namelist.append(obj.name)

print len(finalist)


# In[14]:

# exporting as JSON

import json

json_string = json.dumps([ob.__dict__ for ob in finalist], indent=4, sort_keys=True)

text_file = open("nba.json", "w")
text_file.write(json_string)
text_file.close()


