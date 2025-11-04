import pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
# how well the regression fits the data
from sklearn.metrics import r2_score
import numpy as np

# Load csv
df = pd.read_csv("season_leader_3p_made.csv")

# Prepare data for regression by converting columns to numpy array
# 1 row of x values, figure out number of columns automatically
x = df['Season_End_Year'].values.reshape(-1, 1)
y = df['Most_3PM'].values

# Line of best fit (automatically calculates slope and y-int)
reg = LinearRegression()
reg.fit(x, y)

# Predictions of top 3 pointers each year and R^2 value
y_pred = reg.predict(x)
r2 = r2_score(y, y_pred)

# Regression equation
# take the first coefficient for slope
slope = reg.coef_[0]
intercept = reg.intercept_
print(f"Regression equation: Most_3PM = {slope:.2f} * Year + {intercept:.2f}")
print(f"R² value: {r2:.4f}")

# Bar graph with regression line
plt.figure(figsize=(14,6))
plt.bar(df['Season_End_Year'], df['Most_3PM'], color='skyblue', label='Season Leader 3P Made')
plt.plot(df['Season_End_Year'], y_pred, color='red', linewidth=2, label='Linear Regression Fit')
plt.xlabel('Season End Year')
plt.ylabel('Most 3P Made')
plt.title('Most 3-Point Field Goals Made by Season Leader (with Regression)')
plt.legend()
plt.grid(axis='y', linestyle='--', alpha=0.7)
plt.show()
