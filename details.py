import numpy as np
import pandas as pd

import json
from json import JSONEncoder


class NumpyArrayEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return JSONEncoder.default(self, obj)


data = pd.read_csv('covid-19.csv')
data = data[['Date', 'Country/Region', 'Province/State']]
data = data.fillna('')

countries = data['Country/Region'].unique()

response = {}
for country in countries:
    data_country = data[data['Country/Region'] == country]
    provinces = data_country['Province/State'].unique()
    response[country] = []
    if provinces.size > 1:
        response[country] = provinces

print(json.dumps(response, cls=NumpyArrayEncoder))
