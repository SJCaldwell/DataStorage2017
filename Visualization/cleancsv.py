#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Thu Nov  2 00:03:40 2017

@author: Mike
"""
import pandas as pd
import numpy as np

#Input should be a 2 column csv file  based on the columns you want to visualize
df=pd.read_csv("/Users/Mike/Desktop/deadlift_total.csv")

df = df.dropna()

df1 = df.take(np.random.permutation(len(df))[:50])

#Saves as new output
df1.to_csv('/Users/Mike/Desktop/try3.csv', index = False)

