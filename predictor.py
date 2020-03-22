from lmfit import Model
from numpy import exp, loadtxt, pi, sqrt
import matplotlib.pyplot as plt
from matplotlib.dates import (DateFormatter, WeekdayLocator, MO)
import pandas as pd
import numpy as np

import sys

country = "France"
province = ""

data = pd.read_csv('train.csv')
data = data[['Date', 'Country/Region',
             'Province/State', 'ConfirmedCases', 'Fatalities']]
data['Date'] = pd.to_datetime(data['Date'])

data = data[data['Date'] > '2020-03-01']

if country != "":
    data = data[data["Country/Region"] == country]
    if province != "":
        data = data[data["Province/State"] == province]

data = data.groupby('Date').sum().reset_index()
data['Deaths'] = data['Fatalities'].diff()
data = data.fillna(0)

x_date = data['Date']
x = np.arange(x_date.size)
x_date_pred = pd.date_range(np.datetime64(
    'today'), periods=30, freq='D')
x_pred = np.arange(x[-1] + 1, x[-1] + 1 + x_date_pred.size)

y_inf = data['ConfirmedCases']
y_death = data['Deaths']


def gaussian(x, amp, cen, wid):
    """1-d gaussian: gaussian(x, amp, cen, wid)"""
    return (amp / (sqrt(2*pi) * wid)) * exp(-(x-cen)**2 / (2*wid**2))


gmodel = Model(gaussian)
result_inf = gmodel.fit(y_inf, x=x, amp=5, cen=5, wid=1)
y_inf_pred = result_inf.eval(x=x_pred)
result_death = gmodel.fit(y_death, x=x, amp=5, cen=5, wid=1)
y_death_pred = result_death.eval(x=x_pred)

# print(result.fit_report())

loc = WeekdayLocator(byweekday=MO)
formatter = DateFormatter('%d-%m')

fig, ax = plt.subplots()

# Plot previous values
plt.plot_date(x_date, y_inf, 'yo')
plt.plot_date(x_date, y_death, 'ro')

# Plot predictions
plt.plot_date(x_date,
              result_inf.best_fit, 'k-', label='inf: best fit')
plt.plot_date(x_date,
              result_death.best_fit, 'r-', label='death: best fit')
plt.plot_date(x_date_pred, y_inf_pred, 'co', label='inf_predictions')
plt.plot_date(x_date_pred, y_death_pred, 'mo', label='death_predictions')
plt.legend(loc='best')

ax.xaxis.set_major_locator(loc)
ax.xaxis.set_major_formatter(formatter)
ax.xaxis.set_tick_params(rotation=30, labelsize=10)

plt.show()
