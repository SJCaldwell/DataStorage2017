#Author: Shane Caldwell
#Goal: Run through openpowerlifting.csv and pull out IDs, names, and genders for all lifters in the openpowerlifting.csv data set

import csv
num_lifts = 1
athletes = {} # will hold athletes info
lifts = [] # will hold lifts info

with open("../clean/athletes.csv") as athlete_file:
    reader = csv.reader(athlete_file, delimiter = ',')
    for row in reader:
        athletes[row[1]] = row[0]

with open("../raw/openpowerlifting.csv") as rawfile:
    reader = csv.reader(rawfile, delimiter = ',')
    next(reader) #skip header row
    for row in reader:
        lifts.append([str(num_lifts), row[0],str(athletes[row[1]]), row[3], row[4], row[5], row[6], row[7], row[9], row[11], row[13], '']) 
        num_lifts +=1

with open('../clean/athlete_lifts.csv', 'w') as csvfile:
    writer = csv.writer(csvfile, delimiter = ',')
    for lift in lifts:
        writer.writerow(lift)
