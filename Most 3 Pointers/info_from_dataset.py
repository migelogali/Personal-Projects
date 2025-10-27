import pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score
import numpy as np

# Load your CSV
df = pd.read_csv("season_leader_3p_made.csv")

# Prepare data for regression
X = df['Season_End_Year'].values.reshape(-1, 1)
y = df['Most_3PM'].values

# Step 3: Fit linear regression
reg = LinearRegression()
reg.fit(X, y)

# Step 4: Predictions and R^2
y_pred = reg.predict(X)
r2 = r2_score(y, y_pred)

# Step 5: Regression equation
slope = reg.coef_[0]
intercept = reg.intercept_
print(f"Regression equation: Most_3PM = {slope:.2f} * Year + {intercept:.2f}")
print(f"R² value: {r2:.4f}")

# Step 6: Bar graph with regression line
plt.figure(figsize=(14,6))
plt.bar(df['Season_End_Year'], df['Most_3PM'], color='skyblue', label='Season Leader 3P Made')
plt.plot(df['Season_End_Year'], y_pred, color='red', linewidth=2, label='Linear Regression Fit')
plt.xlabel('Season End Year')
plt.ylabel('Most 3P Made')
plt.title('Most 3-Point Field Goals Made by Season Leader (with Regression)')
plt.legend()
plt.grid(axis='y', linestyle='--', alpha=0.7)
plt.show()