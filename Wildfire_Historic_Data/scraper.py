from selenium import webdriver
from selenium.webdriver.common.by import By
import json
import time

driver = webdriver.Chrome()

code = [
  { "code": "001", "county": "Alameda" },
  { "code": "003", "county": "Alpine" },
  { "code": "005", "county": "Amador" },
  { "code": "007", "county": "Butte" },
  { "code": "009", "county": "Calaveras" },
  { "code": "011", "county": "Colusa" },
  { "code": "013", "county": "Contra Costa" },
  { "code": "015", "county": "Del Norte" },
  { "code": "017", "county": "El Dorado" },
  { "code": "019", "county": "Fresno" },
  { "code": "021", "county": "Glenn" },
  { "code": "023", "county": "Humboldt" },
  { "code": "025", "county": "Imperial" },
  { "code": "027", "county": "Inyo" },
  { "code": "029", "county": "Kern" },
  { "code": "031", "county": "Kings" },
  { "code": "033", "county": "Lake" },
  { "code": "035", "county": "Lassen" },
  { "code": "037", "county": "Los Angeles" },
  { "code": "039", "county": "Madera" },
  { "code": "041", "county": "Marin" },
  { "code": "043", "county": "Mariposa" },
  { "code": "045", "county": "Mendocino" },
  { "code": "047", "county": "Merced" },
  { "code": "049", "county": "Modoc" },
  { "code": "051", "county": "Mono" },
  { "code": "053", "county": "Monterey" },
  { "code": "055", "county": "Napa" },
  { "code": "057", "county": "Nevada" },
  { "code": "059", "county": "Orange" },
  { "code": "061", "county": "Placer" },
  { "code": "063", "county": "Plumas" },
  { "code": "065", "county": "Riverside" },
  { "code": "067", "county": "Sacramento" },
  { "code": "069", "county": "San Benito" },
  { "code": "071", "county": "San Bernardino" },
  { "code": "073", "county": "San Diego" },
  { "code": "075", "county": "San Francisco" },
  { "code": "077", "county": "San Joaquin" },
  { "code": "079", "county": "San Luis Obispo" },
  { "code": "081", "county": "San Mateo" },
  { "code": "083", "county": "Santa Barbara" },
  { "code": "085", "county": "Santa Clara" },
  { "code": "087", "county": "Santa Cruz" },
  { "code": "089", "county": "Shasta" },
  { "code": "091", "county": "Sierra" },
  { "code": "093", "county": "Siskiyou" },
  { "code": "095", "county": "Solano" },
  { "code": "097", "county": "Sonoma" },
  { "code": "099", "county": "Stanislaus" },
  { "code": "101", "county": "Sutter" },
  { "code": "103", "county": "Tehama" },
  { "code": "105", "county": "Trinity" },
  { "code": "107", "county": "Tulare" },
  { "code": "109", "county": "Tuolumne" },
  { "code": "111", "county": "Ventura" },
  { "code": "113", "county": "Yolo" },
  { "code": "115", "county": "Yuba" }
]



def get_data(driver,code, data):
    county_code = code["code"]
    name = code['county']
    driver.get(f"https://www.ncei.noaa.gov/access/monitoring/climate-at-a-glance/county/time-series/CA-{county_code}/hdd/1/0/2010-2021.json")
    time.sleep(4.5)  
    text = driver.find_element(By.TAG_NAME, "pre").text
    json_text = json.loads(text)
    data[name] = json_text['data']

    

data = dict()


for i in range(len(code)):
    get_data(driver,code[i],data)
    print(code[i]['county'])

with open(f"heating_county.json", "w") as file:
    json.dump(data, file)


driver.quit()




