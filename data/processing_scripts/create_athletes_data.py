#Author: Shane Caldwell
#Goal: Run through openpowerlifting.csv and pull out IDs, names, and genders for all lifters in the openpowerlifting.csv data set

import csv
num_athletes = 1
athletes = {} # will hold athletes info
with open("../raw/openpowerlifting.csv") as rawfile:
	reader = csv.reader(rawfile, delimiter = ',')
	next(reader) #skip header row
	for row in reader:
		if row[1] in athletes:
			pass	
		else:
			athletes[row[1]] = [str(num_athletes),row[1],row[2]]
			num_athletes +=1 
all_athletes = []
for key in athletes:
	all_athletes.append(athletes[key])
with open('../clean/athletes.csv', 'w') as csvfile:
	writer = csv.writer(csvfile, delimiter = ',')
	for athlete in all_athletes:
		writer.writerow(athlete)
	
